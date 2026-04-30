import * as React from "react";
import { cn } from "@/lib/utils";

export const GlowCard = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & { glow?: "primary" | "secondary" | "accent" | "none" }
>(({ className, glow = "primary", children, ...props }, ref) => {
  const glowColor =
    glow === "primary"
      ? "from-primary/40 via-primary/0 to-secondary/30"
      : glow === "secondary"
        ? "from-secondary/40 via-secondary/0 to-accent/30"
        : glow === "accent"
          ? "from-accent/40 via-accent/0 to-primary/30"
          : "from-transparent to-transparent";
  return (
    <div ref={ref} className={cn("relative group", className)} {...props}>
      {glow !== "none" && (
        <div
          aria-hidden
          className={cn(
            "pointer-events-none absolute -inset-px rounded-[inherit] bg-gradient-to-br opacity-0 blur transition-opacity duration-500 group-hover:opacity-100",
            glowColor,
          )}
        />
      )}
      <div className="relative h-full w-full rounded-[inherit] border border-border bg-card/60 backdrop-blur-md">
        {children}
      </div>
    </div>
  );
});
GlowCard.displayName = "GlowCard";
