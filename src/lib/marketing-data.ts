import {
  BarChart3,
  Bot,
  CalendarCheck,
  Clock,
  Headphones,
  Mail,
  MessageSquare,
  PhoneCall,
  Route,
  ShieldCheck,
  Sparkles,
  Users,
  Workflow,
  Zap,
} from "lucide-react";

export const industries = [
  "salons",
  "barbers",
  "clinics",
  "physios",
  "tradies",
  "automotive",
  "real estate",
  "gyms",
  "hospitality",
] as const;

export const featureGroups = [
  {
    icon: PhoneCall,
    title: "AI receptionist",
    description:
      "Answers every call instantly, follows your rules, captures caller details, and handles real conversations instead of forcing scripts.",
    bullets: ["Caller ID memory", "Natural NZ or US voice", "Spam filtering", "Urgent caller routing"],
  },
  {
    icon: CalendarCheck,
    title: "Smart booking",
    description:
      "Books appointments, quote calls, and follow-ups into the right calendar with service rules, buffers, reminders, and availability checks.",
    bullets: ["Google Calendar sync", "Aroha Bookings support", "Booking confirmations", "No double bookings"],
  },
  {
    icon: Users,
    title: "CRM + customer memory",
    description:
      "Every call, booking, message, and email lands in a timeline so Aroha remembers returning customers and your team sees the full story.",
    bullets: ["Lead profiles", "Customer timeline", "AI summaries", "Repeat caller context"],
  },
  {
    icon: Mail,
    title: "Email AI",
    description:
      "AI-assisted replies, follow-ups, and inbox workflows keep admin moving after the call without losing your voice or approval control.",
    bullets: ["Suggested replies", "Review queues", "Follow-up templates", "Shared inbox ready"],
  },
  {
    icon: MessageSquare,
    title: "Messages AI",
    description:
      "Missed-call recovery, reminders, and SMS follow-ups help turn calls into confirmed bookings and reduce no-shows.",
    bullets: ["SMS reminders", "Missed-call recovery", "Message summaries", "Follow-up automation"],
  },
  {
    icon: Workflow,
    title: "Automated workflows",
    description:
      "Trigger actions from calls, bookings, and messages so your front desk does the next step while you stay focused on the work.",
    bullets: ["Quote capture", "Lead qualification", "Task creation", "Policy-aware actions"],
  },
  {
    icon: Bot,
    title: "Aurora assistant",
    description:
      "Aurora is the business chatbot inside Aroha AI. Ask about customers, missed leads, bookings, and what needs attention today.",
    bullets: ["Business memory", "Team Q&A", "Insights", "Next best actions"],
  },
  {
    icon: BarChart3,
    title: "Analytics",
    description:
      "See call volume, bookings, missed opportunities, customer trends, and performance insights in the dashboard and reports.",
    bullets: ["Monthly reports", "Weekly insights", "Revenue saved", "Conversion tracking"],
  },
] as const;

export const demoFields = [
  "Business name",
  "Industry",
  "Location",
  "Your name",
  "Email",
  "Phone number",
  "What customers call about",
  "Booking method",
  "Opening hours",
  "Preferred AI tone",
] as const;

export const statusServices = [
  { id: "voice-ai", name: "Voice AI", status: "operational", description: "Inbound calls, live demo lines, transcripts, and summaries." },
  { id: "email-ai", name: "Email AI", status: "operational", description: "Suggested replies, follow-up drafts, and shared inbox workflows." },
  { id: "messages-ai", name: "Messages AI", status: "operational", description: "SMS reminders, missed-call recovery, and customer updates." },
  { id: "calendar", name: "Calendar Sync", status: "operational", description: "Google Calendar and Aroha Bookings availability sync." },
  { id: "crm", name: "CRM", status: "operational", description: "Customer memory, profiles, timelines, and activity history." },
  { id: "billing", name: "Billing", status: "operational", description: "Stripe checkout, subscriptions, invoices, and customer portal." },
] as const;

export const roadmap = {
  live: [
    "24/7 AI call answering",
    "Custom knowledge base setup",
    "Google Calendar sync",
    "AI call summaries and transcripts",
    "Aroha AI CRM timeline",
    "Stripe billing and customer portal",
  ],
  soon: [
    "Deeper Aroha AI account handoff from Aroha Calls",
    "More managed-service analytics inside customer dashboards",
    "Public case study publishing workflow",
    "More live demo niches and voices",
  ],
  planned: [
    "Advanced customer success reporting",
    "More comparison pages for local AI receptionist searches",
    "Affiliate link tracking automation",
    "Optional service health API checks for the status page",
  ],
} as const;

