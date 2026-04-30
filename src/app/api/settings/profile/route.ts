import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { customerProfiles, users } from "@/lib/db/schema";

const schema = z.object({
  name: z.string().min(1).max(120),
  businessName: z.string().max(200).optional(),
  niche: z.string().max(200).optional(),
  phoneNumber: z.string().max(40).optional(),
  website: z.string().max(400).optional(),
});

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthenticated" }, { status: 401 });

  const json = await req.json().catch(() => ({}));
  const parsed = schema.safeParse(json);
  if (!parsed.success) return NextResponse.json({ error: "Invalid body" }, { status: 400 });

  await db.update(users).set({ name: parsed.data.name, updatedAt: new Date() }).where(eq(users.id, session.user.id));
  await db
    .insert(customerProfiles)
    .values({
      userId: session.user.id,
      businessName: parsed.data.businessName,
      niche: parsed.data.niche,
      phoneNumber: parsed.data.phoneNumber,
      website: parsed.data.website,
    })
    .onConflictDoUpdate({
      target: customerProfiles.userId,
      set: {
        businessName: parsed.data.businessName,
        niche: parsed.data.niche,
        phoneNumber: parsed.data.phoneNumber,
        website: parsed.data.website,
        updatedAt: new Date(),
      },
    });

  return NextResponse.json({ ok: true });
}
