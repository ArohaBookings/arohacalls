import { NextResponse } from "next/server";
import { z } from "zod";
import { requireAdmin } from "@/lib/admin";
import { db } from "@/lib/db";
import { statusServices } from "@/lib/db/schema";
import { hasUsableDatabaseUrl } from "@/lib/safe-db";

export const dynamic = "force-dynamic";

const schema = z.object({
  services: z.array(
    z.object({
      id: z.string().min(2).max(80),
      name: z.string().min(2).max(120),
      status: z.enum(["operational", "degraded", "outage"]),
      description: z.string().max(500).optional(),
    }),
  ).min(1).max(20),
});

export async function POST(req: Request) {
  await requireAdmin();
  if (!hasUsableDatabaseUrl()) {
    return NextResponse.json({ error: "Database is not configured" }, { status: 503 });
  }

  const json = await req.json().catch(() => ({}));
  const parsed = schema.safeParse(json);
  if (!parsed.success) return NextResponse.json({ error: "Invalid body" }, { status: 400 });

  const now = new Date();
  for (const service of parsed.data.services) {
    await db
      .insert(statusServices)
      .values({
        id: service.id,
        name: service.name,
        status: service.status,
        description: service.description,
        updatedAt: now,
      })
      .onConflictDoUpdate({
        target: statusServices.id,
        set: {
          name: service.name,
          status: service.status,
          description: service.description,
          updatedAt: now,
        },
      });
  }

  return NextResponse.json({ ok: true });
}
