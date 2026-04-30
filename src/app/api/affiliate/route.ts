import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { affiliateApplications, conversionEvents } from "@/lib/db/schema";
import { sendEmail, emailLayout, ADMIN_NOTIFY_EMAIL } from "@/lib/email";

const schema = z.object({
  name: z.string().min(1).max(200),
  email: z.string().email(),
  audience: z.string().max(400).optional(),
  channel: z.string().max(120).optional(),
  message: z.string().max(4000).optional(),
});

export async function POST(req: Request) {
  const json = await req.json().catch(() => ({}));
  const parsed = schema.safeParse(json);
  if (!parsed.success) return NextResponse.json({ error: "Invalid body" }, { status: 400 });

  await db.insert(affiliateApplications).values(parsed.data);
  await db.insert(conversionEvents).values({
    name: "affiliate_application_submitted",
    metadata: { email: parsed.data.email, channel: parsed.data.channel },
  });

  await sendEmail({
    to: ADMIN_NOTIFY_EMAIL,
    subject: `🤝 Affiliate application: ${parsed.data.name}`,
    html: emailLayout({
      title: "Affiliate application",
      body: `<ul><li>Name: ${parsed.data.name}</li><li>Email: ${parsed.data.email}</li><li>Audience: ${parsed.data.audience ?? "—"}</li><li>Channel: ${parsed.data.channel ?? "—"}</li></ul><p>${(parsed.data.message ?? "").replace(/\n/g, "<br/>")}</p>`,
    }),
    replyTo: parsed.data.email,
  });
  return NextResponse.json({ ok: true });
}
