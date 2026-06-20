import type { Metadata } from "next";
import { ResourcesView } from "@/components/sariro/views/resources-view";

export const metadata: Metadata = {
  title: "Resources — Sariro | Research, blog & free downloads",
  description:
    "Free AI education resources — research papers, field notes, and downloadable tools from Sariro and educator Mimo Patra.",
};

export default function Page() {
  return <ResourcesView />;
}
