import "dotenv/config";
import bcrypt from "bcryptjs";
import { eq } from "drizzle-orm";
import { db } from "../src/lib/db";
import { users } from "../src/lib/db/schema";
import { hasUsableDatabaseUrl } from "../src/lib/safe-db";

async function main() {
  const email = process.env.ADMIN_SEED_EMAIL?.toLowerCase();
  const password = process.env.ADMIN_SEED_PASSWORD;

  if (!hasUsableDatabaseUrl()) {
    throw new Error("DATABASE_URL is not configured with a real database host.");
  }
  if (!email || !password) {
    throw new Error("ADMIN_SEED_EMAIL and ADMIN_SEED_PASSWORD are required.");
  }

  const passwordHash = await bcrypt.hash(password, 12);
  const [existing] = await db.select().from(users).where(eq(users.email, email)).limit(1);

  if (existing) {
    await db
      .update(users)
      .set({
        name: existing.name ?? "Leo",
        passwordHash,
        role: "admin",
        updatedAt: new Date(),
      })
      .where(eq(users.id, existing.id));
    console.log(`Updated admin account for ${email}`);
    return;
  }

  await db.insert(users).values({
    name: "Leo",
    email,
    passwordHash,
    role: "admin",
  });
  console.log(`Created admin account for ${email}`);
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
