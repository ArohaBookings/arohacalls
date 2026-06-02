import { NextResponse } from "next/server";
import { z } from "zod";
import bcrypt from "bcryptjs";
import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { sendEmail, emailTemplates } from "@/lib/email";
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
    html: emailTemplates.welcome({ name: parsed.data.name }),
    template: "welcome_account",
    userId: created.id,
  });

  return NextResponse.json({ ok: true, userId: created.id });
}
