export type Currency = "NZD" | "USD";
export type BillingInterval = "month" | "year";

export type PlanFeatureCategory = "voice" | "calendar" | "crm" | "email" | "messages" | "knowledge" | "analytics" | "support" | "extras";

export type PlanTheme = {
  /** Primary box colour (HSL string for CSS) */
  primary: string;
  /** Secondary accent colour */
  accent: string;
  /** Surface gradient pair */
  gradient: [string, string];
  /** Box product label / shorthand */
  shortCode: string;
  /** One-word product subtitle on the box (e.g., "Starter Pack") */
  subtitle: string;
};

export type Plan = {
  id: "lite" | "essentials" | "professional" | "premium";
  name: string;
  slug: string;
  legacySlug?: string; // matches Shopify product handle
  tagline: string;
  description: string;
  priceNZD: number;
  priceUSD: number;
  yearlyNZD?: number;
  yearlyUSD?: number;
  popular?: boolean;
  features: string[];
  highlights: { label: string; value: string }[];
  bestFor: string;
  theme: PlanTheme;
  /** Long-form features by category — used in plan pages and comparison matrix */
  capabilities: {
    category: PlanFeatureCategory;
    label: string;
    detail: string;
  }[];
  /** What ships in the box (used on the per-plan page) */
  whatsInTheBox: string[];
  /** Plan-specific FAQ */
  faq: { q: string; a: string }[];
  /** Stripe price IDs — set per env. */
  stripePriceId?: {
    month?: { nzd?: string; usd?: string };
    year?: { nzd?: string; usd?: string };
  };
};

