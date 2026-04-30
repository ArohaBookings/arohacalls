import type { Metadata } from "next";
import { requireAdmin } from "@/lib/admin";
import { db } from "@/lib/db";
import { adminSettings, statusServices, users } from "@/lib/db/schema";
import { siteConfig } from "@/lib/site-config";
import { hasUsableDatabaseUrl, queryOrEmpty } from "@/lib/safe-db";
import { AdminShell } from "@/components/admin/admin-shell";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { GlassPanel } from "@/components/marketing/page-shell";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Admin Settings",
  robots: { index: false, follow: false },
};

export default async function AdminSettingsPage() {
  const session = await requireAdmin();
  const [settingRows, statusRows, userRows] = await Promise.all([
    queryOrEmpty(db.select().from(adminSettings).limit(100), "admin-settings-settings"),
    queryOrEmpty(db.select().from(statusServices).limit(100), "admin-settings-status"),
    queryOrEmpty(db.select().from(users).limit(100), "admin-settings-users"),
  ]);
  const admins = userRows.filter((user) => user.role === "admin");
  const envChecks = [
    ["Database", hasUsableDatabaseUrl()],
    ["Stripe secret key", !!process.env.STRIPE_SECRET_KEY],
    ["Stripe webhook secret", !!process.env.STRIPE_WEBHOOK_SECRET],
    ["Resend API key", !!process.env.RESEND_API_KEY],
    ["Google OAuth", !!process.env.GOOGLE_CLIENT_ID && !!process.env.GOOGLE_CLIENT_SECRET],
  ] as const;

  return (
    <AdminShell
      session={session}
      title="Settings"
      description="Business settings, Stripe webhook configuration, email settings, status services, and admin user management."
    >
      <div className="grid gap-6 xl:grid-cols-2">
        <GlassPanel>
          <h2 className="text-xl font-semibold tracking-tight">Environment readiness</h2>
          <div className="mt-4 grid gap-3">
            {envChecks.map(([label, ok]) => (
              <div key={label} className="flex items-center justify-between rounded-xl border border-border bg-card/40 p-3">
                <span className="text-sm">{label}</span>
                <Badge variant={ok ? "success" : "warning"}>{ok ? "Configured" : "Missing"}</Badge>
              </div>
            ))}
          </div>
        </GlassPanel>
        <GlassPanel>
          <h2 className="text-xl font-semibold tracking-tight">Stripe webhook</h2>
          <p className="mt-3 text-sm leading-6 text-muted-foreground">
            Production endpoint: <span className="text-foreground">{siteConfig.url}/api/stripe/webhook</span>
          </p>
          <p className="mt-3 text-sm leading-6 text-muted-foreground">
            Events handled: checkout completion, subscription created/updated/deleted, invoice paid, invoice failed, action required, upcoming-ready invoice data, refunds, and customer/subscription updates as Stripe sends them.
          </p>
        </GlassPanel>
        <GlassPanel>
          <h2 className="text-xl font-semibold tracking-tight">Status services</h2>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Service</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Updated</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {statusRows.length ? (
                statusRows.map((service) => (
                  <TableRow key={service.id}>
                    <TableCell>{service.name}</TableCell>
                    <TableCell><Badge variant={service.status === "operational" ? "success" : "warning"}>{service.status}</Badge></TableCell>
                    <TableCell>{service.updatedAt.toLocaleDateString()}</TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow><TableCell colSpan={3} className="text-muted-foreground">Public status page is using default services until admin-managed status rows exist.</TableCell></TableRow>
              )}
            </TableBody>
          </Table>
        </GlassPanel>
        <GlassPanel>
          <h2 className="text-xl font-semibold tracking-tight">Admin users</h2>
          <div className="mt-4 divide-y divide-border/70">
            {admins.length ? (
              admins.map((admin) => (
                <div key={admin.id} className="flex items-center justify-between gap-4 py-3 text-sm">
                  <div>
                    <p>{admin.name ?? "Admin"}</p>
                    <p className="text-xs text-muted-foreground">{admin.email}</p>
                  </div>
                  <Badge variant="glow">admin</Badge>
                </div>
              ))
            ) : (
              <p className="py-4 text-sm text-muted-foreground">No admin users found in the first 100 users.</p>
            )}
          </div>
        </GlassPanel>
        <GlassPanel className="xl:col-span-2">
          <h2 className="text-xl font-semibold tracking-tight">Admin settings rows</h2>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Key</TableHead>
                <TableHead>Value</TableHead>
                <TableHead>Updated</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {settingRows.length ? (
                settingRows.map((setting) => (
                  <TableRow key={setting.key}>
                    <TableCell>{setting.key}</TableCell>
                    <TableCell className="max-w-md truncate">{JSON.stringify(setting.value)}</TableCell>
                    <TableCell>{setting.updatedAt.toLocaleDateString()}</TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow><TableCell colSpan={3} className="text-muted-foreground">No custom admin settings yet.</TableCell></TableRow>
              )}
            </TableBody>
          </Table>
        </GlassPanel>
      </div>
    </AdminShell>
  );
}
