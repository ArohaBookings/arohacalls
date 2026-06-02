import { NextResponse } from "next/server";
import { z } from "zod";
import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { conversionEvents, customerProfiles, users } from "@/lib/db/schema";
import { auth } from "@/lib/auth";
import { sendEmail, emailTemplates, ADMIN_NOTIFY_EMAIL } from "@/lib/email";
import { buildManagedCustomerPayload, queueArohaAiWebhookSafe } from "@/lib/aroha-ai-webhooks";

const schema = z.object({
  mode: z.enum(["draft", "submit"]).default("submit"),
  businessName: z.string().min(1).max(200),
  niche: z.string().max(200),
  phoneNumber: z.string().max(40).optional(),
  website: z.string().max(400).optional(),
  calendarConnected: z.boolean().optional(),
  notes: z.string().max(4000).optional(),
  onboardingData: z.record(z.string(), z.unknown()).optional(),
});

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthenticated" }, { status: 401 });

  const json = await req.json().catch(() => ({}));
  const parsed = schema.safeParse(json);
  if (!parsed.success) return NextResponse.json({ error: "Invalid body" }, { status: 400 });
  const submitted = parsed.data.mode === "submit";
  const now = new Date();

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
      onboardingData: parsed.data.onboardingData,
      onboardingStatus: submitted ? "received" : "in_progress",
      setupStatus: submitted ? "Onboarding received. Managed setup is queued." : "Onboarding draft saved.",
      setupUpdatedAt: now,
      onboardingCompletedAt: submitted ? now : null,
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
        onboardingData: parsed.data.onboardingData,
        onboardingStatus: submitted ? "received" : "in_progress",
        setupStatus: submitted ? "Onboarding received. Managed setup is queued." : "Onboarding draft saved.",
        setupUpdatedAt: now,
        onboardingCompletedAt: submitted ? now : null,
        updatedAt: now,
      },
    });
  await db.insert(conversionEvents).values({
    name: submitted ? "onboarding_submitted" : "onboarding_saved",
    userId: session.user.id,
    metadata: { businessName: parsed.data.businessName, niche: parsed.data.niche },
  });

  const [user] = await db.select().from(users).where(eq(users.id, session.user.id));
  if (submitted) {
    const summary = Object.entries(parsed.data.onboardingData ?? {})
      .filter(([, value]) => value !== "" && value !== false && value != null)
      .map(([key, value]) => `${key}: ${String(value).slice(0, 500)}`)
      .join("\n");

    await sendEmail({
      to: ADMIN_NOTIFY_EMAIL,
      subject: `Onboarding submitted - ${parsed.data.businessName}`,
      html: emailTemplates.onboardingSubmitted({ businessName: parsed.data.businessName, summary }),
      template: "onboarding_submitted_admin",
      userId: session.user.id,
      metadata: { businessName: parsed.data.businessName, niche: parsed.data.niche },
    });

    if (user?.email) {
      await sendEmail({
        to: user.email,
        subject: "Aroha Calls onboarding received",
        html: emailTemplates.setupStatus({
          title: "Onboarding received",
          message: "Your setup brief is in. Aroha Group will review the details and move your managed front-office setup into Aroha AI.",
          href: "https://www.arohacalls.com/dashboard",
        }),
        template: "onboarding_received_customer",
        userId: session.user.id,
      });
    }
  }

  const payload = await buildManagedCustomerPayload(session.user.id);
  await queueArohaAiWebhookSafe({
    type: submitted ? "managed.onboarding.completed" : "managed.onboarding.updated",
    userId: session.user.id,
    payload,
    idempotencyKey: `onboarding:${session.user.id}:${submitted ? "completed" : "updated"}:${now.getTime()}`,
  });

  return NextResponse.json({ ok: true });
}
