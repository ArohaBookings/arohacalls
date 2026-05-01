"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  Bot,
  CalendarCheck2,
  Car,
  CheckCircle2,
  HeartPulse,
  Home,
  Pause,
  PhoneCall,
  Play,
  RefreshCcw,
  Scissors,
  Sparkles,
  Stethoscope,
  Utensils,
  Wrench,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type Speaker = "caller" | "aroha" | "decision";

type CallLine = {
  speaker: Speaker;
  text: string;
  label?: string;
};

type NicheFlow = {
  id: string;
  label: string;
  icon: typeof Wrench;
  business: string;
  callerNeed: string;
  rule: string;
  transcript: CallLine[];
  decisions: string[];
  outcome: string;
  summary: string[];
};

const flows: NicheFlow[] = [
  {
    id: "tradies",
    label: "Tradies",
    icon: Wrench,
    business: "On-site plumbing team",
    callerNeed: "Hot water cylinder leaking after hours",
    rule: "Capture suburb, urgency, access notes, and route emergencies.",
    transcript: [
      { speaker: "caller", text: "Hi, my hot water cylinder is leaking and I need someone today." },
      { speaker: "aroha", text: "I can help. What suburb are you in, and is water still actively leaking?" },
      { speaker: "caller", text: "Spreydon. It is still leaking but I have turned the mains off." },
      { speaker: "decision", label: "AI decision", text: "Urgent but controlled. Take job details, offer next callout window, notify owner." },
      { speaker: "aroha", text: "Thanks. I can get this logged as urgent. What is your name, best number, and the address?" },
      { speaker: "aroha", text: "You are booked for the urgent callout queue. The owner will get the summary now." },
    ],
    decisions: ["Detected emergency language", "Asked safety and urgency questions", "Captured suburb and access details", "Queued owner notification"],
    outcome: "Urgent job captured, summary sent, customer does not ring the next plumber.",
    summary: ["Job type: leaking cylinder", "Suburb: Spreydon", "Priority: urgent", "Next action: owner callback"],
  },
  {
    id: "salons",
    label: "Salons",
    icon: Scissors,
    business: "Hair and beauty studio",
    callerNeed: "Returning client wants colour and a cut",
    rule: "Check preferred stylist, service length, patch-test notes, and booking window.",
    transcript: [
      { speaker: "caller", text: "Can I book a colour and cut with Maya this week?" },
      { speaker: "aroha", text: "Of course. Are you after a full colour, roots, or a toner and cut?" },
      { speaker: "caller", text: "Roots and a cut. I came in about six weeks ago." },
      { speaker: "decision", label: "AI decision", text: "Returning client. Use memory, keep stylist preference, choose correct duration." },
      { speaker: "aroha", text: "I have noted roots and cut with Maya. Thursday at 2:30 is the first suitable space." },
      { speaker: "aroha", text: "Perfect, you are in. I will send the booking confirmation now." },
    ],
    decisions: ["Recognised returning-booking intent", "Qualified service type", "Preserved stylist preference", "Sent confirmation"],
    outcome: "Booking confirmed with the right service time instead of a rushed manual callback.",
    summary: ["Service: roots and cut", "Stylist: Maya", "Client type: returning", "Next action: confirmation sent"],
  },
  {
    id: "clinics",
    label: "Clinics",
    icon: Stethoscope,
    business: "Appointment clinic",
    callerNeed: "New patient wants a consult",
    rule: "Collect contact details, reason for visit, preferred time, and avoid giving medical advice.",
    transcript: [
      { speaker: "caller", text: "I am a new patient and want to book an appointment." },
      { speaker: "aroha", text: "I can help with booking. What type of appointment do you need?" },
      { speaker: "caller", text: "A general consult, ideally tomorrow morning." },
      { speaker: "decision", label: "AI decision", text: "Booking request only. Collect intake info and avoid diagnosis." },
      { speaker: "aroha", text: "I will take your details and preferred time, then the team can confirm the right appointment." },
      { speaker: "aroha", text: "Thanks. Your request is logged and the clinic has the summary." },
    ],
    decisions: ["Stayed inside booking scope", "Captured new-patient details", "Flagged preferred time", "Sent clinic handoff"],
    outcome: "Patient enquiry handled calmly without the AI pretending to be a clinician.",
    summary: ["Caller: new patient", "Request: general consult", "Preference: tomorrow morning", "Next action: clinic confirmation"],
  },
  {
    id: "real-estate",
    label: "Real estate",
    icon: Home,
    business: "Property sales and rentals",
    callerNeed: "Viewing request on a listing",
    rule: "Capture property, buyer/renter status, budget, finance state, and viewing window.",
    transcript: [
      { speaker: "caller", text: "I saw the three-bedroom listing and want to view it." },
      { speaker: "aroha", text: "Absolutely. Which address or suburb was that listing in?" },
      { speaker: "caller", text: "The one in Riccarton. We are pre-approved and free Saturday." },
      { speaker: "decision", label: "AI decision", text: "High-intent lead. Qualify finance and schedule viewing request." },
      { speaker: "aroha", text: "Great. I have noted Riccarton, pre-approved, Saturday viewing request." },
      { speaker: "aroha", text: "The agent will receive the lead summary and viewing preference now." },
    ],
    decisions: ["Identified listing enquiry", "Qualified buyer readiness", "Captured viewing window", "Prioritised agent follow-up"],
    outcome: "High-intent property lead reaches the agent with useful context.",
    summary: ["Property: Riccarton listing", "Status: pre-approved", "Preference: Saturday", "Next action: agent follow-up"],
  },
  {
    id: "gyms",
    label: "Gyms",
    icon: HeartPulse,
    business: "Fitness studio",
    callerNeed: "Trial class and membership question",
    rule: "Book the first visit, answer basic pricing, and trigger trial follow-up.",
    transcript: [
      { speaker: "caller", text: "Do you have beginner classes? I want to try one before joining." },
      { speaker: "aroha", text: "Yes. Are you looking for strength, boxing, pilates, or general fitness?" },
      { speaker: "caller", text: "General fitness, after work if possible." },
      { speaker: "decision", label: "AI decision", text: "Trial lead. Match class type, capture time preference, queue nurture." },
      { speaker: "aroha", text: "There is a beginner-friendly class after work. I can reserve a trial spot." },
      { speaker: "aroha", text: "Done. You will get the class details and the team will know it is your first visit." },
    ],
    decisions: ["Class intent detected", "Qualified fitness goal", "Booked trial path", "Queued follow-up"],
    outcome: "Trial lead is booked before motivation drops.",
    summary: ["Goal: general fitness", "Level: beginner", "Time: after work", "Next action: trial confirmation"],
  },
  {
    id: "auto",
    label: "Auto shops",
    icon: Car,
    business: "Automotive workshop",
    callerNeed: "Car service and warning light",
    rule: "Capture vehicle, issue, urgency, preferred date, and escalate unsafe cases.",
    transcript: [
      { speaker: "caller", text: "My check engine light is on. Can I book it in?" },
      { speaker: "aroha", text: "I can help. What make and model is the vehicle, and is it driving normally?" },
      { speaker: "caller", text: "Toyota Corolla. It drives okay, but I want it checked soon." },
      { speaker: "decision", label: "AI decision", text: "Non-emergency workshop booking. Capture vehicle info and preferred time." },
      { speaker: "aroha", text: "Thanks. I will log a check-engine diagnostic for a Toyota Corolla." },
      { speaker: "aroha", text: "Your booking request is captured and the workshop has the details." },
    ],
    decisions: ["Vehicle issue detected", "Checked safety urgency", "Captured make/model", "Sent workshop summary"],
    outcome: "Workshop gets a clean diagnostic request instead of a vague missed call.",
    summary: ["Vehicle: Toyota Corolla", "Issue: check engine light", "Urgency: normal", "Next action: workshop booking"],
  },
  {
    id: "vets",
    label: "Vets",
    icon: Stethoscope,
    business: "Vet clinic",
    callerNeed: "Pet appointment and urgency check",
    rule: "Capture pet details, symptoms, urgency, and route emergency language.",
    transcript: [
      { speaker: "caller", text: "My dog has been limping since yesterday. Can I book an appointment?" },
      { speaker: "aroha", text: "I can help with that. Is your dog putting weight on the leg, and are they otherwise alert?" },
      { speaker: "caller", text: "Yes, still walking, just limping." },
      { speaker: "decision", label: "AI decision", text: "Not emergency language. Capture pet details and booking preference." },
      { speaker: "aroha", text: "Thanks. What is your dog's name, your name, and your preferred appointment time?" },
      { speaker: "aroha", text: "I have sent the clinic the details so they can confirm the right slot." },
    ],
    decisions: ["Pet symptom captured", "Urgency screened", "Owner and pet details requested", "Clinic summary sent"],
    outcome: "Pet owner feels heard and the clinic gets the right intake notes.",
    summary: ["Pet: dog", "Symptom: limping", "Urgency: routine", "Next action: clinic slot confirmation"],
  },
  {
    id: "cafes",
    label: "Cafes",
    icon: Utensils,
    business: "Cafe and catering team",
    callerNeed: "Large table and catering question",
    rule: "Capture date, party size, dietary notes, deposit rules, and callback details.",
    transcript: [
      { speaker: "caller", text: "Can I book a table for twelve this weekend, and do you do platters?" },
      { speaker: "aroha", text: "Yes, I can take the details. Which day, what time, and any dietary requirements?" },
      { speaker: "caller", text: "Saturday at 11, two gluten-free, and maybe brunch platters." },
      { speaker: "decision", label: "AI decision", text: "Large booking plus catering. Capture requirements and flag manager approval." },
      { speaker: "aroha", text: "I have noted Saturday 11, twelve guests, two gluten-free, and platter interest." },
      { speaker: "aroha", text: "The team will receive this now and confirm the table and platter options." },
    ],
    decisions: ["Large party detected", "Dietary notes captured", "Catering interest flagged", "Manager confirmation queued"],
    outcome: "Hospitality enquiry is captured during service instead of being lost.",
    summary: ["Party: 12", "Time: Saturday 11", "Dietary: gluten-free x2", "Next action: manager confirm"],
  },
];

