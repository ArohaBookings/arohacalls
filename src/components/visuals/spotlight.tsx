"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export function SpotlightCard({
  className,
  children,
  glowOpacity = 0.45,
}: {
  className?: string;
  children: React.ReactNode;
  glowOpacity?: number;
}) {
  const cardRef = React.useRef<HTMLDivElement>(null);
  const [pos, setPos] = React.useState({ x: 0, y: 0, opacity: 0 });

  function handleMove(e: React.MouseEvent<HTMLDivElement>) {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    setPos({ x: e.clientX - rect.left, y: e.clientY - rect.top, opacity: glowOpacity });
  }
  function handleLeave() {
    setPos((p) => ({ ...p, opacity: 0 }));
  }

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      className={cn("group relative overflow-hidden rounded-2xl border border-border bg-card/60", className)}
    >
      <div
        className="pointer-events-none absolute -inset-px transition-opacity duration-300"
        style={{
          opacity: pos.opacity,
          background: `radial-gradient(360px circle at ${pos.x}px ${pos.y}px, hsl(var(--primary) / 0.18), transparent 70%)`,
        }}
        aria-hidden="true"
      />
      <div className="relative h-full w-full">{children}</div>
    </div>
  );
}
