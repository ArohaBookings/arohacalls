"use client";

import { useState } from "react";
import { ArrowRight, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { BillingInterval } from "@/lib/plans";

export function CheckoutButton({
  planId,
  interval = "month",
  currency = "nzd",
  label,
  variant = "default",
}: {
  planId: string;
  interval?: BillingInterval;
  currency?: "nzd" | "usd";
  label: string;
  variant?: "default" | "outline" | "glow" | "ghost";
}) {
  const [loading, setLoading] = useState(false);

  async function startCheckout() {
    setLoading(true);
    try {
      void fetch("/api/analytics/track", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          event: "checkout_started",
          metadata: { planId, interval, currency },
        }),
        keepalive: true,
      }).catch(() => {});
      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ planId, interval, currency }),
      });
      if (res.status === 401) {
        const params = new URLSearchParams({ plan: planId, interval, currency });
        window.location.href = `/signup?${params.toString()}`;
        return;
      }
      const json = (await res.json()) as { url?: string; error?: string };
      if (!res.ok || !json.url) throw new Error(json.error ?? "Checkout failed");
      window.location.href = json.url;
    } catch (error) {
      console.error(error);
      window.location.href = `/signup?plan=${planId}&interval=${interval}&currency=${currency}`;
    } finally {
      setLoading(false);
    }
  }

  return (
    <Button type="button" variant={variant} onClick={startCheckout} disabled={loading} className="w-full">
      {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
      {label}
      {!loading ? <ArrowRight className="h-4 w-4" /> : null}
    </Button>
  );
}
