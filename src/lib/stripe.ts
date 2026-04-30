import Stripe from "stripe";
import { PLANS, type BillingInterval, type Plan } from "@/lib/plans";

let stripeInstance: Stripe | null = null;

export function getStripe() {
  if (!stripeInstance) {
    const key = process.env.STRIPE_SECRET_KEY;
    if (!key && process.env.NODE_ENV === "production") {
      throw new Error("STRIPE_SECRET_KEY is required in production");
    }
    stripeInstance = new Stripe(key ?? "sk_test_placeholder", {
      apiVersion: "2026-04-22.dahlia",
      typescript: true,
    });
  }
  return stripeInstance;
}

export const stripePublishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY ?? "";

export function getStripePriceId(
  planId: Plan["id"],
  currency: "nzd" | "usd" = "nzd",
  interval: BillingInterval = "month",
) {
  const plan = PLANS.find((p) => p.id === planId);
  if (!plan) return null;
  const envKey = `STRIPE_PRICE_${planId.toUpperCase()}_${currency.toUpperCase()}_${interval.toUpperCase()}`;
  const legacyEnvKey = `STRIPE_PRICE_${planId.toUpperCase()}_${currency.toUpperCase()}`;
  const id = process.env[envKey];
  return id ?? process.env[legacyEnvKey] ?? plan.stripePriceId?.[interval]?.[currency] ?? null;
}

export function getStripeWebhookSecret() {
  return process.env.STRIPE_WEBHOOK_SECRET ?? "";
}
