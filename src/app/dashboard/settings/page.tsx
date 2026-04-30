import type { Metadata } from "next";
import { eq } from "drizzle-orm";
import { requireAuth } from "@/lib/admin";
import { db } from "@/lib/db";
import { customerProfiles, users } from "@/lib/db/schema";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { SettingsForm } from "@/components/dashboard/dashboard-forms";
import { Badge } from "@/components/ui/badge";
import { GlassPanel } from "@/components/marketing/page-shell";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Settings",
  robots: { index: false, follow: false },
};

export default async function SettingsPage() {
  const session = await requireAuth();
  const [[user], [profile]] = await Promise.all([
    db.select().from(users).where(eq(users.id, session.user.id)).limit(1),
    db.select().from(customerProfiles).where(eq(customerProfiles.userId, session.user.id)).limit(1),
  ]);

  return (
    <DashboardShell
      session={session}
      title="Settings"
      description="Update your account details, business profile, notification preferences, and deletion request path."
    >
      <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <GlassPanel>
          <h2 className="text-xl font-semibold tracking-tight">Account and business details</h2>
          <div className="mt-6">
            <SettingsForm user={user ?? session.user} profile={profile} />
          </div>
        </GlassPanel>
        <div className="space-y-6">
          <GlassPanel>
            <Badge variant="outline">Notifications</Badge>
            <h2 className="mt-4 text-xl font-semibold tracking-tight">Default preferences</h2>
            <p className="mt-3 text-sm leading-6 text-muted-foreground">
              Operational emails, billing notices, onboarding updates, and support responses are enabled for managed-service accounts.
            </p>
          </GlassPanel>
          <GlassPanel className="border-destructive/30">
            <Badge variant="destructive">Account deletion</Badge>
            <h2 className="mt-4 text-xl font-semibold tracking-tight">Delete account option</h2>
            <p className="mt-3 text-sm leading-6 text-muted-foreground">
              Submit a support request with subject &quot;Delete my account&quot;. Leo will confirm identity, cancel active billing where required, and remove account data according to the privacy policy.
            </p>
          </GlassPanel>
        </div>
      </div>
    </DashboardShell>
  );
}
