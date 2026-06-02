import { Resend } from "resend";
import { siteConfig } from "@/lib/site-config";
import { db } from "@/lib/db";
import { emailEvents } from "@/lib/db/schema";

let resendInstance: Resend | null | undefined;

export function getResend() {
  if (resendInstance === undefined) {
    const resendKey = process.env.RESEND_API_KEY;
    resendInstance = resendKey ? new Resend(resendKey) : null;
  }
  return resendInstance;
}

export const FROM_EMAIL = process.env.RESEND_FROM_EMAIL ?? "Aroha Calls <hello@arohacalls.com>";
export const ADMIN_NOTIFY_EMAIL = process.env.ADMIN_NOTIFY_EMAIL ?? siteConfig.legalEmail;

type SendArgs = {
  to: string | string[];
  subject: string;
  html: string;
  text?: string;
  replyTo?: string;
  template?: string;
  userId?: string | null;
  metadata?: Record<string, unknown>;
};

export async function sendEmail(args: SendArgs) {
  const resend = getResend();
  if (!resend) {
    console.warn("[email] RESEND_API_KEY not set — skipping email send", args.subject);
    return { ok: false, skipped: true } as const;
  }
  try {
    const { data, error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: args.to,
      subject: args.subject,
      html: args.html,
      text: args.text,
      replyTo: args.replyTo,
    });
    if (error) throw error;
    await logEmailEvent(args, "sent", data?.id).catch((eventError) => console.error("[email] log failed", eventError));
    return { ok: true, id: data?.id } as const;
  } catch (e) {
    console.error("[email] send failed", e);
    await logEmailEvent(args, "failed", undefined, e).catch((eventError) => console.error("[email] log failed", eventError));
    return { ok: false, error: e } as const;
  }
}

async function logEmailEvent(args: SendArgs, status: string, resendId?: string, error?: unknown) {
  await db.insert(emailEvents).values({
    userId: args.userId,
    template: args.template ?? "custom",
    recipient: Array.isArray(args.to) ? args.to.join(", ") : args.to,
    subject: args.subject,
    resendId,
    status,
    error: error instanceof Error ? error.message : error ? String(error) : null,
    metadata: args.metadata,
  });
}

export function emailLayout({ title, body }: { title: string; body: string }) {
  return `<!doctype html>
<html><head><meta charset="utf-8" /><title>${title}</title></head>
<body style="margin:0;padding:0;background:#f8fafc;color:#0f172a;font-family:Inter,Helvetica,Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f8fafc;padding:32px 0;">
    <tr><td align="center">
      <table width="560" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:22px;border:1px solid #e2e8f0;overflow:hidden;box-shadow:0 24px 80px rgba(15,23,42,0.08);">
        <tr><td style="padding:28px 32px;border-bottom:1px solid #e2e8f0;">
          <strong style="font-size:18px;letter-spacing:-0.01em;color:#0f172a;">Aroha Group</strong>
          <div style="margin-top:6px;color:#64748b;font-size:13px;">Managed AI front office for calls, bookings, email, messages and CRM.</div>
        </td></tr>
        <tr><td style="padding:32px;color:#0f172a;font-size:15px;line-height:1.65;">${body}</td></tr>
        <tr><td style="padding:24px 32px;border-top:1px solid #e2e8f0;color:#64748b;font-size:12px;">
          Sent by Aroha Group · <a href="https://www.arohacalls.com" style="color:#0891b2;">arohacalls.com</a>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body></html>`;
}

export function ctaButton(href: string, label: string) {
  return `<a href="${href}" style="display:inline-block;background:#00d2a1;color:#0f172a;padding:12px 18px;border-radius:999px;text-decoration:none;font-weight:700;">${label}</a>`;
}

export const emailTemplates = {
  welcome({ name }: { name?: string | null }) {
    return emailLayout({
      title: "Welcome to Aroha Calls",
      body: `<p>Hi ${name ?? "there"},</p><p>Your Aroha Calls account is ready. Choose a plan, complete onboarding, and the managed setup team will configure your AI front office around your business rules.</p><p>${ctaButton(`${siteConfig.url}/pricing`, "View plans")}</p>`,
    });
  },
  checkoutComplete({ name, planName }: { name?: string | null; planName: string }) {
    return emailLayout({
      title: "Your managed setup is ready to begin",
      body: `<p>Hi ${name ?? "there"},</p><p>Your <strong>${planName}</strong> subscription is active. Complete onboarding with your services, booking rules, call handling, and handoff preferences so Aroha Group can configure your managed front office.</p><p>${ctaButton(`${siteConfig.url}/dashboard/onboarding`, "Complete onboarding")}</p>`,
    });
  },
  onboardingSaved({ businessName }: { businessName?: string | null }) {
    return emailLayout({
      title: "Onboarding saved",
      body: `<p>Your onboarding details${businessName ? ` for <strong>${businessName}</strong>` : ""} have been saved.</p><p>You can keep editing them any time before final submission.</p><p>${ctaButton(`${siteConfig.url}/dashboard/onboarding`, "Return to onboarding")}</p>`,
    });
  },
  onboardingSubmitted({ businessName, summary }: { businessName?: string | null; summary: string }) {
    return emailLayout({
      title: "Onboarding submitted",
      body: `<p><strong>${businessName ?? "A new customer"}</strong> submitted managed onboarding.</p><div style="white-space:pre-line;border:1px solid #e2e8f0;background:#f8fafc;border-radius:14px;padding:14px;">${summary}</div>`,
    });
  },
  setupStatus({ title, message, href }: { title: string; message: string; href?: string }) {
    return emailLayout({
      title,
      body: `<p>${message}</p>${href ? `<p>${ctaButton(href, "Open dashboard")}</p>` : ""}`,
    });
  },
  paymentFailed({ planName }: { planName?: string | null }) {
    return emailLayout({
      title: "Payment needs attention",
      body: `<p>Your ${planName ?? "Aroha Calls"} subscription payment could not be completed. Stripe manages payment methods and retries.</p><p>${ctaButton(`${siteConfig.url}/dashboard/billing`, "Fix billing")}</p>`,
    });
  },
  cancellationScheduled() {
    return emailLayout({
      title: "Cancellation scheduled",
      body: `<p>Your cancellation has been recorded. Billing will not renew after the current paid period unless you resume the subscription in Stripe.</p><p>${ctaButton(`${siteConfig.url}/dashboard/billing`, "Open billing")}</p>`,
    });
  },
};
