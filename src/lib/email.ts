import { Resend } from "resend";
import { siteConfig } from "@/lib/site-config";

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
    return { ok: true, id: data?.id } as const;
  } catch (e) {
    console.error("[email] send failed", e);
    return { ok: false, error: e } as const;
  }
}

export function emailLayout({ title, body }: { title: string; body: string }) {
  return `<!doctype html>
<html><head><meta charset="utf-8" /><title>${title}</title></head>
<body style="margin:0;padding:0;background:#08080a;color:#ededed;font-family:Inter,Helvetica,Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#08080a;padding:32px 0;">
    <tr><td align="center">
      <table width="560" cellpadding="0" cellspacing="0" style="background:#0d0d10;border-radius:16px;border:1px solid #232328;overflow:hidden;">
        <tr><td style="padding:28px 32px;border-bottom:1px solid #1a1a1f;">
          <strong style="font-size:18px;letter-spacing:-0.01em;background:linear-gradient(135deg,#00d2a1,#b388ff);-webkit-background-clip:text;background-clip:text;color:transparent;">Aroha Group</strong>
        </td></tr>
        <tr><td style="padding:32px;color:#ededed;font-size:15px;line-height:1.6;">${body}</td></tr>
        <tr><td style="padding:24px 32px;border-top:1px solid #1a1a1f;color:#7c7c83;font-size:12px;">
          Sent by Aroha Group · <a href="https://arohacalls.com" style="color:#a5a5ad;">arohacalls.com</a>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body></html>`;
}
