import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, PhoneCall, ShieldCheck, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CheckoutButton } from "@/components/marketing/checkout-button";
import { JsonLd } from "@/components/marketing/json-ld";
import { PageHero, SectionBand, GlassPanel } from "@/components/marketing/page-shell";
import { PlanCard } from "@/components/marketing/plan-card";
import { FeatureMatrix } from "@/components/marketing/feature-matrix";
import { PLAN_GUARANTEE, PLANS } from "@/lib/plans";
import { siteConfig } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "Pricing — All 4 Aroha Calls plans, the full package",
  description:
    "Aroha Calls managed AI receptionist plans: Lite NZ$99, Essentials NZ$199, Professional NZ$349, Premium NZ$599. Every feature listed, side-by-side comparison, NZD + USD pricing.",
  alternates: { canonical: `${siteConfig.url}/pricing` },
};

export default function PricingPage() {
  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Product",
          name: "Aroha Calls",
          description: siteConfig.description,
          brand: { "@type": "Brand", name: "Aroha" },
          offers: PLANS.map((plan) => ({
            "@type": "Offer",
            name: plan.name,
            price: plan.priceNZD,
            priceCurrency: "NZD",
            availability: "https://schema.org/InStock",
            url: `${siteConfig.url}/pricing/${plan.slug}`,
          })),
        }}
      />
      <PageHero
        title={<>Four packages. Every feature in the box.</>}
        description="Same pricing as the Shopify store, now with Stripe billing, customer accounts, self-serve plan management, and a managed setup path. Pick a package — see exactly what ships."
        cta={{ href: "/demo", label: "Book a free demo" }}
        secondary={{ href: "tel:+6436672033", label: "Hear Grace from Aroha" }}
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
              <p className="text-xs text-muted-foreground">+64 3 667 2033 — Grace answers, understands the pain, and explains the right setup live.</p>
            </div>
          </div>
          <Button asChild size="lg" variant="outline">
            <a href="tel:+6436672033">
              Call +64 3 667 2033
              <ArrowRight className="h-4 w-4" />
            </a>
          </Button>
        </GlassPanel>
      </section>

      {/* Plan boxes */}
      <SectionBand className="pt-0">
        <div className="container-tight">
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
              <div className="flex flex-col gap-2 sm:flex-row">
                {PLANS.filter((p) => p.yearlyNZD).map((p) => (
                  <CheckoutButton key={p.id} planId={p.id} interval="year" label={`${p.name} yearly`} variant="outline" />
                ))}
              </div>
            </div>
          </GlassPanel>
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
                <a href="tel:+6436672033">
                  <PhoneCall className="h-4 w-4" />
                  Call +64 3 667 2033
                </a>
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
