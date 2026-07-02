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
    description: "Managed Google Calendar setup with staff availability, service lengths, reminders, buffers, and no double bookings.",
    span: "lg:col-span-2",
  },
  {
    icon: Brain,
    title: "Aurora business chatbot",
    description: "Ask what happened today, who needs follow-up, which leads are hot, and where revenue is leaking.",
    span: "lg:col-span-2",
  },
  {
    icon: MessageSquareText,
    title: "Caller ID + memory",
    description: "Remembers returning callers, past bookings, preferences, notes, quote history, and next steps.",
    span: "",
  },
  {
    icon: Mail,
    title: "Email + SMS follow-ups",
    description: "Gmail or inbox drafts, missed-call texts, reminders, quote nudges, and review requests in your voice.",
    span: "",
  },
  {
    icon: Workflow,
    title: "Unified CRM timeline",
    description: "Calls, bookings, emails, SMS, quotes, reviews, and notes sit on one simple customer timeline.",
    span: "lg:col-span-2",
  },
  {
    icon: Zap,
    title: "Automated workflows",
    description: "Smart routing, escalation, VIP rules, after-hours handling, task creation, and follow-up.",
    span: "",
  },
  {
    icon: ShieldCheck,
    title: "Privacy-minded by design",
    description: "Designed around GDPR and NZ Privacy Act principles. Call recording is opt-in. Your data is yours.",
    span: "",
  },
  {
    icon: Languages,
    title: "Natural brand voice",
    description: "Tuned to your market and brand. Handles accents, background noise, interruptions.",
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
          description="One plain-English system for calls, Google Calendar bookings, Gmail and inbox drafts, SMS follow-up, CRM memory, quotes, reviews, analytics, and your team's day-to-day Aurora questions. Powered by Aroha AI and managed by Aroha Group."
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
