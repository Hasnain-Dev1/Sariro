"use client";

import { HERO_STATS } from "@/lib/data";
import { useCountUp } from "../use-count-up";

function StatItem({
  value,
  suffix,
  label,
}: {
  value: number;
  suffix: string;
  label: string;
}) {
  const { value: animated, ref } = useCountUp(value);

  return (
    <div
      ref={ref as React.RefObject<HTMLDivElement>}
      className="text-center"
    >
      <div className="font-heading font-extrabold tracking-tight text-foreground text-5xl sm:text-6xl lg:text-7xl tabular-nums">
        {animated.toLocaleString()}
        <span className="text-brand-blue">{suffix}</span>
      </div>
      <div className="mt-2 font-mono-display text-xs sm:text-sm uppercase tracking-wider text-muted-foreground">
        {label}
      </div>
    </div>
  );
}

export function Stats() {
  return (
    <section className="py-16 sm:py-24" aria-label="Sariro by the numbers">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-y-12 gap-x-6">
          {HERO_STATS.map((s) => (
            <StatItem key={s.label} {...s} />
          ))}
        </div>
      </div>
    </section>
  );
}
