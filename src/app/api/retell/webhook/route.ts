import { createHash } from "node:crypto";
import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { conversionEvents, retellDemoCalls, retellWebhookEvents } from "@/lib/db/schema";
import {
  didBook,
  didRequestQuote,
  inferCallIntent,
  nextActionForCall,
  safeTranscriptSnippet,
  verifyRetellSignature,
} from "@/lib/retell";
import { hasUsableDatabaseUrl } from "@/lib/safe-db";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type RetellCallPayload = {
  call_id?: string;
  agent_id?: string;
  agent_name?: string;
  call_status?: string;
  start_timestamp?: number;
  end_timestamp?: number;
  duration_ms?: number;
  disconnection_reason?: string;
  transcript?: string;
  metadata?: Record<string, unknown>;
  call_analysis?: {
    call_summary?: string;
    user_sentiment?: string;
    call_successful?: boolean;
    custom_analysis_data?: Record<string, unknown>;
  };
};

function toDate(ms?: number) {
  return ms ? new Date(ms) : null;
}

function stableEventId(rawBody: string, event: string, callId?: string) {
  const hash = createHash("sha256").update(rawBody).digest("hex").slice(0, 24);
  return `${event}:${callId ?? "unknown"}:${hash}`;
}

function boolFromCustom(value: unknown) {
  if (typeof value === "boolean") return value;
  if (typeof value === "string") return /^(true|yes|1)$/i.test(value);
  return false;
}

export async function POST(req: Request) {
  const rawBody = await req.text();
  const signature = req.headers.get("x-retell-signature");

  if (!(await verifyRetellSignature(rawBody, signature))) {
    return new NextResponse("Bad signature", { status: 400 });
  }

  const parsed = JSON.parse(rawBody) as { event?: string; event_type?: string; call?: RetellCallPayload };
  const event = parsed.event ?? parsed.event_type ?? "unknown";
  const call = parsed.call ?? {};
  const callId = call.call_id;
  const eventId = stableEventId(rawBody, event, callId);

  if (!hasUsableDatabaseUrl()) {
    return new NextResponse(null, { status: 204 });
  }

  const [existing] = await db
    .select({ id: retellWebhookEvents.id })
    .from(retellWebhookEvents)
    .where(eq(retellWebhookEvents.id, eventId))
    .limit(1);
  if (existing) {
    return new NextResponse(null, { status: 204 });
  }

  await db.insert(retellWebhookEvents).values({
    id: eventId,
    event,
    callId,
    payload: parsed as Record<string, unknown>,
  });

  if (!callId) {
    return new NextResponse(null, { status: 204 });
  }

  const summary = call.call_analysis?.call_summary ?? null;
  const snippet = safeTranscriptSnippet(call.transcript);
  const custom = call.call_analysis?.custom_analysis_data ?? {};
  const detectedIntent = (typeof custom.detected_intent === "string" && custom.detected_intent)
    || (typeof custom.intent === "string" && custom.intent)
    || inferCallIntent(call.transcript, summary);
  const bookingMade = boolFromCustom(custom.booking_made) || boolFromCustom(custom.bookingMade) || didBook(call.transcript, summary);
  const quoteRequested = boolFromCustom(custom.quote_requested) || boolFromCustom(custom.quoteRequested) || didRequestQuote(call.transcript, summary);
  const nextAction = (typeof custom.next_action === "string" && custom.next_action)
    || nextActionForCall({ bookingMade, quoteRequested, intent: detectedIntent });

  const base = {
    agentId: call.agent_id ?? "unknown",
    agentName: call.agent_name ?? "Grace from Aroha",
    selectedAccent: typeof call.metadata?.selectedAccent === "string" ? call.metadata.selectedAccent : "grace",
    selectedVoiceId: typeof call.metadata?.selectedVoiceId === "string" ? call.metadata.selectedVoiceId : null,
    sessionId: typeof call.metadata?.sessionId === "string" ? call.metadata.sessionId : null,
    metadata: call.metadata ?? {},
    updatedAt: new Date(),
  };

  const status =
    event === "call_analyzed"
      ? "analyzed"
      : event === "call_ended"
        ? "ended"
        : event === "call_started"
          ? "ongoing"
          : call.call_status ?? event;

  await db
    .insert(retellDemoCalls)
    .values({
      callId,
      ...base,
      status,
      startedAt: toDate(call.start_timestamp),
      endedAt: toDate(call.end_timestamp),
      analyzedAt: event === "call_analyzed" ? new Date() : null,
      durationMs: call.duration_ms,
      disconnectionReason: call.disconnection_reason,
      transcriptSnippet: snippet,
      summary,
      sentiment: call.call_analysis?.user_sentiment ?? null,
      detectedIntent,
      bookingMade,
      quoteRequested,
      nextAction,
    })
    .onConflictDoUpdate({
      target: retellDemoCalls.callId,
      set: {
        ...base,
        status,
        startedAt: toDate(call.start_timestamp),
        endedAt: toDate(call.end_timestamp),
        analyzedAt: event === "call_analyzed" ? new Date() : null,
        durationMs: call.duration_ms,
        disconnectionReason: call.disconnection_reason,
        transcriptSnippet: snippet,
        summary,
        sentiment: call.call_analysis?.user_sentiment ?? null,
        detectedIntent,
        bookingMade,
        quoteRequested,
        nextAction,
      },
    });

  if (event === "call_ended" || event === "call_analyzed") {
    await db.insert(conversionEvents).values({
      name: event === "call_analyzed" ? "live_demo_call_analyzed" : "live_demo_call_completed",
      sessionId: typeof call.metadata?.sessionId === "string" ? call.metadata.sessionId : undefined,
      metadata: { callId, detectedIntent, bookingMade, quoteRequested, durationMs: call.duration_ms },
    });
  }

  return new NextResponse(null, { status: 204 });
}
