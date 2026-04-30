import type { ConversionEvent, DemoBooking, Order, PageView, Subscription, User } from "@/lib/db/schema";
import { PLANS } from "@/lib/plans";
import { orderRevenue, sumByCurrency } from "@/lib/admin-data";

export function percent(part: number, whole: number) {
  if (!whole) return 0;
  return Math.round((part / whole) * 1000) / 10;
}

export function averageOrderValue(orders: Order[]) {
  const revenue = orderRevenue(orders);
  return Object.fromEntries(
    Object.entries(revenue).map(([currency, amount]) => [currency, orders.length ? Math.round(amount / orders.length) : 0]),
  );
}

export function netSales(orders: Order[]) {
  return sumByCurrency(
    orders.filter((order) => !["refunded", "cancelled"].includes(order.status)),
    (order) => order.amount,
  );
}

export function salesReversals(orders: Order[]) {
  return sumByCurrency(
    orders.filter((order) => ["refunded", "cancelled"].includes(order.status)),
    (order) => order.amount,
  );
}

export function uniqueSessions(views: PageView[]) {
  const sessions = new Set<string>();
  for (const view of views) {
    sessions.add(view.sessionId ?? `${view.userAgent ?? "unknown"}:${view.createdAt.toISOString().slice(0, 10)}`);
  }
  return sessions.size;
}

export function uniqueVisitors(views: PageView[]) {
  const visitors = new Set<string>();
  for (const view of views) {
    visitors.add(view.userId ?? view.sessionId ?? view.userAgent ?? view.id);
  }
  return visitors.size;
}

export function eventCount(events: ConversionEvent[], name: string) {
  return events.filter((event) => event.name === name).length;
}

export function returningCustomerStats(orders: Order[]) {
  const counts = new Map<string, number>();
  for (const order of orders) {
    counts.set(order.customerEmail, (counts.get(order.customerEmail) ?? 0) + 1);
  }
  const customers = counts.size;
  const returningCustomers = [...counts.values()].filter((count) => count > 1).length;
  const firstTimeCustomers = Math.max(customers - returningCustomers, 0);
  return {
    customers,
    firstTimeCustomers,
    returningCustomers,
    returningCustomerRate: percent(returningCustomers, customers),
  };
}

export function subscriptionStatusCounts(subscriptions: Subscription[]) {
  return subscriptions.reduce<Record<string, number>>((acc, subscription) => {
    acc[subscription.status] = (acc[subscription.status] ?? 0) + 1;
    return acc;
  }, {});
}

export function salesByPlan(orders: Order[]) {
  return PLANS.map((plan) => {
    const planOrders = orders.filter((order) => order.planId === plan.id);
    return {
      plan,
      orders: planOrders.length,
      revenue: orderRevenue(planOrders),
    };
  });
}

export function revenueOverTime(orders: Order[], limit = 14) {
  const rows = orders.reduce<Record<string, { date: string; orders: number; revenue: Record<string, number> }>>((acc, order) => {
    const date = order.createdAt.toISOString().slice(0, 10);
    acc[date] ??= { date, orders: 0, revenue: {} };
    acc[date].orders += 1;
    const currency = order.currency.toUpperCase();
    acc[date].revenue[currency] = (acc[date].revenue[currency] ?? 0) + order.amount;
    return acc;
  }, {});
  return Object.values(rows).sort((a, b) => a.date.localeCompare(b.date)).slice(-limit);
}

export function topTrafficSources(views: PageView[], limit = 10) {
  const counts = views.reduce<Record<string, number>>((acc, view) => {
    let source = "Direct / unknown";
    if (view.referrer) {
      try {
        const url = new URL(view.referrer);
        source = url.hostname.replace(/^www\./, "");
      } catch {
        source = view.referrer.slice(0, 80);
      }
    }
    acc[source] = (acc[source] ?? 0) + 1;
    return acc;
  }, {});
  return Object.entries(counts).sort((a, b) => b[1] - a[1]).slice(0, limit);
}

export function topPages(views: PageView[], limit = 15) {
  const counts = views.reduce<Record<string, number>>((acc, view) => {
    acc[view.path] = (acc[view.path] ?? 0) + 1;
    return acc;
  }, {});
  return Object.entries(counts).sort((a, b) => b[1] - a[1]).slice(0, limit);
}

export function shopifyStyleFunnel({
  views,
  conversions,
  orders,
  demos,
  users,
}: {
  views: PageView[];
  conversions: ConversionEvent[];
  orders: Order[];
  demos: DemoBooking[];
  users: User[];
}) {
  const sessions = uniqueSessions(views);
  const checkoutStarted = eventCount(conversions, "checkout_started");
  const signups = users.length;
  return [
    { label: "All sessions", value: sessions, rate: 100 },
    { label: "Pricing / checkout interest", value: checkoutStarted, rate: percent(checkoutStarted, sessions) },
    { label: "Account signups", value: signups, rate: percent(signups, sessions) },
    { label: "Demo bookings", value: demos.length, rate: percent(demos.length, sessions) },
    { label: "Completed checkout orders", value: orders.length, rate: percent(orders.length, sessions) },
  ];
}
