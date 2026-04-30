"use client";

import { motion } from "motion/react";
import { cn } from "@/lib/utils";

export function VoiceWave({ className, bars = 24, color = "primary" }: { className?: string; bars?: number; color?: "primary" | "secondary" | "accent" }) {
  const colorClass =
    color === "primary"
      ? "bg-primary"
      : color === "secondary"
        ? "bg-secondary"
        : "bg-accent";
  return (
    <div className={cn("flex h-10 items-center gap-[3px]", className)}>
      {Array.from({ length: bars }).map((_, i) => {
        const delay = (i * 0.07) % 1.4;
        return (
          <motion.span
            key={i}
            className={cn("w-[3px] rounded-full", colorClass)}
            initial={{ height: 4 }}
            animate={{
              height: [4, 18 + (i % 5) * 4, 4],
              opacity: [0.55, 1, 0.55],
            }}
            transition={{
              duration: 1.1 + (i % 4) * 0.15,
              repeat: Infinity,
              ease: "easeInOut",
              delay,
            }}
          />
        );
      })}
    </div>
  );
}
