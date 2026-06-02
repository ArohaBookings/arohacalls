import type { Metadata } from "next";
import { Building2, Globe2, HeartHandshake, ShieldCheck, Sparkles, TrendingUp } from "lucide-react";
import { PageHero, SectionBand, GlassPanel } from "@/components/marketing/page-shell";
import { siteConfig } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "About",
  description: "Aroha Calls is a managed AI receptionist service for businesses worldwide.",
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

const story = [
  {
    title: "Founded in Christchurch with a global target",
    body:
      "Aroha Group was founded by Leo Bons, a 19-year-old founder based in Christchurch, New Zealand. The company started from a simple problem: service businesses work hard to get leads, rank on Google, run ads, and build trust, then lose customers because nobody answers at the exact moment the customer is ready to book.",
  },
  {
    title: "The mission is bigger than call answering",
    body:
      "Aroha Calls is built as a managed front-office system: voice AI, bookings, Email AI, messages, customer memory, CRM timeline, follow-up, analytics, and Aurora business assistance. The aim is not to replace care, quality, or brand personality. The aim is to make sure every caller is answered, understood, remembered, and moved to the right next step.",
  },
  {
    title: "Built to scale beyond one city or one founder",
    body:
      "Aroha is New Zealand-founded, but the ambition is worldwide. The long-term goal is to build Aroha Group into a billion-dollar SaaS company serving businesses across industries and countries. That is why the product is designed around repeatable systems, secure billing, signed webhooks, customer dashboards, managed onboarding, and a self-serve Aroha AI platform behind the service.",
  },
  {
    title: "What should stay true as the company grows",
    body:
      "The promise is simple: if a business is already earning attention, Aroha helps capture it. Calls should be answered. Bookings should be logged. Follow-ups should happen. Customers should not have to repeat themselves every time they call back. Aroha Group exists to make that level of front-office consistency available to businesses that could never justify building an internal software team.",
  },
];

export default function AboutPage() {
  return (
    <>
      <PageHero
        title={<>Managed for businesses that cannot afford to miss calls.</>}
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
        <div className="container-tight grid gap-6 lg:grid-cols-[0.85fr_1.15fr]">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary">Founder story</p>
            <h2 className="mt-3 text-4xl font-semibold tracking-tight">Aroha Group is being built from Christchurch for the world.</h2>
            <p className="mt-5 text-lg leading-8 text-muted-foreground">
              The company is young, but the standard is not. The goal is to build a global SaaS company that makes premium front-office automation available to the businesses that need it most.
            </p>
            <div className="mt-6 grid gap-3 sm:grid-cols-3">
              {[
                [Building2, "Christchurch-founded"],
                [Globe2, "Worldwide service"],
                [TrendingUp, "Billion-dollar SaaS ambition"],
              ].map(([Icon, label]) => (
                <div key={label as string} className="rounded-2xl border border-border bg-white p-4 text-sm font-medium shadow-sm">
                  <Icon className="mb-3 h-5 w-5 text-primary" />
                  {label as string}
                </div>
              ))}
            </div>
          </div>
          <div className="space-y-4">
            {story.map((item) => (
              <GlassPanel key={item.title}>
                <h3 className="text-xl font-semibold tracking-tight">{item.title}</h3>
                <p className="mt-3 text-sm leading-7 text-muted-foreground">{item.body}</p>
              </GlassPanel>
            ))}
          </div>
        </div>
      </SectionBand>
      <SectionBand>
        <div className="container-tight max-w-4xl">
          <h2 className="text-3xl font-semibold tracking-tight">Designed for real callers, not perfect demos.</h2>
          <p className="mt-5 text-lg leading-8 text-muted-foreground">
            Aroha Calls is for appointment-based and service businesses worldwide: salons, clinics, trades, automotive, gyms, hospitality, real estate, and any owner who needs every enquiry handled professionally. The managed service means Aroha Group sets the tone, rules, FAQs, services, pricing, booking flow, handoff logic, and follow-up so the AI mirrors the business workflow instead of forcing a new one.
          </p>
        </div>
      </SectionBand>
    </>
  );
}
