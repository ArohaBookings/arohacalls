import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { retellDemoCalls } from "@/lib/db/schema";
import { getRetell, safeTranscriptSnippet, inferCallIntent, didBook, didRequestQuote, nextActionForCall } from "@/lib/retell";
import { hasUsableDatabaseUrl } from "@/lib/safe-db";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function safeSummary(row: typeof retellDemoCalls.$inferSelect) {
  return {
    callId: row.callId,
    status: row.status,
    agentName: row.agentName ?? "Grace from Aroha",
    transcriptSnippet: row.transcriptSnippet,
    summary: row.summary,
    sentiment: row.sentiment,
    detectedIntent: row.detectedIntent ?? "Analysis pending",
    bookingMade: row.bookingMade,
    quoteRequested: row.quoteRequested,
    nextAction: row.nextAction,
    durationMs: row.durationMs,
    endedAt: row.endedAt,
  };
}

export async function GET(req: Request, context: { params: Promise<{ callId: string }> }) {
  const { callId } = await context.params;
  const url = new URL(req.url);
  const sessionId = url.searchParams.get("sessionId");

  if (!callId || callId.length > 200) {
    return NextResponse.json({ error: "Invalid call id" }, { status: 400 });
  }

  if (hasUsableDatabaseUrl()) {
    const [row] = await db.select().from(retellDemoCalls).where(eq(retellDemoCalls.callId, callId)).limit(1);
    if (row) {
      if (row.sessionId && sessionId && row.sessionId !== sessionId) {
        return NextResponse.json({ error: "Call not found" }, { status: 404 });
      }
      return NextResponse.json(safeSummary(row));
    }
  }

  const retell = getRetell();
  if (!retell) {
    return NextResponse.json({
      callId,
      status: "pending",
      detectedIntent: "Analysis pending",
      bookingMade: false,
      quoteRequested: false,
    });
  }

  try {
    const call = await retell.call.retrieve(callId);
    const summary = call.call_analysis?.call_summary ?? null;
    const transcriptSnippet = safeTranscriptSnippet(call.transcript);
    const detectedIntent = inferCallIntent(call.transcript, summary);
    const bookingMade = didBook(call.transcript, summary);
    const quoteRequested = didRequestQuote(call.transcript, summary);

    return NextResponse.json({
      callId,
      status: call.call_status,
      agentName: call.agent_name ?? "Grace from Aroha",
      transcriptSnippet,
      summary,
      sentiment: call.call_analysis?.user_sentiment ?? null,
      detectedIntent,
      bookingMade,
      quoteRequested,
      nextAction: nextActionForCall({ bookingMade, quoteRequested, intent: detectedIntent }),
      durationMs: call.duration_ms ?? null,
      endedAt: call.end_timestamp ? new Date(call.end_timestamp) : null,
    });
  } catch {
    return NextResponse.json({
      callId,
      status: "pending",
      detectedIntent: "Analysis pending",
      bookingMade: false,
      quoteRequested: false,
    });
  }
}
