"use client";

import { cn } from "@/lib/utils";

/**
 * Reusable inner-page hero banner. Used at the top of every non-home "page".
 */
export function PageHero({
  eyebrow,
  title,
  subtitle,
  accent = "blue",
  children,
}: {
  eyebrow: string;
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  accent?: "blue" | "green";
  children?: React.ReactNode;
}) {
  return (
    <section className="relative overflow-hidden border-b border-border">
      <div className="pointer-events-none absolute inset-0 bg-grid-slate opacity-50" aria-hidden />
      <div
        className="pointer-events-none absolute -top-32 left-1/2 -translate-x-1/2 h-[420px] w-[760px] rounded-full blur-3xl"
        style={{
          background:
            accent === "green"
              ? "radial-gradient(closest-side, rgba(22,163,74,0.16), transparent 70%)"
              : "radial-gradient(closest-side, rgba(37,99,235,0.18), transparent 70%)",
        }}
        aria-hidden
      />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-12 pb-10 sm:pt-16 sm:pb-14">
        <p
          className={cn(
            "font-mono-display text-xs uppercase tracking-[0.2em] font-semibold",
            accent === "green" ? "text-brand-green" : "text-brand-blue"
          )}
        >
          {eyebrow}
        </p>
        <h1 className="mt-3 font-heading text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-foreground text-balance max-w-4xl">
          {title}
        </h1>
        {subtitle && (
          <p className="mt-5 text-lg sm:text-xl text-foreground/70 font-medium leading-relaxed max-w-2xl">
            {subtitle}
          </p>
        )}
        {children && <div className="mt-7">{children}</div>}
      </div>
    </section>
  );
}
