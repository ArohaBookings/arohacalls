import type { Metadata } from "next";
import Link from "next/link";
import { desc, eq } from "drizzle-orm";
import { ExternalLink } from "lucide-react";
import { requireAuth } from "@/lib/admin";
import { db } from "@/lib/db";
import { invoices, subscriptions } from "@/lib/db/schema";
import { formatPlanPrice, getPlan, type Plan } from "@/lib/plans";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { PortalButton } from "@/components/dashboard/portal-button";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { GlassPanel } from "@/components/marketing/page-shell";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Billing",
  robots: { index: false, follow: false },
};

export default async function BillingPage() {
  const session = await requireAuth();
  const [[subscription], invoiceRows] = await Promise.all([
    db
      .select()
      .from(subscriptions)
      .where(eq(subscriptions.userId, session.user.id))
      .orderBy(desc(subscriptions.updatedAt))
      .limit(1),
    db
      .select()
      .from(invoices)
      .where(eq(invoices.userId, session.user.id))
      .orderBy(desc(invoices.createdAt))
      .limit(20),
  ]);
  const plan = subscription ? getPlan(subscription.planId as Plan["id"]) : null;

  return (
    <DashboardShell
      session={session}
      title="Billing"
      description="Stripe manages payment methods, invoices, plan changes, cancellations, and renewal dates."
    >
      <div className="space-y-6">
        <GlassPanel>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <Badge variant={subscription?.status === "active" ? "success" : "outline"}>
                {subscription?.status ?? "No active subscription"}
              </Badge>
              <h2 className="mt-4 text-2xl font-semibold tracking-tight">{plan?.name ?? "No plan selected"}</h2>
              <p className="mt-2 text-sm text-muted-foreground">
                Next billing date: {subscription?.currentPeriodEnd?.toLocaleDateString() ?? "Not available"}
              </p>
            </div>
            <PortalButton />
          </div>
        </GlassPanel>
        <GlassPanel>
          <h2 className="text-xl font-semibold tracking-tight">Invoice history</h2>
          <div className="mt-4">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead className="text-right">Invoice</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {invoiceRows.length ? (
                  invoiceRows.map((invoice) => (
                    <TableRow key={invoice.id}>
                      <TableCell>{invoice.createdAt.toLocaleDateString()}</TableCell>
                      <TableCell className="capitalize">{invoice.status}</TableCell>
                      <TableCell>{formatPlanPrice(invoice.amountPaid / 100, invoice.currency.toUpperCase() as "NZD" | "USD")}</TableCell>
                      <TableCell className="text-right">
                        {invoice.hostedInvoiceUrl ? (
                          <Button asChild size="sm" variant="outline">
                            <Link href={invoice.hostedInvoiceUrl} target="_blank">
                              View
                              <ExternalLink className="h-4 w-4" />
                            </Link>
                          </Button>
                        ) : (
                          <span className="text-xs text-muted-foreground">Unavailable</span>
                        )}
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={4} className="text-muted-foreground">
                      No invoices have been synced yet.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </GlassPanel>
      </div>
    </DashboardShell>
  );
}
