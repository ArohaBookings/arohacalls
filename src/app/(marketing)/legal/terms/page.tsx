import type { Metadata } from "next";
import { PageHero, SectionBand, GlassPanel } from "@/components/marketing/page-shell";
import { PLANS } from "@/lib/plans";
import { siteConfig } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "Terms Of Service",
  description: "Aroha Calls terms of service for subscriptions, managed AI receptionist setup, acceptable use, billing, and support.",
  alternates: { canonical: "/legal/terms" },
};

const planNames = PLANS.map((plan) => plan.name).join(", ");

const sections = [
  ["Eligibility", "You must be at least 18 years old, have authority to bind the business you represent, and provide accurate account, billing, and business information."],
  ["Services", `Aroha Calls provides managed AI receptionist and related services. Depending on your plan (${planNames}), services may include phone numbers, call answering, bookings, CRM memory, Email AI, Messages AI, Aurora, analytics, and support.`],
  ["Managed setup", "You are responsible for supplying accurate business hours, services, pricing, policies, booking rules, emergency instructions, and transfer details. We configure the AI from those instructions and may ask for clarification before go-live."],
  ["Acceptable use", "You must not use Aroha Calls for unlawful, deceptive, abusive, high-risk emergency-only, spam, harassment, or regulated use cases without our written approval and appropriate compliance controls."],
  ["AI limitations", "AI can make mistakes. You must review critical workflows, keep business rules current, and not rely on Aroha Calls as the only method for emergency, medical, legal, or financial decision-making."],
  ["Billing", "Subscriptions are billed through Stripe. Plans renew automatically unless cancelled. Taxes may apply. You authorize recurring charges for the selected plan and any approved add-ons or usage charges."],
  ["Cancellations", "You may cancel through the dashboard, Stripe Customer Portal, or support. Cancellation stops future renewal and access usually continues until the end of the paid billing period."],
  ["Refunds", "Refunds are governed by the Refund Policy, including the 7-day money-back guarantee for new customers from activation."],
  ["Customer data", "You retain responsibility for the data you provide and for notifying your own callers, staff, and customers about AI call handling, recording, and data use where required."],
  ["Availability", "We aim to provide reliable service, but outages, provider downtime, carrier issues, maintenance, and third-party failures can occur."],
  ["Intellectual property", "Aroha Calls, Aroha AI, Aurora, site content, software, workflows, and branding belong to Aroha Calls or its licensors. You may not copy, resell, or reverse engineer the service."],
  ["Limitation of liability", "To the maximum extent permitted by law, Aroha Calls is not liable for indirect, consequential, lost profit, lost revenue, or lost opportunity damages."],
  ["Contact", `Questions about these terms can be sent to ${siteConfig.email}.`],
];

export default function TermsPage() {
  return (
    <>
      <PageHero
        title={<>Terms of Service.</>}
        description="Effective 29 April 2026. These terms are a comprehensive operating draft and should be legally reviewed before launch."
      />
      <SectionBand>
        <div className="container-tight max-w-4xl space-y-5">
          {sections.map(([title, body]) => (
            <GlassPanel key={title}>
              <h2 className="text-xl font-semibold tracking-tight">{title}</h2>
              <p className="mt-3 text-sm leading-7 text-muted-foreground">{body}</p>
            </GlassPanel>
          ))}
        </div>
      </SectionBand>
    </>
  );
}
