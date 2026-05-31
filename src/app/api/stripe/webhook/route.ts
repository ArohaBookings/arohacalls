import { NextResponse } from "next/server";
import { headers } from "next/headers";
import type Stripe from "stripe";
import { eq } from "drizzle-orm";
import { getStripe, getStripeWebhookSecret } from "@/lib/stripe";
import { db } from "@/lib/db";
import {
  invoices,
  orders,
  stripeWebhookEvents,
  subscriptionEvents,
  subscriptions,
  users,
} from "@/lib/db/schema";
import { sendEmail, emailLayout, ADMIN_NOTIFY_EMAIL } from "@/lib/email";
import { PLANS, type Plan } from "@/lib/plans";
import { normalizeSubscriptionStatus } from "@/lib/stripe-status";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function planNameFromId(id: string) {
  return PLANS.find((p) => p.id === id)?.name ?? id;
}

function validPlanId(value: string | null | undefined): Plan["id"] | null {
  return PLANS.some((plan) => plan.id === value) ? (value as Plan["id"]) : null;
}

function toDate(seconds?: number | null) {
  return seconds ? new Date(seconds * 1000) : null;
}

function subscriptionItem(sub: Stripe.Subscription) {
  return sub.items.data[0];
}

function invoiceSubscriptionId(invoice: Stripe.Invoice) {
  const legacySubscription = (invoice as Stripe.Invoice & { subscription?: string | Stripe.Subscription | null }).subscription;
  if (typeof legacySubscription === "string") return legacySubscription;
  if (legacySubscription?.id) return legacySubscription.id;

  const subscription = invoice.parent?.subscription_details?.subscription;
  return typeof subscription === "string" ? subscription : subscription?.id ?? null;
}

function checkoutInvoiceId(session: Stripe.Checkout.Session) {
  const invoice = session.invoice;
  return typeof invoice === "string" ? invoice : invoice?.id ?? null;
}

async function findUserForStripeCustomer(customer: string | Stripe.Customer | Stripe.DeletedCustomer | null) {
  const customerId = typeof customer === "string" ? customer : customer?.id;
  if (!customerId) return null;
  const [user] = await db.select().from(users).where(eq(users.stripeCustomerId, customerId)).limit(1);
  return user ?? null;
}

async function generateOrderNumber() {
  const prefix = "ARH";
  const ts = Date.now().toString().slice(-7);
  const rand = Math.random().toString(36).slice(2, 5).toUpperCase();
  return `${prefix}-${ts}-${rand}`;
}

async function markStripeEvent(id: string, status: "processed" | "failed", error?: unknown) {
  await db
    .update(stripeWebhookEvents)
    .set({
      processingStatus: status,
      processingError: status === "failed" ? error instanceof Error ? error.message : String(error ?? "handler failed") : null,
      processedAt: new Date(),
    })
    .where(eq(stripeWebhookEvents.id, id));
}

async function upsertSubscriptionFromStripe(
  sub: Stripe.Subscription,
  options: { userId?: string | null; planId?: string | null; eventType?: string } = {},
) {
  const item = subscriptionItem(sub);
  const userFromCustomer = await findUserForStripeCustomer(sub.customer);
  const [existing] = await db
    .select()
    .from(subscriptions)
    .where(eq(subscriptions.stripeSubscriptionId, sub.id))
    .limit(1);

  const userId = options.userId ?? userFromCustomer?.id ?? existing?.userId ?? (typeof sub.metadata?.userId === "string" ? sub.metadata.userId : null);
  if (!userId) return null;

  const planId =
    validPlanId(options.planId ?? null)
    ?? validPlanId(typeof sub.metadata?.planId === "string" ? sub.metadata.planId : null)
    ?? validPlanId(existing?.planId)
    ?? "essentials";

  const values = {
    userId,
    stripeSubscriptionId: sub.id,
    stripePriceId: item?.price.id ?? existing?.stripePriceId ?? "",
    planId,
    status: normalizeSubscriptionStatus(sub.status),
    currency: (item?.price.currency ?? existing?.currency ?? "nzd").toLowerCase(),
    amount: item?.price.unit_amount ?? existing?.amount ?? 0,
    interval: item?.price.recurring?.interval ?? existing?.interval ?? "month",
    currentPeriodStart: toDate(item?.current_period_start),
    currentPeriodEnd: toDate(item?.current_period_end),
    cancelAtPeriodEnd: sub.cancel_at_period_end,
    cancelledAt: toDate(sub.canceled_at),
    updatedAt: new Date(),
  };

  const [row] = await db
    .insert(subscriptions)
    .values(values)
    .onConflictDoUpdate({
      target: subscriptions.stripeSubscriptionId,
      set: values,
    })
    .returning();

  await db.insert(subscriptionEvents).values({
    userId,
    stripeSubscriptionId: sub.id,
    type: options.eventType ?? "stripe_subscription_synced",
    planId,
    toStatus: sub.status,
    metadata: {
      cancelAtPeriodEnd: sub.cancel_at_period_end,
      priceId: item?.price.id,
      currentPeriodEnd: item?.current_period_end,
    },
  });

  return row;
}

