import Link from "next/link";
import { Camera, Mail } from "lucide-react";
import { Logo } from "@/components/marketing/logo";
import { navFooter, siteConfig } from "@/lib/site-config";

export function Footer() {
  return (
    <footer className="relative mt-32 border-t border-border/60 bg-background">
      <div className="container-tight grid gap-10 py-16 lg:grid-cols-12">
        <div className="lg:col-span-4">
          <Logo className="text-base" />
          <p className="mt-4 max-w-xs text-sm text-muted-foreground">
            Aroha Calls and Aroha AI are part of Aroha Group: one front-office system
            for calls, bookings, email, messages, CRM, and follow-up.
          </p>
          <div className="mt-6 flex items-center gap-3">
            <a
              href={siteConfig.social.instagram}
              target="_blank"
              rel="noreferrer"
              className="grid h-9 w-9 place-items-center rounded-full border border-border text-muted-foreground transition-colors hover:border-foreground/30 hover:text-foreground"
              aria-label="Instagram"
            >
              <Camera className="h-4 w-4" />
            </a>
            <a
              href={`mailto:${siteConfig.email}`}
              className="grid h-9 w-9 place-items-center rounded-full border border-border text-muted-foreground transition-colors hover:border-foreground/30 hover:text-foreground"
              aria-label="Email"
            >
              <Mail className="h-4 w-4" />
            </a>
          </div>
          <div className="mt-6 space-y-1.5 text-sm text-muted-foreground">
            <p>
              <a href={`tel:${siteConfig.phones.sales.e164}`} className="font-medium text-primary hover:underline">
                {siteConfig.phones.sales.flag} {siteConfig.phones.sales.display}
              </a>
              {" "}— Grace from Aroha
            </p>
            <p>
              <a href={`tel:${siteConfig.phones.nz.e164}`} className="hover:text-foreground hover:underline">
                {siteConfig.phones.nz.flag} {siteConfig.phones.nz.display}
              </a>
              {" "}— NZ live demo
            </p>
            <p>
              <a href={`tel:${siteConfig.phones.us.e164}`} className="hover:text-foreground hover:underline">
                {siteConfig.phones.us.flag} {siteConfig.phones.us.display}
              </a>
              {" "}— US live demo
            </p>
            <p>
              <Link className="underline-offset-4 hover:text-foreground hover:underline" href={`mailto:${siteConfig.email}`}>
                {siteConfig.email}
              </Link>
            </p>
          </div>
        </div>
        <div className="lg:col-span-8 grid grid-cols-2 gap-8 sm:grid-cols-3 lg:grid-cols-6">
          <div>
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-foreground/60">Product</p>
            <ul className="space-y-2.5 text-sm">
              {navFooter.product.map((item) => (
                <li key={item.href}>
                  <Link className="text-muted-foreground transition-colors hover:text-foreground" href={item.href}>
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-foreground/60">Industries</p>
            <ul className="space-y-2.5 text-sm">
              {navFooter.industries.map((item) => (
                <li key={item.href}>
                  <Link className="text-muted-foreground transition-colors hover:text-foreground" href={item.href}>
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-foreground/60">Locations</p>
            <ul className="space-y-2.5 text-sm">
              {navFooter.locations.map((item) => (
                <li key={item.href}>
                  <Link className="text-muted-foreground transition-colors hover:text-foreground" href={item.href}>
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-foreground/60">Compare</p>
            <ul className="space-y-2.5 text-sm">
              {navFooter.compare.map((item) => (
                <li key={item.href}>
                  <Link className="text-muted-foreground transition-colors hover:text-foreground" href={item.href}>
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-foreground/60">Company</p>
            <ul className="space-y-2.5 text-sm">
              {navFooter.company.map((item) => (
                <li key={item.href}>
                  <Link className="text-muted-foreground transition-colors hover:text-foreground" href={item.href}>
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-foreground/60">Legal</p>
            <ul className="space-y-2.5 text-sm">
              {navFooter.legal.map((item) => (
                <li key={item.href}>
                  <Link className="text-muted-foreground transition-colors hover:text-foreground" href={item.href}>
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
      <div className="border-t border-border/60">
        <div className="container-tight flex flex-col items-center justify-between gap-3 py-6 sm:flex-row">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} Aroha Group. Built for businesses that cannot afford to miss the next call.
          </p>
          <p className="text-xs text-muted-foreground">
            Part of{" "}
            <Link href="/aroha-ai" className="text-foreground underline-offset-4 hover:underline">
              Aroha Group
            </Link>
          </p>
        </div>
      </div>
    </footer>
  );
}
