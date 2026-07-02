import Link from "next/link";
import {
  ArrowRight,
  Bot,
  CalendarCheck,
  CheckCircle2,
  CreditCard,
  MailCheck,
  PhoneIncoming,
  ShieldCheck,
  Sparkles,
  Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const nodes = [
  { label: "Call answered", detail: "Grace qualifies the caller", icon: PhoneIncoming, tone: "primary" },
  { label: "Google Calendar", detail: "Availability checked safely", icon: CalendarCheck, tone: "secondary" },
  { label: "CRM memory", detail: "Returning callers remembered", icon: Users, tone: "primary" },
  { label: "Gmail + Email AI", detail: "Replies drafted for review", icon: MailCheck, tone: "accent" },
  { label: "Aurora", detail: "Ask what needs attention", icon: Bot, tone: "secondary" },
  { label: "Billing", detail: "Plan, invoice, and portal ready", icon: CreditCard, tone: "primary" },
] as const;

const trust = ["Managed setup", "24/7 live demo", "7-day guarantee", "NZD + USD plans"];

function toneClasses(tone: (typeof nodes)[number]["tone"]) {
  if (tone === "secondary") return "border-secondary/25 bg-secondary/[0.07] text-secondary";
  if (tone === "accent") return "border-accent/25 bg-accent/[0.07] text-accent";
  return "border-primary/25 bg-primary/[0.08] text-primary";
}

export function FrontOfficeOS() {
  return (
    <section className="relative overflow-hidden bg-white py-20 sm:py-24">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/55 to-transparent" aria-hidden="true" />
      <div className="absolute inset-0 bg-dots opacity-35" aria-hidden="true" />
      <div className="container-tight relative">
        <div className="grid gap-10 lg:grid-cols-[0.82fr_1.18fr] lg:items-center">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary">One front-office operating system</p>
            <h2 className="mt-4 text-balance text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
              Every enquiry becomes a handled next step.
            </h2>
            <p className="mt-5 max-w-xl text-pretty text-base leading-7 text-muted-foreground sm:text-lg">
              Aroha Calls is managed for you, but it is not just a call bot. It connects voice, Google
              Calendar booking, Gmail and Email AI, customer memory, SMS follow-up, quote notes, Aurora
              assistance, and Stripe billing into one Aroha AI workspace.
            </p>
            <div className="mt-7 flex flex-wrap gap-2">
              {trust.map((item) => (
                <span key={item} className="inline-flex items-center gap-2 rounded-full border border-border bg-white px-3 py-1.5 text-xs font-medium text-muted-foreground shadow-sm">
                  <CheckCircle2 className="h-3.5 w-3.5 text-primary" />
                  {item}
                </span>
              ))}
            </div>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button asChild size="lg">
                <Link href="/live-demo">
                  Talk to Grace live
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link href="/features">See the full system</Link>
              </Button>
            </div>
          </div>

          <div className="relative overflow-hidden rounded-[2rem] border border-border bg-white p-5 shadow-[0_32px_110px_rgba(15,23,42,0.12)] sm:p-7">
            <div className="absolute inset-x-8 top-1/2 h-px bg-gradient-to-r from-transparent via-primary/35 to-transparent" aria-hidden="true" />
            <div className="absolute inset-y-8 left-1/2 w-px bg-gradient-to-b from-transparent via-secondary/25 to-transparent" aria-hidden="true" />
            <div className="relative rounded-[1.5rem] border border-border bg-slate-50/85 p-4 sm:p-5">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <span className="grid h-11 w-11 place-items-center rounded-2xl bg-primary text-primary-foreground shadow-[0_16px_40px_rgba(0,210,161,0.22)]">
                    <Sparkles className="h-5 w-5" />
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-foreground">Aroha live lead engine</p>
                    <p className="text-xs text-muted-foreground">Incoming enquiry to booked follow-up</p>
                  </div>
                </div>
                <span className="rounded-full border border-primary/25 bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                  Running 24/7
                </span>
              </div>

              <div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
                {nodes.map((node, index) => {
                  const Icon = node.icon;
                  return (
                    <div key={node.label} className="relative rounded-2xl border border-border bg-white p-4 shadow-sm">
                      <div className="flex items-start justify-between gap-3">
                        <span className={`grid h-10 w-10 place-items-center rounded-xl border ${toneClasses(node.tone)}`}>
                          <Icon className="h-5 w-5" />
                        </span>
                        <span className="text-xs font-semibold text-muted-foreground">0{index + 1}</span>
                      </div>
                      <h3 className="mt-4 text-sm font-semibold tracking-tight text-foreground">{node.label}</h3>
                      <p className="mt-1 text-xs leading-5 text-muted-foreground">{node.detail}</p>
                    </div>
                  );
                })}
              </div>

              <div className="mt-4 grid gap-3 rounded-2xl border border-primary/20 bg-primary/[0.06] p-4 sm:grid-cols-[1fr_auto] sm:items-center">
                <div>
                  <p className="text-sm font-semibold text-foreground">The owner sees the useful part.</p>
                  <p className="mt-1 text-sm leading-6 text-muted-foreground">
                    Booking captured, summary written, customer remembered, and the next action ready.
                  </p>
                </div>
                <span className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-2 text-xs font-semibold text-primary shadow-sm">
                  <ShieldCheck className="h-4 w-4" />
                  Human rules stay in control
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
