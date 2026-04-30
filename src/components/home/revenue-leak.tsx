import { ArrowRight, CheckCircle2, PhoneMissed, Search, TimerReset } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const leakSteps = [
  {
    icon: Search,
    title: "They find you",
    body: "Google, ads, referrals, old customers. The hard part already happened.",
  },
  {
    icon: PhoneMissed,
    title: "Then the phone rings out",
    body: "No answer means no trust. The caller does not wait around to admire your website.",
  },
  {
    icon: TimerReset,
    title: "They call the next option",
    body: "The lead you paid to earn becomes someone else's booking in under a minute.",
  },
  {
    icon: CheckCircle2,
    title: "Aroha catches it",
    body: "Every call gets answered, qualified, booked, summarised, and followed up.",
  },
] as const;

export function RevenueLeak() {
  return (
    <section className="relative border-y border-border/60 bg-card/20 py-20">
      <div className="container-tight">
        <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary">The real leak</p>
            <h2 className="mt-4 text-balance text-3xl font-semibold tracking-tight text-foreground sm:text-5xl">
              You do not need more leads if the ones calling now are being missed.
            </h2>
            <p className="mt-5 max-w-xl text-pretty text-base leading-7 text-muted-foreground sm:text-lg">
              Most owners spend money getting attention, then lose the customer at the exact moment they are
              ready to talk. Aroha Calls fixes that handoff: phone to booking, email to reply, enquiry to CRM,
              follow-up to customer.
            </p>
            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <Button asChild size="lg">
                <Link href="/demo">
                  See your missed-call fix
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link href="/pricing">Start from NZ$99/mo</Link>
              </Button>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            {leakSteps.map((step, index) => {
              const Icon = step.icon;
              return (
                <div
                  key={step.title}
                  className="relative overflow-hidden rounded-2xl border border-white/10 bg-background/70 p-5"
                >
                  <div className="flex items-center justify-between gap-4">
                    <span className="grid h-11 w-11 place-items-center rounded-xl border border-border bg-card text-primary">
                      <Icon className="h-5 w-5" />
                    </span>
                    <span className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                      0{index + 1}
                    </span>
                  </div>
                  <h3 className="mt-5 text-xl font-semibold tracking-tight text-foreground">{step.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">{step.body}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
