import type { Metadata } from "next";
import { CheckCircle2, Clock, Sparkles } from "lucide-react";
import { PageHero, SectionBand, GlassPanel } from "@/components/marketing/page-shell";
import { Badge } from "@/components/ui/badge";
import { roadmap } from "@/lib/marketing-data";

export const metadata: Metadata = {
  title: "Roadmap",
  description: "Public roadmap for Aroha Calls and the managed Aroha AI service layer.",
  alternates: { canonical: "/roadmap" },
};

const columns = [
  { title: "Live Now", items: roadmap.live, icon: CheckCircle2, badge: "Live" },
  { title: "Coming Soon", items: roadmap.soon, icon: Clock, badge: "Soon" },
  { title: "Planned", items: roadmap.planned, icon: Sparkles, badge: "Planned" },
];

export default function RoadmapPage() {
  return (
    <>
      <PageHero
        title={<>Public roadmap.</>}
        description="A transparent view of what is live, what is coming soon, and what is planned for Aroha Calls as the managed service grows."
      />
      <SectionBand>
        <div className="container-tight grid gap-5 lg:grid-cols-3">
          {columns.map((column) => {
            const Icon = column.icon;
            return (
              <GlassPanel key={column.title}>
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <Icon className="h-5 w-5 text-primary" />
                    <h2 className="text-2xl font-semibold tracking-tight">{column.title}</h2>
                  </div>
                  <Badge variant="outline">{column.badge}</Badge>
                </div>
                <ul className="mt-6 space-y-3">
                  {column.items.map((item) => (
                    <li key={item} className="rounded-2xl border border-border bg-card/60 p-4 text-sm text-foreground/85">
                      {item}
                    </li>
                  ))}
                </ul>
              </GlassPanel>
            );
          })}
        </div>
      </SectionBand>
    </>
  );
}
