import type { Metadata } from "next";
import { desc, eq } from "drizzle-orm";
import { requireAuth } from "@/lib/admin";
import { db } from "@/lib/db";
import { supportTickets } from "@/lib/db/schema";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { SupportForm } from "@/components/dashboard/dashboard-forms";
import { Badge } from "@/components/ui/badge";
import { GlassPanel } from "@/components/marketing/page-shell";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Support",
  robots: { index: false, follow: false },
};

export default async function SupportPage() {
  const session = await requireAuth();
  const tickets = await db
    .select()
    .from(supportTickets)
    .where(eq(supportTickets.userId, session.user.id))
    .orderBy(desc(supportTickets.createdAt))
    .limit(20);

  return (
    <DashboardShell
      session={session}
      title="Support"
      description="Send a support request, review open tickets, or contact support directly."
    >
      <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
        <GlassPanel>
          <h2 className="text-xl font-semibold tracking-tight">New request</h2>
          <p className="mt-2 text-sm text-muted-foreground">Expected response time: within 1 business day.</p>
          <div className="mt-6">
            <SupportForm />
          </div>
        </GlassPanel>
        <div className="space-y-6">
          <GlassPanel>
            <h2 className="text-xl font-semibold tracking-tight">FAQ</h2>
            <div className="mt-4 space-y-4 text-sm leading-6 text-muted-foreground">
              <p><strong className="text-foreground">How do I change booking rules?</strong><br />Submit a support request with the exact change. Leo will update and test it.</p>
              <p><strong className="text-foreground">How do I cancel?</strong><br />Open Billing and launch the Stripe Customer Portal.</p>
              <p><strong className="text-foreground">Where are call stats?</strong><br />Managed-service stats appear on the dashboard once your setup is live.</p>
            </div>
          </GlassPanel>
          <GlassPanel>
            <h2 className="text-xl font-semibold tracking-tight">Tickets</h2>
            <div className="mt-4 divide-y divide-border/70">
              {tickets.length ? (
                tickets.map((ticket) => (
                  <div key={ticket.id} className="flex items-center justify-between gap-4 py-3 text-sm">
                    <div>
                      <p className="font-medium">{ticket.subject}</p>
                      <p className="text-xs text-muted-foreground">{ticket.createdAt.toLocaleDateString()}</p>
                    </div>
                    <Badge variant={ticket.status === "resolved" ? "success" : "outline"}>{ticket.status}</Badge>
                  </div>
                ))
              ) : (
                <p className="py-4 text-sm text-muted-foreground">No support tickets yet.</p>
              )}
            </div>
          </GlassPanel>
        </div>
      </div>
    </DashboardShell>
  );
}
