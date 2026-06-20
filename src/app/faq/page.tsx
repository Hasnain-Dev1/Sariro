import type { Metadata } from "next";
import { FaqView } from "@/components/sariro/views/faq-view";

export const metadata: Metadata = {
  title: "FAQ — Sariro | Frequently asked questions",
  description:
    "Answers about Sariro cohorts, pricing, schools, access, and certificates. Search and filter by category.",
};

export default function Page() {
  return <FaqView />;
}
