import crypto from "node:crypto";
import { and, eq, inArray, isNull, lte, or } from "drizzle-orm";
import { db } from "@/lib/db";
import { arohaAiWebhookEvents, customerProfiles, subscriptions, users } from "@/lib/db/schema";
import { toolsForPlan } from "@/lib/aroha-ai-tools";
import { getPlan, type Plan } from "@/lib/plans";
import { siteConfig } from "@/lib/site-config";

type WebhookPayload = Record<string, unknown>;
type CustomerProfileInsert = typeof customerProfiles.$inferInsert;
type OnboardingStatus = NonNullable<CustomerProfileInsert["onboardingStatus"]>;

export type ArohaAiOutboundEvent =
  | "managed.customer.created"
  | "managed.subscription.created"
  | "managed.subscription.updated"
  | "managed.subscription.payment_failed"
  | "managed.subscription.cancelled"
  | "managed.onboarding.updated"
  | "managed.onboarding.completed"
  | "managed.plan.capabilities.updated";

export type ArohaAiInboundEvent =
  | "managed.setup.received"
  | "managed.setup.in_progress"
  | "managed.setup.needs_review"
  | "managed.setup.ready"
  | "managed.setup.complete"
  | "managed.login.ready"
  | "managed.provisioning.failed"
  | "managed.account.paused"
  | "managed.account.reactivated";

type SignedEnvelope = {
  id: string;
  type: string;
  created: string;
  source: "arohacalls";
  data: WebhookPayload;
};

const OUTBOUND_SECRET = "AROHA_AI_WEBHOOK_SECRET";
const INBOUND_SECRET = "AROHA_CALLS_WEBHOOK_SECRET";
const ENCRYPTION_KEY = "AROHA_WEBHOOK_ENCRYPTION_KEY";
const DEFAULT_SKEW_SECONDS = 300;

function maxSkewSeconds() {
  const raw = Number(process.env.AROHA_WEBHOOK_MAX_SKEW_SECONDS);
  return Number.isFinite(raw) && raw > 0 ? raw : DEFAULT_SKEW_SECONDS;
}

function secret(name: string) {
  return process.env[name]?.trim() ?? "";
}

function timingSafeEqual(a: string, b: string) {
  const left = Buffer.from(a);
  const right = Buffer.from(b);
  return left.length === right.length && crypto.timingSafeEqual(left, right);
}

function hmac(secretValue: string, timestamp: string, nonce: string, body: string) {
  return crypto
    .createHmac("sha256", secretValue)
    .update(`${timestamp}.${nonce}.${body}`)
    .digest("hex");
}

function parseEncryptionKey() {
  const raw = secret(ENCRYPTION_KEY);
  if (!raw) return null;
  const asBase64 = Buffer.from(raw, "base64");
  if (asBase64.length === 32) return asBase64;
  const asUtf8 = Buffer.from(raw);
  if (asUtf8.length === 32) return asUtf8;
  return null;
}

function encryptPayload(data: SignedEnvelope) {
  const key = parseEncryptionKey();
  if (!key) return { body: JSON.stringify(data), encrypted: false };

  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv("aes-256-gcm", key, iv);
  const plaintext = Buffer.from(JSON.stringify(data));
  const ciphertext = Buffer.concat([cipher.update(plaintext), cipher.final()]);
  const tag = cipher.getAuthTag();

  return {
    encrypted: true,
    body: JSON.stringify({
      encrypted: true,
      alg: "A256GCM",
      iv: iv.toString("base64"),
      tag: tag.toString("base64"),
      ciphertext: ciphertext.toString("base64"),
    }),
  };
}

function decryptPayload(body: string) {
  const parsed = JSON.parse(body) as WebhookPayload;
  if (!parsed.encrypted) return parsed;

  const key = parseEncryptionKey();
  if (!key) throw new Error("Encrypted webhook received but encryption key is not configured");
  if (parsed.alg !== "A256GCM") throw new Error("Unsupported encryption algorithm");

  const iv = Buffer.from(String(parsed.iv ?? ""), "base64");
  const tag = Buffer.from(String(parsed.tag ?? ""), "base64");
  const ciphertext = Buffer.from(String(parsed.ciphertext ?? ""), "base64");
  const decipher = crypto.createDecipheriv("aes-256-gcm", key, iv);
  decipher.setAuthTag(tag);
  return JSON.parse(Buffer.concat([decipher.update(ciphertext), decipher.final()]).toString()) as WebhookPayload;
}

