import type { Metadata } from "next";
import { AboutView } from "@/components/sariro/views/about-view";

export const metadata: Metadata = {
  title: "About Mimo — Sariro | 21 years of code, one mission",
  description:
    "Meet Mimo Patra — educator, researcher, and engineer. 36 research papers, 7 patents, 5,000+ students. Teaching thinking, not just coding.",
};

export default function Page() {
  return <AboutView />;
}