async function cacheInvoice(stripe: Stripe, invoice: Stripe.Invoice) {
  const stripeSubscriptionId = invoiceSubscriptionId(invoice);
  const user = await findUserForStripeCustomer(invoice.customer);
  let localSubscription: typeof subscriptions.$inferSelect | null = null;

  if (stripeSubscriptionId) {
    const sub = await stripe.subscriptions.retrieve(stripeSubscriptionId);
    localSubscription = await upsertSubscriptionFromStripe(sub, {
      userId: user?.id,
      eventType: `invoice_sync:${invoice.status ?? "unknown"}`,
    });
  }

  const userId = user?.id ?? localSubscription?.userId ?? null;
  if (!invoice.id) {
    await db.insert(subscriptionEvents).values({
      userId: userId ?? undefined,
      stripeSubscriptionId: stripeSubscriptionId ?? undefined,
      type: "invoice.upcoming",
      metadata: {
        reason: "Stripe sent upcoming invoice without a persisted invoice id",
        amountDue: invoice.amount_due,
        periodStart: invoice.period_start,
        periodEnd: invoice.period_end,
      },
    });
    return { userId, stripeSubscriptionId, localSubscription };
  }

  await db
    .insert(invoices)
    .values({
      userId,
      stripeInvoiceId: invoice.id,
      stripeSubscriptionId,
      status: invoice.status ?? "unknown",
      currency: invoice.currency ?? "nzd",
      amountPaid: invoice.amount_paid ?? 0,
      amountDue: invoice.amount_due ?? 0,
      hostedInvoiceUrl: invoice.hosted_invoice_url ?? null,
      invoicePdf: invoice.invoice_pdf ?? null,
      periodStart: toDate(invoice.period_start),
      periodEnd: toDate(invoice.period_end),
    })
    .onConflictDoUpdate({
      target: invoices.stripeInvoiceId,
      set: {
        userId,
        stripeSubscriptionId,
        status: invoice.status ?? "unknown",
        amountPaid: invoice.amount_paid ?? 0,
        amountDue: invoice.amount_due ?? 0,
        hostedInvoiceUrl: invoice.hosted_invoice_url ?? null,
        invoicePdf: invoice.invoice_pdf ?? null,
      },
    });

  if (localSubscription) {
    await db
      .update(orders)
      .set({ stripeInvoiceId: invoice.id })
      .where(eq(orders.subscriptionId, localSubscription.id));
  }

  return { userId, stripeSubscriptionId, localSubscription };
}

async function handleCheckoutCompleted(stripe: Stripe, session: Stripe.Checkout.Session) {
  const userId = (session.metadata?.userId as string | undefined) ?? null;
  const planId = validPlanId(session.metadata?.planId as string | undefined) ?? "essentials";
  if (!userId) return;

  const [user] = await db.select().from(users).where(eq(users.id, userId)).limit(1);
  const subscriptionId = typeof session.subscription === "string" ? session.subscription : session.subscription?.id ?? null;
  let localSubscription: typeof subscriptions.$inferSelect | null = null;
  let amount = session.amount_total ?? 0;
  const currency = (session.currency ?? "nzd").toLowerCase();

  if (subscriptionId) {
    const sub = await stripe.subscriptions.retrieve(subscriptionId);
    const item = subscriptionItem(sub);
    amount = item?.price.unit_amount ?? amount;
    localSubscription = await upsertSubscriptionFromStripe(sub, {
      userId,
      planId,
      eventType: "checkout_completed",
    });
  }

  const [existingOrder] = await db
    .select({ id: orders.id })
    .from(orders)
    .where(eq(orders.stripeCheckoutSessionId, session.id))
    .limit(1);
  if (existingOrder) return;

  const orderNumber = await generateOrderNumber();
  await db.insert(orders).values({
    orderNumber,
    userId,
    subscriptionId: localSubscription?.id,
    planId,
    planName: planNameFromId(planId),
    customerName: user?.name ?? session.customer_details?.name ?? null,
    customerEmail: user?.email ?? session.customer_details?.email ?? "",
    status: "active",
    currency,
    amount,
    stripeCheckoutSessionId: session.id,
    stripeInvoiceId: checkoutInvoiceId(session),
    metadata: { mode: session.mode, payment_status: session.payment_status },
  });

  const customerEmail = user?.email ?? session.customer_details?.email ?? "";
  if (customerEmail) {
    await sendEmail({
      to: customerEmail,
      subject: "Welcome to Aroha Calls — let's get you live",
      html: emailLayout({
        title: "Welcome to Aroha",
        body: `<p>Kia ora ${user?.name ?? "there"},</p><p>Your <strong>${planNameFromId(planId)}</strong> plan is locked in. Leo will be in touch within 24 hours to begin your white-glove setup.</p><p>In the meantime, finish your onboarding details so we can hit the ground running:</p><p><a href="https://www.arohacalls.com/dashboard/onboarding" style="display:inline-block;background:#00d2a1;color:#0a0a0a;padding:10px 18px;border-radius:999px;text-decoration:none;font-weight:600;">Complete onboarding</a></p>`,
      }),
    });
  }

  await sendEmail({
    to: ADMIN_NOTIFY_EMAIL,
    subject: `New ${planNameFromId(planId)} signup — ${customerEmail}`,
    html: emailLayout({
      title: "New signup",
      body: `<p><strong>${user?.name ?? "—"}</strong> just signed up.</p><ul><li>Email: ${customerEmail}</li><li>Plan: ${planNameFromId(planId)}</li><li>Order: ${orderNumber}</li></ul>`,
    }),
  });
}