export const comparePages = {
  "vs-receptionist": {
    competitor: "hiring a receptionist",
    title: "Aroha Calls vs hiring a receptionist",
    intro:
      "A full-time receptionist is valuable, but most small businesses need 24/7 coverage, instant summaries, and bookings without payroll overhead.",
    rows: [
      ["Coverage", "24/7, weekends, holidays, and busy periods", "Usually business hours unless you hire extra cover"],
      ["Cost", "Plans from NZ$99/month", "Salary, training, cover, payroll, and management"],
      ["Memory", "Caller ID, CRM timeline, transcripts, and summaries", "Depends on manual notes and staff consistency"],
      ["Scalability", "Handles multiple callers and locations by plan", "Requires more people as volume grows"],
      ["Best fit", "Businesses that want managed AI coverage fast", "Businesses that need a human in-person role"],
    ],
  },
  "vs-goodcall": {
    competitor: "Goodcall",
    title: "Aroha Calls vs Goodcall",
    intro:
      "Goodcall is a known AI receptionist option. Aroha Calls is built for managed setup, Aroha AI-powered CRM memory, and businesses that want Leo to configure the system for them.",
    rows: [
      ["Setup", "Done-for-you onboarding and workflow setup", "Primarily platform-led setup"],
      ["Positioning", "Managed service powered by Aroha AI", "AI voice receptionist platform"],
      ["Business memory", "CRM timeline, Aurora assistant, email/message AI", "Feature set depends on plan and integrations"],
      ["Local fit", "NZ-built with NZ and US demo lines", "US-focused brand presence"],
      ["Best fit", "Owners who want the system built and managed", "Teams comfortable self-configuring another platform"],
    ],
  },
  "vs-my-ai-front-desk": {
    competitor: "My AI Front Desk",
    title: "Aroha Calls vs My AI Front Desk",
    intro:
      "My AI Front Desk is a self-serve AI receptionist. Aroha Calls is for businesses that want the same outcome without doing setup, testing, tuning, and ongoing changes themselves.",
    rows: [
      ["Service model", "Managed by Leo with white-glove setup", "Self-serve platform"],
      ["Aroha AI", "Includes managed access to the Aroha AI operating system", "Separate platform ecosystem"],
      ["Change requests", "Send changes to support and we update your rules", "Customer usually configures changes"],
      ["Dashboard", "Customer billing, support, onboarding, and Aroha AI links", "Platform dashboard"],
      ["Best fit", "Busy service operators", "DIY users who want to configure themselves"],
    ],
  },
  "vs-rosie-ai": {
    competitor: "Rosie AI",
    title: "Aroha Calls vs Rosie AI",
    intro:
      "Rosie AI focuses on AI call answering. Aroha Calls packages call handling with managed setup, booking rules, CRM memory, Email AI, Messages AI, and Aurora through Aroha AI.",
    rows: [
      ["Core promise", "Front desk operating system managed for you", "AI answering and receptionist automation"],
      ["Channels", "Calls, email, SMS/messages, bookings, CRM", "Call-first experience"],
      ["Managed service", "Yes, Aroha Calls is done-for-you", "Depends on provider support model"],
      ["Insights", "Call summaries, trends, missed opportunities, Aurora", "Provider analytics vary by plan"],
      ["Best fit", "Businesses wanting a full managed package", "Businesses comparing call-answering-only tools"],
    ],
  },
} as const;

