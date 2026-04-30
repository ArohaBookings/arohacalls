import type { Metadata } from "next";
import { eq } from "drizzle-orm";
import { requireAuth } from "@/lib/admin";
import { db } from "@/lib/db";
import { customerProfiles } from "@/lib/db/schema";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { OnboardingForm } from "@/components/dashboard/dashboard-forms";
import { GlassPanel } from "@/components/marketing/page-shell";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Onboarding",
  robots: { index: false, follow: false },
};

export default async function OnboardingPage() {
  const session = await requireAuth();
  const [profile] = await db
    .select()
    .from(customerProfiles)
    .where(eq(customerProfiles.userId, session.user.id))
    .limit(1);

  return (
    <DashboardShell
      session={session}
      title="Onboarding"
      description="Tell Leo what your business needs so the managed AI receptionist can be configured properly."
    >
      <GlassPanel>
        <div className="mb-6 grid gap-4 sm:grid-cols-4">
          {["Business", "Calendar", "Setup notes", "Confirmation"].map((step, index) => (
            <div key={step} className="rounded-xl border border-border bg-card/40 p-4">
              <p className="text-xs text-muted-foreground">Step {index + 1}</p>
              <p className="mt-1 text-sm font-medium">{step}</p>
            </div>
          ))}
        </div>
        <OnboardingForm defaults={profile} />
      </GlassPanel>
    </DashboardShell>
  );
}
