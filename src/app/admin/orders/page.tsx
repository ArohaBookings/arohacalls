import type { Metadata } from "next";
import Link from "next/link";
import { desc } from "drizzle-orm";
import { Download } from "lucide-react";
import { requireAdmin } from "@/lib/admin";
import { db } from "@/lib/db";
import { orders } from "@/lib/db/schema";
import { formatCurrencyBreakdown, isSince, money, orderRevenue } from "@/lib/admin-data";
import { averageOrderValue, netSales, salesReversals } from "@/lib/admin-shopify-analytics";
import { queryOrEmpty } from "@/lib/safe-db";
import { AdminShell } from "@/components/admin/admin-shell";
import { TestOrderButton } from "@/components/admin/test-order-button";
import { normalizeTimeframe, sinceForTimeframe, TimeframeNav } from "@/components/admin/timeframe-nav";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { GlassPanel, MiniStat } from "@/components/marketing/page-shell";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Admin Orders",
  robots: { index: false, follow: false },
};

type PageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

function firstParam(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

export default async function AdminOrdersPage({ searchParams }: PageProps) {
  const session = await requireAdmin();
  const params = await searchParams;
  const timeframe = normalizeTimeframe(firstParam(params.timeframe));
  const since = sinceForTimeframe(timeframe);
  const plan = firstParam(params.plan) ?? "all";
  const status = firstParam(params.status) ?? "all";
  const search = (firstParam(params.search) ?? "").toLowerCase();
  const rows = await queryOrEmpty(
    db.select().from(orders).orderBy(desc(orders.createdAt)).limit(1000),
    "admin-orders",
  );
  const filtered = rows.filter((order) => {
    if (!isSince(order.createdAt, since)) return false;
    if (plan !== "all" && order.planId !== plan) return false;
    if (status !== "all" && order.status !== status) return false;
    if (search && !`${order.customerName ?? ""} ${order.customerEmail} ${order.orderNumber}`.toLowerCase().includes(search)) return false;
    return true;
  });
  const exportHref = `/api/admin/orders/export?timeframe=${timeframe}&plan=${plan}&status=${status}&search=${encodeURIComponent(search)}`;
  const grossSales = orderRevenue(filtered);
  const net = netSales(filtered);
  const reversals = salesReversals(filtered);
  const aov = averageOrderValue(filtered);

  return (
    <AdminShell
      session={session}
      title="Orders"
      description="All signups and subscription orders in a Shopify-style table with search, filters, and CSV export."
      actions={
        <div className="flex flex-wrap items-center gap-2">
          <TestOrderButton />
          <TimeframeNav active={timeframe} basePath="/admin/orders" />
        </div>
      }
    >
      <div className="mb-6 grid gap-4 md:grid-cols-4">
        <MiniStat label="Orders" value={String(filtered.length)} />
        <MiniStat label="Gross sales" value={formatCurrencyBreakdown(grossSales)} />
        <MiniStat label="Net sales" value={formatCurrencyBreakdown(net)} />
        <MiniStat label="AOV" value={formatCurrencyBreakdown(aov)} />
        <MiniStat label="Sales reversals" value={formatCurrencyBreakdown(reversals)} />
        <MiniStat label="Active" value={String(filtered.filter((order) => order.status === "active").length)} />
        <MiniStat label="Past due" value={String(filtered.filter((order) => order.status === "past_due").length)} />
        <MiniStat label="Refunded" value={String(filtered.filter((order) => order.status === "refunded").length)} />
      </div>
      <GlassPanel>
        <form className="grid gap-3 lg:grid-cols-[1fr_180px_180px_auto]" action="/admin/orders">
          <input type="hidden" name="timeframe" value={timeframe} />
          <Input name="search" defaultValue={search} placeholder="Search name, email, order..." />
          <Select name="plan" defaultValue={plan}>
            <SelectTrigger><SelectValue placeholder="Plan" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All plans</SelectItem>
              <SelectItem value="lite">Lite</SelectItem>
              <SelectItem value="essentials">Essentials</SelectItem>
              <SelectItem value="professional">Professional</SelectItem>
              <SelectItem value="premium">Premium</SelectItem>
            </SelectContent>
          </Select>
          <Select name="status" defaultValue={status}>
            <SelectTrigger><SelectValue placeholder="Status" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All statuses</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
              <SelectItem value="past_due">Past due</SelectItem>
              <SelectItem value="refunded">Refunded</SelectItem>
            </SelectContent>
          </Select>
          <div className="flex gap-2">
            <Button type="submit">Filter</Button>
            <Button asChild variant="outline">
              <Link href={exportHref}>
                <Download className="h-4 w-4" />
                CSV
              </Link>
            </Button>
          </div>
        </form>
        <div className="mt-6">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Plan</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.length ? (
                filtered.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell className="font-medium">
                      <Link href={`/admin/orders/${order.id}`} className="text-primary hover:underline">
                        {order.orderNumber}
                      </Link>
                    </TableCell>
                    <TableCell>
                      <Link href={`/admin/customers/${order.userId}`} className="hover:text-primary hover:underline">
                        {order.customerName ?? "No name"}
                      </Link>
                      <div className="text-xs text-muted-foreground">{order.customerEmail}</div>
                    </TableCell>
                    <TableCell>{order.planName}</TableCell>
                    <TableCell className="capitalize">{order.status}</TableCell>
                    <TableCell>{money(order.amount, order.currency)}</TableCell>
                    <TableCell>{order.createdAt.toLocaleDateString()}</TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="text-muted-foreground">No matching orders.</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </GlassPanel>
    </AdminShell>
  );
}
