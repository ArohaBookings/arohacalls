import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { eq } from "drizzle-orm";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import { requireAdmin } from "@/lib/admin";
import { db } from "@/lib/db";
import { customerProfiles, invoices, orders, subscriptions, users } from "@/lib/db/schema";
import { money } from "@/lib/admin-data";
import { queryOrEmpty } from "@/lib/safe-db";
import { AdminShell } from "@/components/admin/admin-shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { GlassPanel, MiniStat } from "@/components/marketing/page-shell";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Admin Order Detail",
  robots: { index: false, follow: false },
};

function dateText(date?: Date | null) {
  return date ? date.toLocaleString() : "-";
}

export default async function AdminOrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await requireAdmin();
  const { id } = await params;
  const [order] = await queryOrEmpty(db.select().from(orders).where(eq(orders.id, id)).limit(1), "admin-order");
  if (!order) notFound();

  const [userRows, profileRows, subRows, invoiceRows] = await Promise.all([
    queryOrEmpty(db.select().from(users).where(eq(users.id, order.userId)).limit(1), "admin-order-user"),
    queryOrEmpty(db.select().from(customerProfiles).where(eq(customerProfiles.userId, order.userId)).limit(1), "admin-order-profile"),
    order.subscriptionId
      ? queryOrEmpty(db.select().from(subscriptions).where(eq(subscriptions.id, order.subscriptionId)).limit(1), "admin-order-subscription")
      : Promise.resolve([]),
    order.stripeInvoiceId
      ? queryOrEmpty(db.select().from(invoices).where(eq(invoices.stripeInvoiceId, order.stripeInvoiceId)).limit(1), "admin-order-invoice")
      : Promise.resolve([]),
  ]);
  const user = userRows[0];
  const profile = profileRows[0];
  const subscription = subRows[0];
  const invoice = invoiceRows[0];

  return (
    <AdminShell
      session={session}
      title={order.orderNumber}
      description="Shopify-style order detail: customer, business, subscription, invoice, Stripe IDs, value, status, and source metadata."
      actions={
        <div className="flex flex-wrap gap-2">
          <Button asChild variant="outline" size="sm">
            <Link href="/admin/orders">
              <ArrowLeft className="h-4 w-4" />
              Orders
            </Link>
          </Button>
          {user ? (
            <Button asChild variant="outline" size="sm">
              <Link href={`/admin/customers/${user.id}`}>
                Customer
                <ArrowUpRight className="h-4 w-4" />
              </Link>
            </Button>
          ) : null}
        </div>
      }
    >
      <div className="grid gap-4 md:grid-cols-4">
        <MiniStat label="Amount" value={money(order.amount, order.currency)} />
        <MiniStat label="Status" value={order.status} />
        <MiniStat label="Plan" value={order.planName} />
        <MiniStat label="Date" value={order.createdAt.toLocaleDateString()} />
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-2">
        <GlassPanel>
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">Customer</p>
              <h2 className="mt-2 text-2xl font-semibold tracking-tight">{order.customerName ?? user?.name ?? "No name"}</h2>
              <p className="mt-1 text-sm text-muted-foreground">{order.customerEmail}</p>
            </div>
            <Badge variant={order.status === "active" ? "success" : "outline"}>{order.status}</Badge>
          </div>
          <div className="mt-5 grid gap-3 text-sm">
            <div className="rounded-xl border border-border bg-background/35 p-3">
              <p className="text-xs uppercase tracking-[0.16em] text-muted-foreground">Business</p>
              <p className="mt-1 font-medium">{order.businessName ?? profile?.businessName ?? "-"}</p>
            </div>
            <div className="rounded-xl border border-border bg-background/35 p-3">
              <p className="text-xs uppercase tracking-[0.16em] text-muted-foreground">Niche</p>
              <p className="mt-1 font-medium">{profile?.niche ?? "-"}</p>
            </div>
            <div className="rounded-xl border border-border bg-background/35 p-3">
              <p className="text-xs uppercase tracking-[0.16em] text-muted-foreground">Created</p>
              <p className="mt-1 font-medium">{dateText(order.createdAt)}</p>
            </div>
          </div>
        </GlassPanel>

        <GlassPanel>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">Billing</p>
          <h2 className="mt-2 text-2xl font-semibold tracking-tight">{subscription?.stripeSubscriptionId ?? "No subscription attached"}</h2>
          <div className="mt-5 grid gap-3">
            <MiniStat label="Checkout session" value={order.stripeCheckoutSessionId ?? "-"} />
            <MiniStat label="Stripe invoice" value={order.stripeInvoiceId ?? invoice?.stripeInvoiceId ?? "-"} />
            <MiniStat label="Renewal" value={subscription?.currentPeriodEnd?.toLocaleDateString() ?? "-"} />
          </div>
          {invoice?.hostedInvoiceUrl ? (
            <Button asChild variant="outline" className="mt-5">
              <a href={invoice.hostedInvoiceUrl} target="_blank" rel="noreferrer">
                Open invoice
                <ArrowUpRight className="h-4 w-4" />
              </a>
            </Button>
          ) : null}
        </GlassPanel>
      </div>

      <GlassPanel className="mt-6">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">Metadata</p>
        <pre className="mt-4 overflow-auto rounded-xl border border-border bg-background/50 p-4 text-xs text-muted-foreground">
          {JSON.stringify(order.metadata ?? {}, null, 2)}
        </pre>
      </GlassPanel>
    </AdminShell>
  );
}
