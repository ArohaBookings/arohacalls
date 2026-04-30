import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, Check, Sparkles, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { GlassPanel, MiniStat, PageShell } from "@/components/marketing/page-shell";
import { JsonLd } from "@/components/marketing/json-ld";
import { INDUSTRIES, getIndustry } from "@/lib/industries";
import { siteConfig } from "@/lib/site-config";

export function generateStaticParams() {
  return INDUSTRIES.map((i) => ({ industry: i.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ industry: string }> }): Promise<Metadata> {
  const { industry: slug } = await params;
  const industry = getIndustry(slug);
  if (!industry) return {};
  return {
    title: industry.seoTitle,
    description: industry.seoDescription,
    keywords: industry.seoKeywords,
    openGraph: {
      title: industry.seoTitle,
      description: industry.seoDescription,
      url: `${siteConfig.url}/for/${industry.slug}`,
      type: "website",
    },
    alternates: { canonical: `${siteConfig.url}/for/${industry.slug}` },
  };
}

export default async function IndustryPage({ params }: { params: Promise<{ industry: string }> }) {
  const { industry: slug } = await params;
  const industry = getIndustry(slug);
  if (!industry) notFound();

  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: siteConfig.url },
      { "@type": "ListItem", position: 2, name: "Industries", item: `${siteConfig.url}/for` },
      { "@type": "ListItem", position: 3, name: industry.name, item: `${siteConfig.url}/for/${industry.slug}` },
    ],
  };
  const productLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: `Aroha Calls for ${industry.name}`,
    description: industry.seoDescription,
    brand: { "@type": "Brand", name: "Aroha" },
    offers: {
      "@type": "AggregateOffer",
      priceCurrency: "NZD",
      lowPrice: "99",
      highPrice: "599",
      offerCount: 4,
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "5",
      reviewCount: "12",
      bestRating: "5",
    },
  };
  const faqLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: industry.faq.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };

  return (
    <PageShell
      eyebrow={industry.hero.eyebrow}
      title={industry.hero.title}
      description={industry.hero.subtitle}
      badge={<span className="text-2xl">{industry.emoji}</span>}
    >
      <JsonLd data={breadcrumbLd} />
      <JsonLd data={productLd} />
      <JsonLd data={faqLd} />

      <div className="mt-2 flex flex-col gap-3 sm:flex-row">
        <Button asChild size="lg" className="group">
          <Link href={`/demo?source=for-${industry.slug}`}>
            Book your free {industry.name.toLowerCase()} demo
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </Button>
        <Button asChild size="lg" variant="outline">
          <Link href="/pricing">View pricing</Link>
        </Button>
      </div>

      <div className="mt-14 grid gap-4 sm:grid-cols-3">
        {industry.wins.map((w) => (
          <MiniStat key={w.label} label={w.label} value={w.stat} />
        ))}
      </div>

      <section className="mt-20">
        <h2 className="text-3xl font-semibold tracking-tight">Why {industry.name.toLowerCase()} bleed money on the phones.</h2>
        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {industry.pains.map((p) => (
            <GlassPanel key={p.title}>
              <h3 className="text-base font-semibold tracking-tight">{p.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{p.body}</p>
            </GlassPanel>
          ))}
        </div>
      </section>

      <section className="mt-20">
        <Badge variant="glow"><Sparkles className="mr-1 h-3 w-3" /> The Aroha workflow</Badge>
        <h2 className="mt-4 text-3xl font-semibold tracking-tight">From ring to revenue, on autopilot.</h2>
        <div className="mt-8 space-y-3">
          {industry.workflow.map((step, i) => (
            <div key={step} className="flex items-start gap-4 rounded-2xl border border-border bg-card/50 p-5">
              <span className="mt-0.5 grid h-7 w-7 shrink-0 place-items-center rounded-full border border-primary/40 bg-primary/10 text-xs font-semibold text-primary">
                {i + 1}
              </span>
              <p className="text-sm text-foreground/85">{step}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-20">
        <GlassPanel>
          <div className="flex items-center gap-1 text-amber-300">
            {[0, 1, 2, 3, 4].map((n) => (
              <Star key={n} className="h-4 w-4 fill-current" />
            ))}
          </div>
          <blockquote className="mt-3 text-xl font-medium leading-relaxed text-foreground">
            &ldquo;{industry.testimonial.quote}&rdquo;
          </blockquote>
          <p className="mt-4 text-sm text-muted-foreground">
            <span className="font-medium text-foreground">{industry.testimonial.author}</span> · {industry.testimonial.role}
          </p>
        </GlassPanel>
      </section>

      <section className="mt-20">
        <h2 className="text-3xl font-semibold tracking-tight">{industry.name} FAQ</h2>
        <div className="mt-6 space-y-3">
          {industry.faq.map((f) => (
            <GlassPanel key={f.q}>
              <p className="text-base font-medium text-foreground">{f.q}</p>
              <p className="mt-2 text-sm text-muted-foreground">{f.a}</p>
            </GlassPanel>
          ))}
        </div>
      </section>

      <section className="mt-20">
        <GlassPanel>
          <div className="flex flex-col items-start gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h2 className="text-2xl font-semibold tracking-tight">Live in your {industry.name.toLowerCase()} business in 24 hours.</h2>
              <p className="mt-2 text-sm text-muted-foreground">7-day money-back guarantee. Cancel anytime. White-glove onboarding included.</p>
              <ul className="mt-4 space-y-2 text-sm">
                {[`Built for ${industry.name.toLowerCase()}`, "Live the same day", "Cancel anytime", "Money-back guarantee"].map((item) => (
                  <li key={item} className="flex items-center gap-2 text-foreground/85">
                    <Check className="h-4 w-4 text-primary" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="flex flex-col gap-2">
              <Button asChild size="lg" className="group">
                <Link href={`/demo?source=for-${industry.slug}`}>
                  Get a free demo
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link href="/pricing">See plans</Link>
              </Button>
            </div>
          </div>
        </GlassPanel>
      </section>
    </PageShell>
  );
}
