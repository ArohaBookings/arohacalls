import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { conversionEvents, retellDemoCalls } from "@/lib/db/schema";
import { getRetell, getRetellGraceAgentId } from "@/lib/retell";
import { hasUsableDatabaseUrl } from "@/lib/safe-db";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const bodySchema = z.object({
  sessionId: z.string().min(8).max(200).optional(),
  selectedAccent: z.string().max(60).optional(),
  selectedVoiceId: z.string().max(160).optional(),
});

export async function POST(req: Request) {
  const json = await req.json().catch(() => ({}));
  const parsed = bodySchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid body" }, { status: 400 });
  }

  const retell = getRetell();
  const agentId = getRetellGraceAgentId();
  if (!retell || !agentId) {
    return NextResponse.json({ error: "Retell live demo is not configured yet" }, { status: 503 });
  }

  const metadata = {
    source: "arohacalls_live_demo",
    sessionId: parsed.data.sessionId ?? null,
    selectedAccent: parsed.data.selectedAccent ?? "grace",
    selectedVoiceId: parsed.data.selectedVoiceId ?? null,
  };

  try {
    const call = await retell.call.createWebCall({
      agent_id: agentId,
      metadata,
      retell_llm_dynamic_variables: {
        website_source: "www.arohacalls.com/live-demo",
        product_positioning: "Aroha Calls is the done-for-you managed AI receptionist service. Aroha AI is the self-serve platform behind it.",
        current_date: new Date().toISOString().slice(0, 10),
      },
    });

    if (hasUsableDatabaseUrl()) {
      await db
        .insert(retellDemoCalls)
        .values({
          callId: call.call_id,
          sessionId: parsed.data.sessionId,
          agentId: call.agent_id,
          agentName: call.agent_name ?? "Grace from Aroha",
          status: call.call_status,
          selectedAccent: parsed.data.selectedAccent ?? "grace",
          selectedVoiceId: parsed.data.selectedVoiceId,
          metadata,
        })
        .onConflictDoUpdate({
          target: retellDemoCalls.callId,
          set: {
            sessionId: parsed.data.sessionId,
            agentName: call.agent_name ?? "Grace from Aroha",
            status: call.call_status,
            selectedAccent: parsed.data.selectedAccent ?? "grace",
            selectedVoiceId: parsed.data.selectedVoiceId,
            metadata,
            updatedAt: new Date(),
          },
        });

      await db.insert(conversionEvents).values({
        name: "live_demo_call_started",
        sessionId: parsed.data.sessionId,
        metadata: { callId: call.call_id, selectedAccent: parsed.data.selectedAccent ?? "grace" },
      });
    }

    return NextResponse.json({
      accessToken: call.access_token,
      callId: call.call_id,
      agentName: call.agent_name ?? "Grace from Aroha",
      status: call.call_status,
    });
  } catch (error) {
    console.error("[retell web call]", error);
    if (hasUsableDatabaseUrl()) {
      await db.insert(conversionEvents).values({
        name: "live_demo_call_error",
        sessionId: parsed.data.sessionId,
        metadata: { message: error instanceof Error ? error.message : "Retell call failed" },
      });
    }
    return NextResponse.json({ error: "Could not start the live call" }, { status: 502 });
  }
}
