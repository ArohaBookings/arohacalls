export type Location = {
  slug: string;
  name: string;
  country: "New Zealand" | "United States";
  flag: string;
  phone: string;
  timezone: string;
  population: string;
  hero: { eyebrow: string; title: string; subtitle: string };
  pains: { title: string; body: string }[];
  industries: string[];
  trustedBy: string[];
  faq: { q: string; a: string }[];
  seoTitle: string;
  seoDescription: string;
  seoKeywords: string[];
  /** Local pricing emphasis (NZD vs USD) */
  currency: "NZD" | "USD";
};

export const LOCATIONS: Location[] = [
  {
    slug: "new-zealand",
    name: "New Zealand",
    country: "New Zealand",
    flag: "🇳🇿",
    phone: "+64 3 667 2039",
    timezone: "Pacific/Auckland",
    population: "5.2M",
    currency: "NZD",
    seoTitle: "AI Receptionist NZ — 24/7 AI Phone Answering | Aroha Calls",
    seoDescription:
      "Built in Aotearoa for Kiwi businesses. Aroha is the AI receptionist that sounds like a local, books straight into your calendar, never misses a call. From NZ$99/month.",
    seoKeywords: [
      "AI receptionist NZ",
      "AI receptionist New Zealand",
      "virtual receptionist Auckland",
      "AI phone answering NZ",
      "AI for Kiwi businesses",
      "automated receptionist NZ",
    ],
    hero: {
      eyebrow: "Made in Aotearoa",
      title: "The AI receptionist that sounds like a Kiwi.",
      subtitle:
        "Aroha is built, supported and run from New Zealand. We get the accent, the lingo, the way Kiwis like to do business. Live across NZ in under 24 hours.",
    },
    pains: [
      { title: "Tradies on site can't pick up", body: "Aroha answers while you're under the deck or up the ladder." },
      { title: "Salons & cafés mid-service", body: "Aroha picks up so your team can focus on the customer in front of them." },
      { title: "After-hours leads vanish", body: "Aroha works 24/7 — even on Christmas Day." },
    ],
    industries: ["Trades", "Salons", "Cafés", "Clinics", "Real Estate", "Auto"],
    trustedBy: ["Kiwi tradies", "Auckland salons", "Christchurch clinics", "Wellington cafés"],
    faq: [
      { q: "Can Aroha answer in Te Reo?", a: "Aroha can greet bilingually and handle basic Te Reo phrases — full Te Reo support is on the roadmap." },
      { q: "Will the number be a NZ number?", a: "Yes — local NZ Telnyx number, area code of your choice." },
      { q: "What about the GST?", a: "Pricing is shown ex-GST. GST is added at checkout for NZ customers." },
    ],
  },
  {
    slug: "united-states",
    name: "United States",
    country: "United States",
    flag: "🇺🇸",
    phone: "+1 (323) 403-0472",
    timezone: "America/Los_Angeles",
    population: "330M",
    currency: "USD",
    seoTitle: "AI Receptionist USA — 24/7 AI Phone Answering | Aroha Calls",
    seoDescription:
      "American-style AI receptionist for service businesses. Books appointments, answers FAQs, captures leads 24/7. From $59/month USD. Goodcall & Rosie alternative.",
    seoKeywords: [
      "AI receptionist USA",
      "AI receptionist for small business",
      "Goodcall alternative",
      "Rosie AI alternative",
      "virtual receptionist Los Angeles",
      "AI phone service USA",
    ],
    hero: {
      eyebrow: "Now answering across America",
      title: "The AI receptionist your competitors haven't found yet.",
      subtitle:
        "Aroha answers calls, books appointments and replies to every text — with American voices, American support hours, and a price that beats Goodcall and Rosie AI.",
    },
    pains: [
      { title: "Multi-state team coverage", body: "Aroha works in your timezone, your customers' timezone, and overnight." },
      { title: "High call volume", body: "Aroha handles unlimited concurrent calls without breaking a sweat." },
      { title: "Goodcall/Rosie pricing creep", body: "Aroha is up to 40% cheaper with the same features (and more)." },
    ],
    industries: ["Service businesses", "Salons", "Trades", "Real Estate", "Clinics", "Auto"],
    trustedBy: ["LA boutique studios", "Texas trades", "Florida clinics", "NYC salons"],
    faq: [
      { q: "What kind of US numbers can I get?", a: "Local Telnyx numbers in any area code, or toll-free 800/888 numbers." },
      { q: "How does Aroha compare to Goodcall?", a: "Same core features, our managed service includes onboarding (Goodcall doesn't), and our self-serve Aroha AI is significantly cheaper." },
      { q: "Do you support HIPAA?", a: "We're privacy-first by design. Talk to us about HIPAA-grade BAAs for your clinic." },
    ],
  },
  {
    slug: "auckland",
    name: "Auckland",
    country: "New Zealand",
    flag: "🇳🇿",
    phone: "+64 3 667 2039",
    timezone: "Pacific/Auckland",
    population: "1.7M",
    currency: "NZD",
    seoTitle: "AI Receptionist Auckland — 24/7 AI Phone Answering for Auckland Businesses",
    seoDescription:
      "Aroha is the AI receptionist built for Auckland businesses. Trades, clinics, cafés, real estate — answer every call, book every job. From NZ$99/month.",
    seoKeywords: [
      "AI receptionist Auckland",
      "Auckland virtual receptionist",
      "AI phone answering Auckland",
      "Auckland business AI",
      "Auckland small business answering service",
    ],
    hero: {
      eyebrow: "Auckland-ready",
      title: "Auckland's busiest businesses use Aroha.",
      subtitle:
        "From Ponsonby cafés to Westgate trades — Aroha answers, books and follows up so you can focus on the work in Auckland's most demanding economy.",
    },
    pains: [
      { title: "Auckland traffic eats your day", body: "Aroha answers from anywhere, no commute." },
      { title: "Tradies covering the whole city", body: "Aroha books jobs by suburb, optimises your route." },
      { title: "Cafés mid-rush in the CBD", body: "Aroha takes catering and reservation calls so your floor team focuses." },
    ],
    industries: ["CBD cafés", "Auckland trades", "Salons", "Clinics", "Real Estate"],
    trustedBy: ["Ponsonby salons", "North Shore tradies", "Britomart cafés"],
    faq: [
      { q: "Can I get an Auckland 09 number?", a: "Yes. Or any NZ area code, or your existing number forwarded." },
      { q: "Do you have local support?", a: "Yes — Leo is Auckland-based and available on call." },
    ],
  },
  {
    slug: "wellington",
    name: "Wellington",
    country: "New Zealand",
    flag: "🇳🇿",
    phone: "+64 3 667 2039",
    timezone: "Pacific/Auckland",
    population: "215K",
    currency: "NZD",
    seoTitle: "AI Receptionist Wellington — 24/7 AI Phone Answering",
    seoDescription:
      "Aroha is the AI receptionist for Wellington's small businesses. Salons, cafés, clinics, government suppliers — never miss a call. From NZ$99/month.",
    seoKeywords: [
      "AI receptionist Wellington",
      "Wellington virtual receptionist",
      "AI phone answering Wellington",
      "Wellington small business",
    ],
    hero: {
      eyebrow: "Wellington-ready",
      title: "Capital-grade AI reception, Kiwi-priced.",
      subtitle:
        "Aroha works for Wellington's eclectic small business scene — from Cuba St cafés to Karori salons. 24/7 answering, real-time booking, no missed calls.",
    },
    pains: [
      { title: "Wellington wind keeps tradies moving", body: "Aroha picks up while you battle the gusts on a roof in Brooklyn." },
      { title: "Tourist-season cafés", body: "Aroha takes reservations and catering during peak inflow." },
      { title: "Government suppliers", body: "Aroha logs every interaction with audit-ready timestamps." },
    ],
    industries: ["Cafés", "Trades", "Government suppliers", "Salons", "Clinics"],
    trustedBy: ["Cuba St cafés", "Te Aro studios", "Karori salons"],
    faq: [
      { q: "Can I get an Wellington 04 number?", a: "Yes." },
      { q: "Will Aroha know about local landmarks?", a: "Yes — train Aroha on your local context, parking notes, public transport tips." },
    ],
  },
  {
    slug: "christchurch",
    name: "Christchurch",
    country: "New Zealand",
    flag: "🇳🇿",
    phone: "+64 3 667 2039",
    timezone: "Pacific/Auckland",
    population: "390K",
    currency: "NZD",
    seoTitle: "AI Receptionist Christchurch — AI Phone Answering for Garden City Businesses",
    seoDescription:
      "Aroha is the AI receptionist for Christchurch businesses. Trades, salons, clinics, real estate — answer every call 24/7. Local NZ support. From NZ$99/month.",
    seoKeywords: [
      "AI receptionist Christchurch",
      "Christchurch virtual receptionist",
      "AI phone answering Christchurch",
      "Garden City AI",
    ],
    hero: {
      eyebrow: "Christchurch-ready",
      title: "Garden City's busiest businesses already booked.",
      subtitle:
        "Aroha is built in NZ and works for Christchurch's growing service economy — trades, clinics, salons, real estate — at a Kiwi price.",
    },
    pains: [
      { title: "Rebuild boom = phone goes wild", body: "Aroha picks up every quote inquiry without delay." },
      { title: "Real-estate market churn", body: "Aroha books viewings 24/7, qualifies tenants instantly." },
      { title: "Multi-suburb operators", body: "Aroha routes by suburb, optimises team assignments." },
    ],
    industries: ["Trades", "Real Estate", "Auto", "Clinics", "Salons"],
    trustedBy: ["Christchurch tradies", "Sumner cafés", "Riccarton salons"],
    faq: [
      { q: "03 area code?", a: "Yes — instant activation." },
      { q: "Can Aroha learn our suburbs?", a: "Yes — feed it your service area map and Aroha books accordingly." },
    ],
  },
  {
    slug: "los-angeles",
    name: "Los Angeles",
    country: "United States",
    flag: "🇺🇸",
    phone: "+1 (323) 403-0472",
    timezone: "America/Los_Angeles",
    population: "13M",
    currency: "USD",
    seoTitle: "AI Receptionist Los Angeles — Goodcall Alternative for LA Businesses",
    seoDescription:
      "Aroha is the AI receptionist built for LA service businesses. Salons, trades, clinics, real estate — never miss a call. From $59/month. Goodcall & Rosie alternative.",
    seoKeywords: [
      "AI receptionist Los Angeles",
      "LA virtual receptionist",
      "AI phone service LA",
      "Goodcall alternative LA",
      "Rosie AI alternative LA",
    ],
    hero: {
      eyebrow: "LA-ready",
      title: "LA businesses, never miss a call again.",
      subtitle:
        "Aroha is the AI receptionist for LA's service economy — booking, follow-ups, CRM, all on autopilot. Cheaper than Goodcall, smarter than Rosie.",
    },
    pains: [
      { title: "323/213/310 inbound floods", body: "Aroha handles unlimited concurrent calls." },
      { title: "Multi-language (Spanish/Korean/Mandarin)", body: "Aroha speaks the languages your customers do." },
      { title: "Late-night service requests", body: "Aroha works 24/7 across the timezone span you serve." },
    ],
    industries: ["Salons", "Beauty studios", "Trades", "Auto", "Real Estate", "Clinics"],
    trustedBy: ["LA salons", "Westside trades", "Hollywood studios"],
    faq: [
      { q: "Local LA number?", a: "Yes — 323, 213, 310, 818, 626 or any LA area code." },
      { q: "Spanish-speaking AI?", a: "Yes. Aroha handles Spanish, Korean, Mandarin and more." },
    ],
  },
];

export function getLocation(slug: string) {
  return LOCATIONS.find((l) => l.slug === slug);
}
