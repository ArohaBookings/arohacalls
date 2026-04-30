import Link from "next/link";
import { Check, Sparkles, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { SoftwareBox } from "@/components/visuals/software-box";
import type { Plan } from "@/lib/plans";
import { cn } from "@/lib/utils";

export function PlanCard({ plan, currency = "NZD" }: { plan: Plan; currency?: "NZD" | "USD" }) {
  const price = currency === "NZD" ? plan.priceNZD : plan.priceUSD;
  const symbol = currency === "NZD" ? "NZ$" : "US$";
  return (
    <div
      className={cn(
        "relative flex flex-col overflow-hidden rounded-3xl border bg-card/55 transition-all hover:border-foreground/30",
        plan.popular
          ? "border-primary/50 shadow-[0_0_64px_-24px_hsl(var(--primary)/0.55)]"
          : "border-border",
      )}
    >
      {plan.popular && (
        <div className="absolute right-5 top-5 z-10">
          <Badge variant="glow"><Sparkles className="mr-1 h-3 w-3" /> Most popular</Badge>
        </div>
      )}

      {/* Software box mockup at the top */}
      <div
        className="relative flex items-end justify-center overflow-hidden border-b border-border/60 px-6 pb-2 pt-10"
        style={{
          background: `radial-gradient(ellipse at center, ${plan.theme.gradient[0]}24 0%, transparent 70%), hsl(var(--card))`,
          minHeight: "240px",
        }}
      >
        <SoftwareBox plan={plan} size="sm" />
      </div>

      <div className="flex flex-1 flex-col p-7">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">{plan.theme.shortCode}</p>
          <h3 className="mt-1 text-2xl font-bold tracking-tight">{plan.name}</h3>
          <p className="mt-1 text-sm text-foreground/70">{plan.tagline}</p>
        </div>

        <div className="mt-6 flex items-baseline gap-1.5">
          <span className="text-4xl font-bold tracking-tight">{symbol}{price}</span>
          <span className="text-sm text-muted-foreground">/month</span>
        </div>
        <p className="mt-1 text-xs text-muted-foreground">
          {currency === "NZD" ? `USD $${plan.priceUSD}` : `NZ$${plan.priceNZD}`} · ex GST
        </p>

        <ul className="mt-6 flex-1 space-y-2.5 text-sm">
          {plan.features.slice(0, 7).map((f) => (
            <li key={f} className="flex items-start gap-2.5 text-foreground/85">
              <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
              <span>{f}</span>
            </li>
          ))}
          {plan.features.length > 7 && (
            <li className="text-xs text-muted-foreground">+ {plan.features.length - 7} more features</li>
          )}
        </ul>

        <div className="mt-7 grid gap-2">
          <Button asChild variant={plan.popular ? "default" : "outline"}>
            <Link href={`/signup?plan=${plan.id}`}>
              Choose {plan.name}
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
          <Button asChild variant="ghost" size="sm">
            <Link href={`/pricing/${plan.slug}`}>See full {plan.name} package</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
