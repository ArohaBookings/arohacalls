import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { conversionEvents, supportTickets, users } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { auth } from "@/lib/auth";
import { sendEmail, emailLayout, ADMIN_NOTIFY_EMAIL } from "@/lib/email";

const schema = z.object({
  subject: z.string().min(1).max(200),
  message: z.string().min(5).max(8000),
});

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthenticated" }, { status: 401 });

  const json = await req.json().catch(() => ({}));
  const parsed = schema.safeParse(json);
  if (!parsed.success) return NextResponse.json({ error: "Invalid body" }, { status: 400 });

  await db.insert(supportTickets).values({
    userId: session.user.id,
    subject: parsed.data.subject,
    message: parsed.data.message,
  });
  await db.insert(conversionEvents).values({
    name: "support_request_submitted",
    userId: session.user.id,
    metadata: { subject: parsed.data.subject },
  });

  const [user] = await db.select().from(users).where(eq(users.id, session.user.id));
  await sendEmail({
    to: ADMIN_NOTIFY_EMAIL,
    subject: `🛟 Support: ${parsed.data.subject}`,
    html: emailLayout({
      title: "Support ticket",
      body: `<p><strong>${user?.name ?? user?.email}</strong> opened a ticket.</p><blockquote style="border-left:3px solid #00d2a1;padding-left:12px;">${parsed.data.message.replace(/\n/g, "<br/>")}</blockquote>`,
    }),
    replyTo: user?.email ?? undefined,
  });
  return NextResponse.json({ ok: true });
}
