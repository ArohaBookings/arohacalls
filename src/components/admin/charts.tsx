"use client";

import type { ReactNode } from "react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Funnel,
  FunnelChart,
  LabelList,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const palette = ["#00d2a1", "#22d3ee", "#8b5cf6", "#f472b6", "#f59e0b", "#10b981"];

function currency(value: number, code = "NZD") {
  return new Intl.NumberFormat(code === "USD" ? "en-US" : "en-NZ", {
    style: "currency",
    currency: code,
    maximumFractionDigits: 0,
  }).format(value / 100);
}

function ChartFrame({ title, subtitle, children }: { title: string; subtitle?: string; children: ReactNode }) {
  return (
    <div className="rounded-[1.55rem] border border-border bg-white p-5 shadow-[0_24px_80px_rgba(15,23,42,0.08)]">
      <div className="mb-5">
        <h3 className="text-lg font-semibold tracking-tight">{title}</h3>
        {subtitle ? <p className="mt-1 text-xs leading-5 text-muted-foreground">{subtitle}</p> : null}
      </div>
      <div className="h-72">{children}</div>
    </div>
  );
}

export function RevenueTrendChart({
  data,
  title = "Revenue trend",
  subtitle,
}: {
  data: { date: string; NZD?: number; USD?: number; orders?: number }[];
  title?: string;
  subtitle?: string;
}) {
  return (
    <ChartFrame title={title} subtitle={subtitle ?? "Gross sales by day. Amounts are stored in cents and labelled by currency."}>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ left: 0, right: 8, top: 8, bottom: 0 }}>
          <defs>
            <linearGradient id="nzdFill" x1="0" x2="0" y1="0" y2="1">
              <stop offset="5%" stopColor="#00d2a1" stopOpacity={0.35} />
              <stop offset="95%" stopColor="#00d2a1" stopOpacity={0.02} />
            </linearGradient>
            <linearGradient id="usdFill" x1="0" x2="0" y1="0" y2="1">
              <stop offset="5%" stopColor="#22d3ee" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#22d3ee" stopOpacity={0.02} />
            </linearGradient>
          </defs>
          <CartesianGrid stroke="#e2e8f0" strokeDasharray="3 3" vertical={false} />
          <XAxis dataKey="date" tick={{ fontSize: 11, fill: "#64748b" }} tickLine={false} axisLine={false} />
          <YAxis tick={{ fontSize: 11, fill: "#64748b" }} tickLine={false} axisLine={false} tickFormatter={(value) => `${Math.round(Number(value) / 1000) / 10}k`} />
          <Tooltip formatter={(value, name) => currency(Number(value), String(name))} labelClassName="text-slate-900" />
          <Area type="monotone" dataKey="NZD" stroke="#00d2a1" fill="url(#nzdFill)" strokeWidth={2.5} />
          <Area type="monotone" dataKey="USD" stroke="#22d3ee" fill="url(#usdFill)" strokeWidth={2.5} />
        </AreaChart>
      </ResponsiveContainer>
    </ChartFrame>
  );
}

export function FunnelPerformanceChart({ data }: { data: { label: string; value: number; rate: number }[] }) {
  const chartData = data.map((row, index) => ({ ...row, fill: palette[index % palette.length] }));
  return (
    <ChartFrame title="Conversion funnel" subtitle="Sessions to checkout/order conversion, using tracked sessions and conversion events.">
      <ResponsiveContainer width="100%" height="100%">
        <FunnelChart>
          <Tooltip formatter={(value, _name, props) => [`${value} (${props.payload.rate}%)`, props.payload.label]} />
          <Funnel dataKey="value" data={chartData} isAnimationActive>
            <LabelList position="right" fill="#0f172a" stroke="none" dataKey="label" fontSize={12} />
          </Funnel>
        </FunnelChart>
      </ResponsiveContainer>
    </ChartFrame>
  );
}

export function DonutChart({
  title,
  subtitle,
  data,
}: {
  title: string;
  subtitle?: string;
  data: { name: string; value: number }[];
}) {
  return (
    <ChartFrame title={title} subtitle={subtitle}>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Tooltip />
          <Pie data={data} dataKey="value" nameKey="name" innerRadius="58%" outerRadius="84%" paddingAngle={4}>
            {data.map((entry, index) => (
              <Cell key={entry.name} fill={palette[index % palette.length]} />
            ))}
          </Pie>
        </PieChart>
      </ResponsiveContainer>
    </ChartFrame>
  );
}

export function HorizontalBarChart({
  title,
  subtitle,
  data,
}: {
  title: string;
  subtitle?: string;
  data: { name: string; value: number }[];
}) {
  return (
    <ChartFrame title={title} subtitle={subtitle}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} layout="vertical" margin={{ left: 8, right: 24, top: 8, bottom: 8 }}>
          <CartesianGrid stroke="#e2e8f0" strokeDasharray="3 3" horizontal={false} />
          <XAxis type="number" hide />
          <YAxis type="category" dataKey="name" tick={{ fontSize: 11, fill: "#64748b" }} width={116} tickLine={false} axisLine={false} />
          <Tooltip />
          <Bar dataKey="value" radius={[0, 8, 8, 0]} fill="#00d2a1">
            <LabelList dataKey="value" position="right" fill="#0f172a" fontSize={12} />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </ChartFrame>
  );
}

export function MetricBarChart({
  title,
  subtitle,
  data,
}: {
  title: string;
  subtitle?: string;
  data: { name: string; value: number; fill?: string }[];
}) {
  return (
    <ChartFrame title={title} subtitle={subtitle}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ left: 0, right: 8, top: 8, bottom: 0 }}>
          <CartesianGrid stroke="#e2e8f0" strokeDasharray="3 3" vertical={false} />
          <XAxis dataKey="name" tick={{ fontSize: 11, fill: "#64748b" }} tickLine={false} axisLine={false} />
          <YAxis tick={{ fontSize: 11, fill: "#64748b" }} tickLine={false} axisLine={false} />
          <Tooltip />
          <Bar dataKey="value" radius={[8, 8, 0, 0]}>
            {data.map((entry, index) => (
              <Cell key={entry.name} fill={entry.fill ?? palette[index % palette.length]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </ChartFrame>
  );
}
