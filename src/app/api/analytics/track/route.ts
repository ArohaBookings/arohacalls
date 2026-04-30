import { NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { conversionEvents, pageViews } from "@/lib/db/schema";
import { hasUsableDatabaseUrl } from "@/lib/safe-db";

export const dynamic = "force-dynamic";

const schema = z.object({
  path: z.string().min(1).max(500).optional(),
  referrer: z.string().max(1000).optional(),
  sessionId: z.string().max(200).optional(),
  event: z.string().max(120).optional(),
  metadata: z.record(z.string(), z.unknown()).optional(),
});

export async function POST(req: Request) {
  const json = await req.json().catch(() => ({}));
  const parsed = schema.safeParse(json);
  if (!parsed.success) return NextResponse.json({ error: "Invalid body" }, { status: 400 });
  if (!hasUsableDatabaseUrl()) return NextResponse.json({ ok: true, skipped: true });

  const session = await auth().catch(() => null);
  const userId = session?.user?.id;
  const headers = req.headers;

  try {
    if (parsed.data.path) {
      await db.insert(pageViews).values({
        path: parsed.data.path,
        referrer: parsed.data.referrer,
        userAgent: headers.get("user-agent"),
        country: headers.get("x-vercel-ip-country"),
        sessionId: parsed.data.sessionId,
        userId,
      });
    }

    if (parsed.data.event) {
      await db.insert(conversionEvents).values({
        name: parsed.data.event,
        userId,
        sessionId: parsed.data.sessionId,
        metadata: parsed.data.metadata,
      });
    }
  } catch {
    console.warn("[analytics] skipped event");
    return NextResponse.json({ ok: true, skipped: true });
  }

  return NextResponse.json({ ok: true });
}
