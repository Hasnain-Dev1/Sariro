import type { Metadata } from "next";
import { YoutubeView } from "@/components/sariro/views/youtube-view";

export const metadata: Metadata = {
  title: "YouTube — Sariro | Watch. Learn. Grow.",
  description:
    "Free educational content, AI insights, and technical deep-dives from Sariro. New videos every week.",
};

export default function Page() {
  return <YoutubeView />;
}
