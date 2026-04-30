import type { Metadata } from "next";
import { CheckCircle2 } from "lucide-react";
import { PageHero, SectionBand, GlassPanel } from "@/components/marketing/page-shell";
import { featureGroups, industries } from "@/lib/marketing-data";

export const metadata: Metadata = {
  title: "Features",
  description:
    "Aroha Calls combines AI call answering, booking, CRM memory, Email AI, Messages AI, Aurora, workflows, and analytics in one managed service.",
  alternates: { canonical: "/features" },
};

export default function FeaturesPage() {
  return (
    <>
      <PageHero
        title={<>Everything your front desk should do, managed for you.</>}
        description="Aroha Calls is not just a voice bot. It is call answering, bookings, customer memory, follow-up, messaging, email, Aurora, and analytics packaged as a managed service."
        cta={{ href: "/demo", label: "Book a free demo" }}
        secondary={{ href: "/pricing", label: "View pricing" }}
      />
      <SectionBand>
        <div className="container-tight grid gap-5 md:grid-cols-2">
          {featureGroups.map((feature) => {
            const Icon = feature.icon;
            return (
              <GlassPanel key={feature.title} className="p-7">
                <div className="grid h-11 w-11 place-items-center rounded-2xl border border-primary/25 bg-primary/10 text-primary">
                  <Icon className="h-5 w-5" />
                </div>
                <h2 className="mt-5 text-2xl font-semibold tracking-tight">{feature.title}</h2>
                <p className="mt-3 text-sm leading-6 text-muted-foreground">{feature.description}</p>
                <ul className="mt-5 grid gap-2 sm:grid-cols-2">
                  {feature.bullets.map((bullet) => (
                    <li key={bullet} className="flex items-start gap-2 text-sm text-foreground/85">
                      <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                      {bullet}
                    </li>
                  ))}
                </ul>
              </GlassPanel>
            );
          })}
        </div>
      </SectionBand>
      <SectionBand className="border-y border-border/60 bg-card/25">
        <div className="container-tight">
          <h2 className="text-3xl font-semibold tracking-tight">Built for businesses where missed calls cost money.</h2>
          <div className="mt-8 flex flex-wrap gap-3">
            {industries.map((industry) => (
              <span key={industry} className="rounded-full border border-border bg-card/70 px-4 py-2 text-sm capitalize text-muted-foreground">
                AI receptionist for {industry}
              </span>
            ))}
          </div>
        </div>
      </SectionBand>
    </>
  );
}
