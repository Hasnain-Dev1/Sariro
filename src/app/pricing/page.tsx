import type { Metadata } from "next";
import { PricingView } from "@/components/sariro/views/pricing-view";

export const metadata: Metadata = {
  title: "Pricing — Sariro | Simple pricing, real outcomes",
  description:
    "Sariro pricing tiers — Starter, Builder, and School Pro. Cohort-based AI learning with a 14-day money-back guarantee.",
};

export default function Page() {
  return <PricingView />;
}
