import { cn } from "@/lib/utils";
import type { Plan } from "@/lib/plans";

/**
 * SoftwareBox — a CSS-only 3D rendering of a "boxed" software product.
 * Inspired by 90s/00s software packaging, modernized.
 * Per-plan: gradient + short code + subtitle.
 */
export function SoftwareBox({
  plan,
  size = "md",
  className,
  floating = true,
}: {
  plan: Plan;
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
  floating?: boolean;
}) {
  const dims =
    size === "sm"
      ? { w: 180, h: 240, d: 60 }
      : size === "md"
        ? { w: 240, h: 320, d: 80 }
        : size === "lg"
          ? { w: 300, h: 400, d: 100 }
          : { w: 360, h: 480, d: 120 };
  const front = `linear-gradient(155deg, ${plan.theme.gradient[0]} 0%, ${plan.theme.gradient[1]} 100%)`;
  const side = `linear-gradient(180deg, ${plan.theme.gradient[0]} 0%, hsl(0 0% 8%) 100%)`;
  const top = `linear-gradient(180deg, hsl(0 0% 100% / 0.96) 0%, hsl(0 0% 90% / 0.92) 100%)`;
  return (
    <div
      className={cn("relative inline-block perspective-1000", floating && "animate-pulse-slow", className)}
      style={{ perspective: "1400px" }}
    >
      <div
        className="relative"
        style={{
          width: dims.w,
          height: dims.h,
          transformStyle: "preserve-3d",
          transform: "rotateY(-22deg) rotateX(6deg)",
        }}
      >
        {/* Front face */}
        <div
          className="absolute inset-0 rounded-2xl overflow-hidden shadow-2xl"
          style={{
            background: front,
            transform: `translateZ(${dims.d / 2}px)`,
            boxShadow: `0 50px 120px -30px ${plan.theme.gradient[0]}66, 0 30px 60px -20px rgba(0,0,0,0.6)`,
          }}
        >
          <BoxFront plan={plan} />
        </div>

        {/* Right side face */}
        <div
          className="absolute top-0 right-0 h-full overflow-hidden"
          style={{
            width: `${dims.d}px`,
            background: side,
            transform: `rotateY(90deg) translateZ(${dims.w - dims.d / 2}px)`,
            transformOrigin: "left center",
          }}
        >
          <BoxSpine plan={plan} />
        </div>

        {/* Top face */}
        <div
          className="absolute left-0 top-0 w-full"
          style={{
            height: `${dims.d}px`,
            background: top,
            transform: `rotateX(90deg) translateZ(${dims.d / 2}px)`,
            transformOrigin: "center top",
          }}
        >
          <BoxTop plan={plan} />
        </div>
      </div>

      {/* Floor reflection */}
      <div
        className="pointer-events-none absolute left-1/2 -translate-x-1/2"
        style={{
          width: dims.w * 0.95,
          height: dims.d * 1.4,
          top: dims.h - 20,
          background: `radial-gradient(ellipse at center, ${plan.theme.gradient[0]}55 0%, transparent 70%)`,
          filter: "blur(20px)",
        }}
        aria-hidden="true"
      />
    </div>
  );
}

function BoxFront({ plan }: { plan: Plan }) {
  return (
    <div className="relative h-full w-full overflow-hidden text-foreground">
      {/* Top white panel with logo + product name */}
      <div className="absolute inset-x-0 top-0 h-[28%] bg-white/97 px-5 py-4 text-foreground">
        <div className="flex items-center gap-2">
          <span
            className="grid h-8 w-8 place-items-center rounded-lg shadow-sm"
            style={{ background: `linear-gradient(135deg, ${plan.theme.gradient[0]}, ${plan.theme.gradient[1]})` }}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
              <path d="M12 2c1.5 3.5 1.5 7 0 10.5C10.5 16 7 16 5 14.5 3 13 3 9.5 5 8c2-1.5 5.5-1.5 7 0z" />
              <path d="M12 13c-1 4-1 7 0 9 1-2 1-5 0-9z" />
            </svg>
          </span>
          <div className="leading-tight">
            <div className="text-sm font-bold tracking-tight text-zinc-900">Aroha Calls</div>
            <div className="text-[10px] font-medium uppercase tracking-[0.16em] text-zinc-500">Managed AI receptionist</div>
          </div>
        </div>
      </div>

      {/* Middle band — plan name */}
      <div
        className="absolute inset-x-0 px-5 py-4 text-white"
        style={{ top: "28%", height: "44%" }}
      >
        <div className="text-[11px] font-semibold uppercase tracking-[0.22em] opacity-80">{plan.theme.subtitle}</div>
        <div className="mt-1 text-3xl font-bold leading-none tracking-tight">{plan.name}</div>
        <div className="mt-3 text-xs leading-snug opacity-90">{plan.tagline}</div>

        {/* Stat chips */}
        <div className="mt-4 grid grid-cols-2 gap-1.5">
          {plan.highlights.slice(0, 4).map((h) => (
            <div key={h.label} className="rounded-md bg-white/15 px-2 py-1 backdrop-blur-sm">
              <div className="text-[8px] font-semibold uppercase tracking-wider opacity-75">{h.label}</div>
              <div className="text-[11px] font-bold leading-tight">{h.value}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom white panel — version + price */}
      <div className="absolute inset-x-0 bottom-0 h-[28%] bg-white/97 px-5 py-3 text-foreground">
        <div className="flex h-full items-end justify-between">
          <div>
            <div className="text-[10px] font-semibold uppercase tracking-wider text-zinc-500">{plan.theme.shortCode}</div>
            <div className="text-[10px] text-zinc-500">v2026.4</div>
          </div>
          <div className="text-right">
            <div className="text-[10px] font-semibold uppercase tracking-wider text-zinc-500">From</div>
            <div className="text-base font-bold leading-tight tracking-tight text-zinc-900">NZ${plan.priceNZD}/mo</div>
          </div>
        </div>
      </div>

      {/* Subtle shine */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background: "linear-gradient(120deg, rgba(255,255,255,0.16) 0%, transparent 30%, transparent 70%, rgba(0,0,0,0.18) 100%)",
        }}
        aria-hidden="true"
      />
    </div>
  );
}

function BoxSpine({ plan }: { plan: Plan }) {
  return (
    <div className="relative h-full w-full overflow-hidden">
      <div className="absolute inset-x-0 top-3 text-center text-[8px] font-bold uppercase tracking-[0.2em] text-white/85">
        Aroha
      </div>
      <div
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 whitespace-nowrap text-xs font-bold uppercase tracking-[0.18em] text-white"
        style={{ transform: "translate(-50%, -50%) rotate(90deg)" }}
      >
        {plan.name} · {plan.theme.subtitle}
      </div>
      <div className="absolute inset-x-0 bottom-3 text-center text-[8px] font-semibold uppercase tracking-wider text-white/85">
        {plan.theme.shortCode}
      </div>
    </div>
  );
}

function BoxTop({ plan }: { plan: Plan }) {
  return (
    <div className="flex h-full w-full items-center justify-center">
      <div
        className="h-[2px] w-2/3 rounded-full"
        style={{ background: `linear-gradient(90deg, ${plan.theme.gradient[0]}, ${plan.theme.gradient[1]})` }}
      />
    </div>
  );
}
