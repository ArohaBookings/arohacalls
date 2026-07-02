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
    bullets: ["Caller ID memory", "Natural brand voice", "Spam filtering", "Urgent caller routing"],
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
  { id: "ai-receptionist", name: "AI Receptionist", status: "operational", description: "Grace/live receptionist calls, call handling, transcripts, and summaries." },
  { id: "aroha-ai", name: "Aroha AI", status: "operational", description: "Managed customer workspaces, CRM, Email AI, Messages AI, and team tools." },
  { id: "aroha-numbers", name: "Aroha Numbers", status: "operational", description: "Aroha phone numbers, forwarding, routing, and live demo phone lines." },
  { id: "aroha-bookings", name: "Aroha Bookings", status: "operational", description: "Booking flows, availability rules, confirmations, and handoff into calendars." },
  { id: "google-api", name: "Google API", status: "operational", description: "Google Calendar connection, availability reads, and managed booking handoff." },
  { id: "aurora", name: "Aurora", status: "operational", description: "The Aroha AI business assistant for customer memory, insights, and team Q&A." },
  { id: "email-ai", name: "Email AI", status: "operational", description: "Suggested replies, follow-up drafts, and shared inbox workflows." },
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
      "Goodcall is a known AI receptionist option. Aroha Calls is built for managed setup, Aroha AI-powered CRM memory, and businesses that want Aroha Group to configure the system for them.",
    rows: [
      ["Setup", "Done-for-you onboarding and workflow setup", "Primarily platform-led setup"],
      ["Positioning", "Managed service powered by Aroha AI", "AI voice receptionist platform"],
      ["Business memory", "CRM timeline, Aurora assistant, email/message AI", "Feature set depends on plan and integrations"],
      ["Local fit", "NZ and US demo lines with managed setup", "US-focused brand presence"],
      ["Best fit", "Owners who want the system built and managed", "Teams comfortable self-configuring another platform"],
    ],
  },
  "vs-my-ai-front-desk": {
    competitor: "My AI Front Desk",
    title: "Aroha Calls vs My AI Front Desk",
    intro:
      "My AI Front Desk is a self-serve AI receptionist. Aroha Calls is for businesses that want the same outcome without doing setup, testing, tuning, and ongoing changes themselves.",
    rows: [
      ["Service model", "Managed by Aroha Group with white-glove setup", "Self-serve platform"],
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
        text: "Aroha Calls is the managed version of Aroha AI. Aroha Group sets up the voice, business knowledge, booking rules, follow-up logic, CRM memory, and approval workflows so you do not need to build the system yourself.",
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
      { type: "paragraph", text: "AI receptionist software exploded in 2024-25. Most options now sound natural enough for everyday service calls. The differentiators in 2026 are calendar integrations, CRM depth, follow-up workflows, language support, managed setup, and pricing transparency." },
      { type: "heading", text: "Aroha Calls — best for service businesses that want it done for them" },
      { type: "paragraph", text: "Aroha Calls is built for service businesses that want the system set up for them. It is managed by Aroha Group, powered by Aroha AI, and available with NZD and USD plans. It includes Aurora business assistant features on higher plans, plus Email AI and CRM with Essentials and up." },
      { type: "heading", text: "Goodcall — solid US generalist" },
      { type: "paragraph", text: "Goodcall is a known US-focused option and is worth comparing if you want an AI receptionist platform. Compare current pricing, setup help, CRM depth, email support, and calendar behaviour before choosing." },
      { type: "heading", text: "Rosie AI — strong on natural voice" },
      { type: "paragraph", text: "Rosie AI is a known voice-first option. It is worth testing if natural voice quality is your main filter, but compare how much setup help, CRM memory, and follow-up workflow you need." },
      { type: "heading", text: "My AI Front Desk" },
      { type: "paragraph", text: "My AI Front Desk is commonly considered by buyers who want a simple self-serve flow. Check whether the calendar, follow-up, and customer memory match the way your business actually works." },
      { type: "heading", text: "Smith.ai" },
      { type: "paragraph", text: "Smith.ai is often considered when buyers want a human-assisted receptionist model. It can be worth comparing if a human safety net is more important than a fully AI-led managed setup." },
      { type: "heading", text: "How to choose" },
      { type: "paragraph", text: "If you want done-for-you setup at a transparent service-business price, Aroha Calls. If you want self-serve with the same engine, Aroha AI. Compare your shortlist on: calendar depth, CRM, email/SMS follow-ups, multi-language, pricing transparency, and whether real humans handle setup." },
    ],
  },
  {
    slug: "how-to-choose-ai-receptionist-for-tradies",
    title: "How To Choose An AI Receptionist For A Tradie Business (2026)",
    excerpt:
      "Tradies miss more calls than any other industry. A practical guide for plumbers, sparkies, builders and chippies on what an AI receptionist must do.",
    content: [
      { type: "heading", text: "Why tradies bleed money on the phones" },
      { type: "paragraph", text: "When you're up a ladder or under a sink, you can't always pick up. Even a small number of missed high-intent calls can be expensive because many callers are ready to book and will simply try the next business." },
      { type: "heading", text: "What a good AI receptionist needs to do for a tradie" },
      { type: "paragraph", text: "Quote intake (suburb, job type, urgency), calendar booking with travel time and bay/site availability, urgent escalations to your mobile, and SMS follow-ups for quotes that don't book." },
      { type: "heading", text: "Where Aroha shines for tradies" },
      { type: "paragraph", text: "Aroha learns your pricing rules, books into your calendar where appropriate, captures suburb and urgency, and routes urgent jobs such as burst pipes or lockouts to the right person." },
      { type: "heading", text: "What it costs vs. what it pays back" },
      { type: "paragraph", text: "From NZ$99/month. For many tradie businesses, one recovered job can cover the monthly plan. The key is measuring how many real leads are currently being missed." },
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
      { type: "paragraph", text: "AI receptionists like Aroha can pick up quickly, work 24/7, and stay consistent through busy periods. For booking, FAQ, and lead capture, they can be a strong alternative to a remote human service." },
      { type: "heading", text: "When a human is still better" },
      { type: "paragraph", text: "Highly emotional or sensitive calls (bereavement vet, complex medical), or rare 1-in-100 edge cases. For these, Aroha can escalate live to a real person." },
      { type: "heading", text: "When AI wins" },
      { type: "paragraph", text: "Volume, speed, consistency, after-hours, weekends, and holidays are where AI is strongest. You also get a CRM record, call summary, and follow-up path instead of relying on manual notes." },
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
      { type: "paragraph", text: "A simple SMS like 'Hi, sorry we missed you - call us back, or reply with a date and time and we'll book you in' can recover callers who would otherwise disappear." },
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
      { type: "paragraph", text: "Measure again after the system has handled real call volume. The useful question is simple: how many calls were answered, how many became bookings, and how many follow-ups were no longer forgotten?" },
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
      { type: "paragraph", text: "Lite (NZ$99) can pay for itself with one recovered booking in many appointment businesses. Essentials, Professional and Premium make more sense when email, SMS, CRM memory, routing, analytics, or multi-location handling create enough extra saved time or recovered revenue." },
      { type: "heading", text: "Should you start cheap or premium?" },
      { type: "paragraph", text: "Most service businesses should start on Essentials. Lite is for sole operators with low call volume. Professional + is for teams of 3+ or multi-location operators." },
    ],
  },
  {
    slug: "ai-receptionist-google-calendar-gmail-guide",
    title: "How An AI Receptionist Should Work With Google Calendar And Gmail",
    excerpt:
      "A plain-English guide for owners who want calls, bookings, Gmail replies, customer memory, and follow-up to work together without creating another admin mess.",
    content: [
      { type: "heading", text: "Why Calendar and Gmail matter" },
      { type: "paragraph", text: "A call-answering system is only useful if it can move the customer forward. For most service businesses, that means checking the calendar, booking the right slot, sending the right confirmation, and keeping the email trail tidy. If your AI receptionist answers well but leaves the owner to copy notes into Google Calendar and Gmail later, the work has not really been automated. The owner has just moved the admin from one place to another." },
      { type: "heading", text: "The simple version" },
      { type: "paragraph", text: "When a customer calls, Aroha should understand what they need, ask the right questions, check the booking rules, and either book them or prepare the next best action. If the customer emails instead, Aroha AI should draft a reply in the same business voice, pull in the customer record, and leave a human in control for anything sensitive. Calls and emails should end up in the same customer timeline so the next conversation starts with context." },
      { type: "heading", text: "What Google Calendar connection should actually do" },
      { type: "paragraph", text: "A proper Google Calendar setup is more than reading free and busy time. It should understand opening hours, service duration, travel buffers, staff skills, room availability, cancellation rules, and how far ahead customers are allowed to book. A salon might need the right stylist and enough time for colour processing. A trades business might need suburb coverage and emergency rules. A clinic might need appointment types, prep instructions, and careful handoff rules." },
      { type: "heading", text: "What Gmail or Google Workspace connection should actually do" },
      { type: "paragraph", text: "Email AI should reduce inbox drag without letting the system send risky replies unchecked. The best setup is usually draft-first: Aroha AI categorises the thread, drafts a helpful reply, attaches the right customer context, and asks for review when needed. Simple follow-ups can be templated. Complaints, legal questions, medical questions, refund disputes, and anything the business marks as sensitive should stay in a review queue." },
      { type: "heading", text: "Why Aroha Calls asks so many onboarding questions" },
      { type: "paragraph", text: "The details matter. Aroha needs to know what services you offer, what you never promise, who receives urgent calls, which calendar is the source of truth, what inboxes matter, and who should receive the Aroha AI login invite. Those answers are not paperwork. They are the operating rules that stop the AI from guessing." },
      { type: "heading", text: "Managed setup vs doing it yourself" },
      { type: "paragraph", text: "Aroha AI is the self-serve platform for owners who want control. Aroha Calls is the managed version for owners who want Aroha Group to configure the calls, calendar, Gmail or inbox flow, CRM memory, and follow-up. The result should feel simple to the owner: customers get answered, bookings appear in the right place, email drafts are ready, and the team can see what happened." },
      { type: "heading", text: "What to check before choosing any AI receptionist" },
      { type: "paragraph", text: "Ask whether the provider can connect the calendar you actually use, explain how bookings are prevented from double-booking, show where email replies are reviewed, show the customer timeline, and explain what happens when the AI is unsure. The answer should be understandable without technical language. If the system cannot explain its handoff rules in plain English, the owner will not trust it when a real customer calls." },
    ],
  },
  {
    slug: "ai-front-office-operating-system",
    title: "What Is An AI Front-Office Operating System?",
    excerpt:
      "AI reception is growing beyond call answering. Here is what a complete front-office system should include for calls, bookings, inboxes, CRM, messages, quotes, reviews, and owner visibility.",
    content: [
      { type: "heading", text: "The front office is bigger than the phone" },
      { type: "paragraph", text: "Most businesses think they have a phone problem. The phone rings while the team is busy, the caller leaves, and the owner loses the lead. That is real, but it is only one part of the front office. The same customer might also email for a quote, reply to a reminder, ask to reschedule, call after hours, request a receipt, or need a follow-up. A single AI receptionist should not treat each channel as a separate island." },
      { type: "heading", text: "A complete system starts with capture" },
      { type: "paragraph", text: "Capture means every enquiry is answered, logged, and understood. A caller should not disappear because the owner is on site. An email should not sit for three days because nobody knew who should reply. A message should not be forgotten because it was on one staff member's phone. The first job of an AI front-office system is to make sure the business knows who asked for what and what needs to happen next." },
      { type: "heading", text: "Then it needs memory" },
      { type: "paragraph", text: "Memory is what separates a useful system from a nicer voicemail. If Maya called last month, booked a premium service, preferred Tuesday afternoons, and had a note about access, the next call should not start from zero. Aroha AI puts calls, bookings, emails, SMS, notes, tags, quote history, and customer preferences into one timeline so the business sounds organised every time." },
      { type: "heading", text: "Then it needs action" },
      { type: "paragraph", text: "Action is booking the appointment, drafting the email, creating the task, sending the reminder, escalating the urgent call, preparing the quote follow-up, or asking for a review after a successful job. A system that only records information still leaves the owner with admin. A front-office operating system should remove the repetitive next step while keeping humans in control of judgment calls." },
      { type: "heading", text: "Owners need visibility, not dashboards for the sake of dashboards" },
      { type: "paragraph", text: "Many dashboards are built for people who love software. Busy owners need the useful part first: how many calls were answered, what bookings were made, who needs follow-up, where leads came from, and what problems keep repeating. Aurora, the assistant inside Aroha AI, exists for this reason. The owner can ask what happened instead of hunting through tabs." },
      { type: "heading", text: "What Aroha Calls adds" },
      { type: "paragraph", text: "Aroha Calls packages the Aroha AI engine as a managed service. Aroha Group configures the phone number, call rules, Google Calendar logic, inbox flow, CRM fields, escalation rules, and follow-up behaviour. The owner should not need to understand voice providers, webhooks, routing, or model prompts. They should understand that customers get answered and the business gets the next step." },
      { type: "heading", text: "The buying checklist" },
      { type: "paragraph", text: "Before buying any AI front-office system, ask five questions. Can it answer calls naturally? Can it book into the calendar safely? Can it handle email and messages with approval rules? Can it remember customers in a CRM timeline? Can the owner see plain-English results? If the answer to any of those is no, you are probably buying a point solution rather than a front-office system." },
    ],
  },
  {
    slug: "from-live-demo-to-ai-receptionist-onboarding",
    title: "From Live Demo To Onboarding: How Aroha Calls Gets A Business Live",
    excerpt:
      "What happens after a business owner tries the live demo, chooses a plan, pays through Stripe, and submits the onboarding brief that creates the managed Aroha AI workspace.",
    content: [
      { type: "heading", text: "The demo is meant to prove the call experience" },
      { type: "paragraph", text: "A live AI receptionist demo should not be a slideshow. The owner should be able to talk to the receptionist, ask real questions, test a booking or quote scenario, and hear whether the conversation feels calm and useful. Aroha Calls lets visitors talk to Grace in the browser, call the demo line, or request a phone callback from the Aroha number." },
      { type: "heading", text: "The sales call should be plain English" },
      { type: "paragraph", text: "Many business owners are not technical and should not have to be. A useful demo call should explain what the system does in normal language: it answers calls, books appointments, drafts emails, remembers customers, sends follow-up, escalates urgent calls, and gives the owner a summary. The owner should leave knowing whether Lite, Essentials, Professional, or Premium fits the business." },
      { type: "heading", text: "Plan selection comes before setup" },
      { type: "paragraph", text: "The plan decides the managed package: number count, minutes, Email AI, messages, CRM depth, Aurora, analytics, workflows, and support level. Aroha Calls supports NZD and USD pricing and sends the customer through Stripe checkout so billing, invoices, renewals, and cancellation stay clean." },
      { type: "heading", text: "Onboarding turns business knowledge into operating rules" },
      { type: "paragraph", text: "After checkout, onboarding asks the questions that matter: business details, service area, hours, service list, pricing rules, booking rules, Google Calendar ownership, Gmail or inbox needs, follow-up behaviour, customer memory, urgent handoff, compliance boundaries, and who should receive the Aroha AI login invite. Those answers become the setup brief." },
      { type: "heading", text: "Aroha AI receives the setup brief" },
      { type: "paragraph", text: "Behind the scenes, Aroha Calls sends a signed provisioning event to Aroha AI. That payload includes the customer, selected plan, subscription status, onboarding answers, requested integrations, unlocked Aroha AI tools, demo number, and the managed setup workflow. Aroha AI can then create the organisation and return the login URL when ready." },
      { type: "heading", text: "The owner should get a simple result" },
      { type: "paragraph", text: "The end result should not feel like a technical project. The owner gets the Aroha AI login, the team can see calls and customer memory, Google Calendar booking rules are configured, inbox drafts are ready where included, and Aroha Group can tune the system after real calls. The owner should know what is live, what is waiting on them, and who to contact." },
      { type: "heading", text: "Why this process matters" },
      { type: "paragraph", text: "AI reception fails when it is treated as a generic bot. It works when the business rules are clear, the calendar is connected safely, the inbox process has approval rules, and the system knows when to escalate. The Aroha Calls flow is designed to take a curious visitor from demo to plan to onboarding to Aroha AI workspace without forcing them to become a software operator." },
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
