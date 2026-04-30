import type { Order, Subscription } from "@/lib/db/schema";

export function money(amountMinor: number, currency: string) {
  const code = currency.toUpperCase();
  return new Intl.NumberFormat(code === "USD" ? "en-US" : "en-NZ", {
    style: "currency",
    currency: code,
    maximumFractionDigits: 2,
  }).format(amountMinor / 100);
}

export function sumByCurrency<T extends { currency: string }>(
  rows: T[],
  getAmount: (row: T) => number,
) {
  return rows.reduce<Record<string, number>>((acc, row) => {
    const key = row.currency.toUpperCase();
    acc[key] = (acc[key] ?? 0) + getAmount(row);
    return acc;
  }, {});
}

export function formatCurrencyBreakdown(values: Record<string, number>) {
  const entries = Object.entries(values);
  if (!entries.length) return "-";
  return entries.map(([currency, amount]) => money(amount, currency)).join(" / ");
}

export function isSince(date: Date, since: Date | null) {
  return !since || date >= since;
}

export function subscriptionMrr(subscriptions: Subscription[]) {
  return subscriptions
    .filter((subscription) => ["active", "trialing", "past_due"].includes(subscription.status))
    .reduce<Record<string, number>>((acc, subscription) => {
      const currency = subscription.currency.toUpperCase();
      const monthlyAmount = subscription.interval === "year" ? Math.round(subscription.amount / 12) : subscription.amount;
      acc[currency] = (acc[currency] ?? 0) + monthlyAmount;
      return acc;
    }, {});
}

export function orderRevenue(orders: Order[]) {
  return sumByCurrency(orders, (order) => order.amount);
}

export function csvEscape(value: unknown) {
  const str = value == null ? "" : String(value);
  if (!/[",\n]/.test(str)) return str;
  return `"${str.replace(/"/g, '""')}"`;
}
