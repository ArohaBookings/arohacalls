import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  ArrowUpRight,
  BarChart3,
  BookOpen,
  Calendar,
  Check,
  CreditCard,
  Mail,
  Megaphone,
  MessageSquare,
  Minus,
  Phone,
  Sparkles,
  Star,
  Users,
  Workflow,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { GlassPanel, MiniStat, PageShell } from "@/components/marketing/page-shell";
import { JsonLd } from "@/components/marketing/json-ld";
import { AROHA_AI_TOOLS, buildArohaAiUrl, type ArohaTool } from "@/lib/aroha-ai-tools";
import { siteConfig } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "Aroha AI — The Engine Behind Aroha Calls",
  description:
    "Aroha AI is the full self-serve platform: AI receptionist, CRM, booking OS, Email AI, Messages, Aurora business chatbot, knowledge base, workflows, analytics, campaigns, reviews, billing.",
  keywords: [
    "Aroha AI",
    "self-serve AI receptionist",
    "Aroha AI vs Aroha Calls",
    "DIY AI receptionist",
    "AI business platform",
  ],
  alternates: { canonical: `${siteConfig.url}/aroha-ai` },
};

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

const comparison = [
  { feature: "Setup", managed: "We do it for you (24h)", diy: "You do it (15-30 min)" },
  { feature: "Onboarding fee", managed: "Free", diy: "Free" },
  { feature: "Voice AI", managed: "✓ Included", diy: "✓ Included" },
  { feature: "Calendar + Bookings", managed: "✓ Included", diy: "✓ Included" },
  { feature: "CRM", managed: "✓ Essentials+", diy: "✓ Included" },
  { feature: "Email AI", managed: "✓ Essentials+", diy: "✓ Included" },
  { feature: "Messages (SMS/WhatsApp)", managed: "✓ Essentials+", diy: "✓ Included" },
  { feature: "Aurora business chatbot", managed: "✓ Professional+", diy: "✓ Included" },
  { feature: "Knowledge base build", managed: "We build it", diy: "You build it" },
  { feature: "Knowledge base tuning", managed: "We tune monthly", diy: "Self-serve" },
  { feature: "Analytics", managed: "✓ Professional+", diy: "✓ Included" },
  { feature: "Campaigns", managed: "✓ Premium", diy: "✓ Included" },
  { feature: "Workflows / automations", managed: "We build them", diy: "Drag & drop builder" },
  { feature: "Priority support", managed: "✓ Premium", diy: "Email + chat" },
  { feature: "Dedicated success manager", managed: "✓ Premium", diy: "—" },
  { feature: "Starting price", managed: "NZ$99 / US$59", diy: "From US$29 (self-serve)" },
];

