"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowRight, Calculator, PhoneMissed, Sparkles, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";

function dollars(value: number) {
  return new Intl.NumberFormat("en-NZ", {
    style: "currency",
    currency: "NZD",
    maximumFractionDigits: 0,
  }).format(value);
}

function RangeField({
  label,
  value,
  min,
  max,
  step = 1,
  suffix,
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  suffix?: string;
  onChange: (value: number) => void;
}) {
  return (
    <label className="block rounded-2xl border border-white/10 bg-white/[0.04] p-4">
      <span className="flex items-center justify-between gap-4 text-sm font-medium text-foreground">
        {label}
        <span className="text-primary">
          {suffix === "$" ? dollars(value) : `${value}${suffix ?? ""}`}
        </span>
      </span>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(event) => onChange(Number(event.target.value))}
        className="mt-4 h-2 w-full cursor-pointer accent-primary"
      />
    </label>
  );
}

export function LeadLeakCalculator() {
  const [missedCalls, setMissedCalls] = useState(8);
  const [jobValue, setJobValue] = useState(180);
  const [bookingRate, setBookingRate] = useState(35);

  const leak = useMemo(() => {
    const weekly = missedCalls * jobValue * (bookingRate / 100);
    return {
      weekly,
      monthly: weekly * 4.33,
      yearly: weekly * 52,
    };
  }, [bookingRate, jobValue, missedCalls]);

  function trackCalculator() {
    void fetch("/api/analytics/track", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        event: "roi_calculator_completed",
        metadata: { missedCalls, jobValue, bookingRate, monthlyLeak: Math.round(leak.monthly) },
      }),
      keepalive: true,
    }).catch(() => {});
  }

  return (
    <section className="relative border-y border-white/10 bg-[linear-gradient(135deg,rgba(0,210,161,0.14),rgba(179,136,255,0.12)_45%,rgba(255,141,180,0.12))] py-24">
      <div className="container-tight">
        <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary">Revenue leak estimator</p>
            <h2 className="mt-4 text-balance text-3xl font-semibold tracking-tight text-foreground sm:text-5xl">
              Put a number on the calls slipping through.
            </h2>
            <p className="mt-5 max-w-xl text-base leading-7 text-muted-foreground">
              This is not a promise of revenue. It is a quick way to show the risk: if people already call your
              business, missed calls are not an admin problem. They are a conversion leak.
            </p>
            <div className="mt-7 grid gap-3 sm:grid-cols-3">
              {[
                { icon: PhoneMissed, label: "Missed calls", value: `${missedCalls}/wk` },
                { icon: TrendingUp, label: "Potential monthly leak", value: dollars(leak.monthly) },
                { icon: Sparkles, label: "Aroha plan starts", value: "NZ$99/mo" },
              ].map((item) => {
                const Icon = item.icon;
                return (
                  <div key={item.label} className="rounded-2xl border border-white/10 bg-background/55 p-4">
                    <Icon className="h-4 w-4 text-primary" />
                    <p className="mt-3 text-xs uppercase tracking-[0.16em] text-muted-foreground">{item.label}</p>
                    <p className="mt-1 text-lg font-semibold tracking-tight text-foreground">{item.value}</p>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="overflow-hidden rounded-[2rem] border border-white/10 bg-[#0b111d]/92 shadow-[0_24px_100px_rgba(0,0,0,0.38)]">
            <div className="flex items-center justify-between border-b border-white/10 bg-white/[0.04] px-5 py-4">
              <div className="flex items-center gap-3">
                <span className="grid h-10 w-10 place-items-center rounded-xl border border-primary/30 bg-primary/10 text-primary">
                  <Calculator className="h-5 w-5" />
                </span>
                <div>
                  <p className="text-sm font-medium text-foreground">Missed-call leak</p>
                  <p className="text-xs text-muted-foreground">Estimate only - tune it to your business</p>
                </div>
              </div>
            </div>
            <div className="grid gap-5 p-5 sm:p-6 lg:grid-cols-[0.9fr_1.1fr]">
              <div className="space-y-3">
                <RangeField label="Missed calls per week" value={missedCalls} min={1} max={40} onChange={setMissedCalls} suffix="" />
                <RangeField label="Average booking value" value={jobValue} min={50} max={1500} step={10} onChange={setJobValue} suffix="$" />
                <RangeField label="Likely booking rate" value={bookingRate} min={5} max={80} step={5} onChange={setBookingRate} suffix="%" />
              </div>
              <div className="rounded-3xl border border-primary/25 bg-primary/[0.08] p-6">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">Potential lost bookings</p>
                <p className="mt-4 text-5xl font-semibold tracking-tight text-foreground">{dollars(leak.monthly)}</p>
                <p className="mt-2 text-sm text-muted-foreground">per month based on your inputs</p>
                <div className="mt-6 grid gap-3 text-sm">
                  <div className="flex justify-between gap-3">
                    <span className="text-muted-foreground">Weekly risk</span>
                    <span className="font-medium text-foreground">{dollars(leak.weekly)}</span>
                  </div>
                  <div className="flex justify-between gap-3">
                    <span className="text-muted-foreground">Yearly risk</span>
                    <span className="font-medium text-foreground">{dollars(leak.yearly)}</span>
                  </div>
                </div>
                <Button asChild className="mt-7 w-full" onClick={trackCalculator}>
                  <Link href="/demo">
                    Show me the fix
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
