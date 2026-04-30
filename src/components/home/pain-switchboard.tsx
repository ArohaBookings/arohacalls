"use client";

import { useState } from "react";
import {
  ArrowRight,
  CalendarClock,
  ClipboardCheck,
  MailCheck,
  MessageSquareReply,
  PhoneIncoming,
  ShieldAlert,
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const pains = [
  {
    id: "google",
    label: "Google leads",
    icon: PhoneIncoming,
    pain: "You paid for the click, review, referral, or ranking. Then the phone rings while nobody can answer.",
    fix: "Aroha answers immediately, captures the job type, suburb, urgency, and contact details, then books or routes the lead.",
    proof: ["Instant call pickup", "Caller summary", "Owner notification"],
    color: "from-primary/20 to-primary/5",
  },
  {
    id: "after-hours",
    label: "After hours",
    icon: CalendarClock,
    pain: "Good customers call after work. If they hit voicemail, they compare options while you sleep.",
    fix: "Aroha handles after-hours calls, follows your emergency rules, books what it can, and escalates only what matters.",
    proof: ["Opening-hour rules", "Urgent routing", "Next-day follow-up"],
    color: "from-secondary/20 to-secondary/5",
  },
  {
    id: "email",
    label: "Inbox backlog",
    icon: MailCheck,
    pain: "Quote requests sit in the inbox because the team is busy doing the actual work.",
    fix: "Email AI drafts replies from your business knowledge and keeps approval in your hands before anything sensitive is sent.",
    proof: ["Draft replies", "Approval queue", "Customer context"],
    color: "from-accent/20 to-accent/5",
  },
  {
    id: "follow-up",
    label: "Follow-up",
    icon: MessageSquareReply,
    pain: "The first answer is not enough. Leads go cold when reminders, quotes, and confirmations are manual.",
    fix: "Aroha queues confirmations, reminders, missed-call recovery, and quote nudges so the next step does not depend on memory.",
    proof: ["SMS reminders", "Quote nudges", "Missed-call recovery"],
    color: "from-primary/20 to-secondary/10",
  },
  {
    id: "handoff",
    label: "Human handoff",
    icon: ShieldAlert,
    pain: "AI should not pretend to know everything. Complex, angry, or high-risk calls need a clean handoff.",
    fix: "Aroha follows escalation rules, flags risk, sends summaries, and keeps the owner in control of sensitive decisions.",
    proof: ["Risk flags", "Escalation rules", "Human approval"],
    color: "from-destructive/20 to-accent/10",
  },
  {
    id: "admin",
    label: "Admin drag",
    icon: ClipboardCheck,
    pain: "Even when the call goes well, the admin after it steals time: notes, CRM updates, calendar details, and next actions.",
    fix: "Aroha turns conversations into structured summaries, customer memory, tasks, bookings, and workflow triggers.",
    proof: ["CRM timeline", "Structured notes", "Next actions"],
    color: "from-secondary/20 to-primary/10",
  },
] as const;

export function PainSwitchboard() {
  const [active, setActive] = useState<(typeof pains)[number]["id"]>("google");
  const item = pains.find((pain) => pain.id === active) ?? pains[0];
  const Icon = item.icon;

  return (
    <section className="relative py-24">
      <div className="container-tight">
        <div className="grid gap-8 lg:grid-cols-[0.82fr_1.18fr] lg:items-center">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary">Pain switchboard</p>
            <h2 className="mt-4 text-balance text-3xl font-semibold tracking-tight text-foreground sm:text-5xl">
              Every leak in the customer journey, covered by one managed system.
            </h2>
            <p className="mt-5 text-base leading-7 text-muted-foreground">
              Aroha Calls is not selling a gimmick. It is a front-office operating layer for the exact places service
              businesses lose money: phone, inbox, follow-up, calendar, CRM, and handoff.
            </p>
            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <Button asChild>
                <Link href="/features">
                  Explore all features
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button asChild variant="outline">
                <Link href="/demo">Build my workflow demo</Link>
              </Button>
            </div>
          </div>

          <div className="grid gap-4">
            <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
              {pains.map((pain) => {
                const PainIcon = pain.icon;
                return (
                  <button
                    key={pain.id}
                    type="button"
                    onClick={() => setActive(pain.id)}
                    className={cn(
                      "rounded-2xl border p-4 text-left transition",
                      active === pain.id
                        ? "border-primary/50 bg-primary/12 text-primary shadow-[0_0_60px_-30px_hsl(var(--primary))]"
                        : "border-border bg-card/45 text-muted-foreground hover:border-foreground/25 hover:text-foreground",
                    )}
                  >
                    <PainIcon className="h-5 w-5" />
                    <span className="mt-3 block text-sm font-medium">{pain.label}</span>
                  </button>
                );
              })}
            </div>

            <div className={cn("overflow-hidden rounded-[2rem] border border-white/10 bg-gradient-to-br p-px", item.color)}>
              <div className="rounded-[calc(2rem-1px)] bg-[#0b111d]/94 p-6 sm:p-8">
                <div className="flex items-center gap-3">
                  <span className="grid h-12 w-12 place-items-center rounded-2xl border border-primary/30 bg-primary/10 text-primary">
                    <Icon className="h-5 w-5" />
                  </span>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">{item.label}</p>
                    <h3 className="text-2xl font-semibold tracking-tight text-foreground">The leak and the fix</h3>
                  </div>
                </div>
                <div className="mt-7 grid gap-4 lg:grid-cols-2">
                  <div className="rounded-2xl border border-destructive/25 bg-destructive/[0.07] p-5">
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-destructive">Pain</p>
                    <p className="mt-3 text-lg font-semibold leading-snug text-foreground">{item.pain}</p>
                  </div>
                  <div className="rounded-2xl border border-primary/25 bg-primary/[0.08] p-5">
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">Aroha fix</p>
                    <p className="mt-3 text-lg font-semibold leading-snug text-foreground">{item.fix}</p>
                  </div>
                </div>
                <div className="mt-4 grid gap-3 sm:grid-cols-3">
                  {item.proof.map((proof) => (
                    <div key={proof} className="rounded-xl border border-white/10 bg-white/[0.04] px-3 py-3 text-sm text-foreground/85">
                      {proof}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
