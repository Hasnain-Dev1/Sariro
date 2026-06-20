import type { Metadata } from "next";
import { EventsView } from "@/components/sariro/views/events-view";

export const metadata: Metadata = {
  title: "Events — Sariro | Cohorts, webinars & hackathons",
  description:
    "Upcoming Sariro events — cohort start dates, free live webinars, school hackathons, and educator workshops. Reserve your seat.",
};

export default function Page() {
  return <EventsView />;
}
