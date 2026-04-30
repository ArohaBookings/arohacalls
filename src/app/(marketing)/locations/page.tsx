import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { GlassPanel, PageShell } from "@/components/marketing/page-shell";
import { LOCATIONS } from "@/lib/locations";
import { siteConfig } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "AI Receptionist by Location — Aroha Calls",
  description:
    "AI receptionist coverage across NZ and the US. Auckland, Wellington, Christchurch, Los Angeles and growing. From NZ$99/month.",
  alternates: { canonical: `${siteConfig.url}/locations` },
};

export default function LocationsIndex() {
  return (
    <PageShell
      eyebrow="By location"
      title="Aroha is live across two countries — and counting."
      description="Local numbers, local pricing, local support. Pick your city and see how Aroha works in your patch."
    >
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {LOCATIONS.map((l) => (
          <Link key={l.slug} href={`/locations/${l.slug}`} className="group block">
            <GlassPanel className="transition-all hover:border-primary/40">
              <div className="flex items-center gap-2">
                <span className="text-2xl">{l.flag}</span>
                <h2 className="text-lg font-semibold tracking-tight">{l.name}</h2>
              </div>
              <p className="mt-3 text-sm text-muted-foreground">{l.hero.subtitle}</p>
              <span className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-primary opacity-0 transition group-hover:opacity-100">
                Open {l.name}
                <ArrowRight className="h-3.5 w-3.5" />
              </span>
            </GlassPanel>
          </Link>
        ))}
      </div>
    </PageShell>
  );
}
