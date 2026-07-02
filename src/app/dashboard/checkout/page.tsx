import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { requireAuth } from "@/lib/admin";
import { PLANS, type BillingInterval, type Plan } from "@/lib/plans";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { CheckoutRedirect } from "@/components/dashboard/checkout-redirect";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Starting Checkout",
  robots: { index: false, follow: false },
};

type PageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

function first(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

export default async function DashboardCheckoutPage({ searchParams }: PageProps) {
  const session = await requireAuth();
  const params = await searchParams;
  const planId = first(params.plan);
  const plan = PLANS.find((item) => item.id === planId);
  if (!plan) redirect("/pricing");

  const interval = first(params.interval) === "year" && plan.yearlyNZD ? "year" : "month";
  const currency = first(params.currency) === "usd" ? "usd" : "nzd";

  return (
    <DashboardShell
      session={session}
      title="Secure checkout"
      description="Aroha Calls creates your account first, then Stripe handles plan payment before onboarding."
    >
      <CheckoutRedirect planId={plan.id as Plan["id"]} interval={interval as BillingInterval} currency={currency} />
    </DashboardShell>
  );
}
