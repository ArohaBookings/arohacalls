import Link from "next/link";
import { ArrowRight, CheckCircle2, SlidersHorizontal, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

const models = [
  {
    title: "Aroha Calls",
    subtitle: "Done-for-you. We build it, tune it, manage it.",
    description:
      "Best when you want the phone answered and the whole system handled for you. Leo sets up the voice, booking rules, knowledge, follow-up, and support path.",
    icon: Sparkles,
    href: "/demo",
    cta: "Get it set up",
    accent: "primary",
  },
  {
    title: "Aroha AI",
    subtitle: "Self-serve. You build and control it yourself.",
    description:
      "Best when you want direct control of the same engine: voice, CRM, Email AI, messages, calendar rules, automations, and Aurora inside arohaai.app.",
    icon: SlidersHorizontal,
    href: "/aroha-ai",
    cta: "Compare self-serve",
    accent: "secondary",
  },
] as const;

export function BrandSplit() {
  return (
    <section className="relative overflow-hidden border-y border-white/10 bg-[#071018] py-14 sm:py-16">
      <div className="absolute inset-0 bg-grid opacity-20" aria-hidden="true" />
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/70 to-transparent" aria-hidden="true" />
      <div className="container-tight relative">
        <div className="grid gap-5 lg:grid-cols-[0.72fr_1.28fr] lg:items-stretch">
          <div className="flex flex-col justify-between rounded-[1.75rem] border border-white/10 bg-white/[0.035] p-6 sm:p-8">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.16em] text-primary">One Aroha Group engine</p>
              <h2 className="mt-4 text-balance text-3xl font-semibold tracking-tight sm:text-4xl">
                Pick managed or self-serve. Same core system.
              </h2>
            </div>
            <p className="mt-5 text-pretty text-sm leading-6 text-muted-foreground">
              Aroha Calls is what businesses buy when they want the result handled for them. Aroha AI is the platform behind it for owners who want to build and control the setup themselves.
            </p>
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            {models.map((model) => {
              const Icon = model.icon;
              const isPrimary = model.accent === "primary";
              return (
                <article
                  key={model.title}
                  className="relative overflow-hidden rounded-[1.75rem] border border-white/10 bg-card/65 p-6 shadow-[0_24px_90px_rgba(0,0,0,0.28)] sm:p-8"
                >
                  <div
                    className={`absolute inset-x-0 top-0 h-1 bg-gradient-to-r ${
                      isPrimary ? "from-primary via-cyan-300 to-secondary" : "from-secondary via-accent to-primary"
                    }`}
                    aria-hidden="true"
                  />
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="text-2xl font-semibold tracking-tight">{model.title}</h3>
                      <p className="mt-2 text-base font-medium text-foreground/88">{model.subtitle}</p>
                    </div>
                    <span
                      className={`grid h-11 w-11 shrink-0 place-items-center rounded-2xl border ${
                        isPrimary ? "border-primary/35 bg-primary/12 text-primary" : "border-secondary/35 bg-secondary/12 text-secondary"
                      }`}
                    >
                      <Icon className="h-5 w-5" />
                    </span>
                  </div>
                  <p className="mt-5 text-sm leading-6 text-muted-foreground">{model.description}</p>
                  <div className="mt-6 flex flex-wrap items-center gap-3">
                    <Button asChild variant={isPrimary ? "default" : "outline"}>
                      <Link href={model.href}>
                        {model.cta}
                        <ArrowRight className="h-4 w-4" />
                      </Link>
                    </Button>
                    {isPrimary ? (
                      <Link href="/pricing" className="inline-flex items-center gap-2 text-sm text-primary hover:underline">
                        <CheckCircle2 className="h-4 w-4" />
                        View plans
                      </Link>
                    ) : (
                      <a href="https://arohaai.app" className="inline-flex items-center gap-2 text-sm text-secondary hover:underline" target="_blank" rel="noreferrer">
                        Open arohaai.app
                        <ArrowRight className="h-4 w-4" />
                      </a>
                    )}
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