async function handleStripeEvent(stripe: Stripe, event: Stripe.Event) {
  switch (event.type) {
    case "checkout.session.completed":
    case "checkout.session.async_payment_succeeded": {
      await handleCheckoutCompleted(stripe, event.data.object as Stripe.Checkout.Session);
      break;
    }
    case "checkout.session.async_payment_failed": {
      const session = event.data.object as Stripe.Checkout.Session;
      await db.insert(subscriptionEvents).values({
        userId: session.metadata?.userId as string | undefined,
        type: event.type,
        planId: session.metadata?.planId,
        metadata: { checkoutSessionId: session.id, paymentStatus: session.payment_status },
      });
      break;
    }
    case "customer.subscription.updated":
    case "customer.subscription.created":
    case "customer.subscription.deleted":
    case "customer.subscription.paused":
    case "customer.subscription.resumed": {
      await upsertSubscriptionFromStripe(event.data.object as Stripe.Subscription, { eventType: event.type });
      break;
    }
    case "invoice.finalized":
    case "invoice.paid":
    case "invoice.payment_succeeded":
    case "invoice.payment_action_required":
    case "invoice.payment_failed":
    case "invoice.upcoming": {
      const invoice = event.data.object as Stripe.Invoice;
      const { stripeSubscriptionId } = await cacheInvoice(stripe, invoice);

      if (stripeSubscriptionId && event.type === "invoice.payment_failed") {
        await db
          .update(subscriptions)
          .set({ status: "past_due", updatedAt: new Date() })
          .where(eq(subscriptions.stripeSubscriptionId, stripeSubscriptionId));
      }
      break;
    }
    case "customer.updated": {
      const customer = event.data.object as Stripe.Customer;
      if (customer.email) {
        await db
          .update(users)
          .set({ email: customer.email.toLowerCase(), name: customer.name, updatedAt: new Date() })
          .where(eq(users.stripeCustomerId, customer.id));
      }
      break;
    }
    case "charge.refunded": {
      const charge = event.data.object as Stripe.Charge;
      const invoice = (charge as Stripe.Charge & { invoice?: string | Stripe.Invoice | null }).invoice;
      if (invoice && typeof invoice === "string") {
        await db.update(orders).set({ status: "refunded" }).where(eq(orders.stripeInvoiceId, invoice));
      }
      break;
    }
    case "refund.created":
    case "refund.updated":
      break;
    default:
      break;
  }
}

export async function POST(req: Request) {
  const sig = (await headers()).get("stripe-signature");
  const body = await req.text();
  const stripe = getStripe();
  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, sig ?? "", getStripeWebhookSecret());
  } catch (e) {
    console.error("[stripe webhook] signature error", e);
    return new NextResponse("Bad signature", { status: 400 });
  }

  const [existing] = await db
    .select({ id: stripeWebhookEvents.id, processingStatus: stripeWebhookEvents.processingStatus })
    .from(stripeWebhookEvents)
    .where(eq(stripeWebhookEvents.id, event.id))
    .limit(1);

  if (existing?.processingStatus === "processed") {
    return NextResponse.json({ received: true, duplicate: true });
  }
  if (existing?.processingStatus === "processing") {
    return NextResponse.json({ received: true, processing: true });
  }

  if (existing?.processingStatus === "failed") {
    await db
      .update(stripeWebhookEvents)
      .set({
        type: event.type,
        processingStatus: "processing",
        processingError: null,
        payload: event as unknown as Record<string, unknown>,
      })
      .where(eq(stripeWebhookEvents.id, event.id));
  } else {
    await db.insert(stripeWebhookEvents).values({
      id: event.id,
      type: event.type,
      processingStatus: "processing",
      payload: event as unknown as Record<string, unknown>,
    });
  }

  try {
    await handleStripeEvent(stripe, event);
    await markStripeEvent(event.id, "processed");
    return NextResponse.json({ received: true });
  } catch (e) {
    console.error("[stripe webhook] handler error", e);
    await markStripeEvent(event.id, "failed", e);
    return NextResponse.json({ error: "handler failed" }, { status: 500 });
  }
}
