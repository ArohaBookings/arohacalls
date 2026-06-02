import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { arohaAiWebhookEvents } from "@/lib/db/schema";
import {
  applyInboundArohaAiEvent,
  type ArohaAiInboundEvent,
  verifyArohaWebhookRequest,
} from "@/lib/aroha-ai-webhooks";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const inboundEvents = new Set<string>([
  "managed.setup.received",
  "managed.setup.in_progress",
  "managed.setup.needs_review",
  "managed.setup.ready",
  "managed.setup.complete",
  "managed.login.ready",
  "managed.provisioning.failed",
  "managed.account.paused",
  "managed.account.reactivated",
]);

export async function POST(req: Request) {
  const body = await req.text();
  let verified: Awaited<ReturnType<typeof verifyArohaWebhookRequest>>;

  try {
    verified = await verifyArohaWebhookRequest(req, body);
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Invalid webhook" },
      { status: 400 },
    );
  }

  const payload = verified.payload as { type?: unknown; event?: unknown; data?: unknown };
  const type = String(req.headers.get("x-aroha-event") ?? payload.type ?? payload.event ?? "");
  if (!inboundEvents.has(type)) {
    return NextResponse.json({ error: "Unsupported event type" }, { status: 400 });
  }

  const [existing] = await db
    .select({ id: arohaAiWebhookEvents.id, status: arohaAiWebhookEvents.status })
    .from(arohaAiWebhookEvents)
    .where(eq(arohaAiWebhookEvents.idempotencyKey, verified.idempotencyKey))
    .limit(1);

  if (existing?.status === "processed") {
    return NextResponse.json({ ok: true, duplicate: true });
  }

  const data = (payload.data && typeof payload.data === "object" ? payload.data : payload) as Record<string, unknown>;
  const [eventRow] = existing
    ? await db
        .update(arohaAiWebhookEvents)
        .set({
          direction: "inbound",
          eventType: type,
          payload: data,
          status: "processing",
          signature: verified.signature,
          nonce: verified.nonce,
          updatedAt: new Date(),
        })
        .where(eq(arohaAiWebhookEvents.id, existing.id))
        .returning()
    : await db
        .insert(arohaAiWebhookEvents)
        .values({
          direction: "inbound",
          eventType: type,
          idempotencyKey: verified.idempotencyKey,
          status: "processing",
          payload: data,
          signature: verified.signature,
          nonce: verified.nonce,
        })
        .returning();

  try {
    const profile = await applyInboundArohaAiEvent(type as ArohaAiInboundEvent, data);
    await db
      .update(arohaAiWebhookEvents)
      .set({
        userId: profile?.userId ?? null,
        status: "processed",
        processingError: null,
        processedAt: new Date(),
        updatedAt: new Date(),
      })
      .where(eq(arohaAiWebhookEvents.id, eventRow.id));
    return NextResponse.json({ ok: true });
  } catch (error) {
    await db
      .update(arohaAiWebhookEvents)
      .set({
        status: "failed",
        processingError: error instanceof Error ? error.message : "Inbound webhook handler failed",
        updatedAt: new Date(),
      })
      .where(eq(arohaAiWebhookEvents.id, eventRow.id));
    return NextResponse.json({ error: "Handler failed" }, { status: 500 });
  }
}
