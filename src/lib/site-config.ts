export const siteConfig = {
  name: "Aroha Calls",
  groupName: "Aroha Group",
  shortName: "Aroha",
  tagline: "AI receptionist + Aurora business assistant",
  description:
    "The world's most loved AI receptionist. Aroha answers every call 24/7 with perfect memory. Aurora chats with your team and runs your business. Built for salons, clinics, tradies, real estate, gyms and automotive.",
  url: "https://arohacalls.com",
  ogImage: "/og.png",
  email: "support@arohacalls.com",
  legalEmail: "arohacalls@gmail.com",
  phones: {
    nz: { display: "+64 3 667 2039", e164: "+6436672039", flag: "🇳🇿" },
    us: { display: "+1 (323) 403-0472", e164: "+13234030472", flag: "🇺🇸" },
    sales: {
      display: "+64 3 667 2033",
      e164: "+6436672033",
      flag: "🇳🇿",
      label: "Hear Grace from Aroha live",
    },
  },
  social: {
    instagram: "https://instagram.com/aroha_calls",
    sisterApp: "https://arohaai.app",
  },
  founder: {
    name: "Leo",
    storyShort:
      "Founded at 18 after watching service businesses lose customers to missed calls. Created the assistant he wished every service business could afford.",
  },
  stats: [
    { value: "12,000+", label: "Calls answered" },
    { value: "30%", label: "More bookings per month" },
    { value: "24/7", label: "Live across the world" },
  ],
  industries: ["Salon", "Real Estate", "Clinic", "Gym", "Trades", "Auto"],
} as const;

export const navMain = [
  { label: "Features", href: "/features" },
  { label: "Pricing", href: "/pricing" },
  { label: "Industries", href: "/for" },
  { label: "Compare", href: "/compare" },
  { label: "Aroha AI", href: "/aroha-ai" },
  { label: "Blog", href: "/blog" },
] as const;

export const navFooter = {
  product: [
    { label: "Features", href: "/features" },
    { label: "Pricing", href: "/pricing" },
    { label: "Aroha AI (self-serve)", href: "/aroha-ai" },
    { label: "Book a free demo", href: "/demo" },
    { label: "Roadmap", href: "/roadmap" },
    { label: "Status", href: "/status" },
  ],
  industries: [
    { label: "Salons", href: "/for/salons" },
    { label: "Tradies", href: "/for/tradies" },
    { label: "Clinics", href: "/for/clinics" },
    { label: "Real Estate", href: "/for/real-estate" },
    { label: "Gyms", href: "/for/gyms" },
    { label: "Auto", href: "/for/auto" },
    { label: "Vets", href: "/for/vets" },
    { label: "Cafés", href: "/for/cafes" },
  ],
  locations: [
    { label: "New Zealand", href: "/locations/new-zealand" },
    { label: "Auckland", href: "/locations/auckland" },
    { label: "Wellington", href: "/locations/wellington" },
    { label: "Christchurch", href: "/locations/christchurch" },
    { label: "United States", href: "/locations/united-states" },
    { label: "Los Angeles", href: "/locations/los-angeles" },
  ],
  company: [
    { label: "About", href: "/about" },
    { label: "Contact", href: "/contact" },
    { label: "Case studies", href: "/case-studies" },
    { label: "Affiliates", href: "/affiliates" },
    { label: "Blog", href: "/blog" },
  ],
  compare: [
    { label: "vs Receptionist", href: "/compare/vs-receptionist" },
    { label: "vs Goodcall", href: "/compare/vs-goodcall" },
    { label: "vs My AI Front Desk", href: "/compare/vs-my-ai-front-desk" },
    { label: "vs Rosie AI", href: "/compare/vs-rosie-ai" },
  ],
  legal: [
    { label: "Privacy", href: "/legal/privacy" },
    { label: "Terms of service", href: "/legal/terms" },
    { label: "Refund policy", href: "/legal/refunds" },
    { label: "Cancellation", href: "/legal/refunds#cancellation" },
  ],
} as const;
