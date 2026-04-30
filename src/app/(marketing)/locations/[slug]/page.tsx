import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, Phone, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { GlassPanel, MiniStat, PageShell } from "@/components/marketing/page-shell";
import { JsonLd } from "@/components/marketing/json-ld";
import { LOCATIONS, getLocation } from "@/lib/locations";
import { siteConfig } from "@/lib/site-config";
import { PLANS } from "@/lib/plans";

export function generateStaticParams() {
  return LOCATIONS.map((l) => ({ slug: l.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const loc = getLocation(slug);
  if (!loc) return {};
  return {
    title: loc.seoTitle,
    description: loc.seoDescription,
    keywords: loc.seoKeywords,
    openGraph: {
      title: loc.seoTitle,
      description: loc.seoDescription,
      url: `${siteConfig.url}/locations/${loc.slug}`,
      type: "website",
    },
    alternates: { canonical: `${siteConfig.url}/locations/${loc.slug}` },
  };
}

export default async function LocationPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const loc = getLocation(slug);
  if (!loc) notFound();

  const localBusinessLd = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: `Aroha Calls — ${loc.name}`,
    description: loc.seoDescription,
    telephone: loc.phone,
    address: {
      "@type": "PostalAddress",
      addressLocality: loc.name,
      addressCountry: loc.country === "New Zealand" ? "NZ" : "US",
    },
    openingHours: "Mo-Su 00:00-23:59",
    priceRange: loc.currency === "NZD" ? "$$" : "$",
    url: `${siteConfig.url}/locations/${loc.slug}`,
  };
  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: siteConfig.url },
      { "@type": "ListItem", position: 2, name: "Locations", item: `${siteConfig.url}/locations` },
      { "@type": "ListItem", position: 3, name: loc.name, item: `${siteConfig.url}/locations/${loc.slug}` },
    ],
  };
  const faqLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: loc.faq.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };

  return (
    <PageShell
      eyebrow={loc.hero.eyebrow}
      title={loc.hero.title}
      description={loc.hero.subtitle}
      badge={<span className="text-xl">{loc.flag}</span>}
    >
      <JsonLd data={localBusinessLd} />
      <JsonLd data={breadcrumbLd} />
      <JsonLd data={faqLd} />

      <div className="flex flex-col gap-3 sm:flex-row">
        <Button asChild size="lg" className="group">
          <Link href={`/demo?source=${loc.slug}`}>
            Book your free demo
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </Button>
        <Button asChild size="lg" variant="outline">
          <a href={`tel:${loc.phone.replace(/\D/g, "")}`}>
            <Phone className="h-4 w-4" />
            Call: {loc.phone}
          </a>
        </Button>
      </div>

      <div className="mt-12 grid gap-3 sm:grid-cols-3">
        <MiniStat label="Live customers" value={`${loc.population} pop.`} />
        <MiniStat label="Timezone" value={loc.timezone} />
        <MiniStat label="Local pricing" value={loc.currency === "NZD" ? "From NZ$99/mo" : "From US$59/mo"} />
      </div>

      <section className="mt-20">
        <h2 className="text-3xl font-semibold tracking-tight">What {loc.name} businesses lose to missed calls.</h2>
        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {loc.pains.map((p) => (
            <GlassPanel key={p.title}>
              <h3 className="text-base font-semibold tracking-tight">{p.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{p.body}</p>
            </GlassPanel>
          ))}
        </div>
      </section>

      <section className="mt-20">
        <Badge variant="glow"><Star className="mr-1 h-3 w-3" /> Local industries</Badge>
        <h2 className="mt-4 text-3xl font-semibold tracking-tight">Built for {loc.industries.length} core industries in {loc.name}.</h2>
        <div className="mt-6 flex flex-wrap gap-2">
          {loc.industries.map((i) => (
            <span key={i} className="rounded-full border border-border bg-card/40 px-4 py-2 text-sm text-foreground/85">
              {i}
            </span>
          ))}
        </div>
        <p className="mt-6 text-sm text-muted-foreground">Trusted by {loc.trustedBy.join(", ")} and dozens more.</p>
      </section>

      <section className="mt-20">
        <h2 className="text-3xl font-semibold tracking-tight">{loc.name} pricing.</h2>
        <p className="mt-2 text-sm text-muted-foreground">All plans are monthly, in {loc.currency}. Cancel anytime, money-back inside 7 days.</p>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {PLANS.map((p) => (
            <GlassPanel key={p.id}>
              <p className="text-xs uppercase tracking-[0.16em] text-muted-foreground">{p.name}</p>
              <p className="mt-2 text-3xl font-semibold tracking-tight">
                {loc.currency === "NZD" ? `NZ$${p.priceNZD}` : `US$${p.priceUSD}`}
              </p>
              <p className="text-xs text-muted-foreground">/month</p>
              <p className="mt-3 text-sm text-foreground/85">{p.tagline}</p>
              <Button asChild variant="outline" size="sm" className="mt-4 w-full">
                <Link href={`/signup?plan=${p.id}`}>Start with {p.name}</Link>
              </Button>
            </GlassPanel>
          ))}
        </div>
      </section>

      <section className="mt-20">
        <h2 className="text-3xl font-semibold tracking-tight">{loc.name} FAQ</h2>
        <div className="mt-6 space-y-3">
          {loc.faq.map((f) => (
            <GlassPanel key={f.q}>
              <p className="text-base font-medium text-foreground">{f.q}</p>
              <p className="mt-2 text-sm text-muted-foreground">{f.a}</p>
            </GlassPanel>
          ))}
        </div>
      </section>
    </PageShell>
  );
}
