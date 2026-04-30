"use client";

import * as React from "react";
import { ChevronDown } from "lucide-react";
import { SectionHeading } from "@/components/visuals/section-heading";
import { cn } from "@/lib/utils";

const faqs = [
  {
    q: "Do I need any special equipment?",
    a: "Nope. Aroha works with any number of any provider. We give you a Telnyx business line, or forward your existing one in seconds.",
  },
  {
    q: "How long does setup take?",
    a: "Most businesses are live the same day. Our team builds your knowledge base, voice and rules — you approve and we flick the switch.",
  },
  {
    q: "Can I keep my existing phone number?",
    a: "Yes. You can either forward it to your new Aroha line, or fully port it across. We handle everything.",
  },
  {
    q: "How does appointment booking work?",
    a: "Aroha checks your real-time Google Calendar availability and Aroha-managed booking rules, books, sends confirmations and reminders, and syncs everything back.",
  },
  {
    q: "What's the difference between plans?",
    a: "Lite is bookings-only with 100 minutes. Essentials adds the full receptionist with unlimited minutes. Professional adds routing, transfers and analytics. Premium covers multi-location, VIP rules and priority support.",
  },
  {
    q: "Can I cancel any time? Do I get a refund?",
    a: "Yes — cancel any time, your plan runs until end of cycle. New customers also get a 7-day money-back guarantee from first activation.",
  },
  {
    q: "How are summaries and transcripts delivered?",
    a: "Every call gets an instant email summary. Full transcripts and recordings are available in your dashboard.",
  },
  {
    q: "What about privacy and data security?",
    a: "We're GDPR + NZ Privacy Act compliant. Recording is opt-in. Your data is encrypted at rest, never sold, and you can request deletion any time.",
  },
  {
    q: "Can the AI route urgent or VIP callers?",
    a: "Absolutely. Set rules to escalate VIPs, urgent jobs or after-hours emergencies straight to your mobile or whoever's on call.",
  },
  {
    q: "Which industries is this best for?",
    a: "Salons, clinics, tradies, real estate, gyms, automotive, vets, spas, cafes — any service business with appointments or phone-led leads.",
  },
];

function FaqItem({ q, a, defaultOpen }: { q: string; a: string; defaultOpen?: boolean }) {
  const [open, setOpen] = React.useState(!!defaultOpen);
  return (
    <div className="rounded-2xl border border-border bg-card/40 px-6 py-5">
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center justify-between gap-4 text-left"
        aria-expanded={open}
      >
        <span className="text-base font-medium text-foreground">{q}</span>
        <ChevronDown
          className={cn(
            "h-5 w-5 shrink-0 text-muted-foreground transition-transform duration-300",
            open && "rotate-180 text-primary",
          )}
        />
      </button>
      <div
        className={cn(
          "grid overflow-hidden transition-all duration-300",
          open ? "mt-3 grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0",
        )}
      >
        <div className="min-h-0">
          <p className="text-sm leading-relaxed text-muted-foreground">{a}</p>
        </div>
      </div>
    </div>
  );
}

export function FAQ() {
  return (
    <section className="relative py-24">
      <div className="container-tight">
        <SectionHeading
          eyebrow="FAQ"
          title={<>Questions, answered.</>}
          description="Can't find it here? Email us — a real human (Leo) replies, fast."
        />
        <div className="mx-auto mt-12 max-w-3xl space-y-3">
          {faqs.map((f, i) => (
            <FaqItem key={f.q} q={f.q} a={f.a} defaultOpen={i === 0} />
          ))}
        </div>
      </div>
    </section>
  );
}
