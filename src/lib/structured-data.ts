import { PLANS, type BillingInterval, type Plan } from "@/lib/plans";
import { navMain, siteConfig } from "@/lib/site-config";

const supportedCountries = ["NZ", "US", "AU", "GB", "CA"];

export const productImageUrl = `${siteConfig.url}/aroha-calls-wordmark.jpeg`;

export const serviceReviews = [
  {
    name: "Liam R.",
    role: "Owner, Trades",
    body: "Helps us keep up with calls while we're out on site. We'd be losing jobs without it.",
  },
  {
    name: "Sophie K.",
    role: "Salon owner",
    body: "Set-up was quick and the AI sounds like a real receptionist. Clients love that someone always answers.",
  },
  {
    name: "Chloe L.",
    role: "Clinic manager",
    body: "Easy to tweak, easy to use, and it's already turned missed calls into new clients.",
  },
] as const;

export const aggregateRating = {
  "@type": "AggregateRating",
  ratingValue: "5",
  reviewCount: String(serviceReviews.length),
  bestRating: "5",
  worstRating: "1",
};

export function siteGraphJsonLd() {
  const organizationId = `${siteConfig.url}/#organization`;
  const websiteId = `${siteConfig.url}/#website`;
  const serviceId = `${siteConfig.url}/#managed-ai-receptionist`;
  const softwareId = `${siteConfig.url}/#software`;

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": organizationId,
        name: siteConfig.groupName,
        url: siteConfig.url,
        logo: productImageUrl,
        image: productImageUrl,
        email: siteConfig.email,
        telephone: siteConfig.phones.sales.e164,
        sameAs: [siteConfig.social.instagram, siteConfig.social.sisterApp],
        contactPoint: [
          {
            "@type": "ContactPoint",
            telephone: siteConfig.phones.sales.e164,
            contactType: "sales",
            areaServed: supportedCountries,
            availableLanguage: ["English"],
          },
        ],
        knowsAbout: [
          "AI receptionist",
          "virtual receptionist",
          "call answering",
          "Google Calendar booking",
          "Gmail AI assistant",
          "customer relationship management",
          "SMS follow-up",
          "missed call recovery",
          "Aroha AI",
        ],
        hasMerchantReturnPolicy: merchantReturnPolicy(),
      },
      {
        "@type": "WebSite",
        "@id": websiteId,
        name: siteConfig.name,
        url: siteConfig.url,
        publisher: { "@id": organizationId },
        inLanguage: "en",
        about: { "@id": serviceId },
      },
      {
        "@type": "Service",
        "@id": serviceId,
        name: "Aroha Calls managed AI receptionist",
        url: siteConfig.url,
        provider: { "@id": organizationId },
        areaServed: "Worldwide",
        serviceType: "Managed AI receptionist, call answering, booking, CRM, Email AI, SMS follow-up, and front-office automation",
        description: siteConfig.description,
        hasOfferCatalog: {
          "@type": "OfferCatalog",
          name: "Aroha Calls plans",
          itemListElement: PLANS.map((plan) => ({
            "@type": "Offer",
            name: `Aroha Calls ${plan.name}`,
            url: `${siteConfig.url}/pricing/${plan.slug}`,
            price: String(plan.priceNZD),
            priceCurrency: "NZD",
            availability: "https://schema.org/InStock",
          })),
        },
      },
      {
        "@type": "SoftwareApplication",
        "@id": softwareId,
        name: siteConfig.name,
        applicationCategory: "BusinessApplication",
        operatingSystem: "Web",
        url: siteConfig.url,
        image: productImageUrl,
        description: "Managed Aroha AI workspace for calls, Google Calendar booking, Gmail and email AI, CRM memory, SMS follow-up, quotes, reviews, analytics, and Aurora assistant workflows.",
        offers: {
          "@type": "AggregateOffer",
          lowPrice: "99",
          highPrice: "599",
          priceCurrency: "NZD",
          offerCount: PLANS.length,
          availability: "https://schema.org/InStock",
        },
        aggregateRating,
        review: reviewMarkup,
      },
      ...navMain.map((item, index) => ({
        "@type": "SiteNavigationElement",
        position: index + 1,
        name: item.label,
        url: `${siteConfig.url}${item.href}`,
      })),
    ],
  };
}

