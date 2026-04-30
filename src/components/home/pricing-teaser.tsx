import Link from "next/link";
import { Check, ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { SectionHeading } from "@/components/visuals/section-heading";
import { PLANS, PLAN_GUARANTEE } from "@/lib/plans";
import { cn } from "@/lib/utils";

export function PricingTeaser() {
  return (
    <section id="pricing" className="relative py-24">
      <div className="container-tight">
        <SectionHeading
          eyebrow="Pricing"
          title={<>Pick a plan that grows with your phone line.</>}
          description="Transparent pricing in NZD. No contracts. No setup fees. Cancel anytime, money-back inside 7 days."
        />
        <div className="mt-14 grid grid-cols-1 gap-5 lg:grid-cols-4">
          {PLANS.map((plan) => (
            <div
              key={plan.id}
              className={cn(
                "relative flex flex-col rounded-3xl border bg-card/50 p-7 transition-all hover:border-foreground/30",
                plan.popular
                  ? "border-primary/50 bg-card/80 shadow-[0_0_64px_-24px_hsl(var(--primary)/0.55)]"
                  : "border-border",
              )}
            >
              {plan.popular && (
                <Badge variant="glow" className="absolute -top-3 left-7">
                  <Sparkles className="mr-1 h-3 w-3" />
                  Most popular
                </Badge>
              )}
              <div>
                <p className="text-sm uppercase tracking-[0.16em] text-muted-foreground">{plan.name}</p>
                <p className="mt-1 text-sm text-foreground/70">{plan.tagline}</p>
              </div>
              <div className="mt-5 flex items-baseline gap-1.5">
                <span className="text-4xl font-semibold tracking-tight text-foreground">NZ${plan.priceNZD}</span>
                <span className="text-sm text-muted-foreground">/month</span>
              </div>
              <p className="mt-1 text-xs text-muted-foreground">USD ${plan.priceUSD} · ex GST</p>
              <ul className="mt-6 flex-1 space-y-2.5 text-sm">
                {plan.features.slice(0, 6).map((f) => (
                  <li key={f} className="flex items-start gap-2.5 text-foreground/85">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                    {f}
                  </li>
                ))}
              </ul>
              <Button
                asChild
                variant={plan.popular ? "default" : "outline"}
                className="mt-7 w-full"
              >
                <Link href={`/signup?plan=${plan.id}`}>
                  Choose {plan.name}
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>
          ))}
        </div>
        <p className="mt-8 text-center text-xs text-muted-foreground">{PLAN_GUARANTEE}</p>
        <div className="mt-6 flex justify-center">
          <Button asChild variant="ghost" size="sm">
            <Link href="/pricing">
              Compare every feature
              <ArrowRight className="ml-1 h-3.5 w-3.5" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
