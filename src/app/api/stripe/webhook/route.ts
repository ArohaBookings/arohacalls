import { NextResponse } from "next/server";
import { headers } from "next/headers";
import type Stripe from "stripe";
import { getStripe, getStripeWebhookSecret } from "@/lib/stripe";
import { db } from "@/lib/db";
import {
  invoices,
  orders,
  stripeWebhookEvents,
  subscriptionEvents,
  subscriptions,
  users,
} from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { sendEmail, emailLayout, ADMIN_NOTIFY_EMAIL } from "@/lib/email";
import { PLANS } from "@/lib/plans";
import { normalizeSubscriptionStatus } from "@/lib/stripe-status";

export const runtime = "nodejs";

function planNameFromId(id: string) {
  return PLANS.find((p) => p.id === id)?.name ?? id;
}

function toDate(seconds?: number | null) {
  return seconds ? new Date(seconds * 1000) : null;
}

function subscriptionItem(sub: Stripe.Subscription) {
  return sub.items.data[0];
}

function invoiceSubscriptionId(invoice: Stripe.Invoice) {
  const subscription = invoice.parent?.subscription_details?.subscription;
  return typeof subscription === "string" ? subscription : subscription?.id ?? null;
}

async function findUserIdForStripeCustomer(customer: string | Stripe.Customer | Stripe.DeletedCustomer | null) {
  const customerId = typeof customer === "string" ? customer : customer?.id;
  if (!customerId) return null;
  const [user] = await db.select().from(users).where(eq(users.stripeCustomerId, customerId)).limit(1);
  return user?.id ?? null;
}

async function generateOrderNumber() {
  const prefix = "ARH";
  const ts = Date.now().toString().slice(-7);
  const rand = Math.random().toString(36).slice(2, 5).toUpperCase();
  return `${prefix}-${ts}-${rand}`;
}

