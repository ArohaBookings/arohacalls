import type { Metadata } from "next";
import { format } from "date-fns";
import { Activity, AlertTriangle, CheckCircle2, XCircle } from "lucide-react";
import { PageHero, SectionBand, GlassPanel } from "@/components/marketing/page-shell";
import { statusServices as defaultStatusServices } from "@/lib/marketing-data";
import { db } from "@/lib/db";
import { statusServices as statusServicesTable } from "@/lib/db/schema";
import { queryOrEmpty } from "@/lib/safe-db";

export const metadata: Metadata = {
  title: { absolute: "Status - Aroha Group" },
  description: "Live uptime status for Aroha Group AI receptionist, Aroha AI, Aroha numbers, Aroha Bookings, Google API, Aurora, Email AI, and Billing.",
  alternates: { canonical: "/status" },
};

const styles = {
  operational: "border-emerald-200 bg-emerald-50 text-emerald-700",
  degraded: "border-amber-200 bg-amber-50 text-amber-700",
  outage: "border-rose-200 bg-rose-50 text-rose-700",
};

const icons = {
  operational: CheckCircle2,
  degraded: AlertTriangle,
  outage: XCircle,
};

function statusLabel(status: string) {
  if (status === "outage") return "Down";
  if (status === "degraded") return "Degraded";
  return "Operational";
}

export default async function StatusPage() {
  const adminRows = await queryOrEmpty(db.select().from(statusServicesTable), "public-status-services");
  const rows = defaultStatusServices.map((service) => {
    const managed = adminRows.find((row) => row.id === service.id);
    return {
      ...service,
      status: managed?.status ?? service.status,
      description: managed?.description ?? service.description,
      updatedAt: managed?.updatedAt ?? null,
    };
  });
  const worstStatus = rows.some((service) => service.status === "outage")
    ? "outage"
    : rows.some((service) => service.status === "degraded")
      ? "degraded"
      : "operational";
  const updatedAt = rows
    .map((service) => service.updatedAt)
    .filter(Boolean)
    .sort((a, b) => Number(b) - Number(a))[0] ?? new Date();
  const updated = format(updatedAt, "PPpp");

  return (
    <>
      <PageHero
        title={<>{worstStatus === "operational" ? "Everything is working across Aroha Group." : "Aroha Group system status."}</>}
        description="Green, yellow, and red indicators for the systems that power Aroha Calls and Aroha AI: receptionist calls, numbers, bookings, Google API, Aurora, email, and billing."
      />
      <SectionBand>
        <div className="container-tight">
          <GlassPanel className="mb-5 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <Activity className="h-5 w-5 text-primary" />
              <div>
                <p className="font-medium">
                  {worstStatus === "operational" ? "All core systems operational" : `Current state: ${statusLabel(worstStatus)}`}
                </p>
                <p className="text-sm text-muted-foreground">Last updated {updated}</p>
              </div>
            </div>
          </GlassPanel>
          <div className="grid gap-4 md:grid-cols-2">
            {rows.map((service) => {
              const Icon = icons[service.status as keyof typeof icons] ?? CheckCircle2;
              return (
              <GlassPanel key={service.id} className="flex items-start justify-between gap-4">
                <div className="flex gap-3">
                  <Icon className={`mt-1 h-5 w-5 ${service.status === "outage" ? "text-rose-600" : service.status === "degraded" ? "text-amber-600" : "text-emerald-600"}`} />
                  <div>
                    <h2 className="text-xl font-semibold tracking-tight">{service.name}</h2>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">{service.description}</p>
                    {service.updatedAt ? (
                      <p className="mt-3 text-xs text-muted-foreground">Updated {format(service.updatedAt, "PPp")}</p>
                    ) : null}
                  </div>
                </div>
                <span className={`rounded-full border px-3 py-1 text-xs font-medium ${styles[service.status as keyof typeof styles] ?? styles.operational}`}>
                  {statusLabel(service.status)}
                </span>
              </GlassPanel>
              );
            })}
          </div>
        </div>
      </SectionBand>
    </>
  );
}
