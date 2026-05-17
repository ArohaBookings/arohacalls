import type { Metadata } from "next";
import { LiveDemoExperience } from "@/components/live-demo/live-demo-experience";
import { siteConfig } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "Talk to Our AI Receptionist Live — Aroha Calls",
  description:
    "Talk to Grace from Aroha live in your browser. Test a premium AI receptionist for bookings, quotes, customer memory, CRM, Email AI, and 24/7 call answering.",
  alternates: { canonical: "/live-demo" },
  keywords: [
    "AI receptionist",
    "AI receptionist NZ",
    "virtual receptionist",
    "AI receptionist live demo",
    "AI phone answering service",
    "managed AI receptionist",
    "AI receptionist for tradies",
    "24/7 receptionist service",
  ],
  openGraph: {
    title: "Talk to Our AI Receptionist Live — Aroha Calls",
    description:
      "Call Grace from Aroha in your browser and see how a managed AI receptionist answers, books, follows up, and remembers customers.",
    url: `${siteConfig.url}/live-demo`,
    type: "website",
    images: [{ url: siteConfig.ogImage, width: 1200, height: 630, alt: "Aroha Calls live AI receptionist demo" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Talk to Our AI Receptionist Live — Aroha Calls",
    description: "Test Grace from Aroha live in your browser and see the managed AI receptionist workflow.",
    images: [siteConfig.ogImage],
  },
};

const jsonLd = [
  {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "Aroha Calls",
    applicationCategory: "BusinessApplication",
    operatingSystem: "Web",
    url: `${siteConfig.url}/live-demo`,
    description:
      "Managed AI receptionist service for calls, bookings, quotes, follow-up, CRM memory, Email AI, and front-office automation.",
    offers: {
      "@type": "AggregateOffer",
      lowPrice: "99",
      highPrice: "599",
      priceCurrency: "NZD",
      availability: "https://schema.org/InStock",
    },
  },
  {
    "@context": "https://schema.org",
    "@type": "Service",
    name: "Managed AI receptionist",
    provider: {
      "@type": "Organization",
      name: "Aroha Group",
      url: siteConfig.url,
    },
    areaServed: ["New Zealand", "United States", "Australia", "United Kingdom"],
    serviceType: "AI receptionist and virtual receptionist",
    description:
      "Done-for-you AI receptionist setup that answers calls, books customers, captures quotes, creates summaries, and keeps a CRM timeline.",
  },
  {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "Can I talk to the Aroha AI receptionist live?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes. The live demo page connects your browser to Grace from Aroha through a secure Retell web call. You can also call the demo phone line.",
        },
      },
      {
        "@type": "Question",
        name: "Is Aroha Calls self-serve or managed?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Aroha Calls is the managed service where Aroha Group sets up and runs the AI receptionist for you. Aroha AI is the self-serve platform behind it.",
        },
      },
      {
        "@type": "Question",
        name: "What can the AI receptionist handle?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "It can answer calls, qualify leads, book appointments, capture quote requests, remember returning callers, send summaries, support Email AI, and maintain a CRM timeline.",
        },
      },
    ],
  },
];

export default function LiveDemoPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <LiveDemoExperience />
    </>
  );
}
