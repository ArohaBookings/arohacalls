import { cn } from "@/lib/utils";

export function GridBG({ className, fade = "radial" }: { className?: string; fade?: "radial" | "bottom" | "none" }) {
  const mask =
    fade === "radial"
      ? "mask-radial-fade"
      : fade === "bottom"
        ? "mask-bottom-fade"
        : "";
  return (
    <div
      className={cn(
        "pointer-events-none absolute inset-0 bg-grid opacity-50",
        mask,
        className,
      )}
      aria-hidden="true"
    />
  );
}

export function DottedGridBG({ className, fade = "radial" }: { className?: string; fade?: "radial" | "bottom" | "none" }) {
  const mask =
    fade === "radial"
      ? "mask-radial-fade"
      : fade === "bottom"
        ? "mask-bottom-fade"
        : "";
  return (
    <div
      className={cn(
        "pointer-events-none absolute inset-0 bg-dots opacity-60",
        mask,
        className,
      )}
      aria-hidden="true"
    />
  );
}
