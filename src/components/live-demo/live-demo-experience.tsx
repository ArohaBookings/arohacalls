"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { RetellWebClient } from "retell-client-js-sdk";
import {
  ArrowRight,
  Bot,
  CalendarCheck2,
  CheckCircle2,
  CircleStop,
  Clock3,
  Headphones,
  Mail,
  Mic,
  PhoneCall,
  Play,
  Radio,
  ShieldCheck,
  Sparkles,
  UserRound,
  Volume2,
  WandSparkles,
} from "lucide-react";
import { cn } from "@/lib/utils";

type CallStatus =
  | "idle"
  | "microphone"
  | "connecting"
  | "ready"
  | "grace-speaking"
  | "caller-speaking"
  | "ended"
  | "error";

type VoicePreview = {
  accentId: string;
  label: string;
  voice: {
    id: string;
    name: string;
    accent: string;
    gender: string;
    provider: string;
    previewUrl?: string;
  } | null;
};

type CallSummary = {
  callId: string;
  status: string;
  agentName?: string;
  transcriptSnippet?: string | null;
  summary?: string | null;
  sentiment?: string | null;
  detectedIntent?: string | null;
  bookingMade?: boolean;
  quoteRequested?: boolean;
  nextAction?: string | null;
  durationMs?: number | null;
};

const statusCopy: Record<CallStatus, { label: string; detail: string }> = {
  idle: {
    label: "Ready for your test call",
    detail: "Press the button, allow microphone access, and speak to Grace from your browser.",
  },
  microphone: {
    label: "Waiting for microphone",
    detail: "Your browser may ask for permission so Grace can hear you.",
  },
  connecting: {
    label: "Connecting...",
    detail: "Creating the secure Retell web call and opening the audio room.",
  },
  ready: {
    label: "Speaking with Grace...",
    detail: "Ask about bookings, quotes, opening hours, missed calls, or your niche.",
  },
  "grace-speaking": {
    label: "Grace is speaking",
    detail: "Listen to how she qualifies the caller and keeps the next step moving.",
  },
  "caller-speaking": {
    label: "Your turn",
    detail: "Try a real customer scenario: urgent job, booking, quote, or after-hours call.",
  },
  ended: {
    label: "Call ended",
    detail: "The summary will appear below as soon as Retell finishes analysis.",
  },
  error: {
    label: "Could not start the call",
    detail: "Use the phone line or try again in a moment.",
  },
};

const niches = [
  "Tradies on site",
  "Salons mid-appointment",
  "Clinics at reception",
  "Restaurants during service",
  "Real estate agents in viewings",
  "Gyms handling trial leads",
  "Auto shops under the bonnet",
];

const proof = [
  { value: "12,000+", label: "Calls answered" },
  { value: "30%", label: "More bookings / month" },
  { value: "24/7", label: "Coverage" },
];

function getSessionId() {
  const key = "aroha_session_id";
  const existing = window.localStorage.getItem(key);
  if (existing) return existing;
  const next = crypto.randomUUID();
  window.localStorage.setItem(key, next);
  return next;
}

function track(event: string, metadata?: Record<string, unknown>) {
  const sessionId = getSessionId();
  void fetch("/api/analytics/track", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ event, sessionId, metadata }),
    keepalive: true,
  }).catch(() => {});
}

function formatDuration(ms?: number | null) {
  if (!ms) return "Pending";
  const seconds = Math.round(ms / 1000);
  const minutes = Math.floor(seconds / 60);
  const rest = seconds % 60;
  return `${minutes}:${String(rest).padStart(2, "0")}`;
}

