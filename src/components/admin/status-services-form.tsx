"use client";

import { useState, useTransition } from "react";
import { Loader2, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

type StatusServiceRow = {
  id: string;
  name: string;
  status: string;
  description?: string | null;
};

type StatusServiceFormRow = {
  id: string;
  name: string;
  status: string;
  description: string;
};

const statusOptions = [
  { value: "operational", label: "Operational" },
  { value: "degraded", label: "Degraded" },
  { value: "outage", label: "Down" },
];

export function StatusServicesForm({ services }: { services: StatusServiceRow[] }) {
  const [rows, setRows] = useState(
    services.map((service) => ({
      ...service,
      status: ["operational", "degraded", "outage"].includes(service.status) ? service.status : "operational",
      description: service.description ?? "",
    })),
  );
  const [isPending, startTransition] = useTransition();
  const [message, setMessage] = useState<string | null>(null);

  function updateRow(id: string, patch: Partial<StatusServiceFormRow>) {
    setRows((current) => current.map((row) => (row.id === id ? { ...row, ...patch } : row)));
  }

  function save() {
    setMessage(null);
    startTransition(async () => {
      const res = await fetch("/api/admin/status", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ services: rows }),
      });
      setMessage(res.ok ? "Status page updated." : "Could not update status page.");
    });
  }

  return (
    <div className="space-y-4">
      <div className="grid gap-3">
        {rows.map((service) => (
          <div key={service.id} className="rounded-2xl border border-border bg-white p-4 shadow-sm">
            <div className="grid gap-3 md:grid-cols-[1fr_180px] md:items-start">
              <div>
                <p className="font-medium">{service.name}</p>
                <p className="mt-1 text-xs text-muted-foreground">{service.id}</p>
              </div>
              <div className="space-y-2">
                <Label>Status</Label>
                <Select value={service.status} onValueChange={(status) => updateRow(service.id, { status })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {statusOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="mt-3 space-y-2">
              <Label htmlFor={`status-${service.id}`}>Public note / reason</Label>
              <Textarea
                id={`status-${service.id}`}
                value={service.description ?? ""}
                onChange={(event) => updateRow(service.id, { description: event.target.value })}
                className="min-h-20"
                placeholder="What is working, degraded, or down? Add a clear customer-safe update."
              />
            </div>
          </div>
        ))}
      </div>
      <div className="flex items-center gap-3">
        <Button type="button" onClick={save} disabled={isPending}>
          {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          Save status page
        </Button>
        {message ? <p className="text-sm text-muted-foreground">{message}</p> : null}
      </div>
    </div>
  );
}
