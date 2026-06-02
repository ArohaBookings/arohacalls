import { NextResponse } from "next/server";
import { deliverDueArohaAiWebhooks } from "@/lib/aroha-ai-webhooks";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function authorized(req: Request) {
  const secret = process.env.CRON_SECRET;
  if (!secret) return process.env.NODE_ENV !== "production";
  const header = req.headers.get("authorization") ?? "";
  return header === `Bearer ${secret}`;
}

export async function GET(req: Request) {
  if (!authorized(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const delivered = await deliverDueArohaAiWebhooks();
  return NextResponse.json({ ok: true, delivered });
}

export async function POST(req: Request) {
  return GET(req);
}
