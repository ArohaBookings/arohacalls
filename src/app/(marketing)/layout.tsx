import { AnnouncementBar } from "@/components/marketing/announcement-bar";
import { Header } from "@/components/marketing/header";
import { Footer } from "@/components/marketing/footer";
import { AnalyticsTracker } from "@/components/marketing/analytics-tracker";
import { AssistantWidget } from "@/components/marketing/assistant-widget";
import { JsonLd } from "@/components/marketing/json-ld";
import { merchantReturnPolicy, productImageUrl } from "@/lib/structured-data";
import { siteConfig } from "@/lib/site-config";

export default function MarketingLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative flex min-h-screen flex-col">
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Organization",
          name: siteConfig.groupName,
          url: siteConfig.url,
          logo: productImageUrl,
          image: productImageUrl,
          email: siteConfig.email,
          sameAs: [siteConfig.social.instagram, siteConfig.social.sisterApp],
          hasMerchantReturnPolicy: merchantReturnPolicy(),
        }}
      />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "WebSite",
          name: siteConfig.name,
          url: siteConfig.url,
          publisher: {
            "@type": "Organization",
            name: siteConfig.groupName,
            url: siteConfig.url,
          },
        }}
      />
      <AnnouncementBar />
      <Header />
      <AnalyticsTracker />
      <main className="flex-1">{children}</main>
      <Footer />
      <AssistantWidget />
    </div>
  );
}
