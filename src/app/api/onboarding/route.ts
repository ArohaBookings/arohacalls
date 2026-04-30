import { NextResponse } from "next/server";
import { z } from "zod";
import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { conversionEvents, customerProfiles, users } from "@/lib/db/schema";
import { auth } from "@/lib/auth";
import { sendEmail, emailLayout, ADMIN_NOTIFY_EMAIL } from "@/lib/email";

const schema = z.object({
  businessName: z.string().min(1).max(200),
  niche: z.string().max(200),
  phoneNumber: z.string().max(40).optional(),
  website: z.string().max(400).optional(),
  calendarConnected: z.boolean().optional(),
  notes: z.string().max(4000).optional(),
});

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthenticated" }, { status: 401 });

  const json = await req.json().catch(() => ({}));
  const parsed = schema.safeParse(json);
  if (!parsed.success) return NextResponse.json({ error: "Invalid body" }, { status: 400 });

  await db
    .insert(customerProfiles)
    .values({
      userId: session.user.id,
      businessName: parsed.data.businessName,
      niche: parsed.data.niche,
      phoneNumber: parsed.data.phoneNumber,
      website: parsed.data.website,
      calendarConnected: !!parsed.data.calendarConnected,
      notes: parsed.data.notes,
      onboardingStatus: "in_progress",
    })
    .onConflictDoUpdate({
      target: customerProfiles.userId,
      set: {
        businessName: parsed.data.businessName,
        niche: parsed.data.niche,
        phoneNumber: parsed.data.phoneNumber,
        website: parsed.data.website,
        calendarConnected: !!parsed.data.calendarConnected,
        notes: parsed.data.notes,
        onboardingStatus: "in_progress",
        updatedAt: new Date(),
      },
    });
  await db.insert(conversionEvents).values({
    name: "onboarding_submitted",
    userId: session.user.id,
    metadata: { businessName: parsed.data.businessName, niche: parsed.data.niche },
  });

  const [user] = await db.select().from(users).where(eq(users.id, session.user.id));
  await sendEmail({
    to: ADMIN_NOTIFY_EMAIL,
    subject: `🌱 Onboarding submitted — ${parsed.data.businessName}`,
    html: emailLayout({
      title: "Onboarding submitted",
      body: `<p>${user?.name ?? user?.email} just submitted onboarding for <strong>${parsed.data.businessName}</strong>.</p><ul><li>Niche: ${parsed.data.niche}</li><li>Phone: ${parsed.data.phoneNumber ?? "—"}</li><li>Website: ${parsed.data.website ?? "—"}</li><li>Calendar connected: ${parsed.data.calendarConnected ? "yes" : "no"}</li></ul><p>${(parsed.data.notes ?? "").replace(/\n/g, "<br/>")}</p>`,
    }),
  });
  return NextResponse.json({ ok: true });
}
