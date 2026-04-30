export type Industry = {
  slug: string;
  name: string;
  emoji: string;
  hero: { eyebrow: string; title: string; subtitle: string };
  pains: { title: string; body: string }[];
  wins: { stat: string; label: string }[];
  workflow: string[];
  testimonial: { quote: string; author: string; role: string };
  faq: { q: string; a: string }[];
  seoTitle: string;
  seoDescription: string;
  seoKeywords: string[];
};

export const INDUSTRIES: Industry[] = [
  {
    slug: "salons",
    name: "Salons & Beauty",
    emoji: "💇",
    seoTitle: "AI Receptionist for Salons — 24/7 Booking, Never Miss a Client",
    seoDescription:
      "Aroha is the AI receptionist built for salons and beauty studios. Book new clients 24/7, sync to your stylist calendar, recover missed-call revenue. From NZ$99/month.",
    seoKeywords: [
      "AI receptionist salon",
      "salon booking system AI",
      "salon answering service",
      "AI receptionist for hairdressers",
      "AI for beauty studios",
      "salon missed call solution",
    ],
    hero: {
      eyebrow: "Built for salons & beauty",
      title: "Every chair booked. Even on a Sunday at 9pm.",
      subtitle:
        "Aroha picks up while you're with a client, books new appointments straight into the right stylist's calendar, and texts a confirmation before you've finished the blow-dry.",
    },
    pains: [
      { title: "Missed calls = missed revenue", body: "On average a salon loses $9,000+ a year to unanswered calls. Aroha answers in 0.8s." },
      { title: "New clients can't reach you on Sundays", body: "Aroha works 24/7 across timezones, including holidays." },
      { title: "Walk-in chaos", body: "Aroha checks real-time availability per stylist and quotes accurate times." },
    ],
    wins: [
      { stat: "+34%", label: "new bookings in 60 days" },
      { stat: "<1s", label: "average answer time" },
      { stat: "0", label: "missed calls" },
    ],
    workflow: [
      "Aroha greets the caller in your salon's brand voice",
      "Identifies the service requested (cut, colour, blow-wave, treatment)",
      "Pulls real-time availability from each stylist's calendar",
      "Confirms preferred stylist and offers nearest 3 slots",
      "Books, sends an SMS confirmation and emails a calendar invite",
      "Adds the client to your CRM with notes from the call",
    ],
    testimonial: {
      quote: "Set-up was quick and the AI sounds like a real Kiwi. Clients love that someone always answers.",
      author: "Sophie K.",
      role: "Salon owner",
    },
    faq: [
      { q: "Will Aroha know which stylist takes which service?", a: "Yes. We map services to specific staff so curls don't end up on the colourist." },
      { q: "What if a client wants to reschedule?", a: "Aroha handles reschedules and cancellations the same way it handles new bookings — instantly and on calendar." },
    ],
  },
  {
    slug: "tradies",
    name: "Tradies & Construction",
    emoji: "🔧",
    seoTitle: "AI Receptionist for Tradies — Quote Calls Captured 24/7",
    seoDescription:
      "Aroha answers every quote call while you're on the tools. Drops bookings into your calendar, texts customers back, never lets a job slip. From NZ$99/month.",
    seoKeywords: [
      "AI receptionist tradies",
      "AI for plumbers electricians builders",
      "tradesman answering service NZ",
      "AI quote intake",
      "construction call answering AI",
    ],
    hero: {
      eyebrow: "Built for tradies",
      title: "Stop dropping the ladder for the phone.",
      subtitle:
        "Aroha takes the call, books the quote, sends the customer a confirmation, and pings you only for VIPs and emergencies. Your hands stay on the tools.",
    },
    pains: [
      { title: "You're on site, the phone is in the ute", body: "Aroha picks up so you don't have to." },
      { title: "Quote requests in voicemail", body: "Voicemail is dead. Aroha books, captures address, scope and budget on the call." },
      { title: "After-hours emergencies", body: "Set rules — burst pipes go straight to your mobile, everything else gets booked for tomorrow." },
    ],
    wins: [
      { stat: "+40%", label: "more quotes won" },
      { stat: "0", label: "voicemails left" },
      { stat: "1hr", label: "saved every day" },
    ],
    workflow: [
      "Aroha takes the call, asks for suburb and job type",
      "Identifies if it's an emergency or standard quote",
      "Standard jobs go straight onto your calendar at the next available slot",
      "Emergencies get patched through to your mobile in real time",
      "All call summaries hit your CRM with the customer's address pre-filled",
    ],
    testimonial: {
      quote: "Helps us keep up with calls while we're out on site. We'd be losing jobs without it.",
      author: "Liam R.",
      role: "Owner, Trades",
    },
    faq: [
      { q: "Can Aroha quote prices?", a: "Yes — feed it your job pricing matrix and it'll quote ballparks live on the call." },
      { q: "What if it's an emergency?", a: "Aroha follows your urgent rules and patches the call through to your mobile or whoever's on call." },
    ],
  },
  {
    slug: "clinics",
    name: "Clinics & Medical",
    emoji: "🩺",
    seoTitle: "AI Receptionist for Clinics — HIPAA-friendly 24/7 Booking",
    seoDescription:
      "Privacy-conscious AI receptionist for medical, dental and allied-health clinics. Books patients, manages cancellations, syncs to your PMS. From NZ$99/month.",
    seoKeywords: [
      "AI receptionist clinic",
      "medical AI answering service",
      "AI receptionist for dentists",
      "physio AI booking",
      "allied health AI receptionist",
    ],
    hero: {
      eyebrow: "Built for clinics",
      title: "Patients get answered. Privacy stays sacred.",
      subtitle:
        "Aroha is the privacy-first AI receptionist trained for medical, dental and allied-health clinics. Booking, triage, callbacks — all without breaking confidentiality.",
    },
    pains: [
      { title: "Reception is overwhelmed by morning rush", body: "Aroha takes the overflow so your front desk can focus on patients in the room." },
      { title: "Cancellations leave gaps", body: "Aroha auto-fills no-show slots from a waitlist." },
      { title: "After-hours triage", body: "Aroha follows your protocol to route urgent symptoms appropriately." },
    ],
    wins: [
      { stat: "0", label: "missed appointments" },
      { stat: "+22%", label: "waitlist conversion" },
      { stat: "100%", label: "compliant logging" },
    ],
    workflow: [
      "Aroha greets, identifies the patient (existing or new) and the reason for the call",
      "Routes urgent symptoms per your clinical protocol",
      "Books appointments into your PMS / calendar with the right practitioner",
      "Sends SMS reminders and a portal link for forms",
      "Logs every interaction with audit-ready timestamps",
    ],
    testimonial: {
      quote: "Easy to tweak, easy to use, and it's already turned missed calls into new clients.",
      author: "Chloe L.",
      role: "Clinic manager",
    },
    faq: [
      { q: "Is patient data encrypted?", a: "Yes. End-to-end encryption, audit logs, and recordings off by default." },
      { q: "Will Aroha integrate with my PMS?", a: "Most major PMS via Zapier or native API. Talk to Leo about your stack on the demo." },
    ],
  },
  {
    slug: "real-estate",
    name: "Real Estate",
    emoji: "🏡",
    seoTitle: "AI Receptionist for Real Estate — Captures Every Buyer & Tenant",
    seoDescription:
      "Aroha picks up every inquiry on a listing — books viewings, qualifies tenants, replies to portals 24/7. Built for sales agents and property managers.",
    seoKeywords: [
      "AI receptionist real estate",
      "AI for real estate agents",
      "property management AI",
      "AI for tenant inquiries",
      "AI receptionist for letting agents",
    ],
    hero: {
      eyebrow: "Built for real estate",
      title: "Every listing inquiry, captured. Every viewing, booked.",
      subtitle:
        "Aroha is on the phones for buyers, tenants and applicants 24/7. Books viewings into your calendar, qualifies leads, syncs to your CRM.",
    },
    pains: [
      { title: "Buyers calling at 9pm", body: "Aroha picks up, books a viewing for the weekend." },
      { title: "Tenant inquiries flood your inbox", body: "Aroha qualifies, references, and shortlists." },
      { title: "Open home no-shows", body: "Aroha sends reminders, asks for confirmations, fills no-show spots from a waitlist." },
    ],
    wins: [
      { stat: "+58%", label: "more viewings booked" },
      { stat: "0", label: "buyer inquiries lost" },
      { stat: "24/7", label: "lead capture" },
    ],
    workflow: [
      "Aroha answers, asks if it's a buyer, tenant or applicant",
      "Pulls the listing details from your CRM",
      "Offers next 3 viewing slots and books one",
      "For tenants: collects pre-qualification details (employment, references, move-in date)",
      "Sends agent a SMS summary + adds the lead to the CRM",
    ],
    testimonial: {
      quote: "Inquiries come in 24/7 now. Aroha books the viewing and tells me about the lead in one tap.",
      author: "Mia P.",
      role: "Real estate",
    },
    faq: [
      { q: "Can Aroha read off active listings?", a: "Yes — sync your listings feed and Aroha will quote price, address, square metres, viewings." },
      { q: "Does it integrate with my CRM?", a: "Most major real-estate CRMs via Zapier; native APIs for the big ones." },
    ],
  },
  {
    slug: "gyms",
    name: "Gyms & Fitness",
    emoji: "🏋️",
    seoTitle: "AI Receptionist for Gyms — Tour Bookings, Trial Sign-ups, Member Support",
    seoDescription:
      "Aroha books tours, qualifies new members, handles cancellations and renewals 24/7. Built for boutique studios, big-box gyms and PT businesses.",
    seoKeywords: [
      "AI receptionist gym",
      "AI for fitness studios",
      "PT AI booking",
      "gym membership AI",
      "yoga studio AI receptionist",
    ],
    hero: {
      eyebrow: "Built for gyms & fitness",
      title: "Trial sign-ups in your sleep.",
      subtitle:
        "Aroha books tours, signs up trials, schedules PT sessions and handles member support — even when your front desk has the day off.",
    },
    pains: [
      { title: "Trial sign-ups go to voicemail", body: "Aroha closes the trial on the call." },
      { title: "PT sessions juggling 5 calendars", body: "Aroha picks the right trainer based on the member's goals and availability." },
      { title: "Cancellations and pauses", body: "Aroha handles the awkward conversation and follows your retention protocol." },
    ],
    wins: [
      { stat: "+50%", label: "more trials booked" },
      { stat: "70%", label: "retention rate" },
      { stat: "24/7", label: "member support" },
    ],
    workflow: [
      "Aroha takes the call, asks goals and experience level",
      "Books a trial into the right class or PT slot",
      "Sends SMS confirmation + class etiquette guide",
      "Day-of: sends reminder, post-class follow-up with membership offer",
    ],
    testimonial: {
      quote: "Aroha closes trials before they walk in the door. Best front-desk hire I've made.",
      author: "Hemi T.",
      role: "Boutique gym owner",
    },
    faq: [
      { q: "Can Aroha sell memberships?", a: "It can quote pricing and send a Stripe payment link. Final card capture happens via Stripe." },
      { q: "Will members have to talk to AI?", a: "Only if they call. Existing members can still chat to your team in person; Aroha takes the overflow." },
    ],
  },
  {
    slug: "auto",
    name: "Automotive",
    emoji: "🚗",
    seoTitle: "AI Receptionist for Auto Workshops — Bookings, WOFs, Quotes",
    seoDescription:
      "Aroha answers your shop while you're under a bonnet. Books WOFs and services, captures quote requests, dispatches mobile mechanics. From NZ$99/month.",
    seoKeywords: [
      "AI receptionist mechanic",
      "auto workshop AI",
      "AI for car dealerships",
      "panel beater AI booking",
      "tyre shop AI receptionist",
    ],
    hero: {
      eyebrow: "Built for auto",
      title: "Customers reckon they're talking to your receptionist.",
      subtitle:
        "Aroha books WOFs, services, panel jobs and tyres straight into your calendar. Knows your bay availability, knows your make/model expertise, knows your prices.",
    },
    pains: [
      { title: "Phone never stops ringing", body: "Aroha takes the load so you can stay on the spanners." },
      { title: "Walk-ins overrun the bays", body: "Aroha books slots that match your real bay availability." },
      { title: "Quote requests with no follow-up", body: "Aroha follows up by SMS and books once the customer says yes." },
    ],
    wins: [
      { stat: "+45%", label: "more bookings filled" },
      { stat: "0", label: "missed WOF calls" },
      { stat: "1.5hr", label: "saved every day" },
    ],
    workflow: [
      "Aroha asks make, model, year and reason for the call",
      "Quotes prices for known jobs (WOFs, basic services)",
      "Books a slot at a bay your team can actually do",
      "Sends a courtesy SMS the day before with reminders to bring rego",
      "Logs the customer + vehicle in your CRM for next time",
    ],
    testimonial: {
      quote: "Customers reckon they're talking to my receptionist. They've got no idea it's AI.",
      author: "Tama W.",
      role: "Auto workshop",
    },
    faq: [
      { q: "Can Aroha quote on tyres or parts?", a: "Yes — load your supplier price book and Aroha quotes live on the call." },
      { q: "What if the customer needs a courtesy car?", a: "Aroha checks availability and books one alongside the service." },
    ],
  },
  {
    slug: "vets",
    name: "Veterinary",
    emoji: "🐾",
    seoTitle: "AI Receptionist for Vets — Bookings, Triage, After-hours",
    seoDescription:
      "Aroha is the AI receptionist built for veterinary clinics. Books appointments, handles emergency triage, recovers missed-call revenue. Privacy-first.",
    seoKeywords: [
      "AI receptionist vet",
      "veterinary AI answering service",
      "vet clinic AI booking",
      "animal hospital AI",
      "AI for vets",
    ],
    hero: {
      eyebrow: "Built for vets",
      title: "Pet parents always get a real answer.",
      subtitle:
        "Aroha books appointments, triages emergencies and handles after-hours calls so your vets can focus on the animal in front of them.",
    },
    pains: [
      { title: "Phones ring during consults", body: "Aroha picks up so the vet stays with the patient." },
      { title: "After-hours emergencies", body: "Aroha follows your triage protocol and routes critical cases instantly." },
      { title: "Reminders missed", body: "Aroha sends vaccination, dental and grooming reminders automatically." },
    ],
    wins: [
      { stat: "+38%", label: "more bookings" },
      { stat: "100%", label: "after-hours coverage" },
      { stat: "0", label: "missed reminders" },
    ],
    workflow: [
      "Aroha greets, identifies pet & owner from your records",
      "Triages: emergency → on-call vet, routine → next available appointment",
      "Books and sends portal link for intake forms",
      "Sends pre-visit reminders and post-visit follow-ups",
    ],
    testimonial: {
      quote: "Our after-hours triage is finally covered. Aroha follows our protocol to the letter.",
      author: "Rachel B.",
      role: "Veterinary clinic owner",
    },
    faq: [
      { q: "Will Aroha know which vet to book with?", a: "Yes — by species, treatment type and vet specialty." },
      { q: "Can it handle euthanasia bookings sensitively?", a: "Yes. Aroha is trained for compassion, escalates to a human for sensitive cases." },
    ],
  },
  {
    slug: "cafes",
    name: "Cafés & Restaurants",
    emoji: "☕",
    seoTitle: "AI Receptionist for Cafés & Restaurants — Reservations, Catering, Orders",
    seoDescription:
      "Aroha takes reservations, catering orders and large-group bookings 24/7. Built for cafés, restaurants and bars who lose calls during service.",
    seoKeywords: [
      "AI receptionist café",
      "AI restaurant booking",
      "AI for hospitality",
      "AI for catering orders",
      "restaurant answering service",
    ],
    hero: {
      eyebrow: "Built for hospitality",
      title: "Service rush? Aroha's still picking up.",
      subtitle:
        "Aroha takes reservations, catering inquiries, large-group bookings and special-event requests while your team focuses on the room.",
    },
    pains: [
      { title: "Phone rings during the lunch rush", body: "Aroha picks up so your team doesn't have to leave the floor." },
      { title: "Catering orders bounce off voicemail", body: "Aroha captures the brief, quotes a price, sends a follow-up." },
      { title: "Reservation no-shows", body: "Aroha confirms the day before and offers no-show slots to a waitlist." },
    ],
    wins: [
      { stat: "+40%", label: "more reservations honoured" },
      { stat: "+25%", label: "catering revenue" },
      { stat: "0", label: "missed group bookings" },
    ],
    workflow: [
      "Aroha greets, asks party size, date and any dietary requirements",
      "Quotes set menu prices for groups",
      "Books straight into your reservation system",
      "Sends SMS confirmation + map link",
      "Day-of: confirmation reminder; no-show offers slot to waitlist",
    ],
    testimonial: {
      quote: "Catering orders used to disappear into voicemail. Aroha turned them into our most profitable channel.",
      author: "James S.",
      role: "Café owner",
    },
    faq: [
      { q: "Can Aroha take card payments for catering deposits?", a: "Yes — sends a Stripe payment link in real time." },
      { q: "Will it speak in our brand voice?", a: "Absolutely. We tune Aroha's tone, accent and even slang to match your room." },
    ],
  },
];

export function getIndustry(slug: string) {
  return INDUSTRIES.find((i) => i.slug === slug);
}
