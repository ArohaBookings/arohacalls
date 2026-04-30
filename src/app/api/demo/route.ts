import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { conversionEvents, demoBookings } from "@/lib/db/schema";
import { sendEmail, emailLayout, ADMIN_NOTIFY_EMAIL } from "@/lib/email";

const schema = z.object({
  name: z.string().min(1).max(200),
  businessName: z.string().max(200).optional(),
  email: z.string().email(),
  phone: z.string().max(40).optional(),
  industry: z.string().max(120).optional(),
  message: z.string().max(4000).optional(),
  source: z.string().max(120).optional(),
});

export async function POST(req: Request) {
  const json = await req.json().catch(() => ({}));
  const parsed = schema.safeParse(json);
  if (!parsed.success) return NextResponse.json({ error: "Invalid body" }, { status: 400 });

  await db.insert(demoBookings).values(parsed.data);
  await db.insert(conversionEvents).values({
    name: "demo_booking_submitted",
    metadata: { email: parsed.data.email, industry: parsed.data.industry, source: parsed.data.source },
  });

  await sendEmail({
    to: parsed.data.email,
    subject: "Your Aroha Calls demo is on the way 📞",
    html: emailLayout({
      title: "Demo booked",
      body: `<p>Kia ora ${parsed.data.name},</p><p>Thanks for booking a demo of Aroha Calls. Leo personally builds every demo around your real business — you'll hear back within 24 hours with your custom AI receptionist ready to test.</p><p>If anything is urgent, just reply to this email.</p>`,
    }),
  });

  await sendEmail({
    to: ADMIN_NOTIFY_EMAIL,
    subject: `🎯 New demo request: ${parsed.data.name}${parsed.data.businessName ? ` (${parsed.data.businessName})` : ""}`,
    html: emailLayout({
      title: "Demo request",
      body: `<ul><li>Name: ${parsed.data.name}</li><li>Email: ${parsed.data.email}</li><li>Phone: ${parsed.data.phone ?? "—"}</li><li>Industry: ${parsed.data.industry ?? "—"}</li><li>Business: ${parsed.data.businessName ?? "—"}</li></ul><p>${(parsed.data.message ?? "").replace(/\n/g, "<br/>")}</p>`,
    }),
    replyTo: parsed.data.email,
  });

  return NextResponse.json({ ok: true });
}
