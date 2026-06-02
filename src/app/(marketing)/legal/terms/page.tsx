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
  ["Aroha AI workspace", "Managed customers may receive access to an Aroha AI organisation or dashboard. Aroha AI is the platform layer used to manage CRM, email, messages, calendar, voice rules, knowledge, and analytics. Access may be provisioned after onboarding and billing are confirmed."],
  ["Phone number setup", "Depending on plan and availability, customers may use an Aroha business number, forward an existing number, or request number porting. Forwarding and porting depend on carriers, countries, verification, and number availability, so timeframes can vary."],
  ["Calendar setup", "Managed booking currently uses Google Calendar. Customers are responsible for connecting the correct calendar account and keeping staff availability, services, buffers, and booking rules accurate."],
  ["Acceptable use", "You must not use Aroha Calls for unlawful, deceptive, abusive, high-risk emergency-only, spam, harassment, or regulated use cases without our written approval and appropriate compliance controls."],
  ["Regulated and high-risk uses", "Aroha Calls must not be used as the sole system for emergency response, medical diagnosis, legal advice, financial advice, crisis support, or other regulated decisions unless specific written approval and appropriate controls are in place."],
  ["Customer responsibilities", "You must provide accurate instructions, review setup outputs, update business rules when your operations change, monitor critical workflows, maintain your own licenses and compliance notices, and tell callers about recording or AI handling where required."],
  ["AI limitations", "AI can make mistakes. You must review critical workflows, keep business rules current, and not rely on Aroha Calls as the only method for emergency, medical, legal, or financial decision-making."],
  ["Human handoff", "Aroha can be configured to transfer or escalate certain calls, but successful transfer depends on the contacts, hours, carrier availability, and rules you provide. Aroha Calls does not guarantee that a human will always be reachable."],
  ["Availability and providers", "Aroha Calls depends on third-party infrastructure, including hosting, database, billing, email, voice, AI, and carrier services. Outages, maintenance, rate limits, carrier issues, and provider changes may affect availability."],
  ["Billing", "Subscriptions are billed through Stripe. Plans renew automatically unless cancelled. Taxes may apply. You authorize recurring charges for the selected plan and any approved add-ons or usage charges."],
  ["Currencies", "Plans may be offered in NZD and USD where configured. Currency availability, taxes, and payment methods may vary by country and Stripe support."],
  ["Plan changes", "Upgrades, downgrades, cancellations, resumptions, and recharges may be handled through Stripe or by authorised admin action. Stripe may apply prorations, invoice adjustments, retries, and dunning according to the billing configuration."],
  ["Cancellations", "You may cancel through the dashboard, Stripe Customer Portal, or support. Cancellation stops future renewal and access usually continues until the end of the paid billing period."],
  ["Refunds", "Refunds are governed by the Refund Policy, including the 7-day money-back guarantee for new customers from activation."],
  ["Customer data", "You retain responsibility for the data you provide and for notifying your own callers, staff, and customers about AI call handling, recording, and data use where required."],
  ["Webhook and platform sync", "Aroha Calls may send signed billing, subscription, onboarding, and setup events to Aroha AI so managed workspaces stay aligned. These events are operational records used to provision and maintain the service."],
  ["Support", "Support availability depends on plan and business priority. Support may be delivered by email, dashboard support forms, or other channels we approve."],
  ["Service changes", "We may improve, replace, rename, or remove features over time. If a material change affects a paid plan, we will aim to provide a reasonable migration path or notice."],
  ["Intellectual property", "Aroha Calls, Aroha AI, Aurora, site content, software, workflows, and branding belong to Aroha Calls or its licensors. You may not copy, resell, or reverse engineer the service."],
  ["Feedback", "If you provide feedback, ideas, prompts, workflows, or suggestions, you allow Aroha Group to use them to improve the service without owing additional compensation."],
  ["Suspension", "We may suspend or restrict access for non-payment, security risk, abuse, unlawful use, unsupported high-risk use, or breach of these terms."],
  ["Limitation of liability", "To the maximum extent permitted by law, Aroha Calls is not liable for indirect, consequential, lost profit, lost revenue, or lost opportunity damages."],
  ["Indemnity", "To the extent permitted by law, you agree to defend and indemnify Aroha Group from claims arising from your business instructions, caller notices, misuse of the service, breach of law, or unsupported regulated use."],
  ["Governing law", "These terms are intended to operate under New Zealand law unless another mandatory consumer or business law applies. Some rights cannot be excluded by contract."],
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