export function LiveDemoExperience() {
  const [status, setStatus] = useState<CallStatus>("idle");
  const [error, setError] = useState<string | null>(null);
  const [callId, setCallId] = useState<string | null>(null);
  const [summary, setSummary] = useState<CallSummary | null>(null);
  const [voices, setVoices] = useState<VoicePreview[]>([]);
  const [selectedAccent, setSelectedAccent] = useState("nz");
  const [seconds, setSeconds] = useState(0);
  const clientRef = useRef<RetellWebClient | null>(null);
  const callAttemptRef = useRef(0);

  const activeVoice = useMemo(
    () => voices.find((voice) => voice.accentId === selectedAccent)?.voice ?? null,
    [selectedAccent, voices],
  );

  useEffect(() => {
    void fetch("/api/retell/voices")
      .then((res) => res.json())
      .then((json: { voices?: VoicePreview[] }) => setVoices(json.voices ?? []))
      .catch(() => setVoices([]));
  }, []);

  useEffect(() => {
    if (!["ready", "grace-speaking", "caller-speaking"].includes(status)) return;
    const timer = window.setInterval(() => setSeconds((value) => value + 1), 1000);
    return () => window.clearInterval(timer);
  }, [status]);

  useEffect(() => {
    return () => {
      clientRef.current?.stopCall();
      clientRef.current = null;
    };
  }, []);

  async function pollSummary(nextCallId: string) {
    const sessionId = getSessionId();
    for (let attempt = 0; attempt < 10; attempt += 1) {
      const res = await fetch(`/api/retell/calls/${nextCallId}?sessionId=${encodeURIComponent(sessionId)}`).catch(() => null);
      if (res?.ok) {
        const json = (await res.json()) as CallSummary;
        setSummary(json);
        if (json.summary || json.transcriptSnippet || json.status === "analyzed") return;
      }
      await new Promise((resolve) => window.setTimeout(resolve, 1800));
    }
  }

  async function startCall() {
    const attemptId = callAttemptRef.current + 1;
    callAttemptRef.current = attemptId;
    setError(null);
    setSummary(null);
    setSeconds(0);
    setStatus("microphone");
    track("live_demo_call_cta_clicked", { selectedAccent, selectedVoiceId: activeVoice?.id });

    try {
      setStatus("connecting");
      const sessionId = getSessionId();
      const res = await fetch("/api/retell/web-call", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId, selectedAccent, selectedVoiceId: activeVoice?.id }),
      });
      const json = (await res.json().catch(() => ({}))) as { accessToken?: string; callId?: string; error?: string };
      if (!res.ok || !json.accessToken || !json.callId) {
        throw new Error(json.error ?? "Retell did not return a call token");
      }
      const accessToken = json.accessToken;
      const nextCallId = json.callId;
      if (callAttemptRef.current !== attemptId) return;

      const client = new RetellWebClient();
      clientRef.current = client;
      setCallId(nextCallId);

      client.on("call_started", () => setStatus("ready"));
      client.on("call_ready", () => setStatus("ready"));
      client.on("agent_start_talking", () => setStatus("grace-speaking"));
      client.on("agent_stop_talking", () => setStatus("caller-speaking"));
      client.on("call_ended", () => {
        setStatus("ended");
        track("live_demo_call_client_ended", { callId: nextCallId, seconds });
        void pollSummary(nextCallId);
      });
      client.on("error", (message) => {
        setError(typeof message === "string" ? message : "The live call could not continue.");
        setStatus("error");
        track("live_demo_call_client_error", { callId: nextCallId });
      });

      await client.startCall({ accessToken, sampleRate: 24000 });
    } catch (err) {
      if (callAttemptRef.current !== attemptId) return;
      setError(err instanceof Error ? err.message : "The live call could not start.");
      setStatus("error");
      track("live_demo_call_start_failed", { selectedAccent });
    }
  }

  function stopCall() {
    callAttemptRef.current += 1;
    clientRef.current?.stopCall();
    clientRef.current = null;
    setStatus("ended");
    track("live_demo_call_hangup_clicked", { callId, seconds });
    if (callId) void pollSummary(callId);
  }

  const statusInfo = statusCopy[status];
  const isLive = ["ready", "grace-speaking", "caller-speaking"].includes(status);
  const isStarting = status === "microphone" || status === "connecting";
  const canHangUp = isStarting || isLive;

  return (
    <div className="bg-white text-slate-950">
      {canHangUp ? (
        <div className="fixed inset-x-0 bottom-4 z-50 flex justify-center px-4 sm:bottom-6">
          <div className="flex w-full max-w-xl items-center justify-between gap-3 rounded-full border border-rose-200 bg-white/95 p-2 pl-5 shadow-[0_22px_70px_rgba(15,23,42,0.22)] backdrop-blur">
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-slate-950">{statusInfo.label}</p>
              <p className="text-xs text-slate-500">{isLive ? formatDuration(seconds * 1000) : "Grace is being connected"}</p>
            </div>
            <button
              type="button"
              onClick={stopCall}
              className="inline-flex min-h-12 shrink-0 items-center justify-center gap-2 rounded-full bg-rose-600 px-5 text-sm font-semibold text-white transition hover:bg-rose-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-500 focus-visible:ring-offset-2"
              aria-label="Hang up Grace call"
            >
              <CircleStop className="h-4 w-4" />
              Hang up
            </button>
          </div>
        </div>
      ) : null}
      <section className="relative overflow-hidden border-b border-slate-200 bg-[radial-gradient(circle_at_70%_10%,rgba(0,210,255,0.22),transparent_34%),linear-gradient(180deg,#ffffff_0%,#f7fbff_100%)]">
        <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-cyan-400 to-transparent" />
        <div className="container-tight grid min-h-[760px] gap-12 py-16 lg:grid-cols-[0.92fr_1.08fr] lg:items-center lg:py-24">
          <div>
            <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-cyan-200 bg-cyan-50 px-4 py-2 text-sm font-medium text-cyan-900">
              <span className="h-2 w-2 rounded-full bg-cyan-500 shadow-[0_0_18px_rgba(6,182,212,0.85)]" />
              Live browser call plus phone line
            </div>
            <h1 className="max-w-4xl text-balance text-5xl font-semibold leading-[0.96] tracking-tight text-slate-950 sm:text-7xl lg:text-8xl">
              Talk to Our AI Receptionist Right Now
            </h1>
            <p className="mt-7 max-w-2xl text-pretty text-xl leading-8 text-slate-600 sm:text-2xl sm:leading-9">
              Grace answers like a front-of-house pro: she qualifies the caller, books the job, remembers the customer, and hands your team a clean summary.
            </p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <button
                type="button"
                onClick={canHangUp ? stopCall : startCall}
                className={cn(
                  "inline-flex min-h-14 items-center justify-center gap-3 rounded-full px-7 text-base font-semibold text-white shadow-[0_24px_70px_rgba(15,23,42,0.24)] transition hover:-translate-y-0.5",
                  canHangUp ? "bg-rose-600 hover:bg-rose-700" : "bg-slate-950 hover:bg-slate-800",
                )}
              >
                {canHangUp ? <CircleStop className="h-5 w-5" /> : <Mic className="h-5 w-5 text-cyan-300" />}
                {canHangUp ? "Hang up call" : "Talk to Grace live"}
              </button>
              <a
                href="tel:+6436672033"
                onClick={() => track("live_demo_phone_clicked")}
                className="inline-flex min-h-14 items-center justify-center gap-3 rounded-full border border-slate-300 bg-white px-7 text-base font-semibold text-slate-950 transition hover:-translate-y-0.5 hover:border-cyan-300 hover:text-cyan-700"
              >
                <PhoneCall className="h-5 w-5" />
                Call +64 3 667 2033
              </a>
            </div>
            <div className="mt-8 grid max-w-2xl gap-3 sm:grid-cols-3">
              {proof.map((item) => (
                <div key={item.label} className="rounded-3xl border border-slate-200 bg-white/80 p-4 shadow-sm">
                  <p className="text-2xl font-semibold tracking-tight text-slate-950">{item.value}</p>
                  <p className="mt-1 text-xs font-medium uppercase tracking-[0.16em] text-slate-500">{item.label}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="relative">
            <div className="absolute -inset-6 rounded-[3rem] bg-cyan-300/18 blur-3xl" />
            <div className="relative overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-[0_34px_110px_rgba(15,23,42,0.16)]">
              <div className="flex items-center justify-between gap-4 border-b border-slate-200 bg-slate-50 px-5 py-4 text-slate-950">
                <div className="flex items-center gap-3">
                  <span className="grid h-11 w-11 place-items-center rounded-2xl bg-cyan-500 text-white">
                    <Headphones className="h-5 w-5" />
                  </span>
                  <div>
                    <p className="text-sm font-semibold">Grace from Aroha</p>
                    <p className="text-xs text-slate-500">One live demo voice. Your setup can use a different voice.</p>
                  </div>
                </div>
                <span className="inline-flex items-center gap-2 rounded-full border border-cyan-200 bg-white px-3 py-1 text-xs font-medium text-slate-700">
                  <Radio className={cn("h-3.5 w-3.5 text-slate-400", isLive && "animate-pulse text-cyan-600")} />
                  {isLive ? formatDuration(seconds * 1000) : "00:00"}
                </span>
              </div>

              <div className="grid gap-0 lg:grid-cols-[1fr_0.86fr]">
                <div className="p-5 sm:p-7">
                  <div className="rounded-[1.5rem] border border-slate-200 bg-slate-50 p-5">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-cyan-700">Call status</p>
                        <h2 className="mt-2 text-2xl font-semibold tracking-tight">{statusInfo.label}</h2>
                      </div>
                      <span className={cn(
                        "grid h-12 w-12 place-items-center rounded-full",
                        isLive ? "bg-cyan-100 text-cyan-700" : status === "error" ? "bg-rose-100 text-rose-700" : "bg-slate-200 text-slate-700",
                      )}>
                        {isLive ? <Volume2 className="h-5 w-5" /> : status === "ended" ? <CheckCircle2 className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
                      </span>
                    </div>
                    <p className="mt-3 text-sm leading-6 text-slate-600">{error ?? statusInfo.detail}</p>

                    <div className="mt-6 grid gap-3">
                      {[
                        ["Caller says the job, booking, or quote problem"],
                        ["Grace asks the right questions for that niche"],
                        ["Aroha logs the call, memory, summary, and next step"],
                      ].map(([label], index) => (
                        <div key={label} className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3">
                          <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-cyan-50 text-sm font-semibold text-cyan-700">{index + 1}</span>
                          <p className="text-sm font-medium text-slate-700">{label}</p>
                        </div>
                      ))}
                    </div>

                    <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                      {canHangUp ? (
                        <button
                          type="button"
                          onClick={stopCall}
                          className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-rose-600 px-5 text-sm font-semibold text-white transition hover:bg-rose-700"
                        >
                          <CircleStop className="h-4 w-4" />
                          Hang up call
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={startCall}
                          className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-cyan-500 px-5 text-sm font-semibold text-slate-950 transition hover:bg-cyan-400"
                        >
                          <Play className="h-4 w-4" />
                          Start call
                        </button>
                      )}
                      <Link
                        href="/demo"
                        onClick={() => track("live_demo_managed_demo_clicked")}
                        className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-slate-300 px-5 text-sm font-semibold transition hover:border-cyan-300 hover:text-cyan-700"
                      >
                        Get it set up for me
                        <ArrowRight className="h-4 w-4" />
                      </Link>
                    </div>
                  </div>
                </div>

                <div className="border-t border-slate-200 bg-slate-50 p-5 text-slate-950 lg:border-l lg:border-t-0 sm:p-7">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-cyan-700">After-call intelligence</p>
                  <div className="mt-4 space-y-3">
                    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                      <p className="text-xs text-slate-500">Detected intent</p>
                      <p className="mt-1 font-semibold">{summary?.detectedIntent ?? "Analysis appears here after the call"}</p>
                    </div>
                    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                      <p className="text-xs text-slate-500">AI summary</p>
                      <p className="mt-2 text-sm leading-6 text-slate-600">
                        {summary?.summary ?? summary?.transcriptSnippet ?? "Grace will summarise what the caller wanted, what was captured, and what should happen next."}
                      </p>
                    </div>
                    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
                      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                        <p className="text-xs text-slate-500">Booking</p>
                        <p className="mt-1 font-semibold">{summary?.bookingMade ? "Made or requested" : "Pending"}</p>
                      </div>
                      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                        <p className="text-xs text-slate-500">Duration</p>
                        <p className="mt-1 font-semibold">{formatDuration(summary?.durationMs)}</p>
                      </div>
                    </div>
                    <div className="rounded-2xl border border-cyan-200 bg-cyan-50 p-4">
                      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-cyan-700">Next action</p>
                      <p className="mt-2 text-sm leading-6 text-slate-700">
                        {summary?.nextAction ?? "Book, quote, follow up, or hand off to the owner with the context already written."}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-slate-200 bg-white py-16 sm:py-20">
        <div className="container-tight">
          <div className="grid gap-6 lg:grid-cols-[0.72fr_1.28fr] lg:items-end">
            <div>
              <h2 className="text-balance text-4xl font-semibold tracking-tight sm:text-5xl">Preview the voice range.</h2>
              <p className="mt-4 max-w-xl text-lg leading-8 text-slate-600">
                These are licensed Retell voice previews. The live browser call uses Grace today; production customers can be tuned around voice, tone, pace, rules, and niche.
              </p>
            </div>
            <div className="grid gap-3 md:grid-cols-4">
              {(voices.length ? voices : [
                { accentId: "nz", label: "New Zealand", voice: null },
                { accentId: "au", label: "Australian", voice: null },
                { accentId: "us", label: "American", voice: null },
                { accentId: "uk", label: "British", voice: null },
              ]).map((item) => (
                <button
                  key={item.accentId}
                  type="button"
                  onClick={() => {
                    setSelectedAccent(item.accentId);
                    track("live_demo_voice_selected", { accent: item.label, voiceId: item.voice?.id });
                  }}
                  className={cn(
                    "rounded-3xl border p-4 text-left transition hover:-translate-y-0.5",
                    selectedAccent === item.accentId
                      ? "border-cyan-300 bg-cyan-50 shadow-[0_20px_60px_rgba(8,145,178,0.14)]"
                      : "border-slate-200 bg-white hover:border-slate-300",
                  )}
                >
                  <div className="flex items-center justify-between gap-3">
                    <p className="font-semibold">{item.label}</p>
                    <Volume2 className="h-4 w-4 text-cyan-600" />
                  </div>
                  <p className="mt-2 text-xs leading-5 text-slate-500">
                    {item.voice ? `${item.voice.name} - ${item.voice.accent}` : "Preview loads from Retell when configured."}
                  </p>
                  {item.voice?.previewUrl ? (
                    <audio
                      className="mt-3 h-8 w-full"
                      controls
                      preload="none"
                      src={item.voice.previewUrl}
                      onPlay={() => track("live_demo_voice_preview_played", { accent: item.label, voiceId: item.voice?.id })}
                    />
                  ) : null}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="relative border-y border-slate-200 bg-white py-[4.5rem] text-slate-950 sm:py-24">
        <div className="absolute inset-0 bg-dots opacity-30" aria-hidden="true" />
        <div className="container-tight">
          <div className="grid gap-10 lg:grid-cols-[0.88fr_1.12fr] lg:items-center">
            <div>
              <h2 className="text-balance text-4xl font-semibold tracking-tight sm:text-6xl">
                What good is ranking #1 if nobody answers?
              </h2>
              <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-600">
                Ads, SEO, referrals, and repeat customers all end at the same moment: the phone rings. Aroha makes sure that moment turns into a handled conversation instead of a voicemail gamble.
              </p>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              {[
                { icon: PhoneCall, title: "Caller-ID memory", body: "Returning customers get recognised with context, not treated like strangers." },
                { icon: CalendarCheck2, title: "Booking and quoting", body: "Grace asks the right questions and pushes the next step into your workflow." },
                { icon: Mail, title: "Email AI plus CRM", body: "Calls, emails, messages, summaries, and follow-up sit in one customer timeline." },
                { icon: WandSparkles, title: "Aurora assistant", body: "Your team can ask what happened, who needs follow-up, and where revenue is leaking." },
              ].map((item) => {
                const Icon = item.icon;
                return (
                  <div key={item.title} className="rounded-[1.5rem] border border-slate-200 bg-slate-50 p-5 shadow-sm">
                    <Icon className="h-6 w-6 text-cyan-600" />
                    <h3 className="mt-4 text-xl font-semibold">{item.title}</h3>
                    <p className="mt-2 text-sm leading-6 text-slate-600">{item.body}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-slate-200 bg-white py-16 sm:py-24">
        <div className="container-tight">
          <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr]">
            <div>
              <h2 className="text-balance text-4xl font-semibold tracking-tight sm:text-5xl">Built for the businesses that miss calls because they are actually working.</h2>
              <p className="mt-5 text-lg leading-8 text-slate-600">
                When you are under a sink, cutting hair, seeing a patient, running food, or driving to a job, Grace answers before the customer rings someone else.
              </p>
              <Link
                href="/for/tradies"
                onClick={() => track("live_demo_tradie_clicked")}
                className="mt-7 inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-slate-950 px-5 text-sm font-semibold text-white transition hover:bg-slate-800"
              >
                See tradie setup
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              {niches.map((niche) => (
                <div key={niche} className="flex items-center gap-3 rounded-3xl border border-slate-200 bg-slate-50 p-4">
                  <span className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl bg-white text-cyan-700 shadow-sm">
                    <CheckCircle2 className="h-5 w-5" />
                  </span>
                  <p className="font-medium text-slate-800">{niche}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[linear-gradient(180deg,#f8fbff_0%,#ffffff_100%)] py-16 sm:py-24">
        <div className="container-tight">
          <div className="grid gap-6 lg:grid-cols-2">
            <div className="rounded-[2rem] border border-slate-200 bg-white p-7 shadow-sm sm:p-9">
              <Bot className="h-8 w-8 text-cyan-600" />
              <h2 className="mt-5 text-3xl font-semibold tracking-tight">Aroha Calls</h2>
              <p className="mt-3 text-lg font-medium text-slate-700">Done-for-you. We build it, tune it, manage it.</p>
              <p className="mt-4 leading-7 text-slate-600">
                Best when you want Aroha Group to set up your AI receptionist, booking rules, email AI, CRM, memory, follow-up, and front-office workflow for you.
              </p>
              <Link
                href="/pricing"
                onClick={() => track("live_demo_pricing_clicked", { product: "aroha_calls" })}
                className="mt-7 inline-flex items-center gap-2 rounded-full bg-cyan-500 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-400"
              >
                View managed plans
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
            <div className="rounded-[2rem] border border-slate-200 bg-white p-7 text-slate-950 shadow-sm sm:p-9">
              <UserRound className="h-8 w-8 text-secondary" />
              <h2 className="mt-5 text-3xl font-semibold tracking-tight">Aroha AI</h2>
              <p className="mt-3 text-lg font-medium text-slate-700">Self-serve. You build and control it yourself.</p>
              <p className="mt-4 leading-7 text-slate-600">
                Best when you want the platform behind Aroha Calls and prefer to configure your own assistants, CRM, Email AI, automations, and workflows.
              </p>
              <a
                href="https://arohaai.app?utm_source=arohacalls&utm_medium=live_demo&utm_campaign=self_serve"
                target="_blank"
                rel="noreferrer"
                onClick={() => track("live_demo_aroha_ai_clicked")}
                className="mt-7 inline-flex items-center gap-2 rounded-full border border-slate-300 px-5 py-3 text-sm font-semibold transition hover:border-secondary/50 hover:text-secondary"
              >
                Explore self-serve
                <ArrowRight className="h-4 w-4" />
              </a>
            </div>
          </div>

          <div className="mt-12 rounded-[2rem] border border-cyan-200 bg-cyan-50 p-7 sm:p-9">
            <div className="grid gap-8 lg:grid-cols-[0.82fr_1.18fr] lg:items-center">
              <div>
                <Sparkles className="h-8 w-8 text-cyan-700" />
                <h2 className="mt-5 text-balance text-3xl font-semibold tracking-tight sm:text-4xl">Cold visitor, hot lead, handled instantly.</h2>
                <p className="mt-4 text-lg leading-8 text-slate-700">
                  The live demo proves the offer before a sales call. Then the managed setup gets them from interested to live without making them learn another tool.
                </p>
              </div>
              <div className="grid gap-3 sm:grid-cols-3">
                {[
                  ["24/7", "Coverage when the team is busy"],
                  ["CRM", "Every caller remembered"],
                  ["Email AI", "Follow-up without manual chasing"],
                ].map(([value, label]) => (
                  <div key={value} className="rounded-3xl border border-cyan-200 bg-white p-5">
                    <p className="text-3xl font-semibold tracking-tight">{value}</p>
                    <p className="mt-2 text-sm leading-6 text-slate-600">{label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white pb-20">
        <div className="container-tight">
          <div className="rounded-[2rem] border border-slate-200 bg-[linear-gradient(135deg,rgba(0,210,161,0.10),rgba(99,102,241,0.08)_52%,rgba(244,114,182,0.08))] p-8 text-slate-950 shadow-[0_28px_95px_rgba(15,23,42,0.1)] sm:p-12">
            <div className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-center">
              <div>
                <div className="flex flex-wrap gap-3 text-sm text-slate-600">
                  <span className="inline-flex items-center gap-2"><ShieldCheck className="h-4 w-4 text-cyan-600" /> 7-day guarantee</span>
                  <span className="inline-flex items-center gap-2"><Clock3 className="h-4 w-4 text-cyan-600" /> Managed setup</span>
                  <span className="inline-flex items-center gap-2"><PhoneCall className="h-4 w-4 text-cyan-600" /> 24/7 reception</span>
                </div>
                <h2 className="mt-5 max-w-3xl text-balance text-4xl font-semibold tracking-tight sm:text-5xl">
                  Let Grace prove it, then let Aroha Group set it up for your business.
                </h2>
              </div>
              <div className="flex flex-col gap-3 sm:flex-row lg:flex-col">
                <button
                  type="button"
                  onClick={canHangUp ? stopCall : startCall}
                  className={cn(
                    "inline-flex min-h-[3.25rem] items-center justify-center gap-2 rounded-full px-6 text-sm font-semibold transition",
                    canHangUp ? "bg-rose-600 text-white hover:bg-rose-700" : "bg-cyan-400 text-slate-950 hover:bg-cyan-300",
                  )}
                >
                  {canHangUp ? <CircleStop className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
                  {canHangUp ? "Hang up call" : "Talk to Grace live"}
                </button>
                <Link
                  href="/demo"
                  onClick={() => track("live_demo_footer_demo_clicked")}
                  className="inline-flex min-h-[3.25rem] items-center justify-center gap-2 rounded-full border border-slate-300 bg-white px-6 text-sm font-semibold transition hover:border-cyan-300 hover:text-cyan-700"
                >
                  Get it set up for me
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
