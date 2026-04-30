import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { desc, eq } from "drizzle-orm";
import { ArrowLeft, ArrowUpRight, CreditCard, Mail, Phone, UserRound } from "lucide-react";
import { requireAdmin } from "@/lib/admin";
import { db } from "@/lib/db";
import { customerProfiles, invoices, orders, subscriptionEvents, subscriptions, supportTickets, users } from "@/lib/db/schema";
import { formatCurrencyBreakdown, money, orderRevenue } from "@/lib/admin-data";
import { buildArohaAiUrl } from "@/lib/aroha-ai-tools";
import { queryOrEmpty } from "@/lib/safe-db";
import { AdminShell } from "@/components/admin/admin-shell";
import { StripeActions } from "@/components/admin/stripe-actions";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { GlassPanel, MiniStat } from "@/components/marketing/page-shell";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Admin Customer Detail",
  robots: { index: false, follow: false },
};

function dateText(date?: Date | null) {
  return date ? date.toLocaleDateString() : "-";
}

export default async function AdminCustomerDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await requireAdmin();
  const { id } = await params;
  const [user] = await queryOrEmpty(db.select().from(users).where(eq(users.id, id)).limit(1), "admin-customer-user");
  if (!user) notFound();

  const [profileRows, subscriptionRows, orderRows, invoiceRows, ticketRows, eventRows] = await Promise.all([
    queryOrEmpty(db.select().from(customerProfiles).where(eq(customerProfiles.userId, id)).limit(1), "admin-customer-profile"),
    queryOrEmpty(db.select().from(subscriptions).where(eq(subscriptions.userId, id)).orderBy(desc(subscriptions.updatedAt)).limit(10), "admin-customer-subscriptions"),
    queryOrEmpty(db.select().from(orders).where(eq(orders.userId, id)).orderBy(desc(orders.createdAt)).limit(50), "admin-customer-orders"),
    queryOrEmpty(db.select().from(invoices).where(eq(invoices.userId, id)).orderBy(desc(invoices.createdAt)).limit(50), "admin-customer-invoices"),
    queryOrEmpty(db.select().from(supportTickets).where(eq(supportTickets.userId, id)).orderBy(desc(supportTickets.createdAt)).limit(20), "admin-customer-tickets"),
    queryOrEmpty(db.select().from(subscriptionEvents).where(eq(subscriptionEvents.userId, id)).orderBy(desc(subscriptionEvents.createdAt)).limit(30), "admin-customer-events"),
  ]);

  const profile = profileRows[0];
  const subscription = subscriptionRows[0];
  const totalSpend = orderRevenue(orderRows);
  const mrr = subscription
    ? subscription.interval === "year"
      ? Math.round(subscription.amount / 12)
      : subscription.amount
    : 0;

  return (
    <AdminShell
      session={session}
      title={profile?.businessName ?? user.name ?? user.email}
      description="Customer profile, business details, subscription renewal, Stripe controls, invoices, orders, support, and onboarding state."
      actions={
        <div className="flex flex-wrap gap-2">
          <Button asChild variant="outline" size="sm">
            <Link href="/admin/customers">
              <ArrowLeft className="h-4 w-4" />
              Customers
            </Link>
          </Button>
          {user.stripeCustomerId ? (
            <Button asChild variant="outline" size="sm">
              <a href={`https://dashboard.stripe.com/customers/${user.stripeCustomerId}`} target="_blank" rel="noreferrer">
                Stripe
                <ArrowUpRight className="h-4 w-4" />
              </a>
            </Button>
          ) : null}
        </div>
      }
    >
      <div className="grid gap-4 md:grid-cols-4">
        <MiniStat label="Current plan" value={subscription?.planId ?? "No plan"} />
        <MiniStat label="Status" value={subscription?.status ?? "No subscription"} />
        <MiniStat label="MRR" value={subscription ? money(mrr, subscription.currency) : "-"} />
        <MiniStat label="Total spend" value={formatCurrencyBreakdown(totalSpend)} />
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
        <GlassPanel>
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">Business</p>
              <h2 className="mt-2 text-2xl font-semibold tracking-tight">{profile?.businessName ?? "No business profile yet"}</h2>
            </div>
            <Badge variant={profile?.onboardingStatus === "live" ? "success" : "outline"}>
              {profile?.onboardingStatus ?? "pending"}
            </Badge>
          </div>
          <div className="mt-5 grid gap-3 text-sm">
            <div className="flex items-center gap-2 text-muted-foreground"><UserRound className="h-4 w-4 text-primary" /> {user.name ?? "No name"}</div>
            <div className="flex items-center gap-2 text-muted-foreground"><Mail className="h-4 w-4 text-primary" /> {user.email}</div>
            <div className="flex items-center gap-2 text-muted-foreground"><Phone className="h-4 w-4 text-primary" /> {profile?.phoneNumber ?? "No phone"}</div>
            <div className="rounded-xl border border-border bg-background/35 p-3">
              <p className="text-xs uppercase tracking-[0.16em] text-muted-foreground">Niche</p>
              <p className="mt-1 font-medium">{profile?.niche ?? "-"}</p>
            </div>
            <div className="rounded-xl border border-border bg-background/35 p-3">
              <p className="text-xs uppercase tracking-[0.16em] text-muted-foreground">Website</p>
              <p className="mt-1 font-medium">{profile?.website ?? "-"}</p>
            </div>
            <div className="rounded-xl border border-border bg-background/35 p-3">
              <p className="text-xs uppercase tracking-[0.16em] text-muted-foreground">Notes</p>
              <p className="mt-1 leading-6 text-muted-foreground">{profile?.notes ?? "No internal notes yet."}</p>
            </div>
          </div>
        </GlassPanel>

        <GlassPanel>
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">Stripe subscription</p>
              <h2 className="mt-2 text-2xl font-semibold tracking-tight">{subscription?.stripeSubscriptionId ?? "No subscription yet"}</h2>
              <p className="mt-2 text-sm text-muted-foreground">
                Next renewal: {dateText(subscription?.currentPeriodEnd)}
                {subscription?.cancelAtPeriodEnd ? " · cancellation scheduled" : ""}
              </p>
            </div>
            <CreditCard className="h-5 w-5 text-primary" />
          </div>
          <div className="mt-5 grid gap-3 sm:grid-cols-3">
            <MiniStat label="Price ID" value={subscription?.stripePriceId ?? "-"} />
            <MiniStat label="Currency" value={subscription?.currency?.toUpperCase() ?? "-"} />
            <MiniStat label="Interval" value={subscription?.interval ?? "-"} />
          </div>
          <div className="mt-6">
            <StripeActions
              userId={user.id}
              hasStripeCustomer={Boolean(user.stripeCustomerId)}
              hasSubscription={Boolean(subscription?.stripeSubscriptionId)}
              cancelAtPeriodEnd={Boolean(subscription?.cancelAtPeriodEnd)}
              planId={subscription?.planId}
              interval={subscription?.interval}
              currency={subscription?.currency}
            />
          </div>
        </GlassPanel>
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-2">
        <GlassPanel>
          <div className="flex items-center justify-between gap-4">
            <h2 className="text-xl font-semibold tracking-tight">Orders</h2>
            <Badge variant="outline">{orderRows.length}</Badge>
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order</TableHead>
                <TableHead>Plan</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Amount</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orderRows.length ? (
                orderRows.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell>
                      <Link href={`/admin/orders/${order.id}`} className="font-medium text-primary hover:underline">
                        {order.orderNumber}
                      </Link>
                      <div className="text-xs text-muted-foreground">{dateText(order.createdAt)}</div>
                    </TableCell>
                    <TableCell>{order.planName}</TableCell>
                    <TableCell><Badge variant={order.status === "active" ? "success" : "outline"}>{order.status}</Badge></TableCell>
                    <TableCell>{money(order.amount, order.currency)}</TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow><TableCell colSpan={4} className="text-muted-foreground">No orders yet.</TableCell></TableRow>
              )}
            </TableBody>
          </Table>
        </GlassPanel>

        <GlassPanel>
          <div className="flex items-center justify-between gap-4">
            <h2 className="text-xl font-semibold tracking-tight">Invoices</h2>
            <Badge variant="outline">{invoiceRows.length}</Badge>
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Invoice</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Paid</TableHead>
                <TableHead>Due</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {invoiceRows.length ? (
                invoiceRows.map((invoice) => (
                  <TableRow key={invoice.id}>
                    <TableCell>
                      {invoice.hostedInvoiceUrl ? (
                        <a href={invoice.hostedInvoiceUrl} target="_blank" rel="noreferrer" className="text-primary hover:underline">
                          {invoice.stripeInvoiceId}
                        </a>
                      ) : (
                        invoice.stripeInvoiceId
                      )}
                      <div className="text-xs text-muted-foreground">{dateText(invoice.createdAt)}</div>
                    </TableCell>
                    <TableCell><Badge variant={invoice.status === "paid" ? "success" : "outline"}>{invoice.status}</Badge></TableCell>
                    <TableCell>{money(invoice.amountPaid, invoice.currency)}</TableCell>
                    <TableCell>{money(invoice.amountDue, invoice.currency)}</TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow><TableCell colSpan={4} className="text-muted-foreground">No invoices yet.</TableCell></TableRow>
              )}
            </TableBody>
          </Table>
        </GlassPanel>
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-2">
        <GlassPanel>
          <h2 className="text-xl font-semibold tracking-tight">Support tickets</h2>
          <div className="mt-4 space-y-3">
            {ticketRows.length ? ticketRows.map((ticket) => (
              <div key={ticket.id} className="rounded-xl border border-border bg-background/35 p-4">
                <div className="flex items-center justify-between gap-4">
                  <p className="font-medium">{ticket.subject}</p>
                  <Badge variant={ticket.status === "resolved" ? "success" : "outline"}>{ticket.status}</Badge>
                </div>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">{ticket.message}</p>
              </div>
            )) : <p className="text-sm text-muted-foreground">No support tickets yet.</p>}
          </div>
        </GlassPanel>

        <GlassPanel>
          <div className="flex items-center justify-between gap-4">
            <h2 className="text-xl font-semibold tracking-tight">Recent billing events</h2>
            <Button asChild variant="outline" size="sm">
              <Link href={buildArohaAiUrl({ email: user.email, path: "/admin/orgs/new", source: "admin", campaign: "customer_detail" })} target="_blank">
                Aroha AI setup
                <ArrowUpRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
          <div className="mt-4 space-y-3">
            {eventRows.length ? eventRows.map((event) => (
              <div key={event.id} className="rounded-xl border border-border bg-background/35 p-4">
                <div className="flex items-center justify-between gap-4">
                  <p className="font-medium">{event.type}</p>
                  <span className="text-xs text-muted-foreground">{dateText(event.createdAt)}</span>
                </div>
                <p className="mt-1 text-sm text-muted-foreground">{event.toStatus ?? event.planId ?? "No status"}</p>
              </div>
            )) : <p className="text-sm text-muted-foreground">No subscription events yet.</p>}
          </div>
        </GlassPanel>
      </div>
    </AdminShell>
  );
}
