import Link from "next/link";
import { ArrowRight, Wand2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export function ArohaAICTA() {
  return (
    <section className="relative py-24">
      <div className="container-tight">
        <div className="relative overflow-hidden rounded-[2.5rem] border border-border bg-card/40 p-10 lg:p-16">
          <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-secondary via-primary to-accent" aria-hidden="true" />
          <div className="absolute inset-0 bg-grid mask-radial-fade opacity-30" aria-hidden="true" />
          <div className="relative grid gap-10 lg:grid-cols-2">
            <div>
              <Badge variant="secondary" className="bg-secondary/15 text-secondary">
                <Wand2 className="mr-1 h-3 w-3" />
                Want to DIY? Meet Aroha AI
              </Badge>
              <h2 className="mt-4 text-balance text-3xl font-semibold tracking-tight sm:text-4xl">
                One Aroha Group engine. Two ways to run it.
              </h2>
              <p className="mt-4 max-w-xl text-pretty text-muted-foreground">
                Aroha Calls is the managed service: Leo builds, tunes, and runs it for you. Aroha AI is the
                self-serve platform behind the scenes for owners who want to configure voice, email,
                CRM, calendars, and workflows themselves.
              </p>
              <div className="mt-7 flex flex-wrap items-center gap-3">
                <Button asChild variant="gradient" size="lg" className="group">
                  <a href="https://arohaai.app" target="_blank" rel="noreferrer">
                    Try Aroha AI free
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                  </a>
                </Button>
                <Button asChild variant="outline" size="lg">
                  <Link href="/aroha-ai">Compare managed vs self-serve</Link>
                </Button>
              </div>
            </div>
            <div className="relative">
              <div className="grid grid-cols-2 gap-4">
                <div className="rounded-2xl border border-border bg-background/40 p-5">
                  <p className="text-xs uppercase tracking-wider text-muted-foreground">Aroha Calls</p>
                  <p className="mt-1 text-sm font-medium text-foreground">Fully managed</p>
                  <ul className="mt-3 space-y-1.5 text-xs text-muted-foreground">
                    <li>Leo personally onboards</li>
                    <li>White-glove setup</li>
                    <li>Priority support</li>
                    <li>From NZ$99/mo</li>
                  </ul>
                </div>
                <div className="rounded-2xl border border-secondary/40 bg-secondary/5 p-5 shadow-[0_0_64px_-32px_hsl(var(--secondary)/0.6)]">
                  <p className="text-xs uppercase tracking-wider text-secondary">Aroha AI</p>
                  <p className="mt-1 text-sm font-medium text-foreground">Self-serve platform</p>
                  <ul className="mt-3 space-y-1.5 text-xs text-muted-foreground">
                    <li>Build it yourself</li>
                    <li>Same voice + brain</li>
                    <li>Lower starting price</li>
                    <li>arohaai.app</li>
                  </ul>
                </div>
              </div>
              <div className="mt-4 rounded-2xl border border-border bg-background/40 p-5">
                <p className="text-xs uppercase tracking-wider text-muted-foreground">Already on Aroha Calls?</p>
                <p className="mt-1 text-sm text-foreground/85">
                  Your dashboard pre-identifies your account on arohaai.app — open Aurora, view live transcripts and edit policies.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