export const reviewMarkup = serviceReviews.map((review) => ({
  "@type": "Review",
  author: { "@type": "Person", name: review.name },
  reviewBody: review.body,
  name: review.role,
  reviewRating: {
    "@type": "Rating",
    ratingValue: "5",
    bestRating: "5",
    worstRating: "1",
  },
}));

export function merchantReturnPolicy() {
  return {
    "@type": "MerchantReturnPolicy",
    applicableCountry: supportedCountries,
    returnPolicyCategory: "https://schema.org/MerchantReturnFiniteReturnWindow",
    merchantReturnDays: 7,
    returnFees: "https://schema.org/FreeReturn",
    refundType: "https://schema.org/FullRefund",
    returnPolicyUrl: `${siteConfig.url}/legal/refunds`,
  };
}

export function noShippingDetails(currency: "NZD" | "USD") {
  return {
    "@type": "OfferShippingDetails",
    shippingRate: {
      "@type": "MonetaryAmount",
      value: "0",
      currency,
    },
    shippingDestination: {
      "@type": "DefinedRegion",
      addressCountry: supportedCountries,
    },
    deliveryTime: {
      "@type": "ShippingDeliveryTime",
      handlingTime: {
        "@type": "QuantitativeValue",
        minValue: 0,
        maxValue: 1,
        unitCode: "DAY",
      },
      transitTime: {
        "@type": "QuantitativeValue",
        minValue: 0,
        maxValue: 0,
        unitCode: "DAY",
      },
    },
  };
}

function offerPrice(plan: Plan, currency: "NZD" | "USD", interval: BillingInterval) {
  if (interval === "year") {
    return currency === "NZD" ? plan.yearlyNZD : plan.yearlyUSD;
  }
  return currency === "NZD" ? plan.priceNZD : plan.priceUSD;
}

export function planOffers(plan: Plan) {
  const intervals: BillingInterval[] = plan.yearlyNZD ? ["month", "year"] : ["month"];
  return intervals.flatMap((interval) =>
    (["NZD", "USD"] as const).flatMap((currency) => {
      const price = offerPrice(plan, currency, interval);
      if (!price) return [];
      return {
        "@type": "Offer",
        name: `${plan.name} ${interval === "year" ? "yearly" : "monthly"} (${currency})`,
        url: `${siteConfig.url}/pricing/${plan.slug}`,
        price: String(price),
        priceCurrency: currency,
        availability: "https://schema.org/InStock",
        itemCondition: "https://schema.org/NewCondition",
        category: "SoftwareSubscription",
        seller: {
          "@type": "Organization",
          name: siteConfig.groupName,
          url: siteConfig.url,
        },
        hasMerchantReturnPolicy: merchantReturnPolicy(),
        shippingDetails: noShippingDetails(currency),
      };
    }),
  );
}

export function planProductJsonLd(plan: Plan) {
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: `Aroha Calls ${plan.name}`,
    description: plan.description,
    image: productImageUrl,
    sku: `aroha-calls-${plan.id}`,
    category: "Managed AI receptionist subscription",
    brand: { "@type": "Brand", name: "Aroha Calls" },
    aggregateRating,
    review: reviewMarkup,
    offers: planOffers(plan),
  };
}

export function pricingProductJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: "Aroha Calls managed AI receptionist plans",
    description: siteConfig.description,
    image: productImageUrl,
    category: "Managed AI receptionist subscription",
    brand: { "@type": "Brand", name: "Aroha Calls" },
    aggregateRating,
    review: reviewMarkup,
    offers: PLANS.flatMap((plan) => planOffers(plan)),
  };
}
