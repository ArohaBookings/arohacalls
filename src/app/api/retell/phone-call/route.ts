import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { conversionEvents, retellDemoCalls } from "@/lib/db/schema";
import {
  getRetell,
  getRetellGraceAgentId,
  getRetellOutboundNumber,
  normalizeE164PhoneNumber,
} from "@/lib/retell";
import { hasUsableDatabaseUrl } from "@/lib/safe-db";
import { siteConfig } from "@/lib/site-config";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const bodySchema = z.object({
  phoneNumber: z.string().min(6).max(40),
  sessionId: z.string().min(8).max(200).optional(),
  selectedAccent: z.string().max(60).optional(),
  selectedVoiceId: z.string().max(160).optional(),
});

function last4(phone: string) {
  return phone.replace(/\D/g, "").slice(-4);
}

export async function POST(req: Request) {
  const json = await req.json().catch(() => ({}));
  const parsed = bodySchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: "Enter a phone number with country code, like +64 or +1." }, { status: 400 });
  }

  const toNumber = normalizeE164PhoneNumber(parsed.data.phoneNumber);
  if (!toNumber) {
    return NextResponse.json({ error: "Use international format, for example +64211234567 or +14155551212." }, { status: 400 });
  }

  const retell = getRetell();
  const agentId = getRetellGraceAgentId();
  const fromNumber = getRetellOutboundNumber();
  if (!retell || !agentId || !fromNumber) {
    return NextResponse.json({ error: "Aroha phone callbacks are not configured yet." }, { status: 503 });
  }

  const metadata = {
    source: "arohacalls_live_demo_phone",
    callMode: "outbound_phone",
    sessionId: parsed.data.sessionId ?? null,
    selectedAccent: parsed.data.selectedAccent ?? "grace",
    selectedVoiceId: parsed.data.selectedVoiceId ?? null,
    fromNumber,
    phoneLast4: last4(toNumber),
  };

  try {
    const call = await retell.call.createPhoneCall({
      from_number: fromNumber,
      to_number: toNumber,
      override_agent_id: agentId,
      metadata,
      retell_llm_dynamic_variables: {
        website_source: `${siteConfig.url}/live-demo`,
        product_positioning:
          "Aroha Calls is the done-for-you managed AI receptionist service. Aroha AI is the self-serve platform behind it.",
        demo_goal:
          "Call the website visitor, explain Aroha Calls in plain language, learn their business, recommend a plan, and point them to signup, checkout, onboarding, and Aroha AI provisioning.",
        public_demo_number: siteConfig.phones.sales.e164,
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
        name: "live_demo_phone_callback_started",
        sessionId: parsed.data.sessionId,
        metadata: { callId: call.call_id, fromNumber, phoneLast4: last4(toNumber) },
      });
    }

    return NextResponse.json({
      callId: call.call_id,
      agentName: call.agent_name ?? "Grace from Aroha",
      status: call.call_status,
      fromNumber,
    });
  } catch (error) {
    console.error("[retell phone call]", error);
    if (hasUsableDatabaseUrl()) {
      await db.insert(conversionEvents).values({
        name: "live_demo_phone_callback_error",
        sessionId: parsed.data.sessionId,
        metadata: { message: error instanceof Error ? error.message : "Retell phone call failed" },
      });
    }
    return NextResponse.json(
      { error: "Could not start the phone call. Check the number and try again." },
      { status: 502 },
    );
  }
}