function retryAt(attempts: number) {
  const delayMinutes = Math.min(60, Math.max(1, 2 ** Math.max(0, attempts - 1)));
  return new Date(Date.now() + delayMinutes * 60 * 1000);
}

export function arohaWebhookUrls() {
  return {
    stripe: `${siteConfig.url}/api/stripe/webhook`,
    arohaAiInbound: `${siteConfig.url}/api/aroha-ai/webhook`,
    retell: `${siteConfig.url}/api/retell/webhook`,
  };
}

export function isArohaAiWebhookConfigured() {
  return Boolean(process.env.AROHA_AI_WEBHOOK_URL && secret(OUTBOUND_SECRET));
}

export function isWebhookEncryptionConfigured() {
  return Boolean(parseEncryptionKey());
}

export async function queueArohaAiWebhook({
  type,
  userId,
  subscriptionId,
  payload,
  idempotencyKey,
  deliverImmediately = true,
}: {
  type: ArohaAiOutboundEvent;
  userId?: string | null;
  subscriptionId?: string | null;
  payload: WebhookPayload;
  idempotencyKey: string;
  deliverImmediately?: boolean;
}) {
  const [event] = await db
    .insert(arohaAiWebhookEvents)
    .values({
      direction: "outbound",
      eventType: type,
      idempotencyKey,
      userId,
      subscriptionId,
      payload,
      status: isArohaAiWebhookConfigured() ? "pending" : "not_configured",
      nextAttemptAt: isArohaAiWebhookConfigured() ? new Date() : null,
    })
    .onConflictDoUpdate({
      target: arohaAiWebhookEvents.idempotencyKey,
      set: {
        eventType: type,
        userId,
        subscriptionId,
        payload,
        updatedAt: new Date(),
      },
    })
    .returning();

  if (deliverImmediately && event?.status !== "not_configured") {
    await deliverArohaAiWebhook(event.id).catch((error) => {
      console.error("[aroha-ai webhook] delivery failed", error);
    });
  }

  return event;
}

export async function queueArohaAiWebhookSafe(args: Parameters<typeof queueArohaAiWebhook>[0]) {
  try {
    return await queueArohaAiWebhook(args);
  } catch (error) {
    console.error("[aroha-ai webhook] queue failed", error);
    return null;
  }
}

export async function deliverArohaAiWebhook(id: string) {
  const endpoint = process.env.AROHA_AI_WEBHOOK_URL;
  const secretValue = secret(OUTBOUND_SECRET);
  if (!endpoint || !secretValue) {
    await db
      .update(arohaAiWebhookEvents)
      .set({ status: "not_configured", processingError: "AROHA_AI_WEBHOOK_URL or AROHA_AI_WEBHOOK_SECRET missing", updatedAt: new Date() })
      .where(eq(arohaAiWebhookEvents.id, id));
    return;
  }

  const [event] = await db.select().from(arohaAiWebhookEvents).where(eq(arohaAiWebhookEvents.id, id)).limit(1);
  if (!event || event.direction !== "outbound") return;
  if (event.status === "processed") return;

  const envelope: SignedEnvelope = {
    id: event.idempotencyKey,
    type: event.eventType,
    created: event.createdAt.toISOString(),
    source: "arohacalls",
    data: event.payload ?? {},
  };
  const { body, encrypted } = encryptPayload(envelope);
  const timestamp = Math.floor(Date.now() / 1000).toString();
  const nonce = crypto.randomUUID();
  const signature = hmac(secretValue, timestamp, nonce, body);
  const attempts = event.attempts + 1;

  try {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Aroha-Timestamp": timestamp,
        "X-Aroha-Nonce": nonce,
        "X-Aroha-Signature": signature,
        "X-Aroha-Event": event.eventType,
        "X-Aroha-Idempotency-Key": event.idempotencyKey,
      },
      body,
    });
    const responseBody = (await response.text()).slice(0, 2000);
    await db
      .update(arohaAiWebhookEvents)
      .set({
        status: response.ok ? "processed" : "failed",
        encrypted,
        signature,
        nonce,
        attempts,
        responseStatus: response.status,
        responseBody,
        processingError: response.ok ? null : responseBody || `HTTP ${response.status}`,
        nextAttemptAt: response.ok ? null : retryAt(attempts),
        processedAt: response.ok ? new Date() : null,
        updatedAt: new Date(),
      })
      .where(eq(arohaAiWebhookEvents.id, event.id));
  } catch (error) {
    await db
      .update(arohaAiWebhookEvents)
      .set({
        status: "failed",
        encrypted,
        signature,
        nonce,
        attempts,
        processingError: error instanceof Error ? error.message : "delivery failed",
        nextAttemptAt: retryAt(attempts),
        updatedAt: new Date(),
      })
      .where(eq(arohaAiWebhookEvents.id, event.id));
  }
}

