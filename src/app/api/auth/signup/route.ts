import { NextResponse } from "next/server";
import { z } from "zod";
import bcrypt from "bcryptjs";
import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { sendEmail, emailLayout } from "@/lib/email";
import { hasUsableDatabaseUrl } from "@/lib/safe-db";

const schema = z.object({
  name: z.string().min(1).max(120),
  email: z.string().email(),
  password: z.string().min(8).max(200),
});

export async function POST(req: Request) {
  if (!hasUsableDatabaseUrl()) {
    return NextResponse.json({ error: "Database is not configured yet." }, { status: 503 });
  }

  const json = await req.json().catch(() => ({}));
  const parsed = schema.safeParse(json);
  if (!parsed.success) return NextResponse.json({ error: "Invalid body" }, { status: 400 });

  const email = parsed.data.email.toLowerCase();
  const [existing] = await db.select().from(users).where(eq(users.email, email)).limit(1);
  if (existing) return NextResponse.json({ error: "Email already registered" }, { status: 409 });

  const passwordHash = await bcrypt.hash(parsed.data.password, 12);
  const [created] = await db
    .insert(users)
    .values({ name: parsed.data.name, email, passwordHash })
    .returning();

  await sendEmail({
    to: email,
    subject: "Welcome to Aroha Calls — your AI receptionist awaits",
    html: emailLayout({
      title: "Welcome",
      body: `<p>Kia ora ${parsed.data.name},</p><p>Your account is ready. Pick a plan and we'll have your AI receptionist live within 24 hours.</p><p><a href="https://arohacalls.com/pricing" style="display:inline-block;background:#00d2a1;color:#0a0a0a;padding:10px 18px;border-radius:999px;text-decoration:none;font-weight:600;">View plans</a></p>`,
    }),
  });

  return NextResponse.json({ ok: true, userId: created.id });
}
