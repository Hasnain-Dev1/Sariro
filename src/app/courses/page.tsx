import type { Metadata } from "next";
import { CoursesView } from "@/components/sariro/views/courses-view";

export const metadata: Metadata = {
  title: "Courses — Sariro | Cohort-based AI courses",
  description:
    "Browse Sariro's cohort-based AI courses — from AI Literacy fundamentals to building with LLMs. Filter by level and audience. Next cohorts open January 2026.",
};

export default function Page() {
  return <CoursesView />;
}
