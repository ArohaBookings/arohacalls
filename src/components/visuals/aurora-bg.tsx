import { cn } from "@/lib/utils";

export function AuroraBG({ className, intensity = "default" }: { className?: string; intensity?: "subtle" | "default" | "strong" }) {
  const opacity =
    intensity === "subtle" ? "opacity-55" : intensity === "strong" ? "opacity-90" : "opacity-75";
  return (
    <div className={cn("pointer-events-none absolute inset-0 overflow-hidden", className)} aria-hidden="true">
      <div className="absolute inset-0 bg-grid opacity-45 mask-radial-fade" />
      <div
        className={cn("absolute inset-x-0 -top-32 h-[520px] blur-3xl animate-aurora", opacity)}
        style={{
          background:
            "linear-gradient(115deg, transparent 0%, hsl(167 88% 58% / 0.28) 18%, hsl(190 95% 65% / 0.22) 42%, hsl(255 83% 72% / 0.18) 66%, transparent 100%)",
        }}
      />
      <div
        className="absolute inset-x-0 bottom-0 h-[340px] blur-3xl opacity-70 animate-pulse-slow"
        style={{
          background:
            "linear-gradient(180deg, transparent 0%, hsl(199 100% 94% / 0.8) 45%, hsl(0 0% 100% / 0.95) 100%)",
        }}
      />
    </div>
  );
}
