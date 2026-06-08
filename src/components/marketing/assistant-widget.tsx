"use client";

import * as React from "react";
import Link from "next/link";
import { Loader2, MessageCircle, Send, Sparkles, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type ChatMessage = {
  role: "user" | "assistant";
  content: string;
};

const starterQuestions = [
  "Which plan should I choose?",
  "Can I keep my number?",
  "How does Google Calendar work?",
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
    body: JSON.stringify({
      event,
      sessionId,
      metadata: {
        page: window.location.pathname,
        ...metadata,
      },
    }),
    keepalive: true,
  }).catch(() => {});
}

export function AssistantWidget() {
  const [open, setOpen] = React.useState(false);
  const [input, setInput] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [feedback, setFeedback] = React.useState<"resolved" | "stuck" | null>(null);
  const [messages, setMessages] = React.useState<ChatMessage[]>([
    {
      role: "assistant",
      content: "Ask Grace anything about Aroha Calls, pricing, setup, number forwarding, Google Calendar, cancellation, or whether managed vs self-serve is right for you.",
    },
  ]);

  async function ask(question: string) {
    const clean = question.trim();
    if (!clean || loading) return;
    const nextMessages: ChatMessage[] = [...messages, { role: "user", content: clean }];
    const sessionId = getSessionId();
    setMessages(nextMessages);
    setInput("");
    setFeedback(null);
    setLoading(true);
    try {
      const res = await fetch("/api/assistant/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: nextMessages.slice(-10),
          sessionId,
          page: window.location.pathname,
        }),
      });
      const json = (await res.json().catch(() => ({}))) as { answer?: string; fallback?: boolean; intent?: string };
      setMessages((current) => [
        ...current,
        {
          role: "assistant",
          content: json.answer ?? "I can help, but I missed that. Try asking about pricing, setup, number forwarding, or booking a demo.",
        },
      ]);
      if (json.fallback) {
        track("assistant_stuck", { reason: "fallback", intent: json.intent ?? "unknown" });
      }
    } catch {
      setMessages((current) => [
        ...current,
        {
          role: "assistant",
          content: "I could not reach the assistant right now. You can still call Grace live or book a free demo and we will help directly.",
        },
      ]);
      track("assistant_stuck", { reason: "network_error" });
    } finally {
      setLoading(false);
    }
  }

  function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    void ask(input);
  }

  return (
    <div className="pointer-events-none fixed bottom-4 right-4 z-50 print:hidden sm:bottom-5 sm:right-5">
      {open ? (
      <div
        className={cn(
          "pointer-events-auto mb-3 w-[calc(100vw-2rem)] max-w-[420px] origin-bottom-right overflow-hidden rounded-[1.35rem] border border-border bg-white/96 shadow-[0_28px_100px_rgba(15,23,42,0.16)] backdrop-blur-xl transition-all duration-200",
        )}
      >
        <div className="flex items-center justify-between border-b border-border bg-slate-50/80 px-4 py-3">
          <div className="flex items-center gap-3">
            <span className="grid h-9 w-9 place-items-center rounded-full bg-primary/15 text-primary">
              <Sparkles className="h-4 w-4" />
            </span>
            <div>
              <p className="text-sm font-semibold text-foreground">Ask Grace</p>
              <p className="text-xs text-muted-foreground">Plans, setup, number options</p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="rounded-full p-2 text-muted-foreground transition hover:bg-slate-100 hover:text-foreground"
            aria-label="Close assistant"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="max-h-[410px] space-y-3 overflow-y-auto px-4 py-4">
          {messages.map((message, index) => (
            <div
              key={`${message.role}-${index}`}
              className={cn(
                "rounded-2xl px-4 py-3 text-sm leading-6",
                message.role === "user"
                  ? "ml-8 bg-primary text-primary-foreground"
                  : "mr-8 border border-border bg-slate-50 text-foreground/90",
              )}
            >
              {message.content}
            </div>
          ))}
          {loading ? (
            <div className="mr-8 flex items-center gap-2 rounded-2xl border border-border bg-slate-50 px-4 py-3 text-sm text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin text-primary" />
              Thinking...
            </div>
          ) : null}
          {!loading && messages.length > 1 ? (
            <div className="mr-8 rounded-2xl border border-border bg-white px-4 py-3">
              <p className="text-xs font-medium text-muted-foreground">Did Grace answer it?</p>
              <div className="mt-2 flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setFeedback("resolved");
                    track("assistant_resolved");
                  }}
                  className="rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-xs font-medium text-emerald-700 transition hover:bg-emerald-100"
                >
                  Helped
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setFeedback("stuck");
                    track("assistant_stuck", { reason: "user_feedback" });
                  }}
                  className="rounded-full border border-amber-200 bg-amber-50 px-3 py-1.5 text-xs font-medium text-amber-700 transition hover:bg-amber-100"
                >
                  Still stuck
                </button>
              </div>
              {feedback ? (
                <p className="mt-2 text-xs text-muted-foreground">
                  {feedback === "resolved" ? "Marked as resolved." : "Marked as stuck. The next click or demo booking will show in analytics."}
                </p>
              ) : null}
            </div>
          ) : null}
        </div>

        <div className="border-t border-border px-4 py-3">
          <div className="mb-3 flex flex-wrap gap-2">
            {starterQuestions.map((question) => (
              <button
                key={question}
                type="button"
                onClick={() => ask(question)}
                className="rounded-full border border-border bg-slate-50 px-3 py-1.5 text-xs text-muted-foreground transition hover:border-primary/40 hover:text-foreground"
              >
                {question}
              </button>
            ))}
          </div>
          <form onSubmit={onSubmit} className="flex gap-2">
            <input
              value={input}
              onChange={(event) => setInput(event.target.value)}
              maxLength={500}
              placeholder="Ask about setup or pricing..."
              className="min-h-11 flex-1 rounded-full border border-border bg-white px-4 text-sm outline-none transition placeholder:text-muted-foreground focus:border-primary/50"
            />
            <Button type="submit" size="icon" disabled={loading || !input.trim()} aria-label="Send question">
              <Send className="h-4 w-4" />
            </Button>
          </form>
          <div className="mt-3 flex items-center justify-between gap-3 text-xs text-muted-foreground">
            <Link
              href="/live-demo"
              className="hover:text-primary hover:underline"
              onClick={() => track("assistant_conversion_clicked", { destination: "live-demo" })}
            >
              Talk to Grace
            </Link>
            <Link
              href="/demo"
              className="hover:text-primary hover:underline"
              onClick={() => track("assistant_conversion_clicked", { destination: "demo" })}
            >
              Book managed setup
            </Link>
          </div>
        </div>
      </div>
      ) : null}

      <button
        type="button"
        onClick={() => {
          setOpen((value) => {
            const next = !value;
            if (next) track("assistant_opened");
            return next;
          });
        }}
        className="pointer-events-auto ml-auto flex min-h-14 items-center gap-3 rounded-full border border-primary/40 bg-primary px-5 text-sm font-semibold text-primary-foreground shadow-[0_18px_60px_rgba(0,210,161,0.32)] transition hover:-translate-y-0.5"
        aria-expanded={open}
        aria-label="Open Aroha assistant"
      >
        <MessageCircle className="h-5 w-5" />
        Ask Grace
      </button>
    </div>
  );
}
