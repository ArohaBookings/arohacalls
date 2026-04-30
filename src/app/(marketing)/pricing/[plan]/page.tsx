import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowRight,
  Check,
  PhoneCall,
  ShieldCheck,
  Sparkles,
  Star,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { GlassPanel, MiniStat, PageShell } from "@/components/marketing/page-shell";
import { JsonLd } from "@/components/marketing/json-ld";
import { SoftwareBox } from "@/components/visuals/software-box";
import { FeatureMatrix } from "@/components/marketing/feature-matrix";
import { PLANS, getPlanBySlug, PLAN_GUARANTEE } from "@/lib/plans";
import { siteConfig } from "@/lib/site-config";

export function generateStaticParams() {
  return PLANS.flatMap((p) =>
    p.legacySlug && p.legacySlug !== p.slug ? [{ plan: p.slug }, { plan: p.legacySlug }] : [{ plan: p.slug }],
  );
}

export async function generateMetadata({ params }: { params: Promise<{ plan: string }> }): Promise<Metadata> {
  const { plan: slug } = await params;
  const plan = getPlanBySlug(slug);
  if (!plan) return {};
  const title = `Aroha Calls ${plan.name} — NZ$${plan.priceNZD}/month`;
  const description = `${plan.tagline} ${plan.description}`;
  return {
    title,
    description,
    alternates: { canonical: `${siteConfig.url}/pricing/${plan.slug}` },
    openGraph: { title, description, url: `${siteConfig.url}/pricing/${plan.slug}`, type: "website" },
  };
}

