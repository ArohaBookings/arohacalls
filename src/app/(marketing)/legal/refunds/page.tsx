import type { Metadata } from "next";
import { Badge } from "@/components/ui/badge";
import { GlassPanel, PageHero, SectionBand } from "@/components/marketing/page-shell";
import { siteConfig } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "Refund Policy",
  description:
    "Aroha Calls refund, cancellation, billing, and subscription policy for managed AI receptionist plans.",
  alternates: { canonical: "/legal/refunds" },
};

const sections = [
  {
    title: "7-day money-back guarantee",
    body:
      "New Aroha Calls subscriptions include a 7-day money-back guarantee. If the managed service is not the right fit, contact support within 7 days of your first successful subscription payment and we will review and process the refund where eligible.",
  },
  {
    title: "Monthly subscriptions",
    body:
      "Monthly plans are billed in advance and can be cancelled through the customer dashboard or Stripe Customer Portal. Cancelling stops future renewals. Access and managed support may continue until the end of the paid billing period unless we agree otherwise.",
  },
  {
    title: "Annual subscriptions",
    body:
      "Annual plans are discounted prepaid subscriptions. Refunds after the initial guarantee window are not automatic, but we will review billing errors, accidental duplicate charges, or exceptional circumstances fairly.",
  },
  {
    title: "Setup work and managed service",
    body:
      "Aroha Calls is a managed service. Once custom setup, knowledge-base configuration, phone routing, AI tuning, or onboarding work has started, refunds may be limited to unused subscription time unless the issue is caused by Aroha Calls.",
  },
  {
    title: "Billing issues",
    body:
      "If you believe you were charged incorrectly, contact us with the invoice number and account email. We will investigate Stripe records, subscription events, and account history before confirming the result.",
  },
  {
    title: "Refund method",
    body:
      "Approved refunds are returned to the original payment method through Stripe. Processing times depend on your bank or card provider and are outside Aroha Calls' control after Stripe submits the refund.",
  },
] as const;

export default function RefundPolicyPage() {
  return (
    <>
      <PageHero
        title={
          <>
            Refunds, cancellations, and billing handled cleanly.
          </>
        }
        description="Plain-English subscription terms for Aroha Calls customers. Billing is managed through Stripe, and cancellation controls live inside your customer dashboard."
      />
      <SectionBand>
        <div className="container-tight grid gap-6 lg:grid-cols-[0.75fr_1.25fr]">
          <GlassPanel className="h-fit">
            <Badge variant="glow">Current policy</Badge>
            <h2 className="mt-4 text-2xl font-semibold tracking-tight">Need help with billing?</h2>
            <p className="mt-3 text-sm leading-6 text-muted-foreground">
              Email {siteConfig.email} with your account email, plan name, invoice number if available, and
              a short explanation of what happened.
            </p>
            <p id="cancellation" className="mt-6 text-sm leading-6 text-muted-foreground">
              To cancel a subscription, sign in to your dashboard, open Billing, and launch the Stripe
              Customer Portal. Stripe records the cancellation and sends the update back to Aroha Calls.
            </p>
          </GlassPanel>
          <div className="space-y-4">
            {sections.map((section) => (
              <GlassPanel key={section.title}>
                <h2 className="text-xl font-semibold tracking-tight">{section.title}</h2>
                <p className="mt-3 text-sm leading-7 text-muted-foreground">{section.body}</p>
              </GlassPanel>
            ))}
            <p className="text-xs leading-6 text-muted-foreground">
              This policy is a working operational draft and should be reviewed by a qualified professional
              before launch. It does not limit consumer rights that cannot be excluded by applicable law.
            </p>
          </div>
        </div>
      </SectionBand>
    </>
  );
}
