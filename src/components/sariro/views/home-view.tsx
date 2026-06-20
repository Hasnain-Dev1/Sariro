"use client";

import { Hero } from "../sections/hero";
import { TrustedBy } from "../sections/trusted-by";
import { Stats } from "../sections/stats";
import { WhatWeDo } from "../sections/what-we-do";
import { Testimonials } from "../sections/testimonials";
import { Community } from "../sections/community";
import { SectionHeader } from "../ui-bits/section-header";
import { useGo } from "@/lib/nav";
import { COURSES } from "@/lib/data";
import { ArrowRight, Clock, Users } from "lucide-react";
import { cn } from "@/lib/utils";

export function HomeView() {
  const go = useGo();
  const featured = COURSES.filter((c) => c.featured).slice(0, 3);

  return (
    <>
      <Hero />
      <TrustedBy />
      <Stats />
      <WhatWeDo />

      {/* Featured courses preview → links to Courses page */}
      <section className="py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <SectionHeader
              eyebrow="Featured cohorts"
              title={<>Start with a flagship course.</>}
              subtitle="Cohort-based, mentor-led, project-finished. Next seats open January 2026."
            />
            <button
              onClick={() => go("courses")}
              className="btn-tactile btn-tactile-light inline-flex items-center gap-2 px-5 py-3 text-base"
            >
              View all courses
              <ArrowRight className="size-4" />
            </button>
          </div>

          <div className="mt-10 grid md:grid-cols-3 gap-6">
            {featured.map((c) => (
              <article
                key={c.id}
                className="group flex flex-col rounded-2xl border border-border bg-background p-6 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
              >
                <div className="flex items-center justify-between text-xs font-mono-display font-semibold uppercase tracking-wider">
                  <span
                    className={cn(
                      "rounded-full px-3 py-1",
                      c.accent === "green"
                        ? "bg-brand-green/10 text-brand-green"
                        : "bg-brand-blue/10 text-brand-blue"
                    )}
                  >
                    {c.level}
                  </span>
                  <span className="text-muted-foreground">{c.format}</span>
                </div>
                <h3 className="mt-4 font-heading text-xl font-bold tracking-tight">
                  {c.title}
                </h3>
                <p className="mt-2 text-sm text-foreground/70 font-medium leading-relaxed flex-1">
                  {c.tagline}
                </p>
                <div className="mt-4 flex items-center gap-4 text-xs text-muted-foreground font-medium">
                  <span className="inline-flex items-center gap-1">
                    <Clock className="size-3.5" />
                    {c.durationWeeks} weeks
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <Users className="size-3.5" />
                    {c.audience}
                  </span>
                </div>
                <div className="mt-5 flex items-center justify-between">
                  <span className="font-heading text-2xl font-extrabold">
                    {c.priceLabel}
                  </span>
                  <button
                    onClick={() => go("courses")}
                    className="text-sm font-semibold text-brand-blue hover:text-brand-blue/80 cursor-pointer inline-flex items-center gap-1"
                  >
                    Details
                    <ArrowRight className="size-4" />
                  </button>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <Testimonials />
      <Community />
    </>
  );
}
