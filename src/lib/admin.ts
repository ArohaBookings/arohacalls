import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";

export async function requireAuth() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login?from=/dashboard");
  return session;
}

export async function requireAdmin() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login?from=/admin");
  if (session.user.role !== "admin") redirect("/dashboard");
  return session;
}

export async function getOptionalSession() {
  return auth();
}
