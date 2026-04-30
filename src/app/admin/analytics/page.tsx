import type { Metadata } from "next";
import { desc } from "drizzle-orm";
import { requireAdmin } from "@/lib/admin";
import { db } from "@/lib/db";
import { conversionEvents, demoBookings, orders, pageViews, users } from "@/lib/db/schema";
import { isSince } from "@/lib/admin-data";
import {
  eventCount,
  percent,
  returningCustomerStats,
  shopifyStyleFunnel,
  topPages,
  topTrafficSources,
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
  title: "Admin Analytics",
  robots: { index: false, follow: false },
};

type PageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

function firstParam(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

export default async function AdminAnalyticsPage({ searchParams }: PageProps) {
  const session = await requireAdmin();
  const params = await searchParams;
  const timeframe = normalizeTimeframe(firstParam(params.timeframe));
  const since = sinceForTimeframe(timeframe);
  const [viewRows, conversionRows, demoRows, userRows, orderRows] = await Promise.all([
    queryOrEmpty(db.select().from(pageViews).orderBy(desc(pageViews.createdAt)).limit(5000), "admin-analytics-page-views"),
    queryOrEmpty(db.select().from(conversionEvents).orderBy(desc(conversionEvents.createdAt)).limit(1000), "admin-analytics-conversions"),
    queryOrEmpty(db.select().from(demoBookings).orderBy(desc(demoBookings.createdAt)).limit(1000), "admin-analytics-demos"),
    queryOrEmpty(db.select().from(users).orderBy(desc(users.createdAt)).limit(1000), "admin-analytics-users"),
    queryOrEmpty(db.select().from(orders).orderBy(desc(orders.createdAt)).limit(1000), "admin-analytics-orders"),
  ]);
  const views = viewRows.filter((view) => isSince(view.createdAt, since));
  const conversions = conversionRows.filter((event) => isSince(event.createdAt, since));
  const demos = demoRows.filter((demo) => isSince(demo.createdAt, since));
  const signups = userRows.filter((user) => isSince(user.createdAt, since));
  const orderFrame = orderRows.filter((order) => isSince(order.createdAt, since));
  const pageCounts = topPages(views, 15);
  const sourceCounts = topTrafficSources(views, 12);
  const conversionCounts = Object.entries(
    conversions.reduce<Record<string, number>>((acc, event) => {
      acc[event.name] = (acc[event.name] ?? 0) + 1;
      return acc;
    }, {}),
  ).sort((a, b) => b[1] - a[1]);
  const sessions = uniqueSessions(views);
  const visitors = uniqueVisitors(views);
  const signupRate = percent(signups.length, sessions);
  const demoRate = percent(demos.length, sessions);
  const checkoutRate = percent(orderFrame.length, sessions);
  const roiCompletions = eventCount(conversions, "roi_calculator_completed");
  const blogTraffic = views.filter((view) => view.path.startsWith("/blog")).length;
  const checkoutStarted = eventCount(conversions, "checkout_started");
  const customerStats = returningCustomerStats(orderRows);
  const funnel = shopifyStyleFunnel({ views, conversions, orders: orderFrame, demos, users: signups });

  return (
    <AdminShell
      session={session}
      title="Analytics"
      description="Visitor sessions, page views, acquisition sources, signup/demo/checkout conversion, blog traffic, and Shopify-style funnel data."
      actions={<TimeframeNav active={timeframe} basePath="/admin/analytics" />}
    >
      <div className="grid gap-4 md:grid-cols-4 xl:grid-cols-8">
        <MiniStat label="Page views" value={String(views.length)} />
        <MiniStat label="Sessions" value={String(sessions)} />
        <MiniStat label="Visitors" value={String(visitors)} />
        <MiniStat label="Signup conversion" value={`${signupRate}%`} />
        <MiniStat label="Demo conversion" value={`${demoRate}%`} />
        <MiniStat label="Checkout conversion" value={`${checkoutRate}%`} />
        <MiniStat label="Checkout starts" value={String(checkoutStarted)} />
        <MiniStat label="ROI completions" value={String(roiCompletions)} />
        <MiniStat label="Blog traffic" value={String(blogTraffic)} />
        <MiniStat label="Returning customer rate" value={`${customerStats.returningCustomerRate}%`} />
      </div>
      <div className="mt-6 grid gap-6 xl:grid-cols-2">
        <GlassPanel>
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold tracking-tight">Top pages</h2>
            <Badge variant="outline">{timeframe}</Badge>
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Page</TableHead>
                <TableHead>Views</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {pageCounts.length ? (
                pageCounts.slice(0, 15).map(([path, count]) => (
                  <TableRow key={path}>
                    <TableCell>{path}</TableCell>
                    <TableCell>{count}</TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow><TableCell colSpan={2} className="text-muted-foreground">No page views yet.</TableCell></TableRow>
              )}
            </TableBody>
          </Table>
        </GlassPanel>
        <GlassPanel>
          <h2 className="text-xl font-semibold tracking-tight">Conversion events</h2>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Event</TableHead>
                <TableHead>Count</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {conversionCounts.length ? (
                conversionCounts.map(([name, count]) => (
                  <TableRow key={name}>
                    <TableCell>{name}</TableCell>
                    <TableCell>{count}</TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow><TableCell colSpan={2} className="text-muted-foreground">No conversion events yet.</TableCell></TableRow>
              )}
            </TableBody>
          </Table>
        </GlassPanel>
      </div>
      <div className="mt-6 grid gap-6 xl:grid-cols-2">
        <GlassPanel>
          <h2 className="text-xl font-semibold tracking-tight">Conversion funnel</h2>
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
          <h2 className="text-xl font-semibold tracking-tight">Traffic sources</h2>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Source</TableHead>
                <TableHead>Views</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sourceCounts.length ? (
                sourceCounts.map(([source, count]) => (
                  <TableRow key={source}>
                    <TableCell>{source}</TableCell>
                    <TableCell>{count}</TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow><TableCell colSpan={2} className="text-muted-foreground">No source data yet.</TableCell></TableRow>
              )}
            </TableBody>
          </Table>
        </GlassPanel>
      </div>
    </AdminShell>
  );
}
