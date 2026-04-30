import { NextResponse } from "next/server";
import { desc } from "drizzle-orm";
import { requireAdmin } from "@/lib/admin";
import { db } from "@/lib/db";
import { orders } from "@/lib/db/schema";
import { csvEscape, isSince } from "@/lib/admin-data";
import { queryOrEmpty } from "@/lib/safe-db";

export const dynamic = "force-dynamic";

const timeframes = ["7d", "30d", "90d", "1y", "all"] as const;

function sinceFor(value: string | null) {
  const timeframe = timeframes.includes(value as (typeof timeframes)[number]) ? value : "all";
  if (timeframe === "all") return null;
  const days = timeframe === "7d" ? 7 : timeframe === "30d" ? 30 : timeframe === "90d" ? 90 : 365;
  return new Date(Date.now() - days * 24 * 60 * 60 * 1000);
}

export async function GET(req: Request) {
  await requireAdmin();
  const url = new URL(req.url);
  const since = sinceFor(url.searchParams.get("timeframe"));
  const plan = url.searchParams.get("plan") ?? "all";
  const status = url.searchParams.get("status") ?? "all";
  const search = (url.searchParams.get("search") ?? "").toLowerCase();

  const rows = await queryOrEmpty(
    db.select().from(orders).orderBy(desc(orders.createdAt)).limit(5000),
    "admin-orders-export",
  );
  const filtered = rows.filter((order) => {
    if (!isSince(order.createdAt, since)) return false;
    if (plan !== "all" && order.planId !== plan) return false;
    if (status !== "all" && order.status !== status) return false;
    if (search && !`${order.customerName ?? ""} ${order.customerEmail} ${order.orderNumber}`.toLowerCase().includes(search)) return false;
    return true;
  });

  const headers = [
    "order_number",
    "customer_name",
    "customer_email",
    "business_name",
    "plan",
    "status",
    "currency",
    "amount_minor",
    "stripe_checkout_session_id",
    "stripe_invoice_id",
    "created_at",
  ];
  const body = filtered.map((order) =>
    [
      order.orderNumber,
      order.customerName,
      order.customerEmail,
      order.businessName,
      order.planName,
      order.status,
      order.currency,
      order.amount,
      order.stripeCheckoutSessionId,
      order.stripeInvoiceId,
      order.createdAt.toISOString(),
    ]
      .map(csvEscape)
      .join(","),
  );
  const csv = [headers.join(","), ...body].join("\n");

  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="aroha-orders-${new Date().toISOString().slice(0, 10)}.csv"`,
    },
  });
}
