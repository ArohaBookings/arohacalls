"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, CalendarCheck2, MailCheck, MessageSquareReply, PhoneIncoming, Route, Search, Sparkles, TimerReset } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const plays = [
  {
    id: "seo",
    icon: Search,
    label: "Google lead",
    pain: "You paid to rank or advertise. Then the caller reaches voicemail.",
    promise: "Aroha answers the high-intent moment, captures the job, and moves the lead before they call the next result.",
    steps: ["Caller intent detected", "Service + suburb captured", "Booking or quote path chosen", "Owner gets summary"],
    accent: "from-primary/20 via-cyan-400/10 to-transparent",
  },
  {
    id: "after-hours",
    icon: TimerReset,
    label: "After hours",
    pain: "People search after work, after dinner, and on weekends. Your team is not sitting by the phone.",
    promise: "Aroha keeps the front desk open 24/7 while still following your opening hours, urgency rules, and escalation policy.",
    steps: ["Answers instantly", "Checks urgency", "Books or takes details", "Queues next-day follow-up"],
    accent: "from-secondary/20 via-primary/10 to-transparent",
  },
  {
    id: "admin",
    icon: MailCheck,
    label: "Admin drag",
    pain: "The call is done, but the quote, email, reminder, and notes still need to happen.",
    promise: "Aroha turns the conversation into a CRM record, email draft, message follow-up, and clear next action.",
    steps: ["Transcript saved", "Email draft prepared", "SMS reminder queued", "CRM timeline updated"],
    accent: "from-accent/20 via-secondary/10 to-transparent",
  },
  {
    id: "handover",
    icon: Route,
    label: "Urgent jobs",
    pain: "Not every call should be booked normally. Some need a human now.",
    promise: "VIP, emergency, and high-value callers can be routed to the right mobile instead of getting buried.",
    steps: ["Caller classified", "Rule checked", "Live transfer attempted", "Fallback summary sent"],
    accent: "from-rose-400/20 via-primary/10 to-transparent",
  },
] as const;

const niches = ["salons", "clinics", "tradies", "real estate", "gyms", "auto", "vets", "cafes"];

export function ClosingEngine() {
  const [active, setActive] = useState<(typeof plays)[number]["id"]>("seo");
  const play = plays.find((item) => item.id === active) ?? plays[0];
  const Icon = play.icon;

  return (
    <section className="relative py-24">
      <div className="container-tight">
        <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
          <div>
            <Badge variant="glow">Built to close the call, not just answer it</Badge>
            <h2 className="mt-5 text-balance text-3xl font-semibold tracking-tight text-foreground sm:text-5xl">
              The website gets attention. Aroha turns that attention into a handled lead.
            </h2>
            <p className="mt-5 max-w-xl text-base leading-7 text-muted-foreground">
              The strongest pitch is simple: your marketing already creates demand. Aroha makes sure the moment does not die at ringing, voicemail, slow follow-up, or forgotten admin.
            </p>
            <div className="mt-7 flex flex-wrap gap-2">
              {niches.map((niche) => (
                <span key={niche} className="rounded-full border border-border bg-card/45 px-3 py-1 text-xs text-muted-foreground">
                  {niche}
                </span>
              ))}
            </div>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button asChild size="lg" className="group">
                <Link href="/demo">
                  Build my closing workflow
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <a href="tel:+6436672033">Hear Grace from Aroha</a>
              </Button>
            </div>
          </div>

          <div className="overflow-hidden rounded-[2rem] border border-white/10 bg-[#0b111d] shadow-[0_26px_110px_rgba(0,0,0,0.48)]">
            <div className={cn("border-b border-white/10 bg-gradient-to-br p-4", play.accent)}>
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                {plays.map((item) => {
                  const ItemIcon = item.icon;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setActive(item.id)}
                      className={cn(
                        "rounded-2xl border p-3 text-left transition",
                        active === item.id
                          ? "border-primary/50 bg-primary/15 text-primary"
                          : "border-white/10 bg-white/[0.04] text-muted-foreground hover:text-foreground",
                      )}
                    >
                      <ItemIcon className="h-4 w-4" />
                      <span className="mt-2 block text-xs font-medium">{item.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="grid gap-0 lg:grid-cols-[0.9fr_1.1fr]">
              <div className="border-b border-white/10 p-6 lg:border-b-0 lg:border-r">
                <span className="grid h-12 w-12 place-items-center rounded-2xl border border-primary/30 bg-primary/10 text-primary">
                  <Icon className="h-5 w-5" />
                </span>
                <p className="mt-5 text-xs font-semibold uppercase tracking-[0.18em] text-destructive">Pain</p>
                <h3 className="mt-2 text-2xl font-semibold tracking-tight text-foreground">{play.pain}</h3>
                <p className="mt-5 text-xs font-semibold uppercase tracking-[0.18em] text-primary">Aroha fix</p>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">{play.promise}</p>
              </div>

              <div className="p-6">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">Live handling path</p>
                <div className="mt-5 space-y-3">
                  {play.steps.map((step, index) => (
                    <div key={step} className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.04] p-4">
                      <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-primary/15 text-sm font-semibold text-primary">
                        {index + 1}
                      </span>
                      <span className="text-sm text-foreground/90">{step}</span>
                    </div>
                  ))}
                </div>
                <div className="mt-5 grid grid-cols-3 gap-3">
                  {[
                    { icon: PhoneIncoming, label: "Answered" },
                    { icon: CalendarCheck2, label: "Booked" },
                    { icon: MessageSquareReply, label: "Followed up" },
                  ].map((item) => {
                    const ItemIcon = item.icon;
                    return (
                      <div key={item.label} className="rounded-2xl border border-white/10 bg-white/[0.04] p-3 text-center">
                        <ItemIcon className="mx-auto h-4 w-4 text-primary" />
                        <p className="mt-2 text-[11px] text-muted-foreground">{item.label}</p>
                      </div>
                    );
                  })}
                </div>
                <div className="mt-5 rounded-2xl border border-accent/25 bg-accent/[0.08] p-4">
                  <Sparkles className="h-4 w-4 text-accent" />
                  <p className="mt-2 text-sm leading-6 text-foreground/88">
                    Real promise: Aroha answers, qualifies, books or routes, remembers, and follows up under the rules Leo sets for the business.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
