import type { Metadata } from "next";
import { desc } from "drizzle-orm";
import { requireAdmin } from "@/lib/admin";
import { db } from "@/lib/db";
import { conversionEvents, demoBookings, orders, pageViews, subscriptions, subscriptionEvents, users } from "@/lib/db/schema";
import { formatCurrencyBreakdown, isSince, orderRevenue, subscriptionMrr } from "@/lib/admin-data";
import {
  averageOrderValue,
  netSales,
  percent,
  returningCustomerStats,
  revenueOverTime,
  salesByPlan,
  salesReversals,
  shopifyStyleFunnel,
  uniqueSessions,
  uniqueVisitors,
} from "@/lib/admin-shopify-analytics";
import { queryOrEmpty } from "@/lib/safe-db";
import { AdminShell } from "@/components/admin/admin-shell";
import { normalizeTimeframe, sinceForTimeframe, TimeframeNav } from "@/components/admin/timeframe-nav";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { GlassPanel, MiniStat } from "@/components/marketing/page-shell";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Admin Overview",
  robots: { index: false, follow: false },
};

type PageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

function firstParam(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

export default async function AdminOverviewPage({ searchParams }: PageProps) {
  const session = await requireAdmin();
  const params = await searchParams;
  const timeframe = normalizeTimeframe(firstParam(params.timeframe));
  const since = sinceForTimeframe(timeframe);
  const [orderRows, subscriptionRows, userRows, demoRows, conversionRows, eventRows, pageRows] = await Promise.all([
    queryOrEmpty(db.select().from(orders).orderBy(desc(orders.createdAt)).limit(1000), "admin-overview-orders"),
    queryOrEmpty(db.select().from(subscriptions).orderBy(desc(subscriptions.updatedAt)).limit(1000), "admin-overview-subscriptions"),
    queryOrEmpty(db.select().from(users).orderBy(desc(users.createdAt)).limit(1000), "admin-overview-users"),
    queryOrEmpty(db.select().from(demoBookings).orderBy(desc(demoBookings.createdAt)).limit(1000), "admin-overview-demos"),
    queryOrEmpty(db.select().from(conversionEvents).orderBy(desc(conversionEvents.createdAt)).limit(1000), "admin-overview-conversions"),
    queryOrEmpty(db.select().from(subscriptionEvents).orderBy(desc(subscriptionEvents.createdAt)).limit(1000), "admin-overview-events"),
    queryOrEmpty(db.select().from(pageViews).orderBy(desc(pageViews.createdAt)).limit(5000), "admin-overview-page-views"),
  ]);
  const ordersInFrame = orderRows.filter((order) => isSince(order.createdAt, since));
  const usersInFrame = userRows.filter((user) => isSince(user.createdAt, since));
  const demosInFrame = demoRows.filter((demo) => isSince(demo.createdAt, since));
  const conversionsInFrame = conversionRows.filter((event) => isSince(event.createdAt, since));
  const viewsInFrame = pageRows.filter((view) => isSince(view.createdAt, since));
  const churnEvents = eventRows.filter((event) => isSince(event.createdAt, since) && /deleted|cancel/i.test(event.type));
  const mrr = subscriptionMrr(subscriptionRows);
  const arr = Object.fromEntries(Object.entries(mrr).map(([currency, amount]) => [currency, amount * 12]));
  const grossSales = orderRevenue(ordersInFrame);
  const net = netSales(ordersInFrame);
  const reversals = salesReversals(ordersInFrame);
  const aov = averageOrderValue(ordersInFrame);
  const customerStats = returningCustomerStats(orderRows);
  const sessions = uniqueSessions(viewsInFrame);
  const visitors = uniqueVisitors(viewsInFrame);
  const funnel = shopifyStyleFunnel({
    views: viewsInFrame,
    conversions: conversionsInFrame,
    orders: ordersInFrame,
    demos: demosInFrame,
    users: usersInFrame,
  });
  const planRows = salesByPlan(ordersInFrame);
  const timelineRows = revenueOverTime(ordersInFrame, 12);
  const activeCustomers = subscriptionRows.filter((sub) => ["active", "trialing"].includes(sub.status)).length;
  const averageRevenue = Object.fromEntries(
    Object.entries(grossSales).map(([currency, amount]) => [
      currency,
      activeCustomers ? Math.round(amount / activeCustomers) : 0,
    ]),
  );
  const max = Math.max(...timelineRows.map((row) => Object.values(row.revenue).reduce((sum, amount) => sum + amount, 0)), 1);

  return (
    <AdminShell
      session={session}
      title="Overview"
      description="Shopify-style command center for sales, orders, visitor sessions, conversion, returning customers, subscriptions, churn, and revenue trends."
      actions={<TimeframeNav active={timeframe} basePath="/admin/overview" />}
    >
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        <MiniStat label="MRR" value={formatCurrencyBreakdown(mrr)} />
        <MiniStat label="ARR" value={formatCurrencyBreakdown(arr)} />
        <MiniStat label="Gross sales" value={formatCurrencyBreakdown(grossSales)} />
        <MiniStat label="Net sales" value={formatCurrencyBreakdown(net)} />
        <MiniStat label="Average order value" value={formatCurrencyBreakdown(aov)} />
        <MiniStat label="Active customers" value={String(activeCustomers)} />
        <MiniStat label="New signups" value={String(usersInFrame.length)} />
        <MiniStat label="ARPC" value={formatCurrencyBreakdown(averageRevenue)} />
        <MiniStat label="Sessions" value={String(sessions)} />
        <MiniStat label="Visitors" value={String(visitors)} />
        <MiniStat label="Store conversion" value={`${percent(ordersInFrame.length, sessions)}%`} />
        <MiniStat label="Returning customer rate" value={`${customerStats.returningCustomerRate}%`} />
        <MiniStat label="Sales reversals" value={formatCurrencyBreakdown(reversals)} />
        <MiniStat label="Orders" value={String(ordersInFrame.length)} />
      </div>
      <div className="mt-6 grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <GlassPanel>
          <div className="flex items-center justify-between gap-4">
            <h2 className="text-xl font-semibold tracking-tight">Revenue graph</h2>
            <Badge variant="outline">{timeframe}</Badge>
          </div>
          <div className="mt-6 flex h-64 items-end gap-3">
            {timelineRows.length ? (
              timelineRows.map((row) => {
                const amount = Object.values(row.revenue).reduce((sum, value) => sum + value, 0);
                return (
                <div key={row.date} className="flex min-w-0 flex-1 flex-col items-center gap-2">
                  <div
                    className="w-full rounded-t-lg bg-gradient-to-t from-primary/45 to-primary"
                    style={{ height: `${Math.max(12, (amount / max) * 220)}px` }}
                  />
                  <span className="truncate text-[10px] text-muted-foreground">{row.date.slice(5)}</span>
                </div>
              );
              })
            ) : (
              <div className="flex h-full w-full items-center justify-center rounded-xl border border-dashed border-border text-sm text-muted-foreground">
                No revenue data for this timeframe.
              </div>
            )}
          </div>
        </GlassPanel>
        <GlassPanel>
          <h2 className="text-xl font-semibold tracking-tight">Operational stats</h2>
          <div className="mt-4 grid gap-3">
            <MiniStat label="Demo bookings" value={String(demosInFrame.length)} />
            <MiniStat label="Conversion events" value={String(conversionsInFrame.length)} />
            <MiniStat label="Churn events" value={String(churnEvents.length)} />
            <MiniStat label="Churn rate" value={`${activeCustomers ? Math.round((churnEvents.length / activeCustomers) * 1000) / 10 : 0}%`} />
            <MiniStat label="First-time customers" value={String(customerStats.firstTimeCustomers)} />
            <MiniStat label="Returning customers" value={String(customerStats.returningCustomers)} />
          </div>
        </GlassPanel>
      </div>
      <div className="mt-6 grid gap-6 xl:grid-cols-2">
        <GlassPanel>
          <h2 className="text-xl font-semibold tracking-tight">Shopify-style conversion funnel</h2>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Step</TableHead>
                <TableHead>Count</TableHead>
                <TableHead>Rate</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {funnel.map((row) => (
                <TableRow key={row.label}>
                  <TableCell>{row.label}</TableCell>
                  <TableCell>{row.value}</TableCell>
                  <TableCell>{row.rate}%</TableCell>
                </TableRow>
              ))}
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
              {planRows.map((row) => (
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
