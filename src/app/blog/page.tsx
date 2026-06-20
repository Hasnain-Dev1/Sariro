import type { Metadata } from "next";
import { BlogView } from "@/components/sariro/views/blog-view";

export const metadata: Metadata = {
  title: "Blog — Sariro | Field notes from the edge of AI",
  description:
    "Philosophy, practical guides, and learning science from Mimo Patra and the Sariro team.",
};

export default function Page() {
  return <BlogView />;
}
