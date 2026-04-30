"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "motion/react";
import {
  ArrowRight,
  CalendarCheck,
  CheckCircle2,
  Clock,
  Mail,
  Phone,
  PhoneCall,
  ShieldCheck,
  Sparkles,
  Users,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { AuroraBG } from "@/components/visuals/aurora-bg";
import { cn } from "@/lib/utils";

const clips = [
  {
    id: "voice",
    label: "Voice AI",
    icon: Phone,
    title: "Call answered while the owner is on site",
    caller: "I need a plumber this afternoon. Hot water is gone.",
    response: "I can help. What suburb are you in, and is it urgent or standard?",
    outcome: "Booked 3:15 PM - customer details captured",
    stat: "0.8s",
    statLabel: "answer latency",
  },
  {
    id: "email",
    label: "Email AI",
    icon: Mail,
    title: "Reply drafted with customer context",
    caller: "Can you send a quote for the premium package?",
    response: "Aroha drafts the reply, attaches the right service notes, and waits for approval.",
    outcome: "Draft ready - confidence 94% - linked to CRM",
    stat: "1",
    statLabel: "approval needed",
  },
  {
    id: "memory",
    label: "CRM",
    icon: Users,
    title: "Returning customer recognised instantly",
    caller: "It is Maya. Same booking as last time if possible.",
    response: "Aroha pulls the previous service, preferred time, notes, and booking history.",
    outcome: "Repeat caller - timeline updated - next action set",
    stat: "100%",
    statLabel: "context kept",
  },
  {
    id: "calendar",
    label: "Calendar",
    icon: CalendarCheck,
    title: "Booking made without double-booking the team",
    caller: "Do you have anything after 4 today?",
    response: "Aroha checks rules, buffers, team availability, and the right service length.",
    outcome: "Slot confirmed - reminder queued - team notified",
    stat: "24/7",
    statLabel: "coverage",
  },
] as const;

function HeroControlRoom() {
  const [active, setActive] = useState<(typeof clips)[number]["id"]>("voice");
  const clip = clips.find((item) => item.id === active) ?? clips[0];
  const Icon = clip.icon;

  return (
    <div className="relative">
      <div className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-[#0b111d]/92 shadow-[0_28px_120px_rgba(0,0,0,0.55)]">
        <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-primary via-secondary to-accent" aria-hidden="true" />
        <div className="border-b border-white/10 bg-white/[0.03] px-4 py-3">
          <div className="flex flex-wrap items-center gap-2">
            {clips.map((item) => {
              const ItemIcon = item.icon;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setActive(item.id)}
                  className={cn(
                    "inline-flex items-center gap-2 rounded-full border px-3 py-2 text-xs font-medium transition",
                    active === item.id
                      ? "border-primary/50 bg-primary/15 text-primary"
                      : "border-white/10 bg-white/[0.03] text-muted-foreground hover:text-foreground",
                  )}
                >
                  <ItemIcon className="h-3.5 w-3.5" />
                  {item.label}
                </button>
              );
            })}
          </div>
        </div>

        <div className="grid gap-0 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="p-5 sm:p-6">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">Live Aroha workflow</p>
                <h3 className="mt-2 text-xl font-semibold tracking-tight text-foreground">{clip.title}</h3>
              </div>
              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl border border-primary/30 bg-primary/10 text-primary">
                <Icon className="h-5 w-5" />
              </span>
            </div>

            <div className="mt-6 space-y-3">
              <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
                <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">Customer</p>
                <p className="mt-2 text-sm leading-6 text-foreground/90">{clip.caller}</p>
              </div>
              <div className="rounded-2xl border border-primary/25 bg-primary/[0.08] p-4">
                <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-primary">Aroha</p>
                <p className="mt-2 text-sm leading-6 text-foreground/90">{clip.response}</p>
              </div>
              <div className="flex items-center gap-2 rounded-2xl border border-white/10 bg-white/[0.04] p-4 text-sm text-foreground/90">
                <CheckCircle2 className="h-4 w-4 shrink-0 text-primary" />
                {clip.outcome}
              </div>
            </div>
          </div>

          <div className="border-t border-white/10 bg-black/18 p-5 sm:p-6 lg:border-l lg:border-t-0">
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
                <p className="text-2xl font-semibold tracking-tight text-foreground">{clip.stat}</p>
                <p className="mt-1 text-xs leading-4 text-muted-foreground">{clip.statLabel}</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
                <p className="text-2xl font-semibold tracking-tight text-foreground">7</p>
                <p className="mt-1 text-xs leading-4 text-muted-foreground">Recoverable leads</p>
              </div>
            </div>

            <div className="mt-4 rounded-2xl border border-white/10 bg-white/[0.04] p-4">
              <div className="mb-4 flex items-center justify-between">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">Revenue leak closed</p>
                <Zap className="h-4 w-4 text-primary" />
              </div>
              {[
                ["Google lead calls", "paid for"],
                ["Phone rings out", "blocked"],
                ["Booking confirmed", "captured"],
                ["Follow-up sent", "automatic"],
              ].map(([label, value], index) => (
                <div key={label} className="relative flex items-center justify-between gap-4 py-2 text-sm">
                  <div className="flex items-center gap-3">
                    <span className="grid h-6 w-6 place-items-center rounded-full border border-primary/35 bg-primary/10 text-[11px] text-primary">
                      {index + 1}
                    </span>
                    <span className="text-foreground/86">{label}</span>
                  </div>
                  <span className="text-xs text-muted-foreground">{value}</span>
                </div>
              ))}
            </div>

            <div className="mt-4 rounded-2xl border border-accent/20 bg-accent/[0.06] p-4">
              <p className="text-sm font-medium text-foreground">What good is ranking #1 if the call is missed?</p>
              <p className="mt-2 text-xs leading-5 text-muted-foreground">
                Aroha turns the high-intent moment into a handled conversation, not a voicemail gamble.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function Hero() {
  return (
    <section className="relative isolate overflow-hidden pt-24 pb-14 sm:pt-28 sm:pb-20">
      <AuroraBG intensity="strong" />
      <div className="container-tight relative grid items-center gap-12 lg:grid-cols-12">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="lg:col-span-7"
        >
          <h1 className="max-w-5xl text-balance text-5xl font-semibold leading-[0.98] tracking-tight sm:text-7xl lg:text-8xl">
            Never miss another call.
          </h1>
          <p className="mt-6 max-w-2xl text-pretty text-xl leading-8 text-muted-foreground sm:text-2xl sm:leading-9">
            Aroha answers, books, follows up, and remembers every customer &mdash; 24/7.
          </p>

          <div className="mt-8 flex flex-col items-stretch gap-3 sm:flex-row sm:items-center">
            <Button asChild size="xl" variant="default" className="group">
              <a href="tel:+6436672033">
                <PhoneCall className="h-4 w-4" />
                Call the AI now
              </a>
            </Button>
            <Button asChild size="xl" variant="outline">
              <Link href="/demo">
                Get it set up for me
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </Link>
            </Button>
          </div>

          <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-primary" />
              Live demo available 24/7
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-secondary" />
              Built in Christchurch
            </div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-accent" />
              7-day money-back guarantee
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.15 }}
          className="lg:col-span-5"
        >
          <HeroControlRoom />
        </motion.div>
      </div>
    </section>
  );
}
