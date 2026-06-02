import type { Metadata } from "next";
import { desc } from "drizzle-orm";
import { requireAdmin } from "@/lib/admin";
import { db } from "@/lib/db";
import {
  arohaAiWebhookEvents,
  conversionEvents,
  customerProfiles,
  demoBookings,
  orders,
  pageViews,
  stripeWebhookEvents,
  subscriptions,
  subscriptionEvents,
  users,
} from "@/lib/db/schema";
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
import { DonutChart, FunnelPerformanceChart, HorizontalBarChart, MetricBarChart, RevenueTrendChart } from "@/components/admin/charts";
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
  const [orderRows, subscriptionRows, userRows, demoRows, conversionRows, eventRows, pageRows, profileRows, arohaWebhookRows, stripeWebhookRows] = await Promise.all([
    queryOrEmpty(db.select().from(orders).orderBy(desc(orders.createdAt)).limit(1000), "admin-overview-orders"),
    queryOrEmpty(db.select().from(subscriptions).orderBy(desc(subscriptions.updatedAt)).limit(1000), "admin-overview-subscriptions"),
    queryOrEmpty(db.select().from(users).orderBy(desc(users.createdAt)).limit(1000), "admin-overview-users"),
    queryOrEmpty(db.select().from(demoBookings).orderBy(desc(demoBookings.createdAt)).limit(1000), "admin-overview-demos"),
    queryOrEmpty(db.select().from(conversionEvents).orderBy(desc(conversionEvents.createdAt)).limit(1000), "admin-overview-conversions"),
    queryOrEmpty(db.select().from(subscriptionEvents).orderBy(desc(subscriptionEvents.createdAt)).limit(1000), "admin-overview-events"),
    queryOrEmpty(db.select().from(pageViews).orderBy(desc(pageViews.createdAt)).limit(5000), "admin-overview-page-views"),
    queryOrEmpty(db.select().from(customerProfiles).limit(1000), "admin-overview-profiles"),
    queryOrEmpty(db.select().from(arohaAiWebhookEvents).orderBy(desc(arohaAiWebhookEvents.createdAt)).limit(1000), "admin-overview-aroha-webhooks"),
    queryOrEmpty(db.select().from(stripeWebhookEvents).orderBy(desc(stripeWebhookEvents.processedAt)).limit(1000), "admin-overview-stripe-webhooks"),
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
  const timelineChartRows = timelineRows.map((row) => ({
    date: row.date.slice(5),
    NZD: row.revenue.NZD ?? 0,
    USD: row.revenue.USD ?? 0,
    orders: row.orders,
  }));
  const planMix = planRows.map((row) => ({ name: row.plan.name, value: row.orders }));
  const onboardingStatus = Object.entries(
    profileRows.reduce<Record<string, number>>((acc, profile) => {
      acc[profile.onboardingStatus] = (acc[profile.onboardingStatus] ?? 0) + 1;
      return acc;
    }, {}),
  ).map(([name, value]) => ({ name, value }));
  const webhookHealth = [
    { name: "Stripe processed", value: stripeWebhookRows.filter((row) => row.processingStatus === "processed").length, fill: "#00d2a1" },
    { name: "Stripe failed", value: stripeWebhookRows.filter((row) => row.processingStatus === "failed").length, fill: "#f43f5e" },
    { name: "Aroha AI processed", value: arohaWebhookRows.filter((row) => row.status === "processed").length, fill: "#22d3ee" },
    { name: "Aroha AI failed", value: arohaWebhookRows.filter((row) => row.status === "failed").length, fill: "#f59e0b" },
    { name: "Aroha AI queued", value: arohaWebhookRows.filter((row) => ["pending", "processing"].includes(row.status)).length, fill: "#8b5cf6" },
  ];

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
        <RevenueTrendChart data={timelineChartRows} title="Revenue graph" subtitle={`Gross sales for ${timeframe}; NZD and USD stay separate for clean reporting.`} />
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
        <FunnelPerformanceChart data={funnel} />
        <DonutChart title="Orders by plan" subtitle="Plan mix for the selected timeframe." data={planMix} />
      </div>
      <div className="mt-6 grid gap-6 xl:grid-cols-2">
        <HorizontalBarChart title="Setup status" subtitle="Where customers are in managed onboarding and provisioning." data={onboardingStatus} />
        <MetricBarChart title="Webhook health" subtitle="Recent Stripe and Aroha AI webhook processing health." data={webhookHealth} />
      </div>
    </AdminShell>
  );
}
