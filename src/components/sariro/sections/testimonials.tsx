"use client";

import { Star, Quote } from "lucide-react";
import { TESTIMONIALS } from "@/lib/data";

export function Testimonials() {
  // split into two rows for a richer marquee
  const rowA = TESTIMONIALS.slice(0, 3);
  const rowB = TESTIMONIALS.slice(3);
  const loopA = [...rowA, ...rowA, ...rowA, ...rowA];
  const loopB = [...rowB, ...rowB, ...rowB, ...rowB];

  return (
    <section
      id="resources"
      className="py-16 sm:py-24 bg-brand-panel border-y border-border"
      aria-labelledby="testimonials-heading"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl">
          <p className="font-mono-display text-xs uppercase tracking-[0.2em] text-brand-green font-semibold">
            What people say
          </p>
          <h2
            id="testimonials-heading"
            className="mt-3 font-heading text-4xl sm:text-5xl font-extrabold tracking-tight text-foreground text-balance"
          >
            Real outcomes from real learners.
          </h2>
        </div>
      </div>

      {/* marquee rows */}
      <div className="mt-12 space-y-6">
        <MarqueeRow items={loopA} direction="normal" />
        <MarqueeRow items={loopB} direction="reverse" />
      </div>
    </section>
  );
}

function MarqueeRow({
  items,
  direction,
}: {
  items: (typeof TESTIMONIALS)[number][];
  direction: "normal" | "reverse";
}) {
  return (
    <div className="relative marquee-mask overflow-hidden">
      <div
        className={
          "flex w-max gap-5 " +
          (direction === "normal" ? "animate-marquee-slow" : "animate-marquee-reverse")
        }
      >
        {items.map((t, i) => (
          <figure
            key={`${t.name}-${i}`}
            className="w-[320px] sm:w-[380px] shrink-0 rounded-2xl border border-border bg-background p-6 shadow-sm"
          >
            <div className="flex items-center justify-between">
              <Quote className="size-7 text-brand-blue/30" />
              <div className="flex gap-0.5">
                {Array.from({ length: 5 }).map((_, s) => (
                  <Star
                    key={s}
                    className="size-4 fill-brand-green text-brand-green"
                  />
                ))}
              </div>
            </div>
            <blockquote className="mt-4 text-base text-foreground/85 font-medium leading-relaxed">
              “{t.quote}”
            </blockquote>
            <figcaption className="mt-5 flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-blue/10 text-brand-blue font-heading font-bold">
                {t.name.charAt(0)}
              </span>
              <div className="leading-tight">
                <p className="font-heading font-bold text-sm">{t.name}</p>
                <p className="text-xs text-muted-foreground font-medium">
                  {t.role}
                </p>
              </div>
            </figcaption>
          </figure>
        ))}
      </div>
    </div>
  );
}
