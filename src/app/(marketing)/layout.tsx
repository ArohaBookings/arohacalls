import { AnnouncementBar } from "@/components/marketing/announcement-bar";
import { Header } from "@/components/marketing/header";
import { Footer } from "@/components/marketing/footer";
import { AnalyticsTracker } from "@/components/marketing/analytics-tracker";
import { AssistantWidget } from "@/components/marketing/assistant-widget";
import { JsonLd } from "@/components/marketing/json-ld";
import { siteGraphJsonLd } from "@/lib/structured-data";

export default function MarketingLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative flex min-h-screen flex-col">
      <JsonLd data={siteGraphJsonLd()} />
      <AnnouncementBar />
      <Header />
      <AnalyticsTracker />
      <main className="flex-1">{children}</main>
      <Footer />
      <AssistantWidget />
    </div>
  );
}
