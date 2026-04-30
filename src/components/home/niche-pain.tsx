"use client";

import { useState } from "react";
import { ArrowRight, BriefcaseBusiness, Car, Dumbbell, Home, Scissors, Stethoscope, Utensils } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const niches = [
  {
    id: "tradies",
    label: "Tradies",
    icon: BriefcaseBusiness,
    pain: "You are on the tools. The best jobs call while your hands are full.",
    fix: "Aroha qualifies urgency, suburb, job type, and books the callback or appointment before they ring another tradie.",
  },
  {
    id: "salons",
    label: "Salons",
    icon: Scissors,
    pain: "You cannot leave a client mid-cut just because the phone rings.",
    fix: "Aroha answers, checks availability, books appointments, and sends reminders so the chair stays full.",
  },
  {
    id: "clinics",
    label: "Clinics",
    icon: Stethoscope,
    pain: "Reception gets slammed and new patients wait too long.",
    fix: "Aroha triages common requests, captures details, routes urgent calls, and keeps booking rules clean.",
  },
  {
    id: "restaurants",
    label: "Restaurants",
    icon: Utensils,
    pain: "Peak-hour calls hit right when the team is already under pressure.",
    fix: "Aroha handles bookings, hours, availability, and simple questions without pulling staff off service.",
  },
  {
    id: "real-estate",
    label: "Real estate",
    icon: Home,
    pain: "High-intent buyers call once, then move to the next listing.",
    fix: "Aroha qualifies the lead, captures buyer context, books viewing times, and logs it to the CRM.",
  },
  {
    id: "auto",
    label: "Auto shops",
    icon: Car,
    pain: "Quote calls arrive while the workshop is loud and busy.",
    fix: "Aroha captures vehicle, issue, preferred time, quote notes, and follow-up before the job goes cold.",
  },
  {
    id: "gyms",
    label: "Gyms & physios",
    icon: Dumbbell,
    pain: "Calls land while you are coaching, treating, or running a session.",
    fix: "Aroha books consults, handles reschedules, sends reminders, and remembers every returning client.",
  },
] as const;

export function NichePain() {
  const [active, setActive] = useState<(typeof niches)[number]["id"]>("tradies");
  const niche = niches.find((item) => item.id === active) ?? niches[0];
  const Icon = niche.icon;

  return (
    <section className="relative py-24">
      <div className="container-tight">
        <div className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:items-center">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary">Pain by niche</p>
            <h2 className="mt-4 text-balance text-3xl font-semibold tracking-tight text-foreground sm:text-5xl">
              Every industry loses calls for a different reason. Aroha closes the same gap.
            </h2>
            <p className="mt-5 text-base leading-7 text-muted-foreground">
              The call is already high intent. The product just needs to meet the caller before their patience runs out.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
            {niches.map((item) => {
              const ItemIcon = item.icon;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setActive(item.id)}
                  className={cn(
                    "rounded-2xl border p-4 text-left transition",
                    active === item.id
                      ? "border-primary/50 bg-primary/12 text-primary"
                      : "border-border bg-card/45 text-muted-foreground hover:text-foreground",
                  )}
                >
                  <ItemIcon className="h-5 w-5" />
                  <span className="mt-3 block text-sm font-medium">{item.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="mt-8 grid gap-5 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="rounded-[1.75rem] border border-destructive/25 bg-destructive/[0.06] p-7">
            <div className="flex items-center gap-3">
              <span className="grid h-12 w-12 place-items-center rounded-2xl border border-destructive/25 bg-destructive/10 text-destructive">
                <Icon className="h-5 w-5" />
              </span>
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-destructive">Without Aroha</p>
                <h3 className="text-xl font-semibold tracking-tight text-foreground">{niche.label}</h3>
              </div>
            </div>
            <p className="mt-6 text-2xl font-semibold leading-tight tracking-tight text-foreground">
              {niche.pain}
            </p>
          </div>
          <div className="rounded-[1.75rem] border border-primary/30 bg-primary/[0.08] p-7">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">With Aroha Calls</p>
            <p className="mt-5 text-2xl font-semibold leading-tight tracking-tight text-foreground">
              {niche.fix}
            </p>
            <div className="mt-7">
              <Button asChild>
                <Link href="/demo">
                  Build my niche demo
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
