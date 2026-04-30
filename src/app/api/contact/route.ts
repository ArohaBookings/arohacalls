import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { contactMessages, conversionEvents } from "@/lib/db/schema";
import { sendEmail, emailLayout, ADMIN_NOTIFY_EMAIL } from "@/lib/email";

const schema = z.object({
  name: z.string().min(1).max(200),
  businessName: z.string().max(200).optional(),
  email: z.string().email(),
  phone: z.string().max(40).optional(),
  message: z.string().min(5).max(4000),
});

export async function POST(req: Request) {
  const json = await req.json().catch(() => ({}));
  const parsed = schema.safeParse(json);
  if (!parsed.success) return NextResponse.json({ error: "Invalid body" }, { status: 400 });

  await db.insert(contactMessages).values(parsed.data);
  await db.insert(conversionEvents).values({
    name: "contact_form_submitted",
    metadata: { email: parsed.data.email, businessName: parsed.data.businessName },
  });

  await sendEmail({
    to: ADMIN_NOTIFY_EMAIL,
    subject: `📬 New contact: ${parsed.data.name}${parsed.data.businessName ? ` (${parsed.data.businessName})` : ""}`,
    html: emailLayout({
      title: "New contact message",
      body: `<p><strong>${parsed.data.name}</strong></p><p>${parsed.data.email} · ${parsed.data.phone ?? "no phone"}</p><p>${parsed.data.businessName ?? ""}</p><blockquote style="border-left:3px solid #00d2a1;padding-left:12px;color:#a5a5ad;">${parsed.data.message.replace(/\n/g, "<br/>")}</blockquote>`,
    }),
    replyTo: parsed.data.email,
  });

  return NextResponse.json({ ok: true });
}
