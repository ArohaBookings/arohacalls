import type { Metadata } from "next";
import { desc, eq } from "drizzle-orm";
import { requireAuth } from "@/lib/admin";
import { db } from "@/lib/db";
import { subscriptions } from "@/lib/db/schema";
import { formatPlanPrice, getPlan, PLANS, type Plan } from "@/lib/plans";
import { CheckoutButton } from "@/components/marketing/checkout-button";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { PortalButton } from "@/components/dashboard/portal-button";
import { Badge } from "@/components/ui/badge";
import { GlassPanel, MiniStat } from "@/components/marketing/page-shell";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Plan",
  robots: { index: false, follow: false },
};

export default async function PlanPage() {
  const session = await requireAuth();
  const [subscription] = await db
    .select()
    .from(subscriptions)
    .where(eq(subscriptions.userId, session.user.id))
    .orderBy(desc(subscriptions.updatedAt))
    .limit(1);
  const plan = subscription ? getPlan(subscription.planId as Plan["id"]) : null;
  const currentAmount = subscription ? formatPlanPrice(subscription.amount / 100, subscription.currency.toUpperCase() as "NZD" | "USD") : null;

  return (
    <DashboardShell
      session={session}
      title="Plan"
      description="Review your current managed-service plan, usage window, and upgrade or downgrade through Stripe."
    >
      <div className="grid gap-6 xl:grid-cols-[0.8fr_1.2fr]">
        <GlassPanel className="h-fit">
          <Badge variant={subscription?.status === "active" ? "success" : "outline"}>
            {subscription?.status ?? "No subscription"}
          </Badge>
          <h2 className="mt-4 text-2xl font-semibold tracking-tight">{plan?.name ?? "Choose a plan"}</h2>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            {plan?.tagline ?? "Pick an Aroha Calls plan to start your managed AI receptionist setup."}
          </p>
          <div className="mt-6 grid gap-3">
            <MiniStat label="Billing amount" value={currentAmount ?? "-"} />
            <MiniStat label="Billing interval" value={subscription?.interval ?? "-"} />
            <MiniStat label="Usage this period" value="Managed usage pending" />
          </div>
          <div className="mt-6">
            <PortalButton label="Change or cancel in Stripe" />
          </div>
        </GlassPanel>
        <div className="grid gap-4 md:grid-cols-2">
          {PLANS.map((option) => (
            <GlassPanel key={option.id} className={option.popular ? "border-primary/40" : undefined}>
              <div className="flex items-center justify-between gap-3">
                <h3 className="text-lg font-semibold tracking-tight">{option.name}</h3>
                {option.id === subscription?.planId ? <Badge variant="success">Current</Badge> : null}
              </div>
              <p className="mt-2 text-sm text-muted-foreground">{option.bestFor}</p>
              <p className="mt-4 text-2xl font-semibold">{formatPlanPrice(option.priceNZD, "NZD")}<span className="text-sm text-muted-foreground">/mo</span></p>
              <div className="mt-5">
                <CheckoutButton planId={option.id} label={option.id === subscription?.planId ? "Restart checkout" : "Select plan"} variant="outline" />
              </div>
            </GlassPanel>
          ))}
        </div>
      </div>
    </DashboardShell>
  );
}
