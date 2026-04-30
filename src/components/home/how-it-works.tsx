import { Phone, Settings2, CalendarCheck } from "lucide-react";
import { SectionHeading } from "@/components/visuals/section-heading";

const steps = [
  {
    icon: Phone,
    label: "Step 01",
    title: "Get your number",
    body: "Choose a brand-new business line or forward your existing one. Instant activation. Keep or port any number, anytime.",
    bullets: ["Instant activation", "Smart routing to mobiles, teams or branches", "Keep your existing number"],
  },
  {
    icon: Settings2,
    label: "Step 02",
    title: "Set your rules",
    body: "Tell Aroha your hours, services, prices and how you book. We craft the brain — you stay in control.",
    bullets: ["Custom greeting + brand tone", "FAQs, services, policies", "After-hours behaviour, urgent rules"],
  },
  {
    icon: CalendarCheck,
    label: "Step 03",
    title: "Start booking",
    body: "Aroha handles every call instantly. Captures details, checks availability, books appointments, sends confirmations.",
    bullets: ["Bookings dropped into your calendar", "Missed-call texts + email summaries", "Reminders & follow-ups"],
  },
];

export function HowItWorks() {
  return (
    <section className="relative py-24">
      <div className="container-tight">
        <SectionHeading
          eyebrow="How it works"
          title={<>From phone ringing to revenue in 24 hours.</>}
          description="Most businesses go live the same day. White-glove setup is included on every plan — no contracts, no commitments."
        />
        <div className="mt-14 grid gap-6 lg:grid-cols-3">
          {steps.map((s, i) => (
            <div
              key={s.title}
              className="relative overflow-hidden rounded-3xl border border-border bg-card/50 p-8"
            >
              <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-primary/0 via-primary/70 to-primary/0" />
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-primary">{s.label}</p>
              <div className="mt-3 flex items-center gap-3">
                <span className="grid h-12 w-12 place-items-center rounded-2xl border border-border bg-background text-primary">
                  <s.icon className="h-5 w-5" />
                </span>
                <h3 className="text-2xl font-semibold tracking-tight text-foreground">{s.title}</h3>
              </div>
              <p className="mt-4 text-sm text-muted-foreground">{s.body}</p>
              <ul className="mt-6 space-y-2 text-sm">
                {s.bullets.map((b) => (
                  <li key={b} className="flex items-start gap-2 text-foreground/85">
                    <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                    {b}
                  </li>
                ))}
              </ul>
              {i < steps.length - 1 && (
                <div className="absolute right-6 top-8 hidden text-3xl font-semibold text-foreground/10 lg:block">
                  0{i + 1}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
