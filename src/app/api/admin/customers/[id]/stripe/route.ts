import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { z } from "zod";
import type Stripe from "stripe";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { invoices, subscriptionEvents, subscriptions, users } from "@/lib/db/schema";
import { hasUsableDatabaseUrl } from "@/lib/safe-db";
import { getStripe, getStripePriceId } from "@/lib/stripe";
import { normalizeSubscriptionStatus } from "@/lib/stripe-status";
import { PLANS, type Plan, type BillingInterval } from "@/lib/plans";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const planIds = PLANS.map((plan) => plan.id) as [Plan["id"], ...Plan["id"][]];

const actionSchema = z.discriminatedUnion("action", [
  z.object({ action: z.literal("cancel_at_period_end") }),
  z.object({ action: z.literal("cancel_now") }),
  z.object({ action: z.literal("resume") }),
  z.object({
    action: z.literal("change_plan"),
    planId: z.enum(planIds),
    interval: z.enum(["month", "year"]).default("month"),
    currency: z.enum(["nzd", "usd"]).default("nzd"),
  }),
  z.object({
    action: z.literal("charge_now"),
    amountMinor: z.number().int().min(100).max(10_000_000),
    currency: z.enum(["nzd", "usd"]).default("nzd"),
    description: z.string().min(3).max(240),
  }),
]);

function toDate(seconds?: number | null) {
  return seconds ? new Date(seconds * 1000) : null;
}

function subscriptionItem(sub: Stripe.Subscription) {
  return sub.items.data[0];
}

async function requireAdminJson() {
  const session = await auth();
  return session?.user?.id && session.user.role === "admin" ? session : null;
}

async function syncSubscription(subscription: Stripe.Subscription, userId: string, planId?: Plan["id"]) {
  const item = subscriptionItem(subscription);
  const update = {
    status: normalizeSubscriptionStatus(subscription.status),
    stripePriceId: item?.price.id ?? "",
    planId: planId ?? undefined,
    amount: item?.price.unit_amount ?? 0,
    interval: item?.price.recurring?.interval ?? "month",
    currentPeriodStart: toDate(item?.current_period_start),
    currentPeriodEnd: toDate(item?.current_period_end),
    cancelAtPeriodEnd: subscription.cancel_at_period_end,
    cancelledAt: toDate(subscription.canceled_at),
    updatedAt: new Date(),
  };

  await db
    .update(subscriptions)
    .set(update)
    .where(eq(subscriptions.stripeSubscriptionId, subscription.id));

  await db.insert(subscriptionEvents).values({
    userId,
    stripeSubscriptionId: subscription.id,
    type: "admin_subscription_synced",
    planId,
    toStatus: subscription.status,
    metadata: { cancelAtPeriodEnd: subscription.cancel_at_period_end },
  });
}

async function cacheInvoice(invoice: Stripe.Invoice, userId: string) {
  await db
    .insert(invoices)
    .values({
      userId,
      stripeInvoiceId: invoice.id,
      stripeSubscriptionId: typeof invoice.parent?.subscription_details?.subscription === "string"
        ? invoice.parent.subscription_details.subscription
        : invoice.parent?.subscription_details?.subscription?.id ?? null,
      status: invoice.status ?? "open",
      currency: invoice.currency ?? "nzd",
      amountPaid: invoice.amount_paid ?? 0,
      amountDue: invoice.amount_due ?? 0,
      hostedInvoiceUrl: invoice.hosted_invoice_url ?? null,
      invoicePdf: invoice.invoice_pdf ?? null,
      periodStart: toDate(invoice.period_start),
      periodEnd: toDate(invoice.period_end),
    })
    .onConflictDoUpdate({
      target: invoices.stripeInvoiceId,
      set: {
        status: invoice.status ?? "open",
        amountPaid: invoice.amount_paid ?? 0,
        amountDue: invoice.amount_due ?? 0,
        hostedInvoiceUrl: invoice.hosted_invoice_url ?? null,
        invoicePdf: invoice.invoice_pdf ?? null,
      },
    });
}

