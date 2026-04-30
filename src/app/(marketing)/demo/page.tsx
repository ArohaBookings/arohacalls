import type { Metadata } from "next";
import { PhoneCall, Sparkles } from "lucide-react";
import { SmartForm } from "@/components/marketing/forms";
import { PageHero, SectionBand, GlassPanel, MiniStat } from "@/components/marketing/page-shell";
import { siteConfig } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "Book A Free Custom Demo",
  description:
    "Book a free custom Aroha Calls demo. Leo builds a demo around your business, hours, callers, booking rules, and tone.",
  alternates: { canonical: "/demo" },
};

export default function DemoPage() {
  return (
    <>
      <PageHero
        title={<>Turn missed calls into booked, paying clients.</>}
        description="Call the live demo lines or tell us about your business and Leo will personally build a custom AI receptionist demo around your rules."
        cta={{ href: `tel:${siteConfig.phones.nz.e164}`, label: "Call NZ demo line" }}
        secondary={{ href: `tel:${siteConfig.phones.us.e164}`, label: "Call US demo line" }}
      />
      <SectionBand>
        <div className="container-tight grid gap-8 lg:grid-cols-[0.85fr_1.15fr]">
          <div className="space-y-5">
            <GlassPanel>
              <PhoneCall className="h-7 w-7 text-primary" />
              <h2 className="mt-4 text-2xl font-semibold tracking-tight">Live demo lines</h2>
              <p className="mt-3 text-sm leading-6 text-muted-foreground">
                These lines are set up for a sample business so you can hear pacing, booking questions, summaries, and policy handling.
              </p>
              <div className="mt-5 grid gap-3">
                <a href={`tel:${siteConfig.phones.nz.e164}`} className="rounded-2xl border border-border bg-card/60 p-4 hover:border-primary/50">
                  <p className="text-xs text-muted-foreground">NZ live demo</p>
                  <p className="mt-1 text-lg font-semibold">{siteConfig.phones.nz.display}</p>
                </a>
                <a href={`tel:${siteConfig.phones.us.e164}`} className="rounded-2xl border border-border bg-card/60 p-4 hover:border-primary/50">
                  <p className="text-xs text-muted-foreground">US live demo</p>
                  <p className="mt-1 text-lg font-semibold">{siteConfig.phones.us.display}</p>
                </a>
              </div>
            </GlassPanel>
            <div className="grid grid-cols-2 gap-3">
              <MiniStat label="Calls answered" value="24/7" />
              <MiniStat label="Setup target" value="< 24h" />
              <MiniStat label="Starting from" value="$99" />
              <MiniStat label="Guarantee" value="7 days" />
            </div>
          </div>
          <GlassPanel className="p-7">
            <Sparkles className="h-7 w-7 text-primary" />
            <h2 className="mt-4 text-2xl font-semibold tracking-tight">Let&apos;s build your demo.</h2>
            <p className="mt-3 text-sm leading-6 text-muted-foreground">
              No pressure and no generic sales pitch. The demo is built around your business, callers, hours, policies, and tone.
            </p>
            <div className="mt-6">
              <SmartForm
                endpoint="/api/demo"
                submitLabel="Build my demo"
                successMessage="Demo request sent. Leo will be in touch within 24 hours."
                fields={[
                  { name: "businessName", label: "Business name", required: true },
                  { name: "industry", label: "Industry", required: true, placeholder: "Trades, salon, clinic, real estate..." },
                  { name: "source", label: "Where are you based?", required: true },
                  { name: "name", label: "Your name", required: true },
                  { name: "email", label: "Email", type: "email", required: true },
                  { name: "phone", label: "Phone number", required: true },
                  { name: "message", label: "What do customers usually call about?", textarea: true, required: true },
                ]}
              />
            </div>
          </GlassPanel>
        </div>
      </SectionBand>
    </>
  );
}
