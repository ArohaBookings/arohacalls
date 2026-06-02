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
  ["Business onboarding data", "When a customer completes onboarding, we collect operational details such as services, prices or price ranges, booking rules, business hours, handoff contacts, escalation rules, customer categories, CRM fields, calendar preferences, email workflow rules, and compliance boundaries."],
  ["Caller and end-customer data", "When Aroha handles calls, messages, or email, it may process names, phone numbers, email addresses, addresses, appointment preferences, service requests, call reasons, quotes requested, transcript snippets, summaries, sentiment, urgency, and follow-up history."],
  ["How we use information", "We use information to provide and improve the service, answer calls, create summaries, manage bookings, maintain customer memory, send notifications, process billing through Stripe, respond to support, detect abuse, measure conversions, and comply with law."],
  ["AI processing", "Aroha Calls may use AI systems to transcribe, classify, summarise, draft replies, detect intent, produce setup recommendations, and support customer memory. AI output is not guaranteed to be perfect and customers must keep critical business rules current."],
  ["Call recordings and transcripts", "Aroha Calls may process caller names, phone numbers, voice recordings, transcripts, booking requests, and conversation summaries for the business customer. Customers are responsible for telling callers when recordings or AI handling are used where required."],
  ["Legal basis and privacy principles", "We follow NZ Privacy Act 2020 principles including purpose limitation, transparency, security, access, correction, and appropriate disclosure. Where GDPR applies, we rely on contract, legitimate interests, consent where required, and legal obligations."],
  ["Customer as controller", "For many caller and end-customer records, the business customer decides what information Aroha should collect, how it should be used, and what rules apply. In those cases Aroha Calls acts as a service provider or processor for the business customer."],
  ["Aroha Calls as controller", "For account administration, billing, site analytics, fraud prevention, support, direct communications, service improvement, and legal compliance, Aroha Calls may act as an independent controller of personal information."],
  ["Sharing and processors", "We use trusted providers such as Stripe for billing, Resend for email, hosting/database providers, analytics tooling, phone/voice infrastructure, and Aroha AI systems. We share only what is needed to operate the service."],
  ["Aroha AI handoff", "Aroha Calls may send onboarding, subscription, billing status, and setup details to Aroha AI through signed secure webhooks so managed customer workspaces can be provisioned and updated."],
  ["International transfers", "Your information may be processed in New Zealand, the United States, and other countries used by our infrastructure providers. We use contractual and technical safeguards where appropriate."],
  ["Retention", "We keep account, billing, support, and service records while needed to provide the service, meet legal obligations, resolve disputes, and improve the product. Customers may request deletion subject to legal and operational requirements."],
  ["Security controls", "We use role-based access, secure authentication, hashed passwords, Stripe-hosted billing flows, signed webhooks, replay protection, provider encryption, operational logging, and limited admin access. Optional webhook payload encryption can be enabled for Aroha AI sync when both sides configure the key."],
  ["Payment data", "Card and bank payment details are handled by Stripe. Aroha Calls stores billing identifiers, customer IDs, subscription IDs, invoice links, plan, currency, billing interval, and payment status, but does not store raw card numbers."],
  ["Marketing and analytics", "We track page views, conversion events, demo requests, pricing clicks, live-demo events, blog traffic, and similar usage data to understand what content helps customers and where the site needs improvement."],
  ["Children", "Aroha Calls is not directed at children. Customers must not intentionally configure Aroha to collect information from minors unless they have the necessary authority, notices, and safeguards for their business context."],
  ["Sensitive information", "Customers must tell us if their business involves sensitive data such as health, disability, financial, legal, child-related, or highly regulated information. We may require additional setup rules or may decline unsupported high-risk use cases."],
  ["Your rights", "You may request access, correction, deletion, restriction, portability, or objection where applicable. You may also complain to the New Zealand Privacy Commissioner or an EU/UK data protection authority if relevant."],
  ["Caller requests", "If you are a caller or customer of a business using Aroha Calls, we may need to refer your request to that business because they control the relationship with you and the reason your information was collected."],
  ["Security", "We use access controls, encrypted provider infrastructure, role-based admin access, secure payment processors, and operational safeguards. No internet service can be guaranteed perfectly secure."],
  ["Cookies and analytics", "We may use cookies, session identifiers, analytics, and conversion tracking to run the site, protect accounts, understand traffic, and improve marketing performance."],
  ["Do-not-track and consent signals", "Where legally required or technically supported, we will respect applicable consent and opt-out choices. Some essential cookies and security logs are necessary for the site and dashboard to function."],
  ["Data deletion", "Deletion requests are assessed against billing, tax, dispute, fraud-prevention, operational, and legal obligations. We may retain limited records where necessary even after an account is closed."],
  ["Changes of ownership", "If Aroha Group is involved in a merger, acquisition, financing, restructuring, or sale of assets, information may be transferred as part of that transaction subject to appropriate safeguards."],
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
