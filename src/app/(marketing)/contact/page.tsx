import type { Metadata } from "next";
import Link from "next/link";
import { Mail, Phone } from "lucide-react";
import { SmartForm } from "@/components/marketing/forms";
import { PageHero, SectionBand, GlassPanel } from "@/components/marketing/page-shell";
import { siteConfig } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "Contact",
  description: "Contact Aroha Calls for support, billing, demo requests, and AI receptionist questions.",
  alternates: { canonical: "/contact" },
};

export default function ContactPage() {
  return (
    <>
      <PageHero
        title={<>Contact Aroha Calls.</>}
        description="Have a question, need support, or want to see Aroha Calls in action? Send a message and we will respond within 24 hours."
        cta={{ href: "/demo", label: "Book a free demo" }}
      />
      <SectionBand>
        <div className="container-tight grid gap-8 lg:grid-cols-[0.8fr_1.2fr]">
          <GlassPanel>
            <Mail className="h-7 w-7 text-primary" />
            <h2 className="mt-4 text-2xl font-semibold tracking-tight">Support and billing</h2>
            <div className="mt-5 space-y-3 text-sm text-muted-foreground">
              <p>
                Email:{" "}
                <Link className="text-foreground underline-offset-4 hover:underline" href={`mailto:${siteConfig.email}`}>
                  {siteConfig.email}
                </Link>
              </p>
              <p>Business hours: Monday to Friday, 9:00am to 5:00pm NZST.</p>
              <p>Response time: usually within one business day.</p>
            </div>
            <div className="mt-6 rounded-2xl border border-border bg-card/60 p-4">
              <div className="flex items-center gap-2 text-sm font-medium">
                <Phone className="h-4 w-4 text-primary" />
                Prefer to hear it first?
              </div>
              <p className="mt-2 text-sm text-muted-foreground">Call {siteConfig.phones.nz.display} or {siteConfig.phones.us.display} anytime.</p>
            </div>
          </GlassPanel>
          <GlassPanel className="p-7">
            <h2 className="text-2xl font-semibold tracking-tight">Let&apos;s talk about your business.</h2>
            <p className="mt-3 text-sm leading-6 text-muted-foreground">
              No spam, no pressure, and no hard sell. Just useful answers from a real person.
            </p>
            <div className="mt-6">
              <SmartForm
                endpoint="/api/contact"
                submitLabel="Send message"
                successMessage="Message sent. We will reply soon."
                fields={[
                  { name: "name", label: "Your name", required: true },
                  { name: "businessName", label: "Business name" },
                  { name: "email", label: "Email address", type: "email", required: true },
                  { name: "phone", label: "Phone number" },
                  { name: "message", label: "How can we help?", textarea: true, required: true },
                ]}
              />
            </div>
          </GlassPanel>
        </div>
      </SectionBand>
    </>
  );
}
