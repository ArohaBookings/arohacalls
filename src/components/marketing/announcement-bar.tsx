import Link from "next/link";
import { ArrowUpRight, PhoneCall, Sparkles } from "lucide-react";

export function AnnouncementBar() {
  return (
    <div className="relative isolate flex flex-wrap items-center justify-center gap-x-4 gap-y-1 overflow-hidden border-b border-border/60 bg-card/40 px-4 py-2 text-xs text-muted-foreground backdrop-blur-md">
      <p className="inline-flex items-center gap-1.5">
        <PhoneCall className="h-3.5 w-3.5 text-primary" />
        Want to hear from Grace from Aroha? Call{" "}
        <a href="tel:+6436672033" className="text-foreground font-semibold underline-offset-4 hover:underline">
          +64 3 667 2033
        </a>
        <span className="hidden sm:inline">— Grace answers, understands the pain, and explains the right setup live.</span>
      </p>
      <span className="hidden h-3 w-px bg-border sm:block" />
      <p className="inline-flex items-center gap-1.5">
        <Sparkles className="h-3.5 w-3.5 text-secondary" />
        <Link href="/aroha-ai" className="text-foreground inline-flex items-center gap-1 font-medium underline-offset-4 hover:underline">
          Aroha AI self-serve is live
          <ArrowUpRight className="h-3.5 w-3.5" />
        </Link>
      </p>
    </div>
  );
}
