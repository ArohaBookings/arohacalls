import { AnnouncementBar } from "@/components/marketing/announcement-bar";
import { Header } from "@/components/marketing/header";
import { Footer } from "@/components/marketing/footer";
import { AnalyticsTracker } from "@/components/marketing/analytics-tracker";

export default function MarketingLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative flex min-h-screen flex-col">
      <AnnouncementBar />
      <Header />
      <AnalyticsTracker />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}
