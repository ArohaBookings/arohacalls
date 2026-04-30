"use client";

import { useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { AlertTriangle, CreditCard, Loader2, PauseCircle, RotateCcw, SquarePen, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { PLANS, type BillingInterval, type Plan } from "@/lib/plans";

type ActionState = { type: "idle" | "success" | "error"; message?: string };

export function StripeActions({
  userId,
  hasStripeCustomer,
  hasSubscription,
  cancelAtPeriodEnd,
  planId,
  interval,
  currency,
}: {
  userId: string;
  hasStripeCustomer: boolean;
  hasSubscription: boolean;
  cancelAtPeriodEnd: boolean;
  planId?: string | null;
  interval?: string | null;
  currency?: string | null;
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [state, setState] = useState<ActionState>({ type: "idle" });
  const [targetPlan, setTargetPlan] = useState<Plan["id"]>((planId as Plan["id"]) ?? "essentials");
  const [targetInterval, setTargetInterval] = useState<BillingInterval>((interval as BillingInterval) ?? "month");
  const [targetCurrency, setTargetCurrency] = useState<"nzd" | "usd">((currency as "nzd" | "usd") ?? "nzd");
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("Managed Aroha service recharge");

  const disabledReason = useMemo(() => {
    if (!hasStripeCustomer) return "Customer has no Stripe customer ID yet.";
    return null;
  }, [hasStripeCustomer]);

  async function runAction(action: string, body: Record<string, unknown> = {}, confirmText?: string) {
    if (confirmText && !window.confirm(confirmText)) return;
    setState({ type: "idle" });
    startTransition(async () => {
      const res = await fetch(`/api/admin/customers/${userId}/stripe`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action, ...body }),
      });
      const json = (await res.json().catch(() => ({}))) as { error?: string; status?: string; invoiceId?: string };
      if (!res.ok) {
        setState({ type: "error", message: json.error ?? "Stripe action failed." });
        return;
      }
      setState({
        type: "success",
        message: json.invoiceId ? `Invoice ${json.invoiceId} created and attempted.` : `Stripe updated: ${json.status ?? "ok"}.`,
      });
      router.refresh();
    });
  }

  function chargeNow() {
    const amountMinor = Math.round(Number(amount) * 100);
    if (!Number.isFinite(amountMinor) || amountMinor < 100) {
      setState({ type: "error", message: "Enter an amount of at least 1.00." });
      return;
    }
    void runAction(
      "charge_now",
      { amountMinor, currency: targetCurrency, description },
      `Create and attempt to charge a ${targetCurrency.toUpperCase()} ${amount} invoice for this customer?`,
    );
  }

  return (
    <div className="space-y-4">
      {disabledReason ? (
        <div className="flex items-start gap-2 rounded-xl border border-amber-400/20 bg-amber-400/10 p-3 text-sm text-amber-200">
          <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
          {disabledReason}
        </div>
      ) : null}

      <div className="grid gap-3 sm:grid-cols-2">
        <Button
          type="button"
          variant="outline"
          disabled={isPending || !hasStripeCustomer || !hasSubscription || cancelAtPeriodEnd}
          onClick={() => runAction("cancel_at_period_end", {}, "Cancel this subscription at the end of the current billing period?")}
        >
          <PauseCircle className="h-4 w-4" />
          Cancel at renewal
        </Button>
        <Button
          type="button"
          variant="outline"
          disabled={isPending || !hasStripeCustomer || !hasSubscription || !cancelAtPeriodEnd}
          onClick={() => runAction("resume", {}, "Resume this subscription and remove the scheduled cancellation?")}
        >
          <RotateCcw className="h-4 w-4" />
          Resume billing
        </Button>
        <Button
          type="button"
          variant="destructive"
          disabled={isPending || !hasStripeCustomer || !hasSubscription}
          onClick={() => runAction("cancel_now", {}, "Cancel this subscription immediately in Stripe? This can stop access now.")}
        >
          <XCircle className="h-4 w-4" />
          Cancel now
        </Button>
        <Button
          type="button"
          variant="outline"
          disabled={isPending || !hasStripeCustomer || !hasSubscription}
          onClick={() =>
            runAction(
              "change_plan",
              { planId: targetPlan, interval: targetInterval, currency: targetCurrency },
              `Change this customer to ${targetPlan} ${targetInterval} in ${targetCurrency.toUpperCase()} with Stripe proration?`,
            )
          }
        >
          <SquarePen className="h-4 w-4" />
          Change plan
        </Button>
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        <div className="space-y-2">
          <Label>Plan</Label>
          <Select value={targetPlan} onValueChange={(value) => setTargetPlan(value as Plan["id"])}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              {PLANS.map((plan) => (
                <SelectItem key={plan.id} value={plan.id}>{plan.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label>Interval</Label>
          <Select value={targetInterval} onValueChange={(value) => setTargetInterval(value as BillingInterval)}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="month">Monthly</SelectItem>
              <SelectItem value="year">Yearly</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label>Currency</Label>
          <Select value={targetCurrency} onValueChange={(value) => setTargetCurrency(value as "nzd" | "usd")}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="nzd">NZD</SelectItem>
              <SelectItem value="usd">USD</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="rounded-2xl border border-border bg-background/35 p-4">
        <div className="grid gap-3 sm:grid-cols-[160px_1fr_auto] sm:items-end">
          <div className="space-y-2">
            <Label>Recharge amount</Label>
            <Input inputMode="decimal" placeholder="199.00" value={amount} onChange={(event) => setAmount(event.target.value)} />
          </div>
          <div className="space-y-2">
            <Label>Description</Label>
            <Textarea className="min-h-11 py-2" value={description} onChange={(event) => setDescription(event.target.value)} />
          </div>
          <Button type="button" disabled={isPending || !hasStripeCustomer} onClick={chargeNow}>
            {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <CreditCard className="h-4 w-4" />}
            Charge
          </Button>
        </div>
      </div>

      {state.type === "success" ? <p className="text-sm text-primary">{state.message}</p> : null}
      {state.type === "error" ? <p className="text-sm text-destructive">{state.message}</p> : null}
    </div>
  );
}
