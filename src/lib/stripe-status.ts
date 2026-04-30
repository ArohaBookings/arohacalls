export const dbSubscriptionStatuses = [
  "active",
  "trialing",
  "past_due",
  "cancelled",
  "incomplete",
  "incomplete_expired",
  "paused",
  "unpaid",
] as const;

export type DbSubscriptionStatus = (typeof dbSubscriptionStatuses)[number];

export function normalizeSubscriptionStatus(status: string | null | undefined): DbSubscriptionStatus {
  if (status === "canceled") return "cancelled";
  if (status && (dbSubscriptionStatuses as readonly string[]).includes(status)) {
    return status as DbSubscriptionStatus;
  }
  return "incomplete";
}
