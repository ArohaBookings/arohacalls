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
      description="Tell Aroha Group what your business needs so the managed front-office system can be configured properly."
    >
      <GlassPanel className="p-4 sm:p-6">
        <OnboardingForm defaults={profile} />
      </GlassPanel>
    </DashboardShell>
  );
}
