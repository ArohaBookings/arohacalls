import type { Metadata } from "next";
import Link from "next/link";
import { desc, eq } from "drizzle-orm";
import { ArrowUpRight, CalendarCheck, PhoneCall, Quote, Sparkles } from "lucide-react";
import { requireAuth } from "@/lib/admin";
import { db } from "@/lib/db";
import { customerProfiles, invoices, orders, subscriptions, supportTickets, users } from "@/lib/db/schema";
import { getPlan, type Plan } from "@/lib/plans";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { ArohaAILauncher } from "@/components/dashboard/aroha-ai-launcher";
import { GlassPanel, MiniStat } from "@/components/marketing/page-shell";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Customer Dashboard",
  robots: { index: false, follow: false },
};

export default async function DashboardPage() {
  const session = await requireAuth();
  const [[user], [profile], [subscription], orderRows, ticketRows, invoiceRows] = await Promise.all([
    db.select().from(users).where(eq(users.id, session.user.id)).limit(1),
    db.select().from(customerProfiles).where(eq(customerProfiles.userId, session.user.id)).limit(1),
    db
      .select()
      .from(subscriptions)
      .where(eq(subscriptions.userId, session.user.id))
      .orderBy(desc(subscriptions.updatedAt))
      .limit(1),
    db
      .select()
      .from(orders)
      .where(eq(orders.userId, session.user.id))
      .orderBy(desc(orders.createdAt))
      .limit(3),
    db
      .select()
      .from(supportTickets)
      .where(eq(supportTickets.userId, session.user.id))
      .orderBy(desc(supportTickets.createdAt))
      .limit(3),
    db
      .select()
      .from(invoices)
      .where(eq(invoices.userId, session.user.id))
      .orderBy(desc(invoices.createdAt))
      .limit(3),
  ]);

  const plan = subscription ? getPlan(subscription.planId as Plan["id"]) : null;
  const isLive = profile?.onboardingStatus === "live";
  const arohaAiUrl = `https://arohaai.app?utm_source=arohacalls&utm_medium=dashboard&utm_campaign=managed_handoff&email=${encodeURIComponent(user?.email ?? session.user.email ?? "")}`;
  const activity = [
    ...orderRows.map((order) => ({ label: `${order.planName} order ${order.status}`, at: order.createdAt })),
    ...ticketRows.map((ticket) => ({ label: `Support ticket: ${ticket.subject}`, at: ticket.createdAt })),
    ...invoiceRows.map((invoice) => ({ label: `Invoice ${invoice.status}`, at: invoice.createdAt })),
  ]
    .sort((a, b) => b.at.getTime() - a.at.getTime())
    .slice(0, 6);

  return (
    <DashboardShell
      session={session}
      title={`Welcome back${session.user.name ? `, ${session.user.name}` : ""}`}
      description="Your managed Aroha Calls service, onboarding, billing, support, and Aroha AI handoff live here."
    >
      <div className="grid gap-6 xl:grid-cols-[1.35fr_0.65fr]">
        <div className="space-y-6">
          <GlassPanel>
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <Badge variant={isLive ? "success" : "warning"}>{isLive ? "Live" : "Setup in progress"}</Badge>
                <h2 className="mt-4 text-2xl font-semibold tracking-tight">
                  {isLive ? "Your Aroha AI is live and running" : "Your setup is in progress"}
                </h2>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  {isLive
                    ? "Aroha Calls is handling your managed front desk workflows."
                    : "Leo will contact you within 24 hours after onboarding and payment details are complete."}
                </p>
              </div>
              <Button asChild>
                <Link href="/dashboard/onboarding">
                  Finish onboarding
                  <ArrowUpRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>
          </GlassPanel>

          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <MiniStat label="Calls handled this month" value="0" />
            <MiniStat label="Bookings made" value="0" />
            <MiniStat label="Quotes sent" value="0" />
            <MiniStat label="Current plan" value={plan?.name ?? "None"} />
          </div>

          <GlassPanel>
            <h2 className="text-xl font-semibold tracking-tight">Recent activity</h2>
            <div className="mt-4 divide-y divide-border/70">
              {activity.length ? (
                activity.map((item) => (
                  <div key={`${item.label}-${item.at.toISOString()}`} className="flex items-center justify-between gap-4 py-3 text-sm">
                    <span>{item.label}</span>
                    <span className="text-xs text-muted-foreground">{item.at.toLocaleDateString()}</span>
                  </div>
                ))
              ) : (
                <p className="py-4 text-sm text-muted-foreground">No account activity yet.</p>
              )}
            </div>
          </GlassPanel>
        </div>

        <div className="space-y-6">
          <GlassPanel>
            <Badge variant="glow">{plan?.name ?? "No active plan"}</Badge>
            <h2 className="mt-4 text-xl font-semibold tracking-tight">Managed by Leo, powered by Aroha AI</h2>
            <p className="mt-3 text-sm leading-6 text-muted-foreground">
              Aroha Calls is the done-for-you service. Aroha AI is the CRM, email, messages, calendar, and assistant engine behind it.
            </p>
            <Button asChild variant="outline" className="mt-5 w-full">
              <Link href={arohaAiUrl} target="_blank">
                Open Aroha AI
                <ArrowUpRight className="h-4 w-4" />
              </Link>
            </Button>
            <p className="mt-3 text-xs text-muted-foreground">
              Your account is pre-identified by your Aroha Calls email — no second login required.
            </p>
          </GlassPanel>
          <GlassPanel>
            <h2 className="text-xl font-semibold tracking-tight">What is active</h2>
            <div className="mt-4 grid gap-3">
              {[
                [PhoneCall, "Voice AI setup"],
                [CalendarCheck, "Calendar and booking rules"],
                [Sparkles, "CRM and Aurora handoff"],
                [Quote, "Quotes, notes, and follow-ups"],
              ].map(([Icon, label]) => (
                <div key={label as string} className="flex items-center gap-3 rounded-xl border border-border bg-card/40 p-3 text-sm">
                  <Icon className="h-4 w-4 text-primary" />
                  {label as string}
                </div>
              ))}
            </div>
          </GlassPanel>
        </div>
      </div>

      <div className="mt-10">
        <GlassPanel>
          <ArohaAILauncher email={user?.email ?? session.user.email} planId={(subscription?.planId as "lite" | "essentials" | "professional" | "premium" | undefined) ?? null} />
        </GlassPanel>
      </div>
    </DashboardShell>
  );
}
