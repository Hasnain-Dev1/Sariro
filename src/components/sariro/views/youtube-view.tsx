"use client";

import { useState, useMemo } from "react";
import { PageHero } from "../ui-bits/page-hero";
import { Breadcrumb } from "../ui-bits/breadcrumb";
import { SectionHeader } from "../ui-bits/section-header";
import { VIDEOS, type Video } from "@/lib/data";
import {
  Play,
  Youtube,
  ArrowUpRight,
  Eye,
  Bell,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { useGo } from "@/lib/nav";

export function YoutubeView() {
  const go = useGo();
  const featured = VIDEOS.find((v) => v.featured) ?? VIDEOS[0];
  const [active, setActive] = useState<Video>(featured);

  const categories = useMemo(
    () => ["All", ...Array.from(new Set(VIDEOS.map((v) => v.category)))],
    []
  );
  const [cat, setCat] = useState<string>("All");
  const list = cat === "All" ? VIDEOS : VIDEOS.filter((v) => v.category === cat);

  return (
    <>
      <PageHero
        eyebrow="YouTube"
        title={
          <>
            Watch. Learn.{" "}
            <span className="text-brand-blue">Grow.</span>
          </>
        }
        subtitle="Free educational content, insights on AI, and technical deep-dives — published every week."
        accent="blue"
      >
        <a
          href="#youtube"
          onClick={(e) => {
            e.preventDefault();
            toast.success("Thanks for subscribing! New videos every week.");
          }}
          className="btn-tactile btn-tactile-primary inline-flex items-center gap-2 px-5 py-3 text-base"
        >
          <Youtube className="size-5 text-[#ff5f57]" />
          Subscribe — {VIDEOS.length}+ videos
          <Bell className="size-4" />
        </a>
      </PageHero>

      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Breadcrumb items={[{ label: "YouTube" }]} />

          {/* Featured player */}
          <div className="grid lg:grid-cols-12 gap-8 items-start">
            <div className="lg:col-span-8">
              <div className="relative aspect-video overflow-hidden rounded-2xl border border-border shadow-xl bg-[#0f172a]">
                { }
                <img
                  src={active.image}
                  alt={active.title}
                  className="h-full w-full object-cover opacity-80"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <button
                    onClick={() => toast.info(`Now playing: ${active.title}`)}
                    className="flex h-20 w-20 items-center justify-center rounded-full bg-white/90 text-[#0f172a] shadow-2xl hover:scale-110 transition-transform cursor-pointer"
                    aria-label={`Play ${active.title}`}
                  >
                    <Play className="size-9 ml-1.5 fill-current" />
                  </button>
                </div>
                <div className="absolute bottom-0 inset-x-0 p-6">
                  <span className="inline-flex items-center gap-1.5 rounded-md bg-[#7dd3fc]/20 px-2.5 py-1 text-xs font-mono-display font-semibold text-[#7dd3fc]">
                    {active.category}
                  </span>
                  <h2 className="mt-2 font-heading text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
                    {active.title}
                  </h2>
                  <p className="mt-1 text-sm text-white/70 font-medium">
                    {active.description}
                  </p>
                </div>
              </div>
            </div>

            {/* Up next list */}
            <aside className="lg:col-span-4">
              <h3 className="font-heading text-lg font-bold tracking-tight mb-4">Up next</h3>
              <div className="space-y-3 max-h-[420px] overflow-y-auto scroll-sariro pr-1">
                {VIDEOS.slice(0, 6).map((v) => (
                  <button
                    key={v.id}
                    onClick={() => setActive(v)}
                    className={cn(
                      "group flex gap-3 w-full rounded-xl border p-2 text-left transition-all cursor-pointer",
                      active.id === v.id
                        ? "border-brand-blue bg-brand-blue/5"
                        : "border-border hover:border-foreground/20 hover:bg-muted/50"
                    )}
                  >
                    <div className="relative w-28 shrink-0 aspect-video overflow-hidden rounded-lg">
                      { }
                      <img src={v.image} alt="" className="h-full w-full object-cover" />
                      <span className="absolute bottom-1 right-1 rounded bg-black/80 px-1.5 py-0.5 text-[10px] font-mono-display font-semibold text-white">
                        {v.duration}
                      </span>
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="font-heading text-sm font-bold leading-snug line-clamp-2">
                        {v.title}
                      </p>
                      <p className="mt-1 text-xs text-muted-foreground font-medium inline-flex items-center gap-1">
                        <Eye className="size-3" />
                        {v.views} views
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            </aside>
          </div>

          {/* Full library */}
          <div className="mt-16">
            <div className="flex flex-wrap items-end justify-between gap-6">
              <SectionHeader
                eyebrow="Full library"
                title="Every video, all free."
                accent="blue"
              />
              <div className="flex flex-wrap gap-2">
                {categories.map((c) => (
                  <button
                    key={c}
                    onClick={() => setCat(c)}
                    className={cn(
                      "rounded-full px-3.5 py-1.5 text-xs font-semibold cursor-pointer transition-colors border",
                      cat === c
                        ? "bg-foreground text-background border-foreground"
                        : "bg-background text-foreground/70 border-border hover:border-foreground/40"
                    )}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-8 grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {list.map((v) => (
                <article
                  key={v.id}
                  className="group overflow-hidden rounded-2xl border border-border bg-background hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                >
                  <button
                    onClick={() => {
                      setActive(v);
                      window.scrollTo({ top: 0, behavior: "smooth" });
                    }}
                    className="block w-full text-left cursor-pointer"
                  >
                    <div className="relative aspect-video overflow-hidden">
                      { }
                      <img
                        src={v.image}
                        alt={v.title}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <span className="flex h-14 w-14 items-center justify-center rounded-full bg-white/90 text-[#0f172a] shadow-xl">
                          <Play className="size-6 ml-1 fill-current" />
                        </span>
                      </div>
                      <span className="absolute bottom-2 right-2 rounded bg-black/80 px-2 py-1 text-xs font-mono-display font-semibold text-white">
                        {v.duration}
                      </span>
                      <span className="absolute top-2 left-2 rounded-md bg-white/90 px-2 py-0.5 text-xs font-mono-display font-semibold text-foreground">
                        {v.category}
                      </span>
                    </div>
                    <div className="p-5">
                      <h3 className="font-heading text-lg font-bold tracking-tight leading-snug">
                        {v.title}
                      </h3>
                      <p className="mt-1.5 text-sm text-foreground/70 font-medium leading-relaxed line-clamp-2">
                        {v.description}
                      </p>
                      <p className="mt-3 text-xs text-muted-foreground font-medium inline-flex items-center gap-1">
                        <Eye className="size-3.5" />
                        {v.views} views
                      </p>
                    </div>
                  </button>
                </article>
              ))}
            </div>
          </div>

          {/* CTA */}
          <div className="mt-16 rounded-3xl border border-border bg-brand-panel p-8 sm:p-12 text-center">
            <SectionHeader
              align="center"
              eyebrow="Ready to go deeper?"
              title="Turn watching into building."
              subtitle="Every video is free. The cohorts turn viewers into makers."
            />
            <button
              onClick={() => go("courses")}
              className="btn-tactile btn-tactile-primary mt-6 inline-flex items-center gap-2 px-6 py-3.5 text-base"
            >
              Explore cohorts
              <ArrowUpRight className="size-5" />
            </button>
          </div>
        </div>
      </section>
    </>
  );
}