export async function POST(req: Request, context: { params: Promise<{ id: string }> }) {
  const adminSession = await requireAdminJson();
  if (!adminSession) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  if (!hasUsableDatabaseUrl()) {
    return NextResponse.json({ error: "Database is not configured" }, { status: 503 });
  }

  const { id } = await context.params;
  const json = await req.json().catch(() => ({}));
  const parsed = actionSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid body", details: parsed.error.flatten() }, { status: 400 });
  }

  const [user] = await db.select().from(users).where(eq(users.id, id)).limit(1);
  if (!user) return NextResponse.json({ error: "Customer not found" }, { status: 404 });

  const [subscription] = await db.select().from(subscriptions).where(eq(subscriptions.userId, id)).limit(1);
  const stripe = getStripe();

  try {
    switch (parsed.data.action) {
      case "charge_now": {
        if (!user.stripeCustomerId) return NextResponse.json({ error: "Customer has no Stripe customer ID" }, { status: 400 });
        await stripe.invoiceItems.create({
          customer: user.stripeCustomerId,
          amount: parsed.data.amountMinor,
          currency: parsed.data.currency,
          description: parsed.data.description,
        });
        const invoice = await stripe.invoices.create({
          customer: user.stripeCustomerId,
          collection_method: "charge_automatically",
          auto_advance: false,
          pending_invoice_items_behavior: "include",
          metadata: { source: "aroha_admin", adminUserId: adminSession.user.id },
        });
        const finalized = await stripe.invoices.finalizeInvoice(invoice.id);
        const paid = finalized.status === "open" ? await stripe.invoices.pay(finalized.id) : finalized;
        await cacheInvoice(paid, user.id);
        await db.insert(subscriptionEvents).values({
          userId: user.id,
          stripeSubscriptionId: subscription?.stripeSubscriptionId,
          type: "admin_invoice_charged",
          planId: subscription?.planId,
          metadata: {
            invoiceId: paid.id,
            amountMinor: parsed.data.amountMinor,
            currency: parsed.data.currency,
            description: parsed.data.description,
          },
        });
        return NextResponse.json({ ok: true, invoiceId: paid.id, status: paid.status });
      }
      case "change_plan": {
        if (!subscription) return NextResponse.json({ error: "Customer has no local subscription" }, { status: 400 });
        const priceId = getStripePriceId(parsed.data.planId, parsed.data.currency, parsed.data.interval as BillingInterval);
        if (!priceId) return NextResponse.json({ error: "Stripe price is not configured for that plan/currency/interval" }, { status: 500 });
        const current = await stripe.subscriptions.retrieve(subscription.stripeSubscriptionId);
        const item = subscriptionItem(current);
        if (!item?.id) return NextResponse.json({ error: "Subscription item not found" }, { status: 400 });
        const updated = await stripe.subscriptions.update(subscription.stripeSubscriptionId, {
          items: [{ id: item.id, price: priceId }],
          proration_behavior: "create_prorations",
          metadata: { planId: parsed.data.planId },
        });
        await syncSubscription(updated, user.id, parsed.data.planId);
        await db.insert(subscriptionEvents).values({
          userId: user.id,
          stripeSubscriptionId: updated.id,
          type: "admin_plan_changed",
          planId: parsed.data.planId,
          toStatus: updated.status,
          metadata: { priceId, interval: parsed.data.interval, currency: parsed.data.currency },
        });
        return NextResponse.json({ ok: true, status: updated.status });
      }
      case "cancel_at_period_end": {
        if (!subscription) return NextResponse.json({ error: "Customer has no local subscription" }, { status: 400 });
        const updated = await stripe.subscriptions.update(subscription.stripeSubscriptionId, {
          cancel_at_period_end: true,
        });
        await syncSubscription(updated, user.id, subscription.planId as Plan["id"]);
        await db.insert(subscriptionEvents).values({
          userId: user.id,
          stripeSubscriptionId: updated.id,
          type: "admin_cancel_at_period_end",
          planId: subscription.planId,
          toStatus: updated.status,
          metadata: { cancelAtPeriodEnd: true },
        });
        return NextResponse.json({ ok: true, status: updated.status });
      }
      case "resume": {
        if (!subscription) return NextResponse.json({ error: "Customer has no local subscription" }, { status: 400 });
        const updated = await stripe.subscriptions.update(subscription.stripeSubscriptionId, {
          cancel_at_period_end: false,
        });
        await syncSubscription(updated, user.id, subscription.planId as Plan["id"]);
        await db.insert(subscriptionEvents).values({
          userId: user.id,
          stripeSubscriptionId: updated.id,
          type: "admin_resume_subscription",
          planId: subscription.planId,
          toStatus: updated.status,
          metadata: { cancelAtPeriodEnd: false },
        });
        return NextResponse.json({ ok: true, status: updated.status });
      }
      case "cancel_now": {
        if (!subscription) return NextResponse.json({ error: "Customer has no local subscription" }, { status: 400 });
        const cancelled = await stripe.subscriptions.cancel(subscription.stripeSubscriptionId);
        await syncSubscription(cancelled, user.id, subscription.planId as Plan["id"]);
        await db.insert(subscriptionEvents).values({
          userId: user.id,
          stripeSubscriptionId: cancelled.id,
          type: "admin_cancel_now",
          planId: subscription.planId,
          toStatus: cancelled.status,
          metadata: { cancelledImmediately: true },
        });
        return NextResponse.json({ ok: true, status: cancelled.status });
      }
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : "Stripe action failed";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
