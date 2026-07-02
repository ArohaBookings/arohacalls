"use client";

import { useEffect, useState } from "react";
import { ArrowRight, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { BillingInterval, Plan } from "@/lib/plans";

export function CheckoutRedirect({
  planId,
  interval,
  currency,
}: {
  planId: Plan["id"];
  interval: BillingInterval;
  currency: "nzd" | "usd";
}) {
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function startCheckout() {
      setError(null);
      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ planId, interval, currency }),
      });
      const json = (await res.json().catch(() => ({}))) as { url?: string; error?: string };
      if (cancelled) return;
      if (res.ok && json.url) {
        window.location.href = json.url;
        return;
      }
      setError(json.error ?? "Checkout could not start.");
    }

    void startCheckout();
    return () => {
      cancelled = true;
    };
  }, [currency, interval, planId]);

  async function retry() {
    setError(null);
    const res = await fetch("/api/stripe/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ planId, interval, currency }),
    });
    const json = (await res.json().catch(() => ({}))) as { url?: string; error?: string };
    if (res.ok && json.url) {
      window.location.href = json.url;
      return;
    }
    setError(json.error ?? "Checkout could not start.");
  }

  return (
    <div className="rounded-3xl border border-border bg-white p-6 shadow-sm">
      <div className="flex items-start gap-3">
        <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-primary/15 text-primary">
          <Loader2 className="h-5 w-5 animate-spin" />
        </span>
        <div>
          <h2 className="text-xl font-semibold tracking-tight">Starting secure checkout</h2>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            You are signed in. Stripe checkout will open for the selected Aroha Calls plan, then you will return to onboarding.
          </p>
        </div>
      </div>
      {error ? (
        <div className="mt-5 rounded-2xl border border-destructive/30 bg-destructive/10 p-4">
          <p className="text-sm text-destructive">{error}</p>
          <Button type="button" className="mt-3" onClick={retry}>
            Try checkout again
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      ) : null}
    </div>
  );
}