export async function deliverDueArohaAiWebhooks(limit = 20) {
  const rows = await db
    .select({ id: arohaAiWebhookEvents.id })
    .from(arohaAiWebhookEvents)
    .where(
      and(
        eq(arohaAiWebhookEvents.direction, "outbound"),
        inArray(arohaAiWebhookEvents.status, ["pending", "failed"]),
        or(lte(arohaAiWebhookEvents.nextAttemptAt, new Date()), isNull(arohaAiWebhookEvents.nextAttemptAt)),
      ),
    )
    .limit(limit);

  for (const row of rows) {
    await deliverArohaAiWebhook(row.id);
  }
  return rows.length;
}

export async function verifyArohaWebhookRequest(req: Request, body: string, secretName: typeof INBOUND_SECRET | typeof OUTBOUND_SECRET = INBOUND_SECRET) {
  const timestamp = req.headers.get("x-aroha-timestamp") ?? "";
  const nonce = req.headers.get("x-aroha-nonce") ?? "";
  const signature = req.headers.get("x-aroha-signature") ?? "";
  const idempotencyKey = req.headers.get("x-aroha-idempotency-key") ?? "";
  const secretValue = secret(secretName);

  if (!secretValue) throw new Error(`${secretName} is not configured`);
  if (!timestamp || !nonce || !signature || !idempotencyKey) throw new Error("Missing webhook security headers");
  const ageSeconds = Math.abs(Date.now() / 1000 - Number(timestamp));
  if (!Number.isFinite(ageSeconds) || ageSeconds > maxSkewSeconds()) throw new Error("Webhook timestamp is outside replay window");
  if (!timingSafeEqual(signature, hmac(secretValue, timestamp, nonce, body))) throw new Error("Invalid webhook signature");

  const payload = decryptPayload(body);
  return { payload, nonce, signature, idempotencyKey };
}

export async function applyInboundArohaAiEvent(type: ArohaAiInboundEvent, data: WebhookPayload) {
  const userId = typeof data.userId === "string" ? data.userId : null;
  const customerEmail = typeof data.customerEmail === "string" ? data.customerEmail.toLowerCase() : null;
  const arohaAiOrgId = typeof data.arohaAiOrgId === "string" ? data.arohaAiOrgId : typeof data.orgId === "string" ? data.orgId : null;
  const loginUrl = typeof data.loginUrl === "string" ? data.loginUrl : typeof data.arohaAiLoginUrl === "string" ? data.arohaAiLoginUrl : null;
  const message = typeof data.message === "string" ? data.message : null;

  const [user] = userId
    ? await db.select().from(users).where(eq(users.id, userId)).limit(1)
    : customerEmail
      ? await db.select().from(users).where(eq(users.email, customerEmail)).limit(1)
      : [];
  if (!user) return null;

  const statusMap: Record<ArohaAiInboundEvent, OnboardingStatus> = {
    "managed.setup.received": "received",
    "managed.setup.in_progress": "in_progress",
    "managed.setup.needs_review": "needs_review",
    "managed.setup.ready": "ready",
    "managed.setup.complete": "complete",
    "managed.login.ready": "ready",
    "managed.provisioning.failed": "failed",
    "managed.account.paused": "paused",
    "managed.account.reactivated": "live",
  };

  const [profile] = await db
    .insert(customerProfiles)
    .values({
      userId: user.id,
      businessName: typeof data.businessName === "string" ? data.businessName : undefined,
      onboardingStatus: statusMap[type],
      setupStatus: message ?? type,
      arohaAiOrgId,
      arohaAiLoginUrl: loginUrl,
      setupUpdatedAt: new Date(),
      onboardingCompletedAt: type === "managed.setup.complete" ? new Date() : undefined,
    })
    .onConflictDoUpdate({
      target: customerProfiles.userId,
      set: {
        onboardingStatus: statusMap[type],
        setupStatus: message ?? type,
        arohaAiOrgId,
        arohaAiLoginUrl: loginUrl,
        setupUpdatedAt: new Date(),
        onboardingCompletedAt: type === "managed.setup.complete" ? new Date() : undefined,
        updatedAt: new Date(),
      },
    })
    .returning();

  return profile;
}

