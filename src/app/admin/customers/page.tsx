import type { Metadata } from "next";
import { desc } from "drizzle-orm";
import { requireAdmin } from "@/lib/admin";
import { db } from "@/lib/db";
import { customerProfiles, subscriptions, users } from "@/lib/db/schema";
import { money } from "@/lib/admin-data";
import { queryOrEmpty } from "@/lib/safe-db";
import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { AdminShell } from "@/components/admin/admin-shell";
import { TestOrderButton } from "@/components/admin/test-order-button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { GlassPanel, MiniStat } from "@/components/marketing/page-shell";
import { buildArohaAiUrl } from "@/lib/aroha-ai-tools";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Admin Customers",
  robots: { index: false, follow: false },
};

export default async function AdminCustomersPage() {
  const session = await requireAdmin();
  const [userRows, profileRows, subscriptionRows] = await Promise.all([
    queryOrEmpty(db.select().from(users).orderBy(desc(users.createdAt)).limit(1000), "admin-customers-users"),
    queryOrEmpty(db.select().from(customerProfiles).limit(1000), "admin-customers-profiles"),
    queryOrEmpty(db.select().from(subscriptions).orderBy(desc(subscriptions.updatedAt)).limit(1000), "admin-customers-subscriptions"),
  ]);
  const profilesByUser = new Map(profileRows.map((profile) => [profile.userId, profile]));
  const subscriptionsByUser = new Map<string, (typeof subscriptionRows)[number]>();
  for (const subscription of subscriptionRows) {
    if (!subscriptionsByUser.has(subscription.userId)) subscriptionsByUser.set(subscription.userId, subscription);
  }
  const active = subscriptionRows.filter((sub) => ["active", "trialing"].includes(sub.status)).length;
  const pastDue = subscriptionRows.filter((sub) => sub.status === "past_due").length;
  const cancelled = subscriptionRows.filter((sub) => sub.status === "cancelled").length;

  return (
    <AdminShell
      session={session}
      title="Customers"
      description="Full customer list with status, plan, MRR contribution, signup date, last known activity, billing history hooks, and onboarding state."
      actions={<TestOrderButton />}
    >
      <div className="mb-6 grid gap-4 md:grid-cols-4">
        <MiniStat label="Total users" value={String(userRows.length)} />
        <MiniStat label="Active" value={String(active)} />
        <MiniStat label="Past due" value={String(pastDue)} />
        <MiniStat label="Cancelled" value={String(cancelled)} />
      </div>
      <GlassPanel>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Customer</TableHead>
              <TableHead>Business</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Plan</TableHead>
              <TableHead>MRR</TableHead>
              <TableHead>Renews</TableHead>
              <TableHead>Signup</TableHead>
              <TableHead>Onboarding</TableHead>
              <TableHead>Aroha AI org</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {userRows.length ? (
              userRows.map((user) => {
                const profile = profilesByUser.get(user.id);
                const subscription = subscriptionsByUser.get(user.id);
                const mrr = subscription ? (subscription.interval === "year" ? Math.round(subscription.amount / 12) : subscription.amount) : 0;
                return (
                  <TableRow key={user.id}>
                    <TableCell>
                      <Link href={`/admin/customers/${user.id}`} className="font-medium text-primary hover:underline">
                        {user.name ?? "No name"}
                      </Link>
                      <div className="text-xs text-muted-foreground">{user.email}</div>
                    </TableCell>
                    <TableCell>{profile?.businessName ?? "-"}</TableCell>
                    <TableCell>
                      <Badge variant={subscription?.status === "active" ? "success" : "outline"}>
                        {subscription?.status ?? "no plan"}
                      </Badge>
                    </TableCell>
                    <TableCell className="capitalize">{subscription?.planId ?? "-"}</TableCell>
                    <TableCell>{subscription ? money(mrr, subscription.currency) : "-"}</TableCell>
                    <TableCell>{subscription?.currentPeriodEnd?.toLocaleDateString() ?? "-"}</TableCell>
                    <TableCell>{user.createdAt.toLocaleDateString()}</TableCell>
                    <TableCell className="capitalize">{profile?.onboardingStatus ?? "pending"}</TableCell>
                    <TableCell>
                      <Link
                        href={buildArohaAiUrl({
                          email: user.email,
                          path: "/admin/orgs/new",
                          source: "admin",
                          campaign: "managed_org_creation",
                        })}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline"
                      >
                        Set up org
                        <ArrowUpRight className="h-3 w-3" />
                      </Link>
                    </TableCell>
                  </TableRow>
                );
              })
            ) : (
              <TableRow>
                <TableCell colSpan={9} className="text-muted-foreground">No customers yet. Click &ldquo;Simulate test order&rdquo; to populate test data.</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </GlassPanel>
    </AdminShell>
  );
}
