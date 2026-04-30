import { randomBytes } from "crypto";
import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { db } from "@/lib/db";
import { passwordResetTokens, users } from "@/lib/db/schema";
import { emailLayout, sendEmail } from "@/lib/email";
import { siteConfig } from "@/lib/site-config";

export const runtime = "nodejs";

const schema = z.object({
  email: z.string().email(),
});

export async function POST(req: Request) {
  const json = await req.json().catch(() => ({}));
  const parsed = schema.safeParse(json);
  if (!parsed.success) return NextResponse.json({ error: "Invalid body" }, { status: 400 });

  const email = parsed.data.email.toLowerCase();
  const [user] = await db.select().from(users).where(eq(users.email, email)).limit(1);

  if (user) {
    const token = randomBytes(32).toString("hex");
    const expires = new Date(Date.now() + 1000 * 60 * 60);
    await db.insert(passwordResetTokens).values({ token, userId: user.id, expires });

    const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? siteConfig.url;
    const resetUrl = `${baseUrl}/reset-password?token=${token}`;
    await sendEmail({
      to: user.email,
      subject: "Reset your Aroha Calls password",
      html: emailLayout({
        title: "Reset password",
        body: `<p>Kia ora ${user.name ?? "there"},</p><p>Use the button below to choose a new password. This link expires in 1 hour.</p><p><a href="${resetUrl}" style="display:inline-block;background:#00d2a1;color:#0a0a0a;padding:10px 18px;border-radius:999px;text-decoration:none;font-weight:600;">Reset password</a></p><p>If you did not request this, you can ignore this email.</p>`,
      }),
    });
  }

  return NextResponse.json({ ok: true });
}
