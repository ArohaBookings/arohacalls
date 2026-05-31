"use client";

import * as React from "react";
import { ChevronDown } from "lucide-react";
import { SectionHeading } from "@/components/visuals/section-heading";
import { cn } from "@/lib/utils";

const faqs = [
  {
    q: "Do I need any special equipment?",
    a: "No. Aroha works with your current setup. You can use a new Aroha business number, forward your existing number, or port your number later.",
  },
  {
    q: "How long does setup take?",
    a: "Most businesses are live the same day. Our team builds your knowledge base, voice and rules — you approve and we flick the switch.",
  },
  {
    q: "Can I keep my existing phone number?",
    a: "Yes. The fastest setup is call forwarding to Aroha. If you want the number fully moved later, we can help with porting too.",
  },
  {
    q: "How does appointment booking work?",
    a: "You connect Google Calendar through your managed Aroha AI organisation login. We set the services, buffers, staff calendars and rules, then Aroha books, confirms and syncs everything back.",
  },
  {
    q: "Is Aroha Calls only for New Zealand?",
    a: "No. Aroha Calls is made in New Zealand, but it is available worldwide. Pricing supports NZD and USD where configured, and the setup can be tuned for local voices, numbers and workflows.",
  },
  {
    q: "What is the difference between Aroha Calls and Aroha AI?",
    a: "Aroha Calls is done-for-you: we build, tune and manage it. Aroha AI is self-serve: you build and control the platform yourself.",
  },
  {
    q: "What happens after I buy?",
    a: "You create your account, pay through Stripe, complete onboarding, connect Google Calendar if needed, and Leo/Aroha Group contacts you to get the managed setup live.",
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
    a: "We design around GDPR and NZ Privacy Act concepts. Recording is opt-in, your data is never sold, and you can request deletion any time.",
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
