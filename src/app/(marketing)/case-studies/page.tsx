import type { Metadata } from "next";
import { Quote, TrendingUp } from "lucide-react";
import { PageHero, SectionBand, GlassPanel } from "@/components/marketing/page-shell";

export const metadata: Metadata = {
  title: "Case Studies",
  description: "Aroha Calls case studies are coming soon. Layout ready for before/after stats, quotes, and full stories.",
  alternates: { canonical: "/case-studies" },
};

export default function CaseStudiesPage() {
  return (
    <>
      <PageHero
        title={<>Case studies coming soon.</>}
        description="This page is ready for real customer stories: before and after stats, call volume, bookings recovered, customer quotes, and the full rollout story."
        cta={{ href: "/demo", label: "Become a case study" }}
      />
      <SectionBand>
        <div className="container-tight grid gap-5 md:grid-cols-3">
          {[
            ["Before", "Missed calls, voicemail tag, no clean customer history."],
            ["After", "Every call answered, booking details captured, summaries sent."],
            ["Result", "More bookings, less admin, and a calmer front desk."],
          ].map(([title, body]) => (
            <GlassPanel key={title}>
              <TrendingUp className="h-7 w-7 text-primary" />
              <h2 className="mt-4 text-xl font-semibold tracking-tight">{title}</h2>
              <p className="mt-3 text-sm leading-6 text-muted-foreground">{body}</p>
            </GlassPanel>
          ))}
        </div>
        <div className="container-tight mt-8">
          <GlassPanel className="p-8">
            <Quote className="h-8 w-8 text-primary" />
            <p className="mt-5 max-w-3xl text-2xl font-semibold leading-snug tracking-tight">
              Placeholder for a real client quote once the first published case study is approved.
            </p>
          </GlassPanel>
        </div>
      </SectionBand>
    </>
  );
}
