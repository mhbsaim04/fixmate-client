import type { Metadata } from "next";
import { AboutHero } from "@/components/about/about-hero";
import { HowItWorks } from "@/components/home/how-it-works";
import { RepairEstimator } from "@/components/about/repair-estimator";
import { FixmateGuarantee } from "@/components/about/fixmate-guarantee";
import { RoleExplorer } from "@/components/about/role-explorer";
import { InteractiveFaq } from "@/components/about/interactive-faq";
import { AboutCta } from "@/components/about/about-cta";

export const metadata: Metadata = {
  title: "How It Works | FixMate",
  description:
    "Discover how FixMate protects device repairs through a live 5-stage tracked workflow, admin-vetted technicians, and a 100% pay-after-service guarantee.",
};

export default function AboutPage() {
  return (
    <div className="flex flex-col">
      {/* Hero section with philosophy, metrics, and quick navigation */}
      <AboutHero />

      {/* Interactive 4-step workflow simulator (Customer & Technician perspectives) */}
      <HowItWorks id="how-it-works-section" />

      {/* Interactive Repair Experience & Turnaround Estimator */}
      <RepairEstimator />

      {/* The FixMate Transparency Matrix: FixMate vs Traditional Shops */}
      <FixmateGuarantee />

      {/* 3-Pillar Ecosystem Explorer: Customers, Technicians, Admins */}
      <RoleExplorer />

      {/* Searchable, categorized Interactive FAQ */}
      <InteractiveFaq />

      {/* High-converting dual-action CTA */}
      <AboutCta />
    </div>
  );
}
