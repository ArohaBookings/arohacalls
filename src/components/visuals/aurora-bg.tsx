import { cn } from "@/lib/utils";

export function AuroraBG({ className, intensity = "default" }: { className?: string; intensity?: "subtle" | "default" | "strong" }) {
  const opacity =
    intensity === "subtle" ? "opacity-50" : intensity === "strong" ? "opacity-90" : "opacity-70";
  return (
    <div className={cn("pointer-events-none absolute inset-0 overflow-hidden", className)} aria-hidden="true">
      <div className={cn("absolute inset-0 bg-grid mask-radial-fade", opacity === "opacity-50" ? "opacity-30" : "opacity-50")} />
      <div className={cn("absolute -top-40 left-1/2 h-[700px] w-[1100px] -translate-x-1/2 rounded-full blur-3xl animate-aurora", opacity)}
        style={{
          background:
            "conic-gradient(from 90deg at 50% 50%, hsl(162 88% 45% / 0.55) 0deg, hsl(190 95% 65% / 0.45) 90deg, hsl(261 83% 70% / 0.5) 180deg, hsl(340 82% 67% / 0.5) 270deg, hsl(162 88% 45% / 0.55) 360deg)",
        }}
      />
      <div
        className="absolute right-[8%] top-[30%] h-[420px] w-[420px] rounded-full blur-3xl opacity-50 animate-pulse-slow"
        style={{
          background:
            "radial-gradient(circle, hsl(190 95% 65% / 0.4) 0%, transparent 70%)",
        }}
      />
      <div
        className="absolute left-[6%] bottom-[5%] h-[360px] w-[360px] rounded-full blur-3xl opacity-50 animate-pulse-slow"
        style={{
          background:
            "radial-gradient(circle, hsl(340 82% 67% / 0.35) 0%, transparent 70%)",
          animationDelay: "1.5s",
        }}
      />
    </div>
  );
}