export default async function PlanPage({ params }: { params: Promise<{ plan: string }> }) {
  const { plan: slug } = await params;
  const plan = getPlanBySlug(slug);
  if (!plan) notFound();

  const productLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: `Aroha Calls ${plan.name}`,
    description: plan.description,
    brand: { "@type": "Brand", name: "Aroha" },
    offers: {
      "@type": "Offer",
      priceCurrency: "NZD",
      price: String(plan.priceNZD),
      url: `${siteConfig.url}/pricing/${plan.slug}`,
      availability: "https://schema.org/InStock",
    },
    aggregateRating: { "@type": "AggregateRating", ratingValue: "5", reviewCount: "12", bestRating: "5" },
  };
  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: siteConfig.url },
      { "@type": "ListItem", position: 2, name: "Pricing", item: `${siteConfig.url}/pricing` },
      { "@type": "ListItem", position: 3, name: plan.name, item: `${siteConfig.url}/pricing/${plan.slug}` },
    ],
  };
  const faqLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: plan.faq.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };

  // Group capabilities by category
  const grouped = plan.capabilities.reduce<Record<string, typeof plan.capabilities>>((acc, c) => {
    (acc[c.category] ??= []).push(c);
    return acc;
  }, {});

  return (
    <PageShell
      eyebrow={`The ${plan.theme.subtitle}`}
      title={
        <>
          Aroha Calls <span className="aurora-text">{plan.name}</span>
        </>
      }
      description={plan.description}
      badge={<span className="text-base">📦</span>}
    >
      <JsonLd data={productLd} />
      <JsonLd data={breadcrumbLd} />
      <JsonLd data={faqLd} />

      {/* Hero block: software box + price + CTAs */}
      <section className="grid gap-10 lg:grid-cols-[1fr_1.1fr] lg:items-center">
        <div className="relative flex justify-center lg:justify-end">
          <SoftwareBox plan={plan} size="lg" />
        </div>
        <GlassPanel>
          {plan.popular && (
            <Badge variant="glow" className="mb-3"><Sparkles className="mr-1 h-3 w-3" /> Most popular plan</Badge>
          )}
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">{plan.theme.shortCode}</p>
          <h2 className="mt-2 text-3xl font-bold tracking-tight">{plan.name}</h2>
          <p className="mt-2 text-sm text-muted-foreground">{plan.tagline}</p>

          <div className="mt-5 flex items-baseline gap-2">
            <span className="text-5xl font-bold tracking-tight">NZ${plan.priceNZD}</span>
            <span className="text-sm text-muted-foreground">/month</span>
          </div>
          <p className="text-xs text-muted-foreground">USD ${plan.priceUSD} · ex GST</p>

          <div className="mt-5 grid grid-cols-3 gap-2">
            {plan.highlights.map((h) => (
              <MiniStat key={h.label} label={h.label} value={h.value} />
            ))}
          </div>

          <div className="mt-6 flex flex-col gap-2">
            <Button asChild size="lg" className="group">
              <Link href={`/signup?plan=${plan.id}`}>
                Choose {plan.name}
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </Link>
            </Button>
            <div className="grid grid-cols-2 gap-2">
              <Button asChild variant="outline" size="lg">
                <Link href="/demo">Free demo</Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <a href="tel:+6436672033">
                  <PhoneCall className="h-4 w-4" />
                  Talk to sales AI
                </a>
              </Button>
            </div>
          </div>

          <p className="mt-4 flex items-center gap-2 text-xs text-muted-foreground">
            <ShieldCheck className="h-3.5 w-3.5 text-primary" />
            {PLAN_GUARANTEE}
          </p>
        </GlassPanel>
      </section>

      {/* Best for */}
      <section className="mt-16">
        <GlassPanel>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">Best for</p>
          <p className="mt-2 text-lg text-foreground/90">{plan.bestFor}</p>
        </GlassPanel>
      </section>

      {/* What's in the box */}
      <section className="mt-16">
        <h2 className="text-3xl font-bold tracking-tight">What ships in the {plan.name} box.</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Every Aroha plan is a full package. Here&apos;s exactly what you get when you sign up.
        </p>
        <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {plan.whatsInTheBox.map((item, i) => (
            <GlassPanel key={item}>
              <div className="flex items-start gap-3">
                <span
                  className="grid h-9 w-9 shrink-0 place-items-center rounded-xl text-sm font-bold text-white"
                  style={{ background: `linear-gradient(135deg, ${plan.theme.gradient[0]}, ${plan.theme.gradient[1]})` }}
                >
                  {String(i + 1).padStart(2, "0")}
                </span>
                <p className="text-sm leading-relaxed text-foreground/90">{item}</p>
              </div>
            </GlassPanel>
          ))}
        </div>
      </section>

      {/* Capabilities by category */}
      <section className="mt-16">
        <h2 className="text-3xl font-bold tracking-tight">Every capability, in detail.</h2>
        <div className="mt-8 grid gap-4 md:grid-cols-2">
          {Object.entries(grouped).map(([category, items]) => (
            <GlassPanel key={category}>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">{categoryLabel(category)}</p>
              <ul className="mt-4 space-y-3">
                {items.map((item) => (
                  <li key={item.label}>
                    <div className="flex items-start gap-2">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                      <div>
                        <p className="text-sm font-medium text-foreground">{item.label}</p>
                        <p className="text-xs leading-relaxed text-muted-foreground">{item.detail}</p>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </GlassPanel>
          ))}
        </div>
      </section>

      {/* Compare to other plans */}
      <section className="mt-20">
        <h2 className="text-3xl font-bold tracking-tight">How {plan.name} compares.</h2>
        <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
          Every feature, every plan, side by side. No surprises.
        </p>
        <div className="mt-8">
          <FeatureMatrix />
        </div>
      </section>

      {/* Plan FAQ */}
      <section className="mt-20">
        <h2 className="text-3xl font-bold tracking-tight">{plan.name} FAQ</h2>
        <div className="mt-6 space-y-3">
          {plan.faq.map((f) => (
            <GlassPanel key={f.q}>
              <p className="text-base font-medium text-foreground">{f.q}</p>
              <p className="mt-2 text-sm text-muted-foreground">{f.a}</p>
            </GlassPanel>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="mt-20">
        <GlassPanel className="text-center">
          <div className="flex items-center justify-center gap-1 text-amber-300">
            {[0, 1, 2, 3, 4].map((i) => (
              <Star key={i} className="h-4 w-4 fill-current" />
            ))}
          </div>
          <h2 className="mt-4 text-3xl font-bold tracking-tight">Ready to ship the {plan.name} box?</h2>
          <p className="mx-auto mt-3 max-w-xl text-sm text-muted-foreground">
            Live in 24 hours. Cancel anytime. 7-day money-back guarantee. Or call Grace from Aroha and hear the flow live.
          </p>
          <div className="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Button asChild size="xl">
              <Link href={`/signup?plan=${plan.id}`}>
                Choose {plan.name}
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button asChild size="xl" variant="outline">
              <a href="tel:+6436672033">
                <PhoneCall className="h-4 w-4" />
                +64 3 667 2033
              </a>
            </Button>
          </div>
          <p className="mt-3 text-xs text-muted-foreground">+64 3 667 2033 lets you hear from Grace from Aroha right now and see how she would handle your business.</p>
        </GlassPanel>
      </section>
    </PageShell>
  );
}

function categoryLabel(c: string) {
  return ({
    voice: "Voice AI",
    calendar: "Calendar & bookings",
    crm: "CRM & customer memory",
    email: "Email AI",
    messages: "Messages & SMS",
    knowledge: "Knowledge base",
    analytics: "Analytics & reporting",
    support: "Setup & support",
    extras: "Extras",
  } as Record<string, string>)[c] ?? c;
}
