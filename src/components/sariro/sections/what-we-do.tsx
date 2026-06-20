"use client";

import Link from "next/link";
import {
  GraduationCap,
  School,
  Briefcase,
  ArrowRight,
  Check,
} from "lucide-react";
import { TRACKS } from "@/lib/data";
import { ROUTES } from "@/lib/nav";
import { cn } from "@/lib/utils";

const ICONS = { GraduationCap, School, Briefcase } as const;

export function WhatWeDo() {
  return (
    <section
      className="py-16 sm:py-24 bg-brand-panel border-y border-border"
      aria-labelledby="whatwedo-heading"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl">
          <p className="font-mono-display text-xs uppercase tracking-[0.2em] text-brand-blue font-semibold">
            What we do
          </p>
          <h2
            id="whatwedo-heading"
            className="mt-3 font-heading text-4xl sm:text-5xl font-extrabold tracking-tight text-foreground text-balance"
          >
            Expert-led paths for every stage of the journey.
          </h2>
          <p className="mt-4 text-lg text-foreground/70 font-medium leading-relaxed">
            Pick the track that fits. Each one is cohort-based, mentor-led, and
            built around real outcomes — not certificates.
          </p>
        </div>

        <div className="mt-12 grid md:grid-cols-3 gap-6">
          {TRACKS.map((track, idx) => {
            const Icon = ICONS[track.icon as keyof typeof ICONS];
            const isGreen = track.accent === "green";
            return (
              <article
                key={track.id}
                id={track.id}
                className="group relative flex flex-col rounded-2xl border border-border bg-background p-6 sm:p-7 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
              >
                <div className="flex items-center justify-between">
                  <span
                    className={cn(
                      "inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-mono-display font-semibold uppercase tracking-wider",
                      isGreen
                        ? "bg-brand-green/10 text-brand-green"
                        : "bg-brand-blue/10 text-brand-blue"
                    )}
                  >
                    <span className="text-base font-bold">0{idx + 1}</span>
                    {track.tag}
                  </span>
                  <span
                    className={cn(
                      "flex h-12 w-12 items-center justify-center rounded-xl",
                      isGreen
                        ? "bg-brand-green/10 text-brand-green"
                        : "bg-brand-blue/10 text-brand-blue"
                    )}
                  >
                    <Icon className="size-6" />
                  </span>
                </div>

                <h3 className="mt-5 font-heading text-2xl font-bold tracking-tight text-foreground">
                  {track.title}
                </h3>
                <p className="mt-3 text-base text-foreground/70 font-medium leading-relaxed">
                  {track.description}
                </p>

                <ul className="mt-5 space-y-2.5">
                  {track.bullets.map((b) => (
                    <li key={b} className="flex items-start gap-2.5 text-sm text-foreground/80">
                      <span
                        className={cn(
                          "mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full",
                          isGreen
                            ? "bg-brand-green/10 text-brand-green"
                            : "bg-brand-blue/10 text-brand-blue"
                        )}
                      >
                        <Check className="size-3.5" strokeWidth={3} />
                      </span>
                      <span className="font-medium">{b}</span>
                    </li>
                  ))}
                </ul>

                <Link
                  href={ROUTES[track.view]}
                  className={cn(
                    "btn-tactile mt-7 inline-flex items-center justify-center gap-2 px-5 py-3 text-base",
                    isGreen ? "btn-tactile-green" : "btn-tactile-primary"
                  )}
                >
                  {track.cta}
                  <ArrowRight className="size-4" />
                </Link>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
