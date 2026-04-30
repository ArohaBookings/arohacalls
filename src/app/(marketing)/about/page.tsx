import type { Metadata } from "next";
import { HeartHandshake, ShieldCheck, Sparkles } from "lucide-react";
import { PageHero, SectionBand, GlassPanel } from "@/components/marketing/page-shell";
import { siteConfig } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "About",
  description: "Aroha Calls is a New Zealand-built managed AI receptionist service for businesses worldwide.",
  alternates: { canonical: "/about" },
};

const values = [
  {
    icon: HeartHandshake,
    title: "No business should lose customers to missed calls",
    body: "Every missed call can be a missed booking, lost revenue, and a customer who never calls back.",
  },
  {
    icon: Sparkles,
    title: "Built to be the smartest receptionist",
    body: "Aroha is not a rigid script. It learns the business, follows policies, captures details, and improves with real usage.",
  },
  {
    icon: ShieldCheck,
    title: "Risk-free by design",
    body: "Every plan includes done-for-you setup, cancel-anytime billing, and a 7-day money-back guarantee from activation.",
  },
];

export default function AboutPage() {
  return (
    <>
      <PageHero
        title={<>Built in New Zealand for businesses that cannot afford to miss calls.</>}
        description={siteConfig.founder.storyShort}
        cta={{ href: "/demo", label: "Book a demo" }}
        secondary={{ href: "/features", label: "See features" }}
      />
      <SectionBand>
        <div className="container-tight grid gap-5 md:grid-cols-3">
          {values.map((value) => {
            const Icon = value.icon;
            return (
              <GlassPanel key={value.title}>
                <Icon className="h-7 w-7 text-primary" />
                <h2 className="mt-4 text-xl font-semibold tracking-tight">{value.title}</h2>
                <p className="mt-3 text-sm leading-6 text-muted-foreground">{value.body}</p>
              </GlassPanel>
            );
          })}
        </div>
      </SectionBand>
      <SectionBand className="border-y border-border/60 bg-card/25">
        <div className="container-tight max-w-4xl">
          <h2 className="text-3xl font-semibold tracking-tight">Designed for real callers, not perfect demos.</h2>
          <p className="mt-5 text-lg leading-8 text-muted-foreground">
            Aroha Calls is for appointment-based and service businesses worldwide: salons, clinics, trades, automotive, gyms, hospitality, real estate, and any owner who needs every enquiry handled professionally. The managed service means Leo helps set the tone, rules, FAQs, services, pricing, booking flow, and follow-up so the AI mirrors your workflow instead of forcing a new one.
          </p>
        </div>
      </SectionBand>
    </>
  );
}
