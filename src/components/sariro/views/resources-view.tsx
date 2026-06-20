"use client";

import { useState, useMemo } from "react";
import { PageHero } from "../ui-bits/page-hero";
import { Breadcrumb } from "../ui-bits/breadcrumb";
import { SectionHeader } from "../ui-bits/section-header";
import { RESOURCES, type Resource } from "@/lib/data";
import {
  FileText,
  BookOpen,
  Download,
  ArrowUpRight,
  Clock,
  Quote,
  Award,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

const TYPE_META: Record<
  Resource["type"],
  { label: string; icon: React.ComponentType<{ className?: string }>; accent: "blue" | "green" }
> = {
  paper: { label: "Research Paper", icon: FileText, accent: "blue" },
  blog: { label: "Blog Post", icon: BookOpen, accent: "green" },
  download: { label: "Free Download", icon: Download, accent: "blue" },
};

const FILTERS = [
  { id: "all", label: "All" },
  { id: "paper", label: "Research Papers" },
  { id: "blog", label: "Blog" },
  { id: "download", label: "Downloads" },
] as const;

export function ResourcesView() {
  const [filter, setFilter] = useState<(typeof FILTERS)[number]["id"]>("all");

  const filtered = useMemo(
    () => (filter === "all" ? RESOURCES : RESOURCES.filter((r) => r.type === filter)),
    [filter]
  );

  const papers = RESOURCES.filter((r) => r.type === "paper");

  return (
    <>
      <PageHero
        eyebrow="Resources"
        title={
          <>
            Free resources to{" "}
            <span className="text-brand-blue">keep you learning.</span>
          </>
        }
        subtitle="Research papers, field notes, and downloadable tools — the same material we use in our cohorts."
        accent="blue"
      >
        <div className="flex flex-wrap gap-6 text-sm">
          <span className="inline-flex items-center gap-2 font-semibold">
            <FileText className="size-4 text-brand-blue" />
            {papers.length} research papers
          </span>
          <span className="inline-flex items-center gap-2 font-semibold">
            <BookOpen className="size-4 text-brand-green" />
            {RESOURCES.filter((r) => r.type === "blog").length} blog posts
          </span>
          <span className="inline-flex items-center gap-2 font-semibold">
            <Download className="size-4 text-brand-blue" />
            {RESOURCES.filter((r) => r.type === "download").length} free downloads
          </span>
        </div>
      </PageHero>

      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Breadcrumb items={[{ label: "Resources" }]} />

          {/* Filters */}
          <div className="flex flex-wrap gap-2">
            {FILTERS.map((f) => (
              <button
                key={f.id}
                onClick={() => setFilter(f.id)}
                className={cn(
                  "rounded-full px-4 py-2 text-sm font-semibold cursor-pointer transition-colors border",
                  filter === f.id
                    ? "bg-foreground text-background border-foreground"
                    : "bg-background text-foreground/70 border-border hover:border-foreground/40"
                )}
              >
                {f.label}
              </button>
            ))}
          </div>

          {/* Grid */}
          <div className="mt-8 grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((r) => {
              const meta = TYPE_META[r.type];
              const Icon = meta.icon;
              const isGreen = meta.accent === "green";
              return (
                <article
                  key={r.id}
                  className="group flex flex-col rounded-2xl border border-border bg-background p-6 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                >
                  <div className="flex items-center justify-between">
                    <span
                      className={cn(
                        "inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-mono-display font-semibold uppercase tracking-wider",
                        isGreen ? "bg-brand-green/10 text-brand-green" : "bg-brand-blue/10 text-brand-blue"
                      )}
                    >
                      <Icon className="size-3" />
                      {meta.label}
                    </span>
                    <span className="text-xs text-muted-foreground font-medium">{r.date}</span>
                  </div>
                  <span
                    className={cn(
                      "mt-4 inline-flex w-fit rounded-md px-2 py-0.5 text-xs font-semibold",
                      isGreen ? "bg-brand-green/5 text-brand-green" : "bg-brand-blue/5 text-brand-blue"
                    )}
                  >
                    {r.tag}
                  </span>
                  <h3 className="mt-2 font-heading text-lg font-bold tracking-tight leading-snug">
                    {r.title}
                  </h3>
                  <p className="mt-2 text-sm text-foreground/70 font-medium leading-relaxed flex-1">
                    {r.description}
                  </p>
                  <div className="mt-4 flex items-center justify-between">
                    {r.readTime && (
                      <span className="inline-flex items-center gap-1 text-xs text-muted-foreground font-medium">
                        <Clock className="size-3.5" />
                        {r.readTime} read
                      </span>
                    )}
                    <button
                      onClick={() =>
                        r.type === "download"
                          ? toast.success("Download started! Check your downloads folder.")
                          : toast.info("Opening resource…")
                      }
                      className="ml-auto inline-flex items-center gap-1 text-sm font-semibold text-brand-blue hover:text-brand-blue/80 cursor-pointer"
                    >
                      {r.type === "download" ? "Download" : "Read"}
                      <ArrowUpRight className="size-4" />
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      {/* Research highlight band */}
      <section className="py-16 sm:py-20 bg-[#0f172a] text-white relative overflow-hidden">
        <div
          className="pointer-events-none absolute -top-32 left-1/2 -translate-x-1/2 h-[360px] w-[620px] rounded-full blur-3xl opacity-40"
          style={{
            background:
              "radial-gradient(closest-side, rgba(37,99,235,0.5), transparent 70%)",
          }}
          aria-hidden
        />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-10 items-center">
            <div>
              <p className="font-mono-display text-xs uppercase tracking-[0.2em] text-[#7dd3fc] font-semibold">
                Research &amp; patents
              </p>
              <h2 className="mt-3 font-heading text-3xl sm:text-4xl font-extrabold tracking-tight text-balance">
                36 papers. 7 patents. One bibliography on request.
              </h2>
              <p className="mt-4 text-lg text-white/70 font-medium leading-relaxed">
                Mimo's research spans neural network optimization, computational
                efficiency, and educational technology frameworks. A complete
                bibliography is available for academic and professional review.
              </p>
              <div className="mt-6 grid grid-cols-2 gap-4 max-w-sm">
                <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <FileText className="size-6 text-[#7dd3fc]" />
                  <p className="mt-2 font-heading text-3xl font-extrabold">36</p>
                  <p className="text-sm text-white/60 font-medium">Research papers</p>
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <Award className="size-6 text-[#28c840]" />
                  <p className="mt-2 font-heading text-3xl font-extrabold">7</p>
                  <p className="text-sm text-white/60 font-medium">Patents granted</p>
                </div>
              </div>
            </div>
            <figure className="rounded-3xl border border-white/10 bg-white/5 p-8">
              <Quote className="size-8 text-[#7dd3fc]" />
              <blockquote className="mt-4 font-heading text-2xl font-bold leading-snug">
                “I don't teach coding. I teach thinking. Coding is just the
                language we use.”
              </blockquote>
              <figcaption className="mt-5 flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#7dd3fc]/20 text-[#7dd3fc] font-heading font-bold">
                  M
                </span>
                <div className="leading-tight">
                  <p className="font-heading font-bold">Mimo Patra</p>
                  <p className="text-sm text-white/60 font-medium">Educator · Researcher</p>
                </div>
              </figcaption>
            </figure>
          </div>
        </div>
      </section>
    </>
  );
}
