import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      { source: "/collections/all", destination: "/pricing", permanent: true },
      { source: "/products/aroha-calls-lite", destination: "/pricing#lite", permanent: true },
      { source: "/products/aroha-calls-starter", destination: "/pricing#essentials", permanent: true },
      { source: "/products/growth-pack", destination: "/pricing#professional", permanent: true },
      { source: "/products/premium", destination: "/pricing#premium", permanent: true },
      { source: "/pages/services", destination: "/pricing", permanent: true },
      { source: "/pages/learn-more", destination: "/features", permanent: true },
      { source: "/pages/about", destination: "/about", permanent: true },
      { source: "/pages/about-us", destination: "/about", permanent: true },
      { source: "/pages/contact", destination: "/contact", permanent: true },
      { source: "/pages/contact-us", destination: "/contact", permanent: true },
      { source: "/pages/custom-demo-booking", destination: "/demo", permanent: true },
      { source: "/policies/privacy-policy", destination: "/legal/privacy", permanent: true },
      { source: "/policies/terms-of-service", destination: "/legal/terms", permanent: true },
      { source: "/policies/refund-policy", destination: "/legal/refunds", permanent: true },
      { source: "/policies/subscription-policy", destination: "/legal/refunds#cancellation", permanent: true },
      { source: "/policies/contact-information", destination: "/contact", permanent: true },
    ];
  },
};

export default nextConfig;
