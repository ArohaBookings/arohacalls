import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { PageHero, SectionBand, GlassPanel } from "@/components/marketing/page-shell";
import { comparePages } from "@/lib/marketing-data";

export const metadata: Metadata = {
  title: "Compare",
  description: "Compare Aroha Calls with hiring a receptionist, Goodcall, My AI Front Desk, and Rosie AI.",
  alternates: { canonical: "/compare" },
};

export default function CompareIndexPage() {
  return (
    <>
      <PageHero
        title={<>Compare Aroha Calls against the common alternatives.</>}
        description="Use these pages to understand where a managed AI receptionist package fits compared with hiring, call-answering-only tools, and self-serve receptionist platforms."
        cta={{ href: "/pricing", label: "View plans" }}
      />
      <SectionBand>
        <div className="container-tight grid gap-5 md:grid-cols-2">
          {Object.entries(comparePages).map(([slug, page]) => (
            <Link key={slug} href={`/compare/${slug}`} className="block">
              <GlassPanel className="h-full transition-colors hover:border-primary/50">
                <h2 className="text-2xl font-semibold tracking-tight">{page.title}</h2>
                <p className="mt-3 text-sm leading-6 text-muted-foreground">{page.intro}</p>
                <div className="mt-5 inline-flex items-center gap-2 text-sm font-medium text-primary">
                  Read comparison <ArrowRight className="h-4 w-4" />
                </div>
              </GlassPanel>
            </Link>
          ))}
        </div>
      </SectionBand>
    </>
  );
}