export const PLANS: readonly Plan[] = [
  {
    id: "lite",
    name: "Lite",
    slug: "lite",
    legacySlug: "aroha-calls-lite",
    tagline: "Bookings only — perfect for solo operators.",
    description:
      "Aroha Lite is the entry-level managed service. We pick up every call, book straight into your calendar, and give you a clean dashboard with logs, summaries, and basic CRM memory.",
    priceNZD: 99,
    priceUSD: 45,
    bestFor: "Salons, spas, studios and small teams who want appointment-based booking without operational complexity.",
    highlights: [
      { label: "Numbers", value: "1 line" },
      { label: "Minutes", value: "100 / month" },
      { label: "Setup", value: "Hassle-free" },
    ],
    theme: {
      primary: "162 88% 45%",
      accent: "190 95% 65%",
      gradient: ["hsl(162 88% 45%)", "hsl(190 95% 65%)"],
      shortCode: "AC-01",
      subtitle: "Starter Pack",
    },
    features: [
      "1 dedicated business number (Telnyx-powered)",
      "100 inbound minutes / month",
      "24/7 AI receptionist (bookings only)",
      "Friendly, natural NZ voice",
      "Real-time availability checking",
      "Managed Google Calendar + Aroha Bookings setup",
      "Basic customer memory (CRM)",
      "Call logs & summaries",
      "Booking history & management",
      "Hassle-free done-for-you setup",
      "7-day money-back guarantee",
      "Cancel anytime",
    ],
    capabilities: [
      { category: "voice", label: "24/7 AI receptionist", detail: "Books-only mode. Friendly Kiwi voice." },
      { category: "voice", label: "Dedicated business number", detail: "1 Telnyx number. Forward your existing line if you'd like." },
      { category: "calendar", label: "Managed Google Calendar setup", detail: "Real-time availability through Google Calendar and Aroha-managed booking rules. No double bookings." },
      { category: "crm", label: "Basic customer memory", detail: "Caller ID, call logs, last contact." },
      { category: "knowledge", label: "Simple knowledge setup", detail: "Hours, services, FAQs." },
      { category: "support", label: "Hassle-free onboarding", detail: "Done-for-you white-glove setup." },
    ],
    whatsInTheBox: [
      "1 business number activated within 24 hours",
      "100 inbound AI minutes per month",
      "Aroha AI dashboard login",
      "Booking sync set up with your Google Calendar and Aroha-managed rules",
      "Call logs, summaries, and basic CRM memory",
      "Email alerts when bookings come in",
    ],
    faq: [
      { q: "What happens if I use more than 100 minutes?", a: "We'll let you know before you go over and offer a top-up or a one-step upgrade to Essentials (unlimited minutes)." },
      { q: "Can I keep my existing number?", a: "Yes. We'll forward your existing number to your new Aroha line, or fully port it over — your choice." },
      { q: "Will Lite handle anything beyond bookings?", a: "Lite is bookings-focused. For full-feature receptionist behaviour (FAQs, transcripts, advanced KB), upgrade to Essentials." },
    ],
  },
  {
    id: "essentials",
    name: "Essentials",
    slug: "essentials",
    legacySlug: "aroha-calls-starter",
    tagline: "Full-featured AI receptionist.",
    description:
      "Essentials is the workhorse plan. Unlimited minutes, full receptionist behaviour, complete dashboard with email AI, SMS automations, transcripts, and CRM timeline.",
    priceNZD: 199,
    priceUSD: 90,
    yearlyNZD: 2149.2,
    yearlyUSD: 964.8,
    bestFor: "Trades, salons, clinics and any service business that wants a professional image and reliable lead capture.",
    highlights: [
      { label: "Numbers", value: "1 line" },
      { label: "Minutes", value: "Unlimited" },
      { label: "Email AI", value: "Included" },
    ],
    theme: {
      primary: "200 95% 50%",
      accent: "162 88% 55%",
      gradient: ["hsl(200 95% 50%)", "hsl(162 88% 55%)"],
      shortCode: "AC-02",
      subtitle: "Workhorse Pack",
    },
    features: [
      "1 dedicated business number",
      "Unlimited inbound minutes",
      "24/7 AI receptionist (full mode)",
      "Natural NZ voice",
      "Smart booking through Google Calendar + Aroha-managed rules",
      "Knowledge base setup (FAQs, hours, services, policies)",
      "Call summaries + full transcripts after every call",
      "Email summaries delivered to inbox",
      "AI email follow-ups",
      "SMS & message automation",
      "Customer memory (CRM timeline)",
      "Aroha AI dashboard access",
      "Spam & robocall filtering",
      "Email AI — auto-reply, review queue, smart categorisation, custom templates",
      "Done-for-you onboarding",
      "7-day money-back guarantee",
    ],
    capabilities: [
      { category: "voice", label: "Full 24/7 AI receptionist", detail: "Handles bookings, FAQs, transfers, and more — not just bookings." },
      { category: "voice", label: "Unlimited minutes", detail: "No per-minute fees. Spam and robocalls filtered automatically." },
      { category: "calendar", label: "Smart booking + reminders", detail: "Google Calendar sync, Aroha-managed booking rules, double-booking prevention, automatic confirmations." },
      { category: "crm", label: "Customer memory + CRM timeline", detail: "Every call, message and booking unified per customer." },
      { category: "email", label: "Email AI — full inbox automation", detail: "Auto-reply, review queue, smart categorisation, custom templates." },
      { category: "messages", label: "SMS automations", detail: "Missed-call texts, booking confirmations, follow-ups." },
      { category: "knowledge", label: "Knowledge base setup", detail: "Hours, services, pricing, policies, FAQs — fully tunable." },
      { category: "analytics", label: "Call summaries + transcripts", detail: "Every call summarised + full transcript in dashboard." },
      { category: "support", label: "Done-for-you onboarding", detail: "Leo personally builds your KB, voice, and rules." },
    ],
    whatsInTheBox: [
      "1 dedicated business number",
      "Unlimited inbound AI minutes",
      "Full Aroha AI dashboard with CRM, Email AI, Messages, Calendar",
      "Knowledge base built for your business",
      "Email + SMS automation",
      "Done-for-you onboarding inside 24 hours",
    ],
    faq: [
      { q: "How is Essentials different from Lite?", a: "Lite is bookings-only with 100 minutes. Essentials is unlimited minutes, full receptionist behaviour, full dashboard with Email AI + CRM + transcripts." },
      { q: "Will Essentials replace my receptionist?", a: "For most service businesses — yes. Essentials handles every inbound call, every booking and every email follow-up." },
      { q: "What about multiple numbers?", a: "Essentials is 1 number. For multi-brand or multi-department, jump up to Professional (2 numbers) or Premium (5)." },
    ],
  },
  {
    id: "professional",
    name: "Professional",
    slug: "professional",
    legacySlug: "growth-pack",
    tagline: "Routing, transfers, analytics for growing teams.",
    description:
      "Professional is built for multi-staff shops and multi-brand operators. 2 numbers, smart routing and live transfers, advanced KB, monthly analytics, and Aurora business chatbot for the team.",
    priceNZD: 349,
    priceUSD: 157,
    yearlyNZD: 3769.2,
    yearlyUSD: 1692,
    popular: true,
    bestFor: "Salons, clinics and service businesses with multiple staff, multiple locations or increasing demand.",
    highlights: [
      { label: "Numbers", value: "2 lines" },
      { label: "Minutes", value: "Unlimited" },
      { label: "Analytics", value: "Monthly" },
    ],
    theme: {
      primary: "261 83% 65%",
      accent: "190 95% 65%",
      gradient: ["hsl(261 83% 65%)", "hsl(200 95% 60%)"],
      shortCode: "AC-03",
      subtitle: "Growth Pack",
    },
    features: [
      "2 dedicated business numbers (brands or departments)",
      "Unlimited inbound minutes",
      "24/7 AI receptionist (full mode)",
      "Smart call routing & live transfers (mobile or team)",
      "Automatic booking confirmations (email)",
      "Managed Google Calendar setup across staff calendars",
      "Advanced business knowledge setup",
      "Custom FAQs, services, pricing, workflows",
      "Detailed service & policy handling",
      "Full Aroha AI dashboard",
      "Customer memory (CRM timeline)",
      "AI email follow-ups & messaging",
      "Email AI — auto-reply, review queue, custom templates, team collaboration",
      "Booking management across staff",
      "Automation & workflow controls",
      "Monthly performance insights (call volume, missed opps, revenue trends)",
      "Aurora business chatbot for staff",
      "Done-for-you setup",
      "7-day money-back guarantee",
    ],
    capabilities: [
      { category: "voice", label: "2 dedicated numbers", detail: "Run two brands, two departments, or two locations from one Aroha." },
      { category: "voice", label: "Smart routing + live transfers", detail: "Aroha qualifies the call, routes to the right person, or transfers live." },
      { category: "calendar", label: "Multi-staff Google Calendar setup", detail: "Booking management across your whole team. Aroha picks the right staff calendar." },
      { category: "crm", label: "Full CRM timeline", detail: "Every customer interaction in one timeline. Searchable, taggable, exportable." },
      { category: "email", label: "Email AI — team collaboration", detail: "Auto-reply, review queue, custom templates, team handoffs." },
      { category: "messages", label: "SMS + email follow-ups", detail: "Quote chasing, booking reminders, post-job thank-yous." },
      { category: "knowledge", label: "Advanced KB + workflows", detail: "Custom FAQs, services, pricing, escalation rules." },
      { category: "analytics", label: "Monthly performance insights", detail: "Call volume, missed opportunities, revenue trends, team performance." },
      { category: "extras", label: "Aurora business chatbot", detail: "Aurora is your team's AI co-pilot — answers any question with full data context." },
      { category: "support", label: "Done-for-you setup", detail: "Leo personally tunes routing, KB and workflows." },
    ],
    whatsInTheBox: [
      "2 dedicated business numbers",
      "Smart routing + live transfers",
      "Advanced KB build with custom workflows",
      "Aurora business chatbot for staff",
      "Monthly performance insights report",
      "Email AI with team collaboration",
      "Full CRM timeline + lead profiles",
    ],
    faq: [
      { q: "What does 'Smart routing' actually do?", a: "Aroha listens to the caller's intent and routes to the right team member, brand or department — or transfers live to a mobile when needed." },
      { q: "Can the 2 numbers be in different countries?", a: "Yes. We'll set up one in NZ and one in the US (or any combination)." },
      { q: "Is Aurora included?", a: "Yes — Professional is the first plan that includes Aurora, our AI business co-pilot for staff." },
    ],
  },
  {
    id: "premium",
    name: "Premium",
    slug: "premium",
    legacySlug: "premium",
    tagline: "Multi-location, VIPs, white-glove support.",
    description:
      "Premium is for high-volume service businesses, multi-location teams, dealerships, clinics, and brands scaling fast. Up to 5 numbers, Team Handover Mode, custom voice branding, weekly analytics, dedicated support.",
    priceNZD: 599,
    priceUSD: 269,
    yearlyNZD: 6469.2,
    yearlyUSD: 2903.4,
    bestFor: "Franchises, multi-location clinics, busy trades, dealerships, brands scaling fast.",
    highlights: [
      { label: "Numbers", value: "Up to 5 lines" },
      { label: "Minutes", value: "Unlimited" },
      { label: "Analytics", value: "Weekly" },
    ],
    theme: {
      primary: "340 82% 60%",
      accent: "261 83% 65%",
      gradient: ["hsl(340 82% 60%)", "hsl(261 83% 65%)"],
      shortCode: "AC-04",
      subtitle: "Pro Pack",
    },
    features: [
      "Up to 5 dedicated business numbers (multi-location)",
      "Unlimited inbound minutes",
      "24/7 AI receptionist (full mode)",
      "Advanced call routing & Team Handover Mode",
      "Custom AI voice branding (trained to your tone)",
      "Call logs, recordings & full transcripts",
      "Automated booking synced to multi-staff calendars",
      "SMS + email appointment reminders",
      "AI email + SMS follow-ups",
      "Email AI — auto-reply, review queue, smart categorisation, team collaboration",
      "Workflow automations (calls, messages, bookings)",
      "Advanced customer memory (CRM timeline)",
      "Branded & customised knowledge base",
      "VIP / urgent caller rules",
      "Aurora business chatbot for staff",
      "Weekly performance analytics (call volume, bookings, missed revenue, team perf)",
      "Priority onboarding & dedicated support",
      "Hands-on setup",
      "Cancel anytime",
      "7-day money-back guarantee",
    ],
    capabilities: [
      { category: "voice", label: "Up to 5 dedicated numbers", detail: "Multi-location, multi-brand. Each with its own routing rules." },
      { category: "voice", label: "Custom AI voice branding", detail: "Aroha trained to match your business tone, accent, slang." },
      { category: "voice", label: "Team Handover Mode", detail: "Hot-handoff to a real human mid-call when the rules say so." },
      { category: "calendar", label: "Multi-staff multi-location calendars", detail: "Book the right service with the right person at the right site." },
      { category: "calendar", label: "SMS + email appointment reminders", detail: "Reduce no-shows. Confirm the day before automatically." },
      { category: "crm", label: "Advanced CRM timeline", detail: "Lead profiles, lifetime value, custom tags, full search." },
      { category: "email", label: "Email AI — full team collaboration", detail: "Multi-inbox, custom templates, escalation queues." },
      { category: "messages", label: "AI SMS follow-ups", detail: "Quote chasing, win-back campaigns, post-job review requests." },
      { category: "knowledge", label: "Branded & customised KB", detail: "Tone, voice, escalation, special-case rules — all yours." },
      { category: "knowledge", label: "Workflow automations", detail: "Connect calls → messages → bookings → CRM with zero code." },
      { category: "analytics", label: "Weekly performance analytics", detail: "Call volume, bookings, missed revenue, team performance." },
      { category: "extras", label: "VIP / urgent caller rules", detail: "VIPs go straight to the owner. Emergencies escalate live." },
      { category: "extras", label: "Aurora business chatbot", detail: "Your AI co-pilot — full team data, full automation power." },
      { category: "support", label: "Priority onboarding + dedicated support", detail: "Leo personally onboards. Slack/email priority response." },
    ],
    whatsInTheBox: [
      "Up to 5 dedicated business numbers",
      "Custom AI voice trained to your business",
      "Team Handover Mode (live human transfer)",
      "Multi-location, multi-staff calendars + reminders",
      "Branded & customised knowledge base",
      "VIP / urgent escalation rules",
      "Weekly analytics report",
      "Aurora business chatbot for the whole team",
      "Priority onboarding + dedicated support contact",
    ],
    faq: [
      { q: "What does 'Custom AI voice branding' include?", a: "We tune Aroha's tone, accent, slang, pacing and even handling of sensitive topics to match exactly how your brand speaks." },
      { q: "What's Team Handover Mode?", a: "Aroha can hot-transfer a live call to a real human mid-conversation if the call meets your escalation rules — no awkward 'please hold' moments." },
      { q: "Do I get a real human on support?", a: "Yes. Premium includes priority onboarding and a dedicated success manager. Leo is on Slack/email for you." },
    ],
  },
] as const;

