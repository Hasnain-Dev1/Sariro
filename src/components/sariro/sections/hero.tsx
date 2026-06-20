"use client";

import Link from "next/link";
import { ArrowRight, PlayCircle, ShieldCheck, Sparkles } from "lucide-react";
import { TRUSTED_BY } from "@/lib/data";
import { ROUTES } from "@/lib/nav";

// Terminal code-block tokens (keeps JSX parsing trivial & robust)
const TERMINAL_TOKENS: { t: string; c?: string }[] = [
  { t: "# the Sariro method\n", c: "text-white/40" },
  { t: "def", c: "text-[#7dd3fc]" },
  { t: " teach(student):\n  ", c: "text-white/90" },
  { t: "# not syntax — thinking\n  ", c: "text-white/40" },
  { t: "return", c: "text-[#7dd3fc]" },
  { t: " student\n    .ask(", c: "text-white/90" },
  { t: '"why?"', c: "text-[#86efac]" },
  { t: ")\n    .break_it_down()\n    .build_with_ai()\n    .ship()\n\n", c: "text-white/90" },
  { t: "# 5,000+ students · 65+ countries\n", c: "text-white/40" },
  { t: ">>> ", c: "text-[#fbbf24]" },
  { t: "teach(you).ship()\n", c: "text-white/90" },
  { t: "✓ welcome to the future", c: "text-[#28c840]" },
];

export function Hero() {
  return (
    <section
      id="top"
      className="relative overflow-hidden"
      aria-labelledby="hero-heading"
    >
      {/* Background layers */}
      <div className="pointer-events-none absolute inset-0 bg-grid-slate opacity-60" aria-hidden />
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.07]"
        style={{
          backgroundImage: "url(/images/hero-grid.png)",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -top-32 left-1/2 -translate-x-1/2 h-[520px] w-[820px] rounded-full blur-3xl"
        style={{
          background:
            "radial-gradient(closest-side, rgba(37,99,235,0.18), rgba(22,163,74,0.06), transparent 70%)",
        }}
        aria-hidden
      />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-12 pb-16 sm:pt-16 sm:pb-24 lg:pt-20 lg:pb-28">
        <div className="grid lg:grid-cols-12 gap-10 lg:gap-8 items-center">
          {/* Left: copy + single CTA */}
          <div className="lg:col-span-7">
            <div className="inline-flex items-center gap-2 rounded-full border border-border bg-background/70 backdrop-blur px-3.5 py-1.5 text-xs font-medium text-foreground/70 shadow-sm">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-brand-green opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-brand-green" />
              </span>
              New cohort enrolling now — AI Literacy 2026
            </div>

            <h1
              id="hero-heading"
              className="mt-5 font-heading font-extrabold tracking-tight text-foreground text-balance text-[40px] leading-[1.05] sm:text-6xl lg:text-7xl"
            >
              Teaching the{" "}
              <span className="relative inline-block">
                <span className="bg-gradient-to-r from-brand-blue to-brand-green bg-clip-text text-transparent">
                  Future.
                </span>
                <svg
                  className="absolute -bottom-2 left-0 w-full"
                  viewBox="0 0 300 12"
                  fill="none"
                  preserveAspectRatio="none"
                  aria-hidden
                >
                  <path
                    d="M2 9C70 3 230 3 298 9"
                    stroke="url(#u)"
                    strokeWidth="4"
                    strokeLinecap="round"
                  />
                  <defs>
                    <linearGradient id="u" x1="0" y1="0" x2="300" y2="0" gradientUnits="userSpaceOnUse">
                      <stop stopColor="#2563EB" />
                      <stop offset="1" stopColor="#16A34A" />
                    </linearGradient>
                  </defs>
                </svg>
              </span>
            </h1>

            <p className="mt-6 max-w-xl text-lg sm:text-xl leading-relaxed text-foreground/70 font-medium">
              Preparing students, schools, and professionals for an AI-driven
              future. We teach <span className="text-foreground font-semibold">thinking</span> and
              problem-solving — not just coding.
            </p>

            {/* SINGLE action above the fold */}
            <div className="mt-8">
              <Link
                href={ROUTES.courses}
                className="btn-tactile btn-tactile-primary group inline-flex items-center gap-2.5 px-7 py-4 text-lg sm:text-xl"
              >
                <span aria-hidden>👉</span>
                Click Here to Open My Course
                <ArrowRight className="size-5 transition-transform group-hover:translate-x-1" />
              </Link>
              <p className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground">
                <span className="inline-flex items-center gap-1.5">
                  <ShieldCheck className="size-4 text-brand-green" />
                  Secure checkout
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <PlayCircle className="size-4 text-brand-blue" />
                  Instant video access
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <Sparkles className="size-4 text-brand-blue" />
                  5,000+ students enrolled
                </span>
              </p>
            </div>

            {/* Trusted by mini-row */}
            <div className="mt-10">
              <p className="text-xs font-mono-display uppercase tracking-wider text-muted-foreground">
                Trusted &amp; featured by
              </p>
              <div className="mt-3 flex flex-wrap items-center gap-x-6 gap-y-2">
                {TRUSTED_BY.map((name) => (
                  <span
                    key={name}
                    className="font-heading text-base sm:text-lg font-bold text-foreground/45"
                  >
                    {name}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Right: terminal-style card */}
          <div className="lg:col-span-5">
            <div className="relative">
              <div
                className="absolute -inset-4 rounded-[2rem] blur-2xl opacity-60"
                style={{
                  background:
                    "radial-gradient(closest-side, rgba(37,99,235,0.25), transparent 70%)",
                }}
                aria-hidden
              />
              <div className="relative rounded-2xl border border-border bg-[#0f172a] shadow-2xl overflow-hidden">
                {/* window bar */}
                <div className="flex items-center gap-2 px-4 py-3 border-b border-white/10 bg-white/[0.03]">
                  <span className="h-3 w-3 rounded-full bg-[#ff5f57]" />
                  <span className="h-3 w-3 rounded-full bg-[#febc2e]" />
                  <span className="h-3 w-3 rounded-full bg-[#28c840]" />
                  <span className="ml-2 font-mono-display text-xs text-white/50">
                    mimo — teaching_terminal
                  </span>
                </div>
                {/* code */}
                <pre className="px-5 py-5 font-mono-display text-[13px] sm:text-sm leading-relaxed text-white/90 overflow-x-auto">
                  <code>
                    {TERMINAL_TOKENS.map((t, i) => (
                      <span key={i} className={t.c}>
                        {t.t}
                      </span>
                    ))}
                  </code>
                </pre>
                {/* footer strip */}
                <div className="flex items-center justify-between px-4 py-3 border-t border-white/10 bg-white/[0.03]">
                  <span className="font-mono-display text-xs text-white/50">
                    ~/sariro/cohort-2026
                  </span>
                  <span className="inline-flex items-center gap-1.5 text-xs text-[#28c840]">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#28c840]" />
                    live
                  </span>
                </div>
              </div>

              {/* floating stat chip */}
              <div className="absolute -bottom-5 -left-5 hidden sm:flex items-center gap-3 rounded-2xl border border-border bg-background px-4 py-3 shadow-xl">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-green/10 text-brand-green font-heading text-lg font-extrabold">
                  98
                </div>
                <div className="leading-tight">
                  <p className="font-heading font-bold text-sm">Percentile</p>
                  <p className="text-xs text-muted-foreground">teacher, 2 yrs running</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
