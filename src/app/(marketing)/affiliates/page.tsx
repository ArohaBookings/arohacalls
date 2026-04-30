import type { Metadata } from "next";
import { Link2, Percent, Send } from "lucide-react";
import { SmartForm } from "@/components/marketing/forms";
import { PageHero, SectionBand, GlassPanel } from "@/components/marketing/page-shell";

export const metadata: Metadata = {
  title: "Affiliates",
  description: "Apply to the Aroha Calls affiliate program and earn 20% recurring commission.",
  alternates: { canonical: "/affiliates" },
};

export default function AffiliatesPage() {
  return (
    <>
      <PageHero
        title={<>Earn 20% recurring commission with Aroha Calls.</>}
        description="Refer business owners who need every call answered and earn recurring commission when they become managed Aroha Calls customers."
        cta={{ href: "#apply", label: "Apply now" }}
      />
      <SectionBand>
        <div className="container-tight grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="grid gap-5">
            {[
              { icon: Link2, title: "Get a unique link", body: "Approved affiliates receive a tracked referral link for Aroha Calls." },
              { icon: Send, title: "Share with your audience", body: "Refer service businesses, agencies, local operators, and anyone losing leads to missed calls." },
              { icon: Percent, title: "Earn 20% recurring", body: "Earn recurring commission while the referred customer remains active." },
            ].map((step) => {
              const Icon = step.icon;
              return (
                <GlassPanel key={step.title}>
                  <Icon className="h-7 w-7 text-primary" />
                  <h2 className="mt-4 text-xl font-semibold tracking-tight">{step.title}</h2>
                  <p className="mt-3 text-sm leading-6 text-muted-foreground">{step.body}</p>
                </GlassPanel>
              );
            })}
          </div>
          <GlassPanel id="apply" className="p-7">
            <h2 className="text-2xl font-semibold tracking-tight">Apply to join.</h2>
            <p className="mt-3 text-sm leading-6 text-muted-foreground">
              Tell us who you reach and how you plan to introduce Aroha Calls.
            </p>
            <div className="mt-6">
              <SmartForm
                endpoint="/api/affiliate"
                submitLabel="Submit application"
                successMessage="Application received. We will review it soon."
                fields={[
                  { name: "name", label: "Your name", required: true },
                  { name: "email", label: "Email", type: "email", required: true },
                  { name: "audience", label: "Audience or community", required: true },
                  { name: "channel", label: "Main channel", placeholder: "Website, YouTube, agency, newsletter..." },
                  { name: "message", label: "Why do you want to partner with Aroha?", textarea: true },
                ]}
              />
            </div>
          </GlassPanel>
        </div>
      </SectionBand>
    </>
  );
}
