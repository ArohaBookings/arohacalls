import { Check, Minus } from "lucide-react";
import { FEATURE_MATRIX, PLANS } from "@/lib/plans";
import { cn } from "@/lib/utils";

function Cell({ value, highlight }: { value: string | true; highlight?: boolean }) {
  if (value === true) {
    return (
      <span className={cn("inline-flex h-6 w-6 items-center justify-center rounded-full", highlight ? "bg-primary/20 text-primary" : "bg-foreground/8 text-foreground/80")}>
        <Check className="h-3.5 w-3.5" strokeWidth={3} />
      </span>
    );
  }
  if (value === "—" || value === "-") {
    return <Minus className="h-4 w-4 text-muted-foreground/40" />;
  }
  return (
    <span className={cn("text-xs font-medium", highlight ? "text-primary" : "text-foreground/85")}>{value}</span>
  );
}

export function FeatureMatrix() {
  return (
    <div className="overflow-hidden rounded-3xl border border-border bg-card/40">
      {/* Header row */}
      <div className="sticky top-0 z-10 grid grid-cols-[minmax(220px,1.6fr)_repeat(4,minmax(110px,1fr))] gap-2 border-b border-border bg-card/85 px-4 py-4 backdrop-blur-md sm:gap-4 sm:px-6">
        <div className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">Compare every feature</div>
        {PLANS.map((plan) => (
          <div key={plan.id} className="text-center">
            <div className={cn("text-sm font-bold tracking-tight", plan.popular ? "text-primary" : "text-foreground")}>{plan.name}</div>
            <div className="mt-0.5 text-[11px] text-muted-foreground">NZ${plan.priceNZD}/mo</div>
            {plan.popular && <div className="mt-1 inline-block rounded-full bg-primary/15 px-2 py-0.5 text-[9px] font-semibold uppercase tracking-wider text-primary">Most popular</div>}
          </div>
        ))}
      </div>

      {/* Groups */}
      <div className="divide-y divide-border">
        {FEATURE_MATRIX.map((group) => (
          <div key={group.group}>
            <div className="bg-card/60 px-4 py-3 text-[11px] font-semibold uppercase tracking-[0.2em] text-muted-foreground sm:px-6">{group.group}</div>
            <div className="divide-y divide-border/50">
              {group.rows.map((row) => (
                <div key={row.feature} className="grid grid-cols-[minmax(220px,1.6fr)_repeat(4,minmax(110px,1fr))] items-center gap-2 px-4 py-3 text-sm sm:gap-4 sm:px-6">
                  <div className="text-foreground/85">{row.feature}</div>
                  <div className="flex items-center justify-center"><Cell value={row.lite} /></div>
                  <div className="flex items-center justify-center"><Cell value={row.essentials} /></div>
                  <div className="flex items-center justify-center"><Cell value={row.professional} highlight /></div>
                  <div className="flex items-center justify-center"><Cell value={row.premium} /></div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