function formatTime(step: number) {
  const seconds = Math.min(step * 8, 48);
  return `00:${String(seconds).padStart(2, "0")}`;
}

export function LiveCallWalkthrough() {
  const [activeId, setActiveId] = useState("tradies");
  const [step, setStep] = useState(0);
  const [playing, setPlaying] = useState(true);
  const [showCapabilities, setShowCapabilities] = useState(true);

  const flow = useMemo(() => flows.find((item) => item.id === activeId) ?? flows[0], [activeId]);
  const ActiveIcon = flow.icon;
  const progress = ((step + 1) / flow.transcript.length) * 100;

  useEffect(() => {
    if (!playing) return;
    const timer = window.setTimeout(() => {
      setStep((current) => {
        if (current >= flow.transcript.length - 1) {
          setPlaying(false);
          return current;
        }
        return current + 1;
      });
    }, 2400);
    return () => window.clearTimeout(timer);
  }, [flow.transcript.length, playing, step]);

  function restart(nextId = activeId) {
    setActiveId(nextId);
    setStep(0);
    setPlaying(true);
  }

  return (
    <section className="relative overflow-hidden border-y border-white/10 bg-[#071018] py-20 sm:py-24">
      <div className="absolute inset-0 bg-grid opacity-20" aria-hidden="true" />
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/70 to-transparent" aria-hidden="true" />
      <div className="container-tight relative">
        <div className="grid gap-8 lg:grid-cols-[0.76fr_1.24fr] lg:items-start">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary">Proof of intelligence</p>
            <h2 className="mt-4 text-balance text-4xl font-semibold tracking-tight sm:text-5xl">
              Watch Aroha handle a real call flow.
            </h2>
            <p className="mt-5 max-w-xl text-pretty text-base leading-7 text-muted-foreground">
              Not a fixed script. Pick a niche and watch the call change: different questions, rules, routing, summaries, and next actions.
            </p>

            <div className="mt-7 flex flex-wrap gap-2">
              {flows.map((item) => {
                const Icon = item.icon;
                const active = item.id === flow.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => restart(item.id)}
                    className={cn(
                      "inline-flex items-center gap-2 rounded-full border px-3 py-2 text-sm transition",
                      active
                        ? "border-primary/50 bg-primary/15 text-primary"
                        : "border-white/10 bg-white/[0.04] text-muted-foreground hover:text-foreground",
                    )}
                  >
                    <Icon className="h-4 w-4" />
                    {item.label}
                  </button>
                );
              })}
            </div>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button asChild size="lg">
                <Link href="/demo">
                  Book your free custom demo
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <a href="tel:+6436672033">
                  <PhoneCall className="h-4 w-4" />
                  Call Grace live
                </a>
              </Button>
            </div>
          </div>

          <div className="overflow-hidden rounded-[2rem] border border-white/10 bg-[#0b111d] shadow-[0_30px_120px_rgba(0,0,0,0.48)]">
            <div className="flex flex-col gap-4 border-b border-white/10 bg-white/[0.03] p-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-3">
                <span className="grid h-11 w-11 place-items-center rounded-2xl border border-primary/30 bg-primary/10 text-primary">
                  <ActiveIcon className="h-5 w-5" />
                </span>
                <div>
                  <p className="text-sm font-semibold text-foreground">Aroha Calls - live example</p>
                  <p className="text-xs text-muted-foreground">{flow.business}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => restart()}
                  className="inline-flex h-9 items-center gap-2 rounded-full border border-white/10 px-3 text-xs text-muted-foreground hover:text-foreground"
                >
                  <RefreshCcw className="h-3.5 w-3.5" />
                  Restart
                </button>
                <button
                  type="button"
                  onClick={() => setPlaying((value) => !value)}
                  className="inline-flex h-9 items-center gap-2 rounded-full border border-primary/35 bg-primary/10 px-3 text-xs text-primary"
                >
                  {playing ? <Pause className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5" />}
                  {playing ? "Pause" : "Play"}
                </button>
              </div>
            </div>

            <div className="grid gap-0 lg:grid-cols-[1.08fr_0.92fr]">
              <div className="p-5 sm:p-6">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">Incoming call</p>
                    <h3 className="mt-2 text-2xl font-semibold tracking-tight">{flow.callerNeed}</h3>
                  </div>
                  <span className="rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-sm font-semibold text-primary">
                    {formatTime(step)}
                  </span>
                </div>

                <div className="mt-5 h-2 overflow-hidden rounded-full bg-white/[0.06]">
                  <div className="h-full rounded-full bg-gradient-to-r from-primary via-secondary to-accent transition-all duration-500" style={{ width: `${progress}%` }} />
                </div>

                <div className="mt-6 space-y-3">
                  {flow.transcript.slice(0, step + 1).map((line, index) => {
                    const isCaller = line.speaker === "caller";
                    const isDecision = line.speaker === "decision";
                    return (
                      <div
                        key={`${line.speaker}-${index}`}
                        className={cn(
                          "rounded-2xl border p-4 transition",
                          isDecision
                            ? "border-secondary/25 bg-secondary/[0.08]"
                            : isCaller
                              ? "ml-auto max-w-[92%] border-white/10 bg-white/[0.05]"
                              : "mr-auto max-w-[92%] border-primary/25 bg-primary/[0.08]",
                        )}
                      >
                        <p className={cn("text-[10px] font-semibold uppercase tracking-[0.18em]", isDecision ? "text-secondary" : isCaller ? "text-muted-foreground" : "text-primary")}>
                          {line.label ?? (isCaller ? "Caller" : "Aroha")}
                        </p>
                        <p className="mt-2 text-sm leading-6 text-foreground/90">{line.text}</p>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="border-t border-white/10 bg-black/18 p-5 sm:p-6 lg:border-l lg:border-t-0">
                <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
                  <div className="flex items-start gap-3">
                    <Bot className="mt-0.5 h-5 w-5 text-primary" />
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">Rule Aroha follows</p>
                      <p className="mt-2 text-sm leading-6 text-foreground/88">{flow.rule}</p>
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setShowCapabilities((value) => !value)}
                  className="mt-4 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3 py-2 text-xs text-muted-foreground transition hover:text-foreground"
                >
                  <Sparkles className="h-3.5 w-3.5 text-primary" />
                  {showCapabilities ? "Hide capabilities" : "Show capabilities"}
                </button>

                {showCapabilities ? (
                  <div className="mt-4 space-y-3">
                    {flow.decisions.map((decision, index) => (
                      <div
                        key={decision}
                        className={cn(
                          "flex items-start gap-3 rounded-2xl border p-3 transition",
                          index <= step
                            ? "border-primary/25 bg-primary/[0.08] text-foreground"
                            : "border-white/10 bg-white/[0.03] text-muted-foreground",
                        )}
                      >
                        <CheckCircle2 className={cn("mt-0.5 h-4 w-4 shrink-0", index <= step ? "text-primary" : "text-muted-foreground")} />
                        <p className="text-sm leading-5">{decision}</p>
                      </div>
                    ))}
                  </div>
                ) : null}

                <div className="mt-5 rounded-2xl border border-accent/25 bg-accent/[0.08] p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent">Outcome</p>
                  <p className="mt-2 text-sm leading-6 text-foreground/90">{flow.outcome}</p>
                </div>

                <div className="mt-5 grid gap-2">
                  {flow.summary.map((item) => (
                    <div key={item} className="flex items-center gap-2 rounded-xl bg-white/[0.04] px-3 py-2 text-xs text-muted-foreground">
                      <CalendarCheck2 className="h-3.5 w-3.5 text-primary" />
                      {item}
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
