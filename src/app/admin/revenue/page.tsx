import type { Metadata } from "next";
import { desc } from "drizzle-orm";
import { requireAdmin } from "@/lib/admin";
import { db } from "@/lib/db";
import { orders, subscriptionEvents, subscriptions } from "@/lib/db/schema";
import { formatCurrencyBreakdown, isSince, orderRevenue, subscriptionMrr } from "@/lib/admin-data";
import { averageOrderValue, netSales, revenueOverTime, salesByPlan, salesReversals } from "@/lib/admin-shopify-analytics";
import { queryOrEmpty } from "@/lib/safe-db";
import { PLANS } from "@/lib/plans";
import { AdminShell } from "@/components/admin/admin-shell";
import { normalizeTimeframe, sinceForTimeframe, TimeframeNav } from "@/components/admin/timeframe-nav";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { GlassPanel, MiniStat } from "@/components/marketing/page-shell";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Admin Revenue",
  robots: { index: false, follow: false },
};

type PageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

function firstParam(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

export default async function AdminRevenuePage({ searchParams }: PageProps) {
  const session = await requireAdmin();
  const params = await searchParams;
  const timeframe = normalizeTimeframe(firstParam(params.timeframe));
  const since = sinceForTimeframe(timeframe);
  const [subscriptionRows, orderRows, eventRows] = await Promise.all([
    queryOrEmpty(db.select().from(subscriptions).orderBy(desc(subscriptions.updatedAt)).limit(1000), "admin-revenue-subscriptions"),
    queryOrEmpty(db.select().from(orders).orderBy(desc(orders.createdAt)).limit(1000), "admin-revenue-orders"),
    queryOrEmpty(db.select().from(subscriptionEvents).orderBy(desc(subscriptionEvents.createdAt)).limit(100), "admin-revenue-events"),
  ]);
  const ordersInFrame = orderRows.filter((order) => isSince(order.createdAt, since));
  const eventsInFrame = eventRows.filter((event) => isSince(event.createdAt, since));
  const activeSubs = subscriptionRows.filter((sub) => ["active", "trialing", "past_due"].includes(sub.status));
  const mrr = subscriptionMrr(activeSubs);
  const arr = Object.fromEntries(Object.entries(mrr).map(([currency, amount]) => [currency, amount * 12]));
  const grossSales = orderRevenue(ordersInFrame);
  const net = netSales(ordersInFrame);
  const reversals = salesReversals(ordersInFrame);
  const aov = averageOrderValue(ordersInFrame);
  const salesRows = revenueOverTime(ordersInFrame, 20);
  const totalSalesByPlan = salesByPlan(ordersInFrame);
  const planBreakdown = PLANS.map((plan) => {
    const planSubs = activeSubs.filter((sub) => sub.planId === plan.id);
    return {
      plan,
      count: planSubs.length,
      mrr: subscriptionMrr(planSubs),
    };
  });
  const churn = eventsInFrame.filter((event) => /deleted|cancel/i.test(event.type));
  const upgrades = eventsInFrame.filter((event) => /upgrade|plan_changed/i.test(event.type));
  const downgrades = eventsInFrame.filter((event) => /downgrade/i.test(event.type));

  return (
    <AdminShell
      session={session}
      title="Revenue"
      description="MRR, ARR, gross sales, net sales, sales reversals, average order value, plan breakdowns, churn, and subscription movement."
      actions={<TimeframeNav active={timeframe} basePath="/admin/revenue" />}
    >
      <div className="grid gap-4 md:grid-cols-4 xl:grid-cols-8">
        <MiniStat label="MRR" value={formatCurrencyBreakdown(mrr)} />
        <MiniStat label="ARR" value={formatCurrencyBreakdown(arr)} />
        <MiniStat label="Gross sales" value={formatCurrencyBreakdown(grossSales)} />
        <MiniStat label="Net sales" value={formatCurrencyBreakdown(net)} />
        <MiniStat label="Sales reversals" value={formatCurrencyBreakdown(reversals)} />
        <MiniStat label="Average order value" value={formatCurrencyBreakdown(aov)} />
        <MiniStat label="Orders" value={String(ordersInFrame.length)} />
        <MiniStat label="Churn events" value={String(churn.length)} />
      </div>
      <div className="mt-6 grid gap-6 xl:grid-cols-[1fr_1fr]">
        <GlassPanel>
          <h2 className="text-xl font-semibold tracking-tight">MRR breakdown by plan</h2>
          <div className="mt-4 space-y-3">
            {planBreakdown.map((row) => (
              <div key={row.plan.id} className="rounded-xl border border-border bg-card/40 p-4">
                <div className="flex items-center justify-between gap-3">
                  <span className="font-medium">{row.plan.name}</span>
                  <Badge variant={row.plan.popular ? "glow" : "outline"}>{row.count} active</Badge>
                </div>
                <p className="mt-2 text-sm text-muted-foreground">{formatCurrencyBreakdown(row.mrr)}</p>
              </div>
            ))}
          </div>
        </GlassPanel>
        <GlassPanel>
          <h2 className="text-xl font-semibold tracking-tight">Subscription events</h2>
          <div className="mt-4 grid gap-3 md:grid-cols-2">
            <MiniStat label="Upgrades" value={String(upgrades.length)} />
            <MiniStat label="Downgrades" value={String(downgrades.length)} />
          </div>
          <div className="mt-4">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Event</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {eventRows.length ? (
                  eventRows.slice(0, 10).map((event) => (
                    <TableRow key={event.id}>
                      <TableCell>{event.type}</TableCell>
                      <TableCell>{event.toStatus ?? "-"}</TableCell>
                      <TableCell>{event.createdAt.toLocaleDateString()}</TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={3} className="text-muted-foreground">No subscription events yet.</TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </GlassPanel>
      </div>
      <div className="mt-6 grid gap-6 xl:grid-cols-2">
        <GlassPanel>
          <h2 className="text-xl font-semibold tracking-tight">Gross sales over time</h2>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Orders</TableHead>
                <TableHead>Sales</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {salesRows.length ? salesRows.map((row) => (
                <TableRow key={row.date}>
                  <TableCell>{row.date}</TableCell>
                  <TableCell>{row.orders}</TableCell>
                  <TableCell>{formatCurrencyBreakdown(row.revenue)}</TableCell>
                </TableRow>
              )) : (
                <TableRow><TableCell colSpan={3} className="text-muted-foreground">No revenue data yet.</TableCell></TableRow>
              )}
            </TableBody>
          </Table>
        </GlassPanel>
        <GlassPanel>
          <h2 className="text-xl font-semibold tracking-tight">Total sales by plan</h2>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Plan</TableHead>
                <TableHead>Orders</TableHead>
                <TableHead>Sales</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {totalSalesByPlan.map((row) => (
                <TableRow key={row.plan.id}>
                  <TableCell>{row.plan.name}</TableCell>
                  <TableCell>{row.orders}</TableCell>
                  <TableCell>{formatCurrencyBreakdown(row.revenue)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </GlassPanel>
      </div>
    </AdminShell>
  );
}
