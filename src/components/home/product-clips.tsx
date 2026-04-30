"use client";

import { useState } from "react";
import { Bot, CalendarDays, MailCheck, MessageSquareText, PhoneCall, Sparkles, Users } from "lucide-react";
import { cn } from "@/lib/utils";

const clips = [
  {
    id: "calls",
    title: "Voice AI",
    icon: PhoneCall,
    headline: "The call gets answered before the lead cools down.",
    lines: ["Caller intent captured", "Urgent rule checked", "Booking slot offered", "Summary sent to the owner"],
    sideTitle: "Live call state",
    sideRows: [
      ["Caller", "Hot water is gone"],
      ["Aroha", "Qualifying suburb + urgency"],
      ["Outcome", "Booked for 3:15 PM"],
    ],
  },
  {
    id: "email",
    title: "Email AI",
    icon: MailCheck,
    headline: "Email replies get drafted with the same customer memory.",
    lines: ["Inbox monitored", "Reply drafted", "Risk flagged", "Approval kept human"],
    sideTitle: "Approval queue",
    sideRows: [
      ["Thread", "Quote request"],
      ["Confidence", "94%"],
      ["Action", "Approve or edit"],
    ],
  },
  {
    id: "messages",
    title: "Messages AI",
    icon: MessageSquareText,
    headline: "Follow-up does not vanish just because the owner got busy.",
    lines: ["Missed call recovery", "Booking reminders", "Quote nudges", "Customer context attached"],
    sideTitle: "Recovery queue",
    sideRows: [
      ["Needs reply", "1"],
      ["Recoverable leads", "7"],
      ["After-hours leak", "0"],
    ],
  },
  {
    id: "crm",
    title: "CRM + Aurora",
    icon: Bot,
    headline: "Aurora knows what happened across calls, email, bookings, and customers.",
    lines: ["Customer timeline", "Repeat caller memory", "Next best action", "Owner command view"],
    sideTitle: "Daily command view",
    sideRows: [
      ["Memory", "Shared timeline"],
      ["Bookings", "Calendar-safe"],
      ["Questions", "Ask Aurora"],
    ],
  },
] as const;

const proofRows = [
  { icon: CalendarDays, label: "Calendar-safe" },
  { icon: Users, label: "Customer memory" },
  { icon: Bot, label: "Aurora ready" },
] as const;

export function ProductClips() {
  const [active, setActive] = useState<(typeof clips)[number]["id"]>("calls");
  const clip = clips.find((item) => item.id === active) ?? clips[0];
  const Icon = clip.icon;

  return (
    <section className="relative py-24">
      <div className="container-tight">
        <div className="grid gap-8 lg:grid-cols-[0.75fr_1.25fr] lg:items-end">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary">
              Product clips from the Aroha AI operating layer
            </p>
            <h2 className="mt-4 max-w-2xl text-balance text-3xl font-semibold tracking-tight text-foreground sm:text-5xl">
              Not just a phone bot. The full customer side of the business.
            </h2>
            <p className="mt-5 max-w-xl text-base leading-7 text-muted-foreground">
              Aroha Calls is the managed package. Underneath it is the Aroha AI workspace Leo uses:
              voice, inbox, email AI, messages, CRM, Aurora, calendars, analytics, and recovery queues.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {clips.map((item) => {
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
                  <span className="mt-3 block text-sm font-medium">{item.title}</span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="mt-10 overflow-hidden rounded-[2rem] border border-white/10 bg-[#0c111d] shadow-[0_24px_100px_rgba(0,0,0,0.42)]">
          <div className="flex items-center justify-between border-b border-white/10 bg-white/[0.03] px-5 py-4">
            <div className="flex items-center gap-3">
              <span className="grid h-10 w-10 place-items-center rounded-xl border border-primary/30 bg-primary/10 text-primary">
                <Icon className="h-5 w-5" />
              </span>
              <div>
                <p className="text-sm font-medium text-foreground">{clip.title}</p>
                <p className="text-xs text-muted-foreground">Managed by Aroha Group - powered by Aroha AI</p>
              </div>
            </div>
            <span className="hidden rounded-full border border-primary/25 bg-primary/10 px-3 py-1 text-xs text-primary sm:inline-flex">
              Live workflow
            </span>
          </div>

          <div className="grid gap-0 lg:grid-cols-[1fr_0.72fr]">
            <div className="p-6 sm:p-8">
              <h3 className="text-2xl font-semibold tracking-tight text-foreground">{clip.headline}</h3>
              <div className="mt-7 grid gap-3 sm:grid-cols-2">
                {clip.lines.map((line) => (
                  <div key={line} className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
                    <Sparkles className="h-4 w-4 text-primary" />
                    <p className="mt-3 text-sm font-medium text-foreground">{line}</p>
                  </div>
                ))}
              </div>
              <div className="mt-7 grid gap-3 sm:grid-cols-3">
                {proofRows.map((row) => {
                  const RowIcon = row.icon;
                  return (
                    <div
                      key={row.label}
                      className="flex items-center gap-2 rounded-xl bg-white/[0.04] px-3 py-2 text-xs text-muted-foreground"
                    >
                      <RowIcon className="h-4 w-4 text-primary" />
                      {row.label}
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="border-t border-white/10 bg-black/20 p-6 sm:p-8 lg:border-l lg:border-t-0">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">{clip.sideTitle}</p>
              <div className="mt-5 space-y-3">
                {clip.sideRows.map(([label, value]) => (
                  <div key={label} className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
                    <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-primary">{label}</p>
                    <p className="mt-1 text-lg font-semibold tracking-tight text-foreground">{value}</p>
                  </div>
                ))}
              </div>
              <div className="mt-5 rounded-2xl border border-accent/25 bg-accent/[0.08] p-4">
                <p className="text-sm leading-6 text-foreground/88">
                  The customer sees a fast, calm front desk. You see the booking, summary, reply draft,
                  and next action in one place.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
