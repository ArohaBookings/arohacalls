import {
  Phone,
  CalendarDays,
  Brain,
  Mail,
  ShieldCheck,
  Zap,
  Workflow,
  MessageSquareText,
  Languages,
} from "lucide-react";
import { SectionHeading } from "@/components/visuals/section-heading";
import { SpotlightCard } from "@/components/visuals/spotlight";

const features = [
  {
    icon: Phone,
    title: "24/7 AI receptionist",
    description: "Answers every call in your brand voice — even at 3am, even on Christmas Day.",
    span: "lg:col-span-2 lg:row-span-2",
    visual: "calls",
  },
  {
    icon: CalendarDays,
    title: "Calendar that books itself",
    description: "Managed Google Calendar and Aroha Bookings rules, reminders, buffers, no double bookings.",
    span: "lg:col-span-2",
  },
  {
    icon: Brain,
    title: "Aurora business chatbot",
    description: "Your team's brain — pulls customer history, drafts SOPs, answers any question instantly.",
    span: "lg:col-span-2",
  },
  {
    icon: MessageSquareText,
    title: "Caller ID + memory",
    description: "Remembers every customer. Greets returning callers by name with full conversation history.",
    span: "",
  },
  {
    icon: Mail,
    title: "Email + SMS follow-ups",
    description: "Never let a hot lead go cold — automated follow-ups in your voice.",
    span: "",
  },
  {
    icon: Workflow,
    title: "Unified CRM timeline",
    description: "Calls, bookings, emails, SMS — every customer interaction in one beautiful timeline.",
    span: "lg:col-span-2",
  },
  {
    icon: Zap,
    title: "Automated workflows",
    description: "Smart routing, escalations, VIP rules, after-hours handling — all on autopilot.",
    span: "",
  },
  {
    icon: ShieldCheck,
    title: "Privacy-minded by design",
    description: "GDPR + NZ Privacy Act compliant. Call recording is opt-in. Your data is yours.",
    span: "",
  },
  {
    icon: Languages,
    title: "Natural Kiwi voice",
    description: "Sounds like a real local. Handles accents, background noise, interruptions.",
    span: "",
  },
];

export function FeaturesBento() {
  return (
    <section id="features" className="relative py-24">
      <div className="container-tight">
        <SectionHeading
          eyebrow="The Aroha stack"
          title={<>Every part of the front-of-house, on autopilot.</>}
          description="One system for calls, bookings, follow-ups, and your team's day-to-day questions. Powered by Aroha AI."
        />
        <div className="mt-14 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:auto-rows-[14rem]">
          {features.map((f) => (
            <SpotlightCard key={f.title} className={`flex flex-col p-6 ${f.span}`}>
              <div className="flex items-center gap-3">
                <span className="grid h-10 w-10 place-items-center rounded-xl border border-border bg-background/60 text-primary">
                  <f.icon className="h-5 w-5" />
                </span>
                <h3 className="text-base font-semibold text-foreground">{f.title}</h3>
              </div>
              <p className="mt-3 text-sm text-muted-foreground">{f.description}</p>
              {f.visual === "calls" && (
                <div className="mt-auto pt-6">
                  <div className="space-y-2">
                    {[
                      { time: "2:14am", label: "After-hours booking", tone: "primary" },
                      { time: "11:08am", label: "Returning customer ⭐", tone: "secondary" },
                      { time: "4:41pm", label: "Quote request → calendar", tone: "accent" },
                    ].map((row, i) => (
                      <div
                        key={i}
                        className="flex items-center justify-between rounded-xl border border-border bg-background/40 px-3 py-2 text-xs"
                      >
                        <div className="flex items-center gap-2">
                          <span
                            className={`h-2 w-2 rounded-full ${
                              row.tone === "primary"
                                ? "bg-primary"
                                : row.tone === "secondary"
                                  ? "bg-secondary"
                                  : "bg-accent"
                            } animate-pulse`}
                          />
                          <span className="text-muted-foreground">{row.time}</span>
                          <span className="text-foreground">{row.label}</span>
                        </div>
                        <span className="text-[10px] uppercase tracking-wider text-primary">Booked</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </SpotlightCard>
          ))}
        </div>
      </div>
    </section>
  );
}
