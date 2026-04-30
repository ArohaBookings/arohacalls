import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { GlassPanel, PageShell } from "@/components/marketing/page-shell";
import { INDUSTRIES } from "@/lib/industries";
import { siteConfig } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "AI Receptionist by Industry — Aroha Calls",
  description:
    "AI receptionist tuned for your industry. Salons, tradies, clinics, real estate, gyms, auto, vets, cafés. Live in 24 hours.",
  alternates: { canonical: `${siteConfig.url}/for` },
};

export default function IndustriesIndex() {
  return (
    <PageShell
      eyebrow="By industry"
      title="An AI receptionist tuned for your industry."
      description="Aroha is configured differently for tradies than for salons. Pick yours and see exactly how Aroha will work in your business."
    >
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {INDUSTRIES.map((i) => (
          <Link
            key={i.slug}
            href={`/for/${i.slug}`}
            className="group block"
          >
            <GlassPanel className="transition-all hover:border-primary/40 hover:shadow-[0_0_64px_-32px_hsl(var(--primary)/0.45)]">
              <span className="text-3xl">{i.emoji}</span>
              <h2 className="mt-3 text-lg font-semibold tracking-tight">{i.name}</h2>
              <p className="mt-2 text-sm text-muted-foreground">{i.hero.subtitle}</p>
              <span className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-primary opacity-0 transition group-hover:opacity-100">
                Open {i.name} page
                <ArrowRight className="h-3.5 w-3.5" />
              </span>
            </GlassPanel>
          </Link>
        ))}
      </div>
    </PageShell>
  );
}
