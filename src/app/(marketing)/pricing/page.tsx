import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, CalendarCheck, CreditCard, Globe2, PhoneCall, ShieldCheck, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CheckoutButton } from "@/components/marketing/checkout-button";
import { JsonLd } from "@/components/marketing/json-ld";
import { PageHero, SectionBand, GlassPanel } from "@/components/marketing/page-shell";
import { PlanCard } from "@/components/marketing/plan-card";
import { FeatureMatrix } from "@/components/marketing/feature-matrix";
import { PLAN_GUARANTEE, PLANS } from "@/lib/plans";
import { siteConfig } from "@/lib/site-config";
import { pricingProductJsonLd, serviceReviews } from "@/lib/structured-data";

export const metadata: Metadata = {
  title: "Pricing — All 4 Aroha Calls plans, the full package",
  description:
    "Aroha Calls managed AI receptionist plans: Lite NZ$99, Essentials NZ$199, Professional NZ$349, Premium NZ$599. Every feature listed, side-by-side comparison, NZD + USD pricing.",
  alternates: { canonical: `${siteConfig.url}/pricing` },
};

export default function PricingPage() {
  return (
    <>
      <JsonLd data={pricingProductJsonLd()} />
      <PageHero
        title={<>Four packages. Every feature in the box.</>}
        description="Pick your managed AI receptionist plan in NZD or USD. We set up the number, caller flow, Google Calendar, CRM timeline, Email AI, and handover rules so you know exactly what happens after payment."
        cta={{ href: "/demo", label: "Book a free demo" }}
        secondary={{ href: "/live-demo", label: "Talk to Grace live" }}
      />

      {/* Quick stats / sales line callout */}
      <section className="container-tight -mt-12 mb-12">
        <GlassPanel className="flex flex-col items-center gap-4 text-center sm:flex-row sm:justify-between sm:text-left">
          <div className="flex items-center gap-3">
            <span className="grid h-12 w-12 place-items-center rounded-full bg-primary/15 text-primary">
              <PhoneCall className="h-5 w-5" />
            </span>
            <div>
              <p className="text-sm font-semibold text-foreground">Want to hear from Grace from Aroha?</p>
              <p className="text-xs text-muted-foreground">Talk in your browser, or call +64 3 667 2033 if you prefer the phone line.</p>
            </div>
          </div>
          <Button asChild size="lg" variant="outline">
            <Link href="/live-demo">
              Talk to Grace live
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </GlassPanel>
      </section>

      <SectionBand className="pt-0">
        <div className="container-tight">
          <div className="grid gap-4 lg:grid-cols-[0.9fr_1.1fr] lg:items-stretch">
            <GlassPanel className="flex flex-col justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">Simple setup</p>
                <h2 className="mt-3 text-3xl font-bold tracking-tight">You choose a plan. We make the phones work.</h2>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                  You do not need to understand voice providers, routing, or CRM wiring. Aroha Group sets up the managed front desk and gives you a clear path to go live.
                </p>
              </div>
              <div className="mt-6 flex flex-wrap gap-2 text-xs text-muted-foreground">
                <span className="rounded-full border border-border bg-background/40 px-3 py-1">Monthly or yearly</span>
                <span className="rounded-full border border-border bg-background/40 px-3 py-1">NZD or USD</span>
                <span className="rounded-full border border-border bg-background/40 px-3 py-1">Cancel anytime</span>
              </div>
            </GlassPanel>
            <div className="grid gap-3 sm:grid-cols-3">
              {[
                {
                  icon: PhoneCall,
                  title: "1. Pick the number setup",
                  body: "Use a new Aroha number, forward your existing line, or talk to us about porting when you are ready.",
                },
                {
                  icon: CalendarCheck,
                  title: "2. Connect Google Calendar",
                  body: "Inside your managed Aroha AI organisation, you connect Google Calendar and we tune services, buffers, staff and rules.",
                },
                {
                  icon: CreditCard,
                  title: "3. Stripe handles billing",
                  body: "Checkout, invoices, renewals, plan changes and cancellation all run through Stripe customer billing.",
                },
              ].map((item) => (
                <div key={item.title} className="rounded-3xl border border-border bg-card/45 p-5">
                  <item.icon className="h-5 w-5 text-primary" />
                  <h3 className="mt-4 text-base font-semibold tracking-tight">{item.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{item.body}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </SectionBand>

      {/* Plan boxes */}
      <SectionBand className="pt-0">
        <div className="container-tight">
          <div className="mb-8 flex flex-col gap-3 text-center">
            <p className="inline-flex items-center justify-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-primary">
              <Globe2 className="h-3.5 w-3.5" />
              Available worldwide
            </p>
            <h2 className="text-balance text-3xl font-bold tracking-tight">Choose the package that matches your call volume.</h2>
            <p className="mx-auto max-w-2xl text-sm text-muted-foreground">
              Start in NZD or USD. Lite is monthly only; Essentials, Professional and Premium also support yearly billing where listed.
            </p>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {PLANS.map((plan) => (
              <div key={plan.id} id={plan.id} className="scroll-mt-28">
                <PlanCard plan={plan} />
              </div>
            ))}
          </div>
          <div className="mt-8 flex items-center justify-center gap-2 text-sm text-muted-foreground">
            <ShieldCheck className="h-4 w-4 text-primary" />
            {PLAN_GUARANTEE}
          </div>
        </div>
      </SectionBand>

      {/* Comparison matrix */}
      <SectionBand className="pt-0">
        <div className="container-tight">
          <div className="text-center">
            <p className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/5 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-primary">
              <Sparkles className="h-3 w-3" /> Side-by-side
            </p>
            <h2 className="mt-4 text-balance text-3xl font-bold tracking-tight sm:text-4xl">Compare every feature, every plan.</h2>
            <p className="mx-auto mt-3 max-w-2xl text-pretty text-muted-foreground">
              Eleven categories, fifty-plus capabilities, all in one matrix. No fine print, no upsells hidden behind asterisks.
            </p>
          </div>
          <div className="mt-10">
            <FeatureMatrix />
          </div>
        </div>
      </SectionBand>

      {/* Yearly billing banner */}
      <SectionBand className="pt-0">
        <div className="container-tight">
          <GlassPanel>
            <div className="flex flex-col items-start gap-6 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <h2 className="text-2xl font-bold tracking-tight">Want yearly billing? Save ~10%.</h2>
                <p className="mt-2 text-sm text-muted-foreground">
                  Yearly plans are available on Essentials, Professional and Premium. Pay once, save the equivalent of one month free.
                </p>
              </div>
              <div className="grid w-full gap-2 sm:grid-cols-2 lg:w-auto lg:grid-cols-3">
                {PLANS.filter((p) => p.yearlyNZD).map((p) => (
                  <CheckoutButton key={`${p.id}-nzd`} planId={p.id} interval="year" currency="nzd" label={`${p.name} NZD`} variant="outline" />
                ))}
                {PLANS.filter((p) => p.yearlyUSD).map((p) => (
                  <CheckoutButton key={`${p.id}-usd`} planId={p.id} interval="year" currency="usd" label={`${p.name} USD`} variant="outline" />
                ))}
              </div>
            </div>
          </GlassPanel>
        </div>
      </SectionBand>

      <SectionBand className="pt-0">
        <div className="container-tight">
          <div className="text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">Proof from the floor</p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight">The value is simple: answered calls turn into customers.</h2>
          </div>
          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {serviceReviews.map((review) => (
              <GlassPanel key={review.name}>
                <div className="flex items-center gap-1 text-amber-300">
                  {[0, 1, 2, 3, 4].map((i) => (
                    <Sparkles key={i} className="h-3.5 w-3.5 fill-current" />
                  ))}
                </div>
                <p className="mt-4 text-sm leading-relaxed text-foreground/85">&ldquo;{review.body}&rdquo;</p>
                <p className="mt-4 text-sm font-semibold text-foreground">{review.name}</p>
                <p className="text-xs text-muted-foreground">{review.role}</p>
              </GlassPanel>
            ))}
          </div>
        </div>
      </SectionBand>

      {/* Final CTA */}
      <SectionBand className="pt-0">
        <div className="container-tight">
          <GlassPanel className="text-center">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Still deciding? Hear Grace from Aroha.</h2>
            <p className="mx-auto mt-3 max-w-2xl text-muted-foreground">
              Call +64 3 667 2033 — Grace will ask about your business, surface the missed-call pain, and tell you exactly which plan covers it. The call is the proof.
            </p>
            <div className="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Button asChild size="xl" className="group">
                <Link href="/live-demo">
                  <PhoneCall className="h-4 w-4" />
                  Talk to Grace live
                </Link>
              </Button>
              <Button asChild size="xl" variant="outline">
                <Link href="/demo">
                  Or book a guided demo
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>
          </GlassPanel>
        </div>
      </SectionBand>
    </>
  );
}