export async function POST(req: Request) {
  const sig = (await headers()).get("stripe-signature");
  const body = await req.text();
  let event: Stripe.Event;
  const stripe = getStripe();

  try {
    event = stripe.webhooks.constructEvent(body, sig ?? "", getStripeWebhookSecret());
  } catch (e) {
    console.error("[stripe webhook] signature error", e);
    return new NextResponse("Bad signature", { status: 400 });
  }

  try {
    const [existing] = await db
      .select({ id: stripeWebhookEvents.id })
      .from(stripeWebhookEvents)
      .where(eq(stripeWebhookEvents.id, event.id))
      .limit(1);
    if (existing) return NextResponse.json({ received: true, duplicate: true });

    await db.insert(stripeWebhookEvents).values({
      id: event.id,
      type: event.type,
      payload: event as unknown as Record<string, unknown>,
    });

    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        const userId = (session.metadata?.userId as string | undefined) ?? null;
        const planId = (session.metadata?.planId as string | undefined) ?? "essentials";
        if (!userId) break;

        const subscriptionId = session.subscription as string | null;
        let amount = session.amount_total ?? 0;
        const currency = (session.currency ?? "nzd").toLowerCase();
        if (subscriptionId) {
          const sub = await stripe.subscriptions.retrieve(subscriptionId);
          const item = subscriptionItem(sub);
          amount = item?.price.unit_amount ?? amount;
          await db
            .insert(subscriptions)
            .values({
              userId,
              stripeSubscriptionId: sub.id,
              stripePriceId: item?.price.id ?? "",
              planId,
              status: normalizeSubscriptionStatus(sub.status),
              currency,
              amount,
              interval: item?.price.recurring?.interval ?? "month",
              currentPeriodStart: toDate(item?.current_period_start),
              currentPeriodEnd: toDate(item?.current_period_end),
              cancelAtPeriodEnd: sub.cancel_at_period_end,
            })
            .onConflictDoNothing();

          await db.insert(subscriptionEvents).values({
            userId,
            stripeSubscriptionId: sub.id,
            type: "checkout_completed",
            planId,
            toStatus: sub.status,
            metadata: { checkoutSessionId: session.id },
          });
        }

        const orderNumber = await generateOrderNumber();
        const [user] = await db.select().from(users).where(eq(users.id, userId)).limit(1);
        await db.insert(orders).values({
          orderNumber,
          userId,
          planId,
          planName: planNameFromId(planId),
          customerName: user?.name ?? session.customer_details?.name ?? null,
          customerEmail: user?.email ?? session.customer_details?.email ?? "",
          status: "active",
          currency,
          amount,
          stripeCheckoutSessionId: session.id,
          metadata: { mode: session.mode, payment_status: session.payment_status },
        });

        await sendEmail({
          to: user?.email ?? session.customer_details?.email ?? "",
          subject: `Welcome to Aroha Calls — let's get you live ✨`,
          html: emailLayout({
            title: "Welcome to Aroha",
            body: `<p>Kia ora ${user?.name ?? "there"},</p><p>Your <strong>${planNameFromId(planId)}</strong> plan is locked in. Leo will be in touch within 24 hours to begin your white-glove setup.</p><p>In the meantime, finish your onboarding details so we can hit the ground running:</p><p><a href="https://arohacalls.com/dashboard/onboarding" style="display:inline-block;background:#00d2a1;color:#0a0a0a;padding:10px 18px;border-radius:999px;text-decoration:none;font-weight:600;">Complete onboarding</a></p>`,
          }),
        });
        await sendEmail({
          to: ADMIN_NOTIFY_EMAIL,
          subject: `🎉 New ${planNameFromId(planId)} signup — ${user?.email ?? session.customer_details?.email}`,
          html: emailLayout({
            title: "New signup",
            body: `<p><strong>${user?.name ?? "—"}</strong> just signed up.</p><ul><li>Email: ${user?.email ?? session.customer_details?.email}</li><li>Plan: ${planNameFromId(planId)}</li><li>Order: ${orderNumber}</li></ul>`,
          }),
        });
        break;
      }
      case "customer.subscription.updated":
      case "customer.subscription.created":
      case "customer.subscription.deleted":
      case "customer.subscription.paused":
      case "customer.subscription.resumed": {
        const sub = event.data.object as Stripe.Subscription;
        const item = subscriptionItem(sub);
        const userId = await findUserIdForStripeCustomer(sub.customer);
        await db
          .update(subscriptions)
          .set({
            status: normalizeSubscriptionStatus(sub.status),
            stripePriceId: item?.price.id ?? "",
            amount: item?.price.unit_amount ?? 0,
            interval: item?.price.recurring?.interval ?? "month",
            currentPeriodStart: toDate(item?.current_period_start),
            currentPeriodEnd: toDate(item?.current_period_end),
            cancelAtPeriodEnd: sub.cancel_at_period_end,
            cancelledAt: toDate(sub.canceled_at),
            updatedAt: new Date(),
          })
          .where(eq(subscriptions.stripeSubscriptionId, sub.id));
        await db.insert(subscriptionEvents).values({
          userId,
          stripeSubscriptionId: sub.id,
          type: event.type,
          toStatus: sub.status,
          metadata: { cancelAtPeriodEnd: sub.cancel_at_period_end },
        });
        break;
      }
      case "invoice.paid":
      case "invoice.payment_succeeded":
      case "invoice.payment_action_required":
      case "invoice.payment_failed":
      case "invoice.upcoming": {
        const invoice = event.data.object as Stripe.Invoice;
        const stripeSubscriptionId = invoiceSubscriptionId(invoice);
        const userId = await findUserIdForStripeCustomer(invoice.customer);

        await db
          .insert(invoices)
          .values({
            userId,
            stripeInvoiceId: invoice.id,
            stripeSubscriptionId,
            status: invoice.status ?? event.type,
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
              status: invoice.status ?? event.type,
              amountPaid: invoice.amount_paid ?? 0,
              amountDue: invoice.amount_due ?? 0,
              hostedInvoiceUrl: invoice.hosted_invoice_url ?? null,
              invoicePdf: invoice.invoice_pdf ?? null,
            },
          });

        if (stripeSubscriptionId && event.type === "invoice.payment_failed") {
          await db
            .update(subscriptions)
            .set({ status: "past_due", updatedAt: new Date() })
            .where(eq(subscriptions.stripeSubscriptionId, stripeSubscriptionId));
        }
        if (stripeSubscriptionId && (event.type === "invoice.paid" || event.type === "invoice.payment_succeeded")) {
          const sub = await stripe.subscriptions.retrieve(stripeSubscriptionId);
          const item = subscriptionItem(sub);
          await db
            .update(subscriptions)
            .set({
              status: normalizeSubscriptionStatus(sub.status),
              currentPeriodStart: toDate(item?.current_period_start),
              currentPeriodEnd: toDate(item?.current_period_end),
              updatedAt: new Date(),
            })
            .where(eq(subscriptions.stripeSubscriptionId, stripeSubscriptionId));
        }
        break;
      }
      case "customer.updated": {
        const customer = event.data.object as Stripe.Customer;
        if (customer.email) {
          await db
            .update(users)
            .set({ email: customer.email.toLowerCase(), name: customer.name, updatedAt: new Date() })
            .where(eq(users.stripeCustomerId, customer.id));
        }
        break;
      }
      case "charge.refunded": {
        const charge = event.data.object as Stripe.Charge;
        const invoice = (charge as Stripe.Charge & { invoice?: string | Stripe.Invoice | null }).invoice;
        if (invoice && typeof invoice === "string") {
          await db.update(orders).set({ status: "refunded" }).where(eq(orders.stripeInvoiceId, invoice));
        }
        break;
      }
      case "refund.created":
      case "refund.updated":
        break;
      default:
        break;
    }
    return NextResponse.json({ received: true });
  } catch (e) {
    console.error("[stripe webhook] handler error", e);
    return NextResponse.json({ error: "handler failed" }, { status: 500 });
  }
}
