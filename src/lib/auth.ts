import NextAuth, { type DefaultSession } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";
import { DrizzleAdapter } from "@auth/drizzle-adapter";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { db, getDb } from "@/lib/db";
import { users, accounts, sessions, verificationTokens } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { hasUsableDatabaseUrl } from "@/lib/safe-db";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: "customer" | "admin";
    } & DefaultSession["user"];
  }

  interface User {
    role?: "customer" | "admin";
  }
}

const credentialsSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8).max(200),
});

function adminSeedCredentials() {
  const email = process.env.ADMIN_SEED_EMAIL?.toLowerCase();
  const password = process.env.ADMIN_SEED_PASSWORD;
  if (!email || !password) return null;
  return { email, password };
}

function isLocalSeedAdmin(email: string, password: string) {
  if (process.env.NODE_ENV === "production" || hasUsableDatabaseUrl()) return false;
  const admin = adminSeedCredentials();
  return Boolean(admin && email === admin.email && password === admin.password);
}

const authDb = getDb();

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: DrizzleAdapter(authDb, {
    usersTable: users,
    accountsTable: accounts,
    sessionsTable: sessions,
    verificationTokensTable: verificationTokens,
  }),
  session: { strategy: "jwt" },
  pages: { signIn: "/login", error: "/login" },
  providers: [
    ...(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET
      ? [
          Google({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            allowDangerousEmailAccountLinking: true,
          }),
        ]
      : []),
    Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(raw) {
        const parsed = credentialsSchema.safeParse(raw);
        if (!parsed.success) return null;

        const email = parsed.data.email.toLowerCase();
        if (isLocalSeedAdmin(email, parsed.data.password)) {
          return {
            id: "local-admin",
            email,
            name: "Leo",
            role: "admin",
          };
        }

        let user: typeof users.$inferSelect | undefined;
        try {
          [user] = await db.select().from(users).where(eq(users.email, email)).limit(1);
        } catch (error) {
          console.error("[auth:credentials]", error);
          return null;
        }

        if (!user || !user.passwordHash) return null;

        const valid = await bcrypt.compare(parsed.data.password, user.passwordHash);
        if (!valid) return null;

        return {
          id: user.id,
          email: user.email,
          name: user.name ?? undefined,
          image: user.image ?? undefined,
          role: user.role,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = (user as { role?: "customer" | "admin" }).role ?? "customer";
      } else if (token.id) {
        try {
          const [refreshed] = await db.select().from(users).where(eq(users.id, token.id as string));
          if (refreshed) {
            token.role = refreshed.role;
            token.name = refreshed.name;
            token.email = refreshed.email;
          }
        } catch (error) {
          console.error("[auth:jwt-refresh]", error);
        }
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string;
        session.user.role = (token.role as "customer" | "admin") ?? "customer";
      }
      return session;
    },
  },
});
