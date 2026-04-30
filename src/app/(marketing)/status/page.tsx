import type { Metadata } from "next";
import { format } from "date-fns";
import { Activity } from "lucide-react";
import { PageHero, SectionBand, GlassPanel } from "@/components/marketing/page-shell";
import { statusServices } from "@/lib/marketing-data";

export const metadata: Metadata = {
  title: { absolute: "Status - Aroha Group" },
  description: "Live uptime status for Aroha Group Voice AI, Email AI, Messages AI, Calendar Sync, CRM, and Billing.",
  alternates: { canonical: "/status" },
};

const styles = {
  operational: "bg-primary text-primary-foreground",
  degraded: "bg-yellow-400 text-black",
  outage: "bg-destructive text-destructive-foreground",
};

export default function StatusPage() {
  const updated = format(new Date(), "PPpp");
  return (
    <>
      <PageHero
        title={<>Everything is working across Aroha Group.</>}
        description="Simple green, yellow, and red indicators for the systems that power Aroha Calls and Aroha AI: voice, email, messages, calendars, CRM, and billing."
      />
      <SectionBand>
        <div className="container-tight">
          <GlassPanel className="mb-5 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <Activity className="h-5 w-5 text-primary" />
              <div>
                <p className="font-medium">All core systems operational</p>
                <p className="text-sm text-muted-foreground">Last updated {updated}</p>
              </div>
            </div>
          </GlassPanel>
          <div className="grid gap-4 md:grid-cols-2">
            {statusServices.map((service) => (
              <GlassPanel key={service.id} className="flex items-start justify-between gap-4">
                <div>
                  <h2 className="text-xl font-semibold tracking-tight">{service.name}</h2>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">{service.description}</p>
                </div>
                <span className={`rounded-full px-3 py-1 text-xs font-medium ${styles[service.status]}`}>
                  {service.status}
                </span>
              </GlassPanel>
            ))}
          </div>
        </div>
      </SectionBand>
    </>
  );
}
