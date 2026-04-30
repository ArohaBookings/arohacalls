import Link from "next/link";
import {
  ArrowUpRight,
  BarChart3,
  BookOpen,
  Calendar,
  CreditCard,
  Lock,
  Mail,
  MessageSquare,
  Phone,
  Sparkles,
  Star,
  Users,
  Workflow,
  Megaphone,
} from "lucide-react";
import { AROHA_AI_TOOLS, buildArohaAiUrl, type ArohaTool } from "@/lib/aroha-ai-tools";
import { cn } from "@/lib/utils";

const ICONS: Record<ArohaTool["iconKey"], React.ComponentType<{ className?: string }>> = {
  phone: Phone,
  mail: Mail,
  messages: MessageSquare,
  calendar: Calendar,
  users: Users,
  sparkles: Sparkles,
  book: BookOpen,
  workflow: Workflow,
  analytics: BarChart3,
  campaign: Megaphone,
  star: Star,
  card: CreditCard,
};

export function ArohaAILauncher({
  email,
  planId,
}: {
  email?: string | null;
  planId?: "lite" | "essentials" | "professional" | "premium" | null;
}) {
  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">Aroha AI access</p>
          <h2 className="mt-2 text-2xl font-semibold tracking-tight">Every tool you paid for, one click away.</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Aroha Calls is the managed flavour. Aroha AI is the same engine, exposed for you to inspect, tune and run.
          </p>
        </div>
        <Link
          href={buildArohaAiUrl({ email })}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-2 rounded-full border border-primary/40 bg-primary/10 px-4 py-2 text-sm font-medium text-primary transition hover:border-primary hover:bg-primary/15"
        >
          Open Aroha AI dashboard
          <ArrowUpRight className="h-3.5 w-3.5" />
        </Link>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {AROHA_AI_TOOLS.map((tool) => {
          const Icon = ICONS[tool.iconKey];
          const unlocked = !planId || tool.plans.includes(planId);
          const href = unlocked ? buildArohaAiUrl({ email, path: tool.arohaPath }) : "/dashboard/plan";
          return (
            <Link
              key={tool.id}
              href={href}
              target={unlocked ? "_blank" : undefined}
              rel={unlocked ? "noreferrer" : undefined}
              className={cn(
                "group relative overflow-hidden rounded-2xl border p-5 transition",
                unlocked
                  ? "border-border bg-card/55 hover:border-primary/40 hover:bg-card/80"
                  : "border-border/60 bg-card/30 opacity-80 hover:opacity-100",
              )}
            >
              <div className="flex items-start justify-between gap-3">
                <span
                  className={cn(
                    "grid h-10 w-10 place-items-center rounded-xl border",
                    unlocked
                      ? "border-primary/30 bg-primary/10 text-primary"
                      : "border-border bg-card text-muted-foreground",
                  )}
                >
                  <Icon className="h-5 w-5" />
                </span>
                {unlocked ? (
                  tool.badge ? (
                    <span
                      className={cn(
                        "rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider",
                        tool.badge === "Live"
                          ? "border-primary/30 bg-primary/10 text-primary"
                          : tool.badge === "Beta"
                            ? "border-secondary/30 bg-secondary/10 text-secondary"
                            : "border-border bg-card text-muted-foreground",
                      )}
                    >
                      {tool.badge}
                    </span>
                  ) : null
                ) : (
                  <span className="inline-flex items-center gap-1 rounded-full border border-border/70 bg-card/40 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                    <Lock className="h-3 w-3" />
                    Upgrade
                  </span>
                )}
              </div>
              <h3 className="mt-4 text-base font-semibold tracking-tight text-foreground">{tool.name}</h3>
              <p className="mt-1 text-xs uppercase tracking-wider text-muted-foreground">{tool.tagline}</p>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{tool.description}</p>
              <div className="mt-4 inline-flex items-center gap-1 text-xs font-medium text-primary opacity-0 transition group-hover:opacity-100">
                {unlocked ? "Open in Aroha AI" : "Upgrade plan to unlock"}
                <ArrowUpRight className="h-3 w-3" />
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
