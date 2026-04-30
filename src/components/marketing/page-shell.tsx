import type { HTMLAttributes, ReactNode } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function PageHero({
  title,
  description,
  cta,
  secondary,
  className,
}: {
  title: ReactNode;
  description: string;
  cta?: { href: string; label: string };
  secondary?: { href: string; label: string };
  className?: string;
}) {
  return (
    <section className={cn("relative isolate overflow-hidden border-b border-border/60 py-20 sm:py-28", className)}>
      <div className="absolute inset-0 -z-10 bg-grid opacity-30" />
      <div className="absolute inset-x-0 top-0 -z-10 h-40 bg-gradient-to-b from-primary/12 via-secondary/8 to-transparent blur-2xl" />
      <div className="absolute inset-x-0 bottom-0 -z-10 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
      <div className="container-tight">
        <h1 className="max-w-4xl text-balance text-4xl font-semibold leading-[1.04] tracking-tight sm:text-6xl">
          {title}
        </h1>
        <p className="mt-6 max-w-2xl text-pretty text-lg leading-8 text-muted-foreground">
          {description}
        </p>
        {(cta || secondary) && (
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            {cta && (
              <Button asChild size="lg">
                <Link href={cta.href}>
                  {cta.label}
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            )}
            {secondary && (
              <Button asChild size="lg" variant="outline">
                <Link href={secondary.href}>{secondary.label}</Link>
              </Button>
            )}
          </div>
        )}
      </div>
    </section>
  );
}

export function SectionBand({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return <section className={cn("py-20 sm:py-24", className)}>{children}</section>;
}

export function GlassPanel({
  children,
  className,
  ...props
}: {
  children: ReactNode;
  className?: string;
} & HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "rounded-[1.55rem] border border-white/10 bg-card/65 p-6 shadow-[0_24px_80px_rgba(0,0,0,0.32)] backdrop-blur-xl",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export function MiniStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-border bg-card/45 p-4">
      <p className="text-2xl font-semibold tracking-tight text-foreground">{value}</p>
      <p className="mt-1 text-xs text-muted-foreground">{label}</p>
    </div>
  );
}

/**
 * Shorthand wrapper that renders a styled hero + a content container.
 * Used by industry, location, and other lightweight landing pages.
 */
export function PageShell({
  eyebrow,
  badge,
  title,
  description,
  children,
}: {
  eyebrow?: string;
  badge?: ReactNode;
  title: ReactNode;
  description: string;
  children: ReactNode;
}) {
  return (
    <>
      <section className="relative isolate overflow-hidden border-b border-border/60 py-20 sm:py-28">
        <div className="absolute inset-0 -z-10 bg-grid opacity-30" />
        <div className="absolute inset-x-0 top-0 -z-10 h-40 bg-gradient-to-b from-primary/12 via-secondary/8 to-transparent blur-2xl" />
        <div className="absolute inset-x-0 bottom-0 -z-10 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
        <div className="container-tight">
          {(eyebrow || badge) && (
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/5 px-3 py-1 text-xs font-medium uppercase tracking-[0.18em] text-primary">
              {badge ?? <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />}
              {eyebrow}
            </div>
          )}
          <h1 className="max-w-4xl text-balance text-4xl font-semibold leading-[1.04] tracking-tight sm:text-6xl">
            {title}
          </h1>
          <p className="mt-6 max-w-2xl text-pretty text-lg leading-8 text-muted-foreground">
            {description}
          </p>
        </div>
      </section>
      <section className="py-16 sm:py-20">
        <div className="container-tight">{children}</div>
      </section>
    </>
  );
}
