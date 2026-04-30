/**
 * The Aroha AI tool surface — what every paying customer gets access to
 * once they purchase a managed Aroha Calls plan.
 *
 * `arohaPath` deep-links to the corresponding screen on https://arohaai.app.
 * If Leo ever changes the route names on the self-serve app, only this file
 * needs to be updated.
 */
export type ArohaTool = {
  id:
    | "voice"
    | "email"
    | "messages"
    | "calendar"
    | "crm"
    | "aurora"
    | "knowledge"
    | "workflows"
    | "analytics"
    | "campaigns"
    | "reviews"
    | "billing";
  name: string;
  tagline: string;
  description: string;
  arohaPath: string;
  iconKey:
    | "phone"
    | "mail"
    | "messages"
    | "calendar"
    | "users"
    | "sparkles"
    | "book"
    | "workflow"
    | "analytics"
    | "campaign"
    | "star"
    | "card";
  /** Plans that unlock this tool (lite / essentials / professional / premium). */
  plans: ("lite" | "essentials" | "professional" | "premium")[];
  badge?: "Live" | "Beta" | "Coming soon";
};

export const AROHA_AI_TOOLS: ArohaTool[] = [
  {
    id: "voice",
    name: "Voice AI",
    tagline: "Your 24/7 AI receptionist",
    description:
      "Listen live, edit greetings, manage call rules, transfer logic, and after-hours behaviour. Spam filtering and VIP routing baked in.",
    arohaPath: "/voice",
    iconKey: "phone",
    plans: ["lite", "essentials", "professional", "premium"],
    badge: "Live",
  },
  {
    id: "calendar",
    name: "Calendar & Bookings",
    tagline: "Real-time slot management",
    description:
      "Managed Google Calendar sync, service durations, buffers, multi-staff routing, Aroha Bookings rules, and reminder cadences.",
    arohaPath: "/calendar",
    iconKey: "calendar",
    plans: ["lite", "essentials", "professional", "premium"],
    badge: "Live",
  },
  {
    id: "crm",
    name: "CRM",
    tagline: "Every customer, every interaction",
    description:
      "Unified timeline of calls, bookings, emails and SMS. Lead profiles, lifetime value, tags and search.",
    arohaPath: "/crm",
    iconKey: "users",
    plans: ["essentials", "professional", "premium"],
    badge: "Live",
  },
  {
    id: "email",
    name: "Email AI",
    tagline: "Drafts, summaries, follow-ups",
    description:
      "Inbox triage, AI-drafted replies in your tone of voice, and auto-summaries of long threads. Approve and send in one click.",
    arohaPath: "/email",
    iconKey: "mail",
    plans: ["essentials", "professional", "premium"],
    badge: "Live",
  },
  {
    id: "messages",
    name: "Messages",
    tagline: "SMS + WhatsApp + missed-call texts",
    description:
      "Two-way SMS, missed-call auto-texts, booking confirmations and reminders. Templates and AI-suggested replies.",
    arohaPath: "/messages",
    iconKey: "messages",
    plans: ["essentials", "professional", "premium"],
    badge: "Live",
  },
  {
    id: "aurora",
    name: "Aurora Assistant",
    tagline: "Your business copilot",
    description:
      "Aurora answers any question with full customer history, drafts SOPs, summarises call patterns and surfaces opportunities daily.",
    arohaPath: "/aurora",
    iconKey: "sparkles",
    plans: ["professional", "premium"],
    badge: "Live",
  },
  {
    id: "knowledge",
    name: "Knowledge Base",
    tagline: "Train Aroha on your business",
    description:
      "Hours, services, pricing, policies, FAQs, brand tone and special-case rules. Aroha references this on every call and email.",
    arohaPath: "/knowledge",
    iconKey: "book",
    plans: ["essentials", "professional", "premium"],
    badge: "Live",
  },
  {
    id: "workflows",
    name: "Workflows",
    tagline: "Automations on autopilot",
    description:
      "Trigger SMS after a quote, escalate VIPs to a phone, sync to Google Sheets, post to Slack — no code required.",
    arohaPath: "/workflows",
    iconKey: "workflow",
    plans: ["professional", "premium"],
    badge: "Live",
  },
  {
    id: "analytics",
    name: "Analytics",
    tagline: "Calls, bookings, revenue",
    description:
      "Filter by team member, service, channel, time-of-day and source. Export to CSV or share a dashboard link.",
    arohaPath: "/analytics",
    iconKey: "analytics",
    plans: ["professional", "premium"],
    badge: "Live",
  },
  {
    id: "campaigns",
    name: "Campaigns",
    tagline: "Win-back & seasonal offers",
    description:
      "Segment your CRM and send personalised SMS or email campaigns. AI writes the offer; Aroha takes the inbound bookings.",
    arohaPath: "/campaigns",
    iconKey: "campaign",
    plans: ["premium"],
    badge: "Beta",
  },
  {
    id: "reviews",
    name: "Reviews",
    tagline: "Auto-request 5-star reviews",
    description:
      "After every successful job, Aroha asks happy customers for a Google review. Auto-replies to negatives in private.",
    arohaPath: "/reviews",
    iconKey: "star",
    plans: ["essentials", "professional", "premium"],
    badge: "Live",
  },
  {
    id: "billing",
    name: "Billing & Quotes",
    tagline: "Quotes, invoices, payment links",
    description:
      "Generate quotes from a call summary, send Stripe payment links, and trigger reminders for unpaid invoices.",
    arohaPath: "/billing",
    iconKey: "card",
    plans: ["professional", "premium"],
    badge: "Beta",
  },
];

export function toolsForPlan(planId: ArohaTool["plans"][number] | null | undefined): ArohaTool[] {
  if (!planId) return AROHA_AI_TOOLS.filter((t) => t.plans.includes("lite"));
  return AROHA_AI_TOOLS.filter((t) => t.plans.includes(planId));
}

export function lockedToolsForPlan(planId: ArohaTool["plans"][number] | null | undefined): ArohaTool[] {
  const unlocked = new Set(toolsForPlan(planId).map((t) => t.id));
  return AROHA_AI_TOOLS.filter((t) => !unlocked.has(t.id));
}

/**
 * Build a deep link into Aroha AI for a specific tool, pre-identifying the
 * Aroha Calls customer so the SSO handoff is seamless.
 */
export function buildArohaAiUrl({
  email,
  path,
  source = "dashboard",
  campaign = "managed_handoff",
}: {
  email?: string | null;
  path?: string;
  source?: string;
  campaign?: string;
}) {
  const base = "https://arohaai.app";
  const params = new URLSearchParams({
    utm_source: "arohacalls",
    utm_medium: source,
    utm_campaign: campaign,
  });
  if (email) params.set("email", email);
  return `${base}${path ?? ""}?${params.toString()}`;
}