export default function ArohaAIPage() {
  const productLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "Aroha AI",
    applicationCategory: "BusinessApplication",
    operatingSystem: "Web",
    offers: {
      "@type": "AggregateOffer",
      priceCurrency: "USD",
      lowPrice: "29",
      highPrice: "399",
      offerCount: 4,
    },
    description: metadata.description,
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "5",
      reviewCount: "12",
      bestRating: "5",
    },
  };

  return (
    <PageShell
      eyebrow="The engine"
      title={<>Aroha AI — the platform powering every Aroha Calls customer.</>}
      description="Aroha Calls is the managed flavour. Aroha AI is the same engine, exposed for you. Voice, calendar, CRM, email, messages, Aurora, knowledge base, workflows, analytics, campaigns, reviews and billing — all in one platform."
      badge={<Sparkles className="h-3 w-3" />}
    >
      <JsonLd data={productLd} />

      <div className="flex flex-col gap-3 sm:flex-row">
        <Button asChild size="lg" variant="gradient" className="group">
          <a href={buildArohaAiUrl({ source: "aroha-ai-page", campaign: "self_serve" })} target="_blank" rel="noreferrer">
            Try Aroha AI free
            <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </a>
        </Button>
        <Button asChild size="lg" variant="outline">
          <Link href="/pricing">
            Or get it managed for you
            <ArrowRight className="h-4 w-4" />
          </Link>
        </Button>
      </div>

      <div className="mt-12 grid gap-4 sm:grid-cols-3">
        <MiniStat label="Tools in one platform" value={`${AROHA_AI_TOOLS.length}`} />
        <MiniStat label="Setup time" value="< 30 min" />
        <MiniStat label="Avg. ROI in 90 days" value="8-15x" />
      </div>

      {/* The full tool surface */}
      <section className="mt-20">
        <Badge variant="glow"><Sparkles className="mr-1 h-3 w-3" /> The full tool surface</Badge>
        <h2 className="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl">Every tool you need to run the front of house.</h2>
        <p className="mt-3 max-w-2xl text-muted-foreground">
          Aroha AI bundles every tool a service business needs to capture, convert and care for customers — in one platform, with one CRM, one inbox, one calendar.
        </p>
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {AROHA_AI_TOOLS.map((tool) => {
            const Icon = ICONS[tool.iconKey];
            return (
              <GlassPanel key={tool.id} className="h-full">
                <div className="flex items-start justify-between gap-3">
                  <span className="grid h-10 w-10 place-items-center rounded-xl border border-primary/30 bg-primary/10 text-primary">
                    <Icon className="h-5 w-5" />
                  </span>
                  {tool.badge ? (
                    <span
                      className={
                        tool.badge === "Live"
                          ? "rounded-full border border-primary/30 bg-primary/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-primary"
                          : "rounded-full border border-secondary/30 bg-secondary/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-secondary"
                      }
                    >
                      {tool.badge}
                    </span>
                  ) : null}
                </div>
                <h3 className="mt-4 text-lg font-semibold tracking-tight">{tool.name}</h3>
                <p className="mt-1 text-xs uppercase tracking-wider text-muted-foreground">{tool.tagline}</p>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{tool.description}</p>
              </GlassPanel>
            );
          })}
        </div>
      </section>

      {/* Managed vs Self-serve comparison */}
      <section className="mt-24">
        <Badge variant="glow">Managed vs Self-serve</Badge>
        <h2 className="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl">Pick the path that matches how you work.</h2>
        <p className="mt-3 max-w-2xl text-muted-foreground">
          Same engine, two delivery models. If you want Leo to build, tune and run it for you — choose Aroha Calls. If you want to configure it yourself — choose Aroha AI.
        </p>

        <div className="mt-10 overflow-hidden rounded-3xl border border-border bg-card/40">
          <div className="grid grid-cols-3 border-b border-border bg-card/60 text-sm">
            <div className="px-5 py-4 font-semibold">Feature</div>
            <div className="px-5 py-4 font-semibold text-primary">Aroha Calls (Managed)</div>
            <div className="px-5 py-4 font-semibold text-secondary">Aroha AI (Self-serve)</div>
          </div>
          {comparison.map((row, i) => (
            <div
              key={row.feature}
              className={`grid grid-cols-3 border-b border-border/60 text-sm last:border-0 ${i % 2 === 0 ? "" : "bg-card/30"}`}
            >
              <div className="px-5 py-3 text-foreground/85">{row.feature}</div>
              <div className="px-5 py-3 text-foreground/90">
                {row.managed === "—" ? <Minus className="h-4 w-4 text-muted-foreground/50" /> : row.managed}
              </div>
              <div className="px-5 py-3 text-foreground/90">
                {row.diy === "—" ? <Minus className="h-4 w-4 text-muted-foreground/50" /> : row.diy}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 grid gap-4 lg:grid-cols-2">
          <GlassPanel className="border-primary/30">
            <Badge variant="glow">Most popular for service businesses</Badge>
            <h3 className="mt-3 text-2xl font-semibold tracking-tight">Aroha Calls — Managed</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Leo personally onboards you, tunes the voice, builds your knowledge base and watches every call for the first week. From NZ$99/month.
            </p>
            <ul className="mt-4 space-y-2 text-sm">
              {["White-glove setup in 24h", "Live in your business the same day", "7-day money-back guarantee", "Cancel anytime"].map((item) => (
                <li key={item} className="flex items-start gap-2 text-foreground/85">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                  {item}
                </li>
              ))}
            </ul>
            <Button asChild className="mt-5 w-full">
              <Link href="/pricing">
                See managed plans
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </GlassPanel>
          <GlassPanel className="border-secondary/30">
            <Badge variant="secondary" className="bg-secondary/15 text-secondary">For technical operators</Badge>
            <h3 className="mt-3 text-2xl font-semibold tracking-tight">Aroha AI — Self-serve</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Build it yourself with the same Aroha engine. Configure voice, rules, CRM, workflows. No setup wait.
            </p>
            <ul className="mt-4 space-y-2 text-sm">
              {["DIY setup in under 30 min", "Same voice + brain as Aroha Calls", "Pay-as-you-grow pricing", "Free trial — no card"].map((item) => (
                <li key={item} className="flex items-start gap-2 text-foreground/85">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-secondary" />
                  {item}
                </li>
              ))}
            </ul>
            <Button asChild variant="outline" className="mt-5 w-full">
              <a
                href={buildArohaAiUrl({ source: "aroha-ai-page", campaign: "self_serve_compare" })}
                target="_blank"
                rel="noreferrer"
              >
                Try Aroha AI free
                <ArrowUpRight className="h-4 w-4" />
              </a>
            </Button>
          </GlassPanel>
        </div>
      </section>

      {/* Aurora deep dive */}
      <section className="mt-24">
        <GlassPanel className="overflow-hidden">
          <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
            <div>
              <Badge variant="glow"><Sparkles className="mr-1 h-3 w-3" /> Meet Aurora</Badge>
              <h2 className="mt-4 text-3xl font-semibold tracking-tight">Aurora is your business co-pilot.</h2>
              <p className="mt-3 text-muted-foreground">
                Aurora is the assistant baked into Aroha AI. Ask Aurora about a customer, a missed lead, a booking pattern, or what your team should do next — Aurora pulls the data and gives you a real answer.
              </p>
              <ul className="mt-5 space-y-2 text-sm">
                {[
                  "What's the time of day we miss the most calls?",
                  "Which customers haven't booked in 90 days?",
                  "Draft a quote follow-up for Sarah J.",
                  "Summarise yesterday's calls in 5 bullet points.",
                ].map((q) => (
                  <li key={q} className="flex items-start gap-2 text-foreground/85">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                    <span>&ldquo;{q}&rdquo;</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-2xl border border-border bg-background/40 p-5">
              <div className="space-y-3 text-sm">
                <div className="rounded-xl border border-border bg-card/60 px-4 py-3">
                  <p className="text-xs uppercase tracking-wider text-muted-foreground">You</p>
                  <p className="mt-1">What did Aroha do for us last week?</p>
                </div>
                <div className="rounded-xl border border-primary/30 bg-primary/10 px-4 py-3">
                  <p className="text-xs uppercase tracking-wider text-primary">Aurora</p>
                  <p className="mt-1 text-foreground/90">
                    Last week Aroha answered <strong>184 calls</strong> (4 missed during a network blip on Wed AM, all called back automatically). It booked <strong>62 appointments</strong> and sent <strong>89 follow-up SMS</strong>. Top callers: Sarah J. (returning), Liam R. (new quote, $2,400 job booked), and 12 first-time callers from your Google Ads.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </GlassPanel>
      </section>

      {/* Final CTA */}
      <section className="mt-24">
        <GlassPanel>
          <div className="flex flex-col items-start gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">One engine. Two ways to start.</h2>
              <p className="mt-2 text-sm text-muted-foreground">
                Try Aroha AI free with no card required, or get Aroha Calls managed for you with a free demo.
              </p>
            </div>
            <div className="flex flex-col gap-2 sm:flex-row">
              <Button asChild variant="gradient" size="lg" className="group">
                <a href={buildArohaAiUrl({ source: "aroha-ai-page", campaign: "footer_cta" })} target="_blank" rel="noreferrer">
                  Try Aroha AI
                  <ArrowUpRight className="h-4 w-4" />
                </a>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link href="/demo">Book a free demo</Link>
              </Button>
            </div>
          </div>
        </GlassPanel>
      </section>
    </PageShell>
  );
}
