import type { Metadata } from "next";
import { CareersView } from "@/components/sariro/views/careers-view";

export const metadata: Metadata = {
  title: "Careers — Sariro | Help us teach the future",
  description:
    "Join Sariro — a remote-first team teaching AI literacy to students, schools, and professionals. Open roles in education, schools, product, and growth.",
};

export default function Page() {
  return <CareersView />;
}
