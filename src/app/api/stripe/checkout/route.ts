import { NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/lib/auth";
import { getStripe, getStripePriceId } from "@/lib/stripe";
import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { siteConfig } from "@/lib/site-config";
import { PLANS } from "@/lib/plans";

const bodySchema = z.object({
  planId: z.enum(PLANS.map((p) => p.id) as [string, ...string[]]),
  currency: z.enum(["nzd", "usd"]).default("nzd"),
  interval: z.enum(["month", "year"]).default("month"),
});

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id || !session.user.email) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const json = await req.json().catch(() => ({}));
  const parsed = bodySchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid body" }, { status: 400 });
  }

  const plan = PLANS.find((p) => p.id === parsed.data.planId);
  if (parsed.data.interval === "year" && !plan?.yearlyNZD) {
    return NextResponse.json({ error: "Yearly billing is not available for this plan" }, { status: 400 });
  }

  const priceId = getStripePriceId(parsed.data.planId as never, parsed.data.currency, parsed.data.interval);
  if (!priceId) {
    return NextResponse.json({ error: "Price not configured" }, { status: 500 });
  }

  const stripe = getStripe();
  const [user] = await db.select().from(users).where(eq(users.id, session.user.id)).limit(1);
  if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

  let stripeCustomerId = user.stripeCustomerId ?? undefined;
  if (!stripeCustomerId) {
    const customer = await stripe.customers.create({
      email: user.email,
      name: user.name ?? undefined,
      metadata: { userId: user.id },
    });
    stripeCustomerId = customer.id;
    await db.update(users).set({ stripeCustomerId }).where(eq(users.id, user.id));
  }

  const checkout = await stripe.checkout.sessions.create({
    mode: "subscription",
    customer: stripeCustomerId,
    line_items: [{ price: priceId, quantity: 1 }],
    success_url: `${siteConfig.url}/dashboard/onboarding?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${siteConfig.url}/pricing?canceled=1`,
    allow_promotion_codes: true,
    subscription_data: {
      metadata: { userId: user.id, planId: parsed.data.planId, interval: parsed.data.interval },
    },
    metadata: { userId: user.id, planId: parsed.data.planId, interval: parsed.data.interval },
  });

  return NextResponse.json({ url: checkout.url });
}