export const PLAN_GUARANTEE = "7-day money-back guarantee · Cancel anytime · Done-for-you setup";

/** Comprehensive feature matrix — every row is a capability, every column is a plan. */
export const FEATURE_MATRIX: {
  group: string;
  rows: { feature: string; lite: string | true; essentials: string | true; professional: string | true; premium: string | true }[];
}[] = [
  {
    group: "Phone numbers & minutes",
    rows: [
      { feature: "Dedicated business numbers", lite: "1", essentials: "1", professional: "2", premium: "Up to 5" },
      { feature: "Inbound AI minutes / month", lite: "100", essentials: "Unlimited", professional: "Unlimited", premium: "Unlimited" },
      { feature: "Forward existing number", lite: true, essentials: true, professional: true, premium: true },
      { feature: "Number porting", lite: true, essentials: true, professional: true, premium: true },
      { feature: "Multi-country numbers (NZ + US)", lite: "—", essentials: "—", professional: true, premium: true },
    ],
  },
  {
    group: "AI receptionist",
    rows: [
      { feature: "24/7 AI receptionist", lite: "Bookings only", essentials: "Full mode", professional: "Full mode", premium: "Full mode" },
      { feature: "Natural NZ voice", lite: true, essentials: true, professional: true, premium: true },
      { feature: "Custom voice branding", lite: "—", essentials: "—", professional: "—", premium: true },
      { feature: "Spam & robocall filtering", lite: "—", essentials: true, professional: true, premium: true },
      { feature: "Smart routing & live transfers", lite: "—", essentials: "—", professional: true, premium: true },
      { feature: "Team Handover Mode", lite: "—", essentials: "—", professional: "—", premium: true },
      { feature: "VIP / urgent caller rules", lite: "—", essentials: "—", professional: "—", premium: true },
    ],
  },
  {
    group: "Bookings & calendar",
    rows: [
      { feature: "Real-time availability", lite: true, essentials: true, professional: true, premium: true },
      { feature: "Google Calendar sync", lite: true, essentials: true, professional: true, premium: true },
      { feature: "Aroha-managed booking rules", lite: true, essentials: true, professional: true, premium: true },
      { feature: "Google Calendar setup handled by us", lite: true, essentials: true, professional: true, premium: true },
      { feature: "Multi-staff calendars", lite: "—", essentials: "—", professional: true, premium: true },
      { feature: "Multi-location bookings", lite: "—", essentials: "—", professional: "—", premium: true },
      { feature: "SMS + email reminders", lite: "—", essentials: true, professional: true, premium: true },
    ],
  },
  {
    group: "CRM & customer memory",
    rows: [
      { feature: "Caller ID & call logs", lite: true, essentials: true, professional: true, premium: true },
      { feature: "Basic customer memory", lite: true, essentials: true, professional: true, premium: true },
      { feature: "Full CRM timeline", lite: "—", essentials: true, professional: true, premium: true },
      { feature: "Lead profiles + tags", lite: "—", essentials: "—", professional: true, premium: true },
      { feature: "Lifetime value tracking", lite: "—", essentials: "—", professional: "—", premium: true },
    ],
  },
  {
    group: "Email AI",
    rows: [
      { feature: "Email summaries to inbox", lite: true, essentials: true, professional: true, premium: true },
      { feature: "Email AI auto-reply", lite: "—", essentials: true, professional: true, premium: true },
      { feature: "Review queue", lite: "—", essentials: true, professional: true, premium: true },
      { feature: "Smart categorisation", lite: "—", essentials: true, professional: true, premium: true },
      { feature: "Custom templates", lite: "—", essentials: true, professional: true, premium: true },
      { feature: "Team collaboration", lite: "—", essentials: "—", professional: true, premium: true },
    ],
  },
  {
    group: "Messages & SMS",
    rows: [
      { feature: "Missed-call SMS auto-reply", lite: "—", essentials: true, professional: true, premium: true },
      { feature: "Booking confirmations (SMS)", lite: "—", essentials: true, professional: true, premium: true },
      { feature: "AI SMS follow-ups", lite: "—", essentials: "—", professional: true, premium: true },
      { feature: "Win-back & review campaigns", lite: "—", essentials: "—", professional: "—", premium: true },
    ],
  },
  {
    group: "Knowledge base & workflows",
    rows: [
      { feature: "Simple KB (hours, services, FAQs)", lite: true, essentials: true, professional: true, premium: true },
      { feature: "Advanced KB (custom workflows)", lite: "—", essentials: "—", professional: true, premium: true },
      { feature: "Branded & customised KB", lite: "—", essentials: "—", professional: "—", premium: true },
      { feature: "Workflow automations", lite: "—", essentials: "—", professional: true, premium: true },
    ],
  },
  {
    group: "Analytics & reporting",
    rows: [
      { feature: "Call logs & summaries", lite: true, essentials: true, professional: true, premium: true },
      { feature: "Full transcripts", lite: "—", essentials: true, professional: true, premium: true },
      { feature: "Performance analytics", lite: "—", essentials: "—", professional: "Monthly", premium: "Weekly" },
      { feature: "Missed revenue tracking", lite: "—", essentials: "—", professional: true, premium: true },
      { feature: "Team performance reporting", lite: "—", essentials: "—", professional: "—", premium: true },
    ],
  },
  {
    group: "Aurora — your AI business co-pilot",
    rows: [
      { feature: "Aurora business chatbot", lite: "—", essentials: "—", professional: true, premium: true },
      { feature: "Aurora full data context", lite: "—", essentials: "—", professional: true, premium: true },
      { feature: "Aurora workflow automation", lite: "—", essentials: "—", professional: "—", premium: true },
    ],
  },
  {
    group: "Setup & support",
    rows: [
      { feature: "Done-for-you onboarding", lite: true, essentials: true, professional: true, premium: true },
      { feature: "Live in 24 hours", lite: true, essentials: true, professional: true, premium: true },
      { feature: "Standard email support", lite: true, essentials: true, professional: true, premium: true },
      { feature: "Priority onboarding", lite: "—", essentials: "—", professional: "—", premium: true },
      { feature: "Dedicated success manager", lite: "—", essentials: "—", professional: "—", premium: true },
    ],
  },
  {
    group: "Pricing & guarantees",
    rows: [
      { feature: "Monthly price (NZD)", lite: "$99", essentials: "$199", professional: "$349", premium: "$599" },
      { feature: "Monthly price (USD)", lite: "$45", essentials: "$90", professional: "$157", premium: "$269" },
      { feature: "7-day money-back guarantee", lite: true, essentials: true, professional: true, premium: true },
      { feature: "Cancel anytime", lite: true, essentials: true, professional: true, premium: true },
      { feature: "No contracts", lite: true, essentials: true, professional: true, premium: true },
    ],
  },
];

export function getPlan(id: Plan["id"]): Plan | undefined {
  return PLANS.find((p) => p.id === id);
}

export function getPlanBySlug(slug: string): Plan | undefined {
  return PLANS.find((p) => p.slug === slug || p.legacySlug === slug);
}

export function priceFor(plan: Plan, currency: Currency) {
  return currency === "NZD" ? plan.priceNZD : plan.priceUSD;
}

export function yearlyPriceFor(plan: Plan, currency: Currency) {
  return currency === "NZD" ? plan.yearlyNZD : plan.yearlyUSD;
}

export function formatPlanPrice(amount: number, currency: Currency) {
  return new Intl.NumberFormat(currency === "NZD" ? "en-NZ" : "en-US", {
    style: "currency",
    currency,
    maximumFractionDigits: Number.isInteger(amount) ? 0 : 2,
  }).format(amount);
}