export async function buildManagedCustomerPayload(userId: string) {
  const [[user], [profile], [subscription]] = await Promise.all([
    db.select().from(users).where(eq(users.id, userId)).limit(1),
    db.select().from(customerProfiles).where(eq(customerProfiles.userId, userId)).limit(1),
    db.select().from(subscriptions).where(eq(subscriptions.userId, userId)).limit(1),
  ]);
  const plan = subscription?.planId ? getPlan(subscription.planId as Plan["id"]) : undefined;
  const onboardingData = (profile?.onboardingData ?? {}) as Record<string, unknown>;
  const unlockedTools = toolsForPlan(plan?.id).map((tool) => ({
    id: tool.id,
    name: tool.name,
    path: tool.arohaPath,
    badge: tool.badge,
  }));

  return {
    sourceProduct: "Aroha Calls",
    sourceUrl: siteConfig.url,
    handoffVersion: "2026-07-02",
    provisioningIntent: "create_managed_aroha_ai_organisation",
    userId,
    customerEmail: user?.email,
    customerName: user?.name,
    stripeCustomerId: user?.stripeCustomerId,
    businessName: profile?.businessName,
    niche: profile?.niche,
    phoneNumber: profile?.phoneNumber,
    website: profile?.website,
    onboardingStatus: profile?.onboardingStatus,
    setupStatus: profile?.setupStatus,
    onboardingData,
    requestedIntegrations: {
      googleCalendar: Boolean(profile?.calendarConnected || onboardingData.calendarConnected || onboardingData.googleCalendarConnectDesired),
      googleCalendarAccount: onboardingData.googleCalendarAccount,
      gmail: Boolean(onboardingData.gmailConnectDesired || onboardingData.emailInboxes),
      gmailInboxes: onboardingData.emailInboxes,
      googleSignInPreferred: Boolean(onboardingData.googleSignInPreferred),
      smsOrWhatsApp: Boolean(onboardingData.messageChannels || onboardingData.missedCallText),
    },
    planId: subscription?.planId,
    selectedPlan: plan
      ? {
          id: plan.id,
          name: plan.name,
          slug: plan.slug,
          tagline: plan.tagline,
          priceNZD: plan.priceNZD,
          priceUSD: plan.priceUSD,
          bestFor: plan.bestFor,
          highlights: plan.highlights,
          capabilities: plan.capabilities,
          unlockedTools,
        }
      : null,
    subscriptionStatus: subscription?.status,
    stripeSubscriptionId: subscription?.stripeSubscriptionId,
    stripePriceId: subscription?.stripePriceId,
    currency: subscription?.currency,
    interval: subscription?.interval,
    currentPeriodEnd: subscription?.currentPeriodEnd?.toISOString(),
    managedSetupWorkflow: {
      customerPath: "signup -> Stripe checkout -> dashboard onboarding -> Aroha AI org provisioning -> login invite",
      loginDelivery:
        "When the managed Aroha AI organisation is ready, send the customer a secure invite or password setup email and return arohaAiOrgId/loginUrl via the inbound webhook.",
      demoNumber: siteConfig.phones.sales.e164,
      supportEmail: siteConfig.email,
    },
  };
}
