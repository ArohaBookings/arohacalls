import type { Metadata } from "next";
import { PageHero, SectionBand, GlassPanel } from "@/components/marketing/page-shell";
import { siteConfig } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "Aroha Calls privacy policy for website visitors, customers, callers, demo requests, and billing.",
  alternates: { canonical: "/legal/privacy" },
};

const sections = [
  ["Who we are", `Aroha Calls provides managed AI receptionist, booking, CRM, email, messaging, and support services from ${siteConfig.url}. Contact ${siteConfig.email} for privacy requests.`],
  ["Information we collect", "We may collect account details, business details, billing identifiers, demo and contact form messages, call metadata, call recordings where enabled, transcripts, summaries, booking details, support requests, device data, page views, conversion events, and communications with us."],
  ["How we use information", "We use information to provide and improve the service, answer calls, create summaries, manage bookings, maintain customer memory, send notifications, process billing through Stripe, respond to support, detect abuse, measure conversions, and comply with law."],
  ["Call recordings and transcripts", "Aroha Calls may process caller names, phone numbers, voice recordings, transcripts, booking requests, and conversation summaries for the business customer. Customers are responsible for telling callers when recordings or AI handling are used where required."],
  ["Legal basis and privacy principles", "We follow NZ Privacy Act 2020 principles including purpose limitation, transparency, security, access, correction, and appropriate disclosure. Where GDPR applies, we rely on contract, legitimate interests, consent where required, and legal obligations."],
  ["Sharing and processors", "We use trusted providers such as Stripe for billing, Resend for email, hosting/database providers, analytics tooling, phone/voice infrastructure, and Aroha AI systems. We share only what is needed to operate the service."],
  ["International transfers", "Your information may be processed in New Zealand, the United States, and other countries used by our infrastructure providers. We use contractual and technical safeguards where appropriate."],
  ["Retention", "We keep account, billing, support, and service records while needed to provide the service, meet legal obligations, resolve disputes, and improve the product. Customers may request deletion subject to legal and operational requirements."],
  ["Your rights", "You may request access, correction, deletion, restriction, portability, or objection where applicable. You may also complain to the New Zealand Privacy Commissioner or an EU/UK data protection authority if relevant."],
  ["Security", "We use access controls, encrypted provider infrastructure, role-based admin access, secure payment processors, and operational safeguards. No internet service can be guaranteed perfectly secure."],
  ["Cookies and analytics", "We may use cookies, session identifiers, analytics, and conversion tracking to run the site, protect accounts, understand traffic, and improve marketing performance."],
  ["Updates", "We may update this policy as the service changes. Material changes will be reflected on this page with a new effective date."],
];

export default function PrivacyPage() {
  return (
    <>
      <PageHero
        title={<>Privacy Policy.</>}
        description="Effective 29 April 2026. This is a comprehensive operating draft and should be legally reviewed before launch."
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
