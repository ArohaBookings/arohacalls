import Link from "next/link";
import { ArrowRight, Hammer, MapPin, PhoneCall, Route } from "lucide-react";
import { Button } from "@/components/ui/button";

const moments = [
  { label: "Under a sink", detail: "Aroha captures the issue, suburb, urgency, and callback details.", icon: Hammer },
  { label: "On a roof", detail: "The customer gets a calm answer instead of voicemail.", icon: PhoneCall },
  { label: "Between jobs", detail: "Aroha books the next step before they ring someone else.", icon: Route },
];

export function TradieSpotlight() {
  return (
    <section className="relative overflow-hidden bg-background py-16 sm:py-20">
      <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-primary/10 via-secondary/5 to-transparent" aria-hidden="true" />
      <div className="container-tight relative">
        <div className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-[linear-gradient(135deg,rgba(0,210,161,0.12),rgba(179,136,255,0.08)_48%,rgba(255,141,180,0.08))] p-6 shadow-[0_28px_120px_rgba(0,0,0,0.35)] sm:p-8 lg:p-10">
          <div className="absolute inset-0 bg-grid opacity-20" aria-hidden="true" />
          <div className="relative grid gap-8 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-primary">
                <MapPin className="h-3.5 w-3.5" />
                Built for service calls
              </div>
              <h2 className="mt-5 text-balance text-4xl font-semibold tracking-tight sm:text-5xl">
                For tradies on the tools
              </h2>
              <p className="mt-5 max-w-2xl text-pretty text-lg leading-8 text-foreground/82">
                When you&apos;re under a sink, on a roof, or driving between jobs, Aroha answers before the customer rings someone else.
              </p>
              <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                <Button asChild size="lg" className="group">
                  <Link href="/for/tradies">
                    See tradie setup
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                  </Link>
                </Button>
                <Button asChild size="lg" variant="outline">
                  <a href="tel:+6436672033">
                    <PhoneCall className="h-4 w-4" />
                    Call the AI now
                  </a>
                </Button>
              </div>
            </div>

            <div className="grid gap-3">
              {moments.map((moment, index) => {
                const Icon = moment.icon;
                return (
                  <div key={moment.label} className="flex items-start gap-4 rounded-2xl border border-white/10 bg-black/24 p-4 backdrop-blur">
                    <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl border border-primary/25 bg-primary/10 text-primary">
                      <Icon className="h-5 w-5" />
                    </span>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-semibold text-primary">0{index + 1}</span>
                        <h3 className="font-semibold tracking-tight">{moment.label}</h3>
                      </div>
                      <p className="mt-1 text-sm leading-6 text-muted-foreground">{moment.detail}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
