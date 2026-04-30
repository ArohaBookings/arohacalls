import Link from "next/link";
import { ArrowRight, PhoneCall } from "lucide-react";
import { Button } from "@/components/ui/button";

export function FooterCTA() {
  return (
    <section className="relative py-24">
      <div className="container-tight">
        <div className="relative overflow-hidden rounded-[2.5rem] border border-border bg-card/55 p-12 text-center shadow-[0_24px_120px_rgba(0,0,0,0.32)] lg:p-20">
          <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-primary via-secondary to-accent" aria-hidden="true" />
          <div className="absolute inset-0 bg-grid mask-radial-fade opacity-25" aria-hidden="true" />
          <h2 className="relative mx-auto max-w-2xl text-balance text-3xl font-semibold tracking-tight sm:text-5xl">
            Your next caller should become a booking, not a voicemail.
          </h2>
          <p className="relative mx-auto mt-4 max-w-xl text-pretty text-muted-foreground">
            Bring your real business details. Leo will show you the exact AI receptionist, inbox, follow-up,
            and booking workflow Aroha Group would run for you.
          </p>
          <div className="relative mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Button asChild size="xl" className="group">
              <Link href="/demo">
                Book your free demo
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </Link>
            </Button>
            <Button asChild size="xl" variant="outline">
              <a href="tel:+6436672039">
                <PhoneCall className="h-4 w-4" />
                Call our live demo line
              </a>
            </Button>
          </div>
          <p className="relative mt-6 text-xs text-muted-foreground">
            7-day money-back guarantee · Cancel anytime · Live the same day
          </p>
        </div>
      </div>
    </section>
  );
}
