import { Hero } from "@/components/home/hero";
import { RevenueLeak } from "@/components/home/revenue-leak";
import { ClosingEngine } from "@/components/home/closing-engine";
import { ProductClips } from "@/components/home/product-clips";
import { LeadLeakCalculator } from "@/components/home/lead-leak-calculator";
import { PainSwitchboard } from "@/components/home/pain-switchboard";
import { NichePain } from "@/components/home/niche-pain";
import { TrustedBy } from "@/components/home/trusted-by";
import { FeaturesBento } from "@/components/home/features-bento";
import { HowItWorks } from "@/components/home/how-it-works";
import { Testimonials } from "@/components/home/testimonials";
import { PricingTeaser } from "@/components/home/pricing-teaser";
import { ArohaAICTA } from "@/components/home/aroha-ai-cta";
import { Integrations } from "@/components/home/integrations";
import { FAQ } from "@/components/home/faq";
import { FooterCTA } from "@/components/home/footer-cta";

export default function HomePage() {
  return (
    <>
      <Hero />
      <RevenueLeak />
      <ClosingEngine />
      <ProductClips />
      <LeadLeakCalculator />
      <PainSwitchboard />
      <NichePain />
      <TrustedBy />
      <FeaturesBento />
      <HowItWorks />
      <Integrations />
      <PricingTeaser />
      <Testimonials />
      <ArohaAICTA />
      <FAQ />
      <FooterCTA />
    </>
  );
}