export const blogSeedPosts = [
  {
    slug: "ai-receptionist-new-zealand",
    title: "AI Receptionist New Zealand: What Small Businesses Need To Know",
    excerpt:
      "A practical guide to 24/7 AI call answering, booking, customer memory, and what to check before replacing voicemail.",
    content: [
      {
        type: "paragraph",
        text: "An AI receptionist is not just a nicer voicemail. For service businesses, it is the difference between a caller being handled while they are ready to book and that same caller opening the next result on Google.",
      },
      {
        type: "heading",
        text: "What a serious AI receptionist should handle",
      },
      {
        type: "paragraph",
        text: "At minimum, it should answer instantly, understand why the customer is calling, capture clean details, follow your hours and service rules, route urgent calls, book into the right calendar, and send a useful summary to the owner.",
      },
      {
        type: "heading",
        text: "Where Aroha Calls fits",
      },
      {
        type: "paragraph",
        text: "Aroha Calls is the managed version of Aroha AI. Leo sets up the voice, business knowledge, booking rules, follow-up logic, CRM memory, and approval workflows so you do not need to build the system yourself.",
      },
      {
        type: "heading",
        text: "What to check before buying",
      },
      {
        type: "paragraph",
        text: "Ask whether the system can handle your niche, your opening hours, your booking rules, after-hours calls, returning customers, emails, messages, and real handoff to a human when needed. If it only takes a message, it is not a front desk.",
      },
    ],
  },
  {
    slug: "missed-calls-cost-small-businesses",
    title: "How Much Do Missed Calls Cost A Service Business?",
    excerpt:
      "A simple framework for estimating lost bookings, admin time, and why instant call capture pays for itself quickly.",
    content: [
      {
        type: "paragraph",
        text: "A missed call is rarely just a missed conversation. In service businesses, it can be a missed quote, a missed booking, a missed repeat customer, or a lead you already paid to attract.",
      },
      {
        type: "heading",
        text: "The simple missed-call maths",
      },
      {
        type: "paragraph",
        text: "Start with four numbers: calls missed per week, average booking value, the percentage of missed callers who would have booked, and how many weeks you operate. Even conservative numbers usually show that one recovered job can cover the plan.",
      },
      {
        type: "heading",
        text: "The hidden cost is trust",
      },
      {
        type: "paragraph",
        text: "When someone calls, they are usually in decision mode. If the phone rings out, the customer does not know you were busy doing good work. They only know they did not get helped.",
      },
      {
        type: "heading",
        text: "What Aroha changes",
      },
      {
        type: "paragraph",
        text: "Aroha answers, qualifies, books or routes, then sends the owner a clear summary. The customer gets momentum and the business keeps the opportunity alive without hiring another person to watch the phone.",
      },
    ],
  },
  {
    slug: "ai-receptionist-vs-voicemail",
    title: "AI Receptionist vs Voicemail",
    excerpt:
      "Why callers hang up, what modern AI can handle, and where a managed setup beats a basic message-taking flow.",
    content: [
      {
        type: "paragraph",
        text: "Voicemail asks the customer to do extra work after you missed the moment. AI reception answers while the intent is still fresh.",
      },
      {
        type: "heading",
        text: "Voicemail captures messages. Aroha captures outcomes.",
      },
      {
        type: "paragraph",
        text: "A voicemail can tell you someone called. Aroha can ask the next question, capture the job details, book the appointment, send a confirmation, update the CRM, and prepare the follow-up.",
      },
      {
        type: "heading",
        text: "Customers want progress",
      },
      {
        type: "paragraph",
        text: "A caller does not care whether the team is on the tools, with a patient, serving a table, or in a meeting. They care whether they can get helped now. AI reception gives them that first step without interrupting your team.",
      },
      {
        type: "heading",
        text: "Managed setup matters",
      },
      {
        type: "paragraph",
        text: "The difference between a generic bot and a useful receptionist is setup: services, policies, tone, escalation rules, calendars, customer memory, and the follow-up process. Aroha Calls packages that setup for you.",
      },
    ],
  },
  {
    slug: "best-ai-receptionist-2026",
    title: "Best AI Receptionist of 2026 — Independent Buyer's Guide",
    excerpt:
      "An honest, no-affiliate guide to the leading AI receptionist platforms — Aroha, Goodcall, Rosie, My AI Front Desk, Smith.ai. Pricing, features, who should pick what.",
    content: [
      { type: "heading", text: "The state of AI receptionists in 2026" },
      { type: "paragraph", text: "AI receptionist software exploded in 2024-25. Most options now sound natural enough to fool callers. The differentiators in 2026 are calendar integrations, CRM depth, follow-up workflows, language support, and pricing transparency." },
      { type: "heading", text: "Aroha Calls — best for service businesses that want it done for them" },
      { type: "paragraph", text: "Aroha is the only one on this list with a fully-managed white-glove setup at the same price as the DIY tools. Built in NZ, also serving the US. Plans NZ$99-$599 (US$45-$269). Includes Aurora business chatbot for staff, plus Email AI and CRM with the Essentials plan and up." },
      { type: "heading", text: "Goodcall — solid US generalist" },
      { type: "paragraph", text: "Goodcall has been around since 2020 and is reliable. Pricing starts around US$59/month for the basic tier. Lacks the deeper CRM + email AI integration that Aroha offers." },
      { type: "heading", text: "Rosie AI — strong on natural voice" },
      { type: "paragraph", text: "Rosie's voice is excellent but their entry price is higher and there's no managed setup option. Best for tech-savvy operators happy to configure themselves." },
      { type: "heading", text: "My AI Front Desk" },
      { type: "paragraph", text: "Affordable starter, simple flows. Less depth on calendar booking and follow-ups. Good if you only need basic answering and a transcript." },
      { type: "heading", text: "Smith.ai" },
      { type: "paragraph", text: "Hybrid AI + human receptionists. Premium pricing. Worth considering if you want a human safety net on every call (Aroha can also escalate to a human)." },
      { type: "heading", text: "How to choose" },
      { type: "paragraph", text: "If you want done-for-you setup at a Kiwi price, Aroha Calls. If you want self-serve with the same engine, Aroha AI. Compare your shortlist on: calendar depth, CRM, email/SMS follow-ups, multi-language, pricing transparency, and whether real humans handle setup." },
    ],
  },
  {
    slug: "how-to-choose-ai-receptionist-for-tradies",
    title: "How To Choose An AI Receptionist For A Tradie Business (2026)",
    excerpt:
      "Tradies miss more calls than any other industry. A practical guide for plumbers, sparkies, builders and chippies on what an AI receptionist must do.",
    content: [
      { type: "heading", text: "Why tradies bleed money on the phones" },
      { type: "paragraph", text: "When you're up a ladder or under a sink, you can't pick up. The average tradie misses 6-12 calls a week. At an average job value of $400-$2,000, even one missed conversion a week is $20-100k a year." },
      { type: "heading", text: "What a good AI receptionist needs to do for a tradie" },
      { type: "paragraph", text: "Quote intake (suburb, job type, urgency), calendar booking with travel time and bay/site availability, urgent escalations to your mobile, and SMS follow-ups for quotes that don't book." },
      { type: "heading", text: "Where Aroha shines for tradies" },
      { type: "paragraph", text: "Tama at our auto workshop tells us customers don't realise they're talking to AI. Liam (trades) said he'd be losing jobs without it. Aroha learns your pricing matrix, books straight into your calendar, and routes urgent jobs (burst pipes, lockouts) to whoever's on call." },
      { type: "heading", text: "What it costs vs. what it pays back" },
      { type: "paragraph", text: "From NZ$99/month. One recovered job per month covers the plan. We've never had a tradie customer where the maths didn't work." },
    ],
  },
  {
    slug: "ai-receptionist-vs-virtual-receptionist",
    title: "AI Receptionist vs Virtual Receptionist — Which One Wins For Small Businesses",
    excerpt:
      "Virtual (human) receptionists used to be the only option. AI receptionists in 2026 are cheaper, faster, and increasingly more accurate. Here's the honest comparison.",
    content: [
      { type: "heading", text: "Virtual receptionist services in 2026" },
      { type: "paragraph", text: "A virtual receptionist is a remote human team that picks up your calls. They cost $200-$1,500/month for limited call volume, and quality varies wildly with team turnover." },
      { type: "heading", text: "AI receptionists in 2026" },
      { type: "paragraph", text: "AI receptionists like Aroha pick up in under 1 second, work 24/7, never get sick, and cost a fraction of the human equivalent. Quality matches or beats most virtual receptionist services for booking, FAQ and lead capture." },
      { type: "heading", text: "When a human is still better" },
      { type: "paragraph", text: "Highly emotional or sensitive calls (bereavement vet, complex medical), or rare 1-in-100 edge cases. For these, Aroha can escalate live to a real person." },
      { type: "heading", text: "When AI wins" },
      { type: "paragraph", text: "Volume, speed, consistency, after-hours, weekends, holidays. AI handles 99% of inbound for service businesses better than a $1,500/month human team — and you get a beautiful CRM record of every call." },
      { type: "heading", text: "The hybrid model" },
      { type: "paragraph", text: "The smartest setup in 2026: Aroha handles every inbound, with rules to escalate the rare cases that need a human. You get the cost and consistency of AI with the safety of human backup." },
    ],
  },
  {
    slug: "stop-missing-calls-checklist",
    title: "The Missed-Call Checklist: 10 Ways To Stop Losing Customers To The Phone",
    excerpt:
      "If your phone rings out, voicemails pile up, or your team forgets to call back — this 10-step checklist will plug the leak in a week.",
    content: [
      { type: "heading", text: "1. Measure your missed calls" },
      { type: "paragraph", text: "Get your call data. If you're on a typical SMB phone plan, your provider can give you a missed-call report. Most owners are shocked." },
      { type: "heading", text: "2. Audit voicemail-to-callback time" },
      { type: "paragraph", text: "If it's longer than 15 minutes, you've already lost most of those callers." },
      { type: "heading", text: "3. Set up missed-call SMS auto-responses" },
      { type: "paragraph", text: "A simple SMS like 'Hi, sorry we missed you — call us back, or reply with a date and time and we'll book you in' recovers ~30% of missed calls." },
      { type: "heading", text: "4. Add a 24/7 call answering layer" },
      { type: "paragraph", text: "An AI receptionist like Aroha picks up every call instantly, including after hours and weekends. Most missed calls become bookings." },
      { type: "heading", text: "5. Real-time calendar integration" },
      { type: "paragraph", text: "Stop the back-and-forth. A booking system tied to your calendar lets the AI close the appointment on the call." },
      { type: "heading", text: "6. CRM-level customer memory" },
      { type: "paragraph", text: "Returning callers should be greeted by name, with their booking history pulled up automatically. Aroha does this." },
      { type: "heading", text: "7. Escalation rules for VIPs and emergencies" },
      { type: "paragraph", text: "Some callers (best customers, urgent jobs) deserve a human ASAP. Set rules to route them straight to your mobile." },
      { type: "heading", text: "8. Email/SMS follow-up workflows" },
      { type: "paragraph", text: "If a quote doesn't book on the call, automated follow-ups recover another 15-20%." },
      { type: "heading", text: "9. Review prompts after every job" },
      { type: "paragraph", text: "Happy customers say nothing unless asked. Aroha asks for a Google review after every successful job." },
      { type: "heading", text: "10. Measure again in 90 days" },
      { type: "paragraph", text: "Most businesses see 25-40% more bookings within the first quarter of plugging the missed-call leak." },
    ],
  },
  {
    slug: "ai-receptionist-pricing-comparison-2026",
    title: "AI Receptionist Pricing 2026 — A Transparent Comparison",
    excerpt:
      "What does an AI receptionist actually cost in 2026? Real pricing for Aroha, Goodcall, Rosie, Smith.ai and others — with the gotchas.",
    content: [
      { type: "heading", text: "The headline prices (per month)" },
      { type: "paragraph", text: "Aroha Lite NZ$99 / US$45. Aroha Essentials NZ$199 / US$90. Aroha Professional NZ$349 / US$157. Aroha Premium NZ$599 / US$269. Goodcall: from US$59 (Starter), US$199 (Pro). Rosie: from US$199. My AI Front Desk: from US$65. Smith.ai (hybrid): from US$285." },
      { type: "heading", text: "What's included vs. what's an upsell" },
      { type: "paragraph", text: "Watch for: per-minute overage charges, calendar integration as a paid add-on, CRM access only on top tiers, language support locked behind premium plans, and setup fees of $500+ on enterprise plans." },
      { type: "heading", text: "Aroha is transparent on purpose" },
      { type: "paragraph", text: "Aroha plans include: unlimited minutes (Essentials and up), free white-glove setup, managed Google Calendar setup, CRM, email summaries, no per-call fees. The price you see is the price you pay." },
      { type: "heading", text: "ROI by plan" },
      { type: "paragraph", text: "Lite (NZ$99) pays for itself with one recovered booking a month. Essentials (NZ$199) typically pays back 5x. Professional (NZ$349) pays back 8-10x for multi-staff teams. Premium (NZ$599) pays back 15-20x for multi-location operators." },
      { type: "heading", text: "Should you start cheap or premium?" },
      { type: "paragraph", text: "Most service businesses should start on Essentials. Lite is for sole operators with low call volume. Professional + is for teams of 3+ or multi-location operators." },
    ],
  },
] as const;

export const dashboardStats = [
  { label: "Calls handled this month", value: "0", icon: PhoneCall },
  { label: "Bookings made", value: "0", icon: CalendarCheck },
  { label: "Quotes sent", value: "0", icon: Zap },
  { label: "Setup status", value: "In progress", icon: Clock },
] as const;

export const adminMetricLabels = [
  { label: "MRR", icon: BarChart3 },
  { label: "ARR", icon: Sparkles },
  { label: "Active customers", icon: Users },
  { label: "Churn rate", icon: Route },
  { label: "ARPC", icon: Headphones },
  { label: "New signups", icon: ShieldCheck },
] as const;
