import Link from "next/link";
import { cn } from "@/lib/utils";

export const timeframes = ["7d", "30d", "90d", "1y", "all"] as const;
export type Timeframe = (typeof timeframes)[number];

export function normalizeTimeframe(value: unknown): Timeframe {
  return timeframes.includes(value as Timeframe) ? (value as Timeframe) : "30d";
}

export function sinceForTimeframe(timeframe: Timeframe) {
  if (timeframe === "all") return null;
  const days = timeframe === "7d" ? 7 : timeframe === "30d" ? 30 : timeframe === "90d" ? 90 : 365;
  return new Date(Date.now() - days * 24 * 60 * 60 * 1000);
}

export function TimeframeNav({ active, basePath }: { active: Timeframe; basePath: string }) {
  return (
    <div className="flex flex-wrap gap-2">
      {timeframes.map((timeframe) => (
        <Link
          key={timeframe}
          href={`${basePath}?timeframe=${timeframe}`}
          className={cn(
            "rounded-full border px-3 py-1.5 text-sm transition",
            active === timeframe
              ? "border-primary bg-primary/15 text-primary"
              : "border-border text-muted-foreground hover:bg-card hover:text-foreground",
          )}
        >
          {timeframe}
        </Link>
      ))}
    </div>
  );
}
