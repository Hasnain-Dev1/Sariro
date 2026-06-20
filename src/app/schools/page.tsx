import type { Metadata } from "next";
import { SchoolsView } from "@/components/sariro/views/schools-view";

export const metadata: Metadata = {
  title: "For Schools — Sariro | AI workshops & curriculum",
  description:
    "Bring AI into your classrooms. Immersive workshops, hackathons, curriculum consultation, and full AI lab setup for K-12 schools.",
};

export default function Page() {
  return <SchoolsView />;
}
