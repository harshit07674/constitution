import React from "react";
import { MarketingNavbar } from "@/components/layout/MarketingNavbar";
import { HeroSection } from "@/components/marketing/HeroSection";
import { PhilosophySection } from "@/components/marketing/PhilosophySection";
import { HowItWorksSection } from "@/components/marketing/HowItWorksSection";
import { InteractivePreviewSection } from "@/components/marketing/InteractivePreviewSection";
import { PrivacySection } from "@/components/marketing/PrivacySection";
import { ClosingCtaSection } from "@/components/marketing/ClosingCtaSection";
import { MarketingFooter } from "@/components/layout/MarketingFooter";

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen bg-[var(--color-paper)]">
      <MarketingNavbar />
      <main className="flex-1">
        <HeroSection />
        <PhilosophySection />
        <HowItWorksSection />
        <InteractivePreviewSection />
        <PrivacySection />
        <ClosingCtaSection />
      </main>
      <MarketingFooter />
    </div>
  );
}
