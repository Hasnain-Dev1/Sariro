"use client";

import { useState } from "react";
import { PageHero } from "../ui-bits/page-hero";
import { Breadcrumb } from "../ui-bits/breadcrumb";
import { SectionHeader } from "../ui-bits/section-header";
import {
  MIMO_NUMBERS,
  MIMO_EXPERTISE,
  MIMO_JOURNEY,
  MIMO_FULL_STORY,
  MIMO_PRINCIPLES,
} from "@/lib/data";
import { useCountUp } from "../use-count-up";
import { useGo } from "@/lib/nav";
import {
  Quote,
  ChevronDown,
  FileText,
  Award,
  Users,
  Globe,
  Code2,
  GraduationCap,
  ArrowRight,
  Lightbulb,
  Rocket,
  ShieldCheck,
  Compass,
} from "lucide-react";
import { cn } from "@/lib/utils";

const NUM_ICONS = [FileText, Award, Users, Globe, Code2, GraduationCap];
const PRINCIPLE_ICONS = [Lightbulb, Rocket, ShieldCheck, Compass];

export function AboutView() {
  const go = useGo();
  const [open, setOpen] = useState(false);

  return (
    <>
      <PageHero
        eyebrow="About Mimo"
        title={
          <>
            21 years of code.{" "}
            <span className="bg-gradient-to-r from-brand-blue to-brand-green bg-clip-text text-transparent">
              One mission: teach the future.
            </span>
          </>
        }
        subtitle="Mimo Patra isn't just an instructor — he's a practitioner. Bridging the gap between academic theory and industry reality."
        accent="blue"
      />

      {/* Portrait + intro */}
      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Breadcrumb items={[{ label: "About Mimo" }]} />

          <div className="grid lg:grid-cols-12 gap-10 lg:gap-12 items-start">
            {/* Portrait */}
            <div className="lg:col-span-5">
              <div className="relative lg:sticky lg:top-28">
                <div
                  className="absolute -inset-3 rounded-[2rem] blur-2xl opacity-50"
                  style={{
                    background:
                      "radial-gradient(closest-side, rgba(37,99,235,0.25), rgba(22,163,74,0.12), transparent 70%)",
                  }}
                  aria-hidden
                />
                <div className="relative overflow-hidden rounded-3xl border border-border shadow-xl">
                  { }
                  <img
                    src="/images/mimo-portrait.png"
                    alt="Mimo Patra, educator and software engineer behind Sariro"
                    className="w-full h-auto object-cover"
                  />
                  <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent p-5">
                    <p className="font-heading text-xl font-bold text-white">Mimo Patra</p>
                    <p className="text-sm text-white/80">Educator · Researcher · Engineer</p>
                  </div>
                </div>

                <div className="absolute -top-4 -right-3 sm:-right-6 max-w-[230px] rotate-2 rounded-2xl border border-border bg-background px-4 py-3 shadow-xl">
                  <Quote className="size-4 text-brand-blue" />
                  <p className="mt-1 text-sm font-semibold leading-snug text-foreground">
                    I don't teach coding. I teach thinking.
                  </p>
                </div>
              </div>
            </div>

            {/* Story */}
            <div className="lg:col-span-7">
              <SectionHeader
                eyebrow="The story so far"
                title="From first lines of code to 5,000+ students."
                accent="blue"
              />

              <div className="mt-6 space-y-4 text-base sm:text-lg text-foreground/75 font-medium leading-relaxed">
                <p>{MIMO_FULL_STORY[0]}</p>

                {open && (
                  <div className="space-y-4 animate-in fade-in slide-in-from-top-2 duration-300">
                    {MIMO_FULL_STORY.slice(1).map((p, i) => (
                      <p key={i}>{p}</p>
                    ))}
                  </div>
                )}
              </div>

              <button
                onClick={() => setOpen((v) => !v)}
                className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-brand-blue hover:text-brand-blue/80 cursor-pointer"
                aria-expanded={open}
              >
                {open ? "Show less" : "Read the full story"}
                <ChevronDown className={cn("size-4 transition-transform", open && "rotate-180")} />
              </button>

              {/* Principles */}
              <div className="mt-10">
                <SectionHeader
                  eyebrow="Teaching principles"
                  title="The four ideas behind every Sariro lesson."
                  accent="green"
                />
                <div className="mt-6 grid sm:grid-cols-2 gap-4">
                  {MIMO_PRINCIPLES.map((p, i) => {
                    const Icon = PRINCIPLE_ICONS[i % PRINCIPLE_ICONS.length];
                    return (
                      <div
                        key={p.title}
                        className="rounded-2xl border border-border bg-brand-panel p-5"
                      >
                        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-green/10 text-brand-green">
                          <Icon className="size-5" />
                        </span>
                        <h3 className="mt-3 font-heading text-lg font-bold tracking-tight">
                          {p.title}
                        </h3>
                        <p className="mt-1.5 text-sm text-foreground/70 font-medium leading-relaxed">
                          {p.text}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Expertise */}
              <div className="mt-10">
                <p className="font-mono-display text-xs uppercase tracking-wider text-muted-foreground">
                  Expertise in
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {MIMO_EXPERTISE.map((e) => (
                    <span
                      key={e}
                      className="inline-flex items-center gap-1.5 rounded-full border border-border bg-background px-3.5 py-1.5 text-sm font-semibold text-foreground/80"
                    >
                      <span className="h-1.5 w-1.5 rounded-full bg-brand-green" />
                      {e}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* By the numbers */}
      <section className="py-16 sm:py-20 bg-brand-panel border-y border-border">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeader
            align="center"
            eyebrow="By the numbers"
            title="A practitioner's track record."
            subtitle="Not just slides — research, patents, and 5,000+ students taught."
            accent="blue"
          />
          <div className="mt-12 grid grid-cols-2 lg:grid-cols-3 gap-4">
            {MIMO_NUMBERS.map((n, i) => (
              <MimoNumber
                key={n.label}
                {...n}
                Icon={NUM_ICONS[i % NUM_ICONS.length]}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Teaching journey */}
      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12">
            <div>
              <SectionHeader
                eyebrow="Teaching journey"
                title="From peer mentorship to 98th-percentile educator."
                accent="green"
              />
              <ol className="mt-8 relative border-s border-border ms-3 space-y-8">
                {MIMO_JOURNEY.map((step) => (
                  <li key={step.title} className="ms-6">
                    <span className="absolute -start-[9px] flex h-4 w-4 items-center justify-center rounded-full bg-brand-blue ring-4 ring-background" />
                    <p className="font-mono-display text-xs uppercase tracking-wider text-brand-blue font-semibold">
                      {step.year}
                    </p>
                    <h3 className="mt-1 font-heading text-lg font-bold tracking-tight">
                      {step.title}
                    </h3>
                    <p className="mt-1 text-foreground/70 font-medium leading-relaxed">
                      {step.text}
                    </p>
                  </li>
                ))}
              </ol>
            </div>

            {/* Research & patents */}
            <div className="rounded-3xl border border-border bg-brand-panel p-6 sm:p-8">
              <SectionHeader
                eyebrow="Research & patents"
                title="Pushing the edge of the field."
                accent="blue"
              />
              <p className="mt-4 text-foreground/70 font-medium leading-relaxed">
                Beyond the classroom, Mimo's work focuses on computational
                efficiency, neural network optimization, and educational
                technology frameworks.
              </p>

              <div className="mt-6 grid grid-cols-2 gap-3">
                <div className="rounded-2xl border border-border bg-background p-5">
                  <FileText className="size-6 text-brand-blue" />
                  <p className="mt-3 font-heading text-3xl font-extrabold tabular-nums">36</p>
                  <p className="text-sm font-medium text-foreground/70">Research papers</p>
                  <p className="text-xs text-muted-foreground mt-0.5">in international journals</p>
                </div>
                <div className="rounded-2xl border border-border bg-background p-5">
                  <Award className="size-6 text-brand-green" />
                  <p className="mt-3 font-heading text-3xl font-extrabold tabular-nums">7</p>
                  <p className="text-sm font-medium text-foreground/70">Technology patents</p>
                  <p className="text-xs text-muted-foreground mt-0.5">granted for innovative systems</p>
                </div>
              </div>

              <div className="mt-6 rounded-2xl border border-dashed border-border bg-background p-5">
                <p className="font-heading font-bold">Full bibliography</p>
                <p className="mt-1 text-sm text-foreground/70 font-medium leading-relaxed">
                  A comprehensive list of all published research papers and patent
                  documentation is maintained for academic review.
                </p>
                <button
                  onClick={() => go("resources")}
                  className="btn-tactile btn-tactile-light mt-5 w-full inline-flex items-center justify-center gap-2 px-5 py-3 text-base"
                >
                  Browse resources
                  <ArrowRight className="size-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 sm:py-20 bg-foreground text-white">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 text-center">
          <Quote className="mx-auto size-10 text-[#7dd3fc]" />
          <p className="mt-5 font-heading text-2xl sm:text-3xl font-extrabold tracking-tight text-balance">
            “Whether I'm teaching a middle school student their first Python loop
            or guiding a professional through AI integration — the mission is the
            same. Teach thinking. Foster curiosity. Build the future.”
          </p>
          <p className="mt-5 text-white/60 font-medium">— Mimo Patra</p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={() => go("courses")}
              className="btn-tactile btn-tactile-primary inline-flex items-center gap-2 px-6 py-3.5 text-base"
            >
              Learn with Mimo
              <ArrowRight className="size-5" />
            </button>
            <button
              onClick={() => go("schools")}
              className="btn-tactile btn-tactile-light inline-flex items-center gap-2 px-6 py-3.5 text-base"
            >
              Bring Sariro to your school
              <ArrowRight className="size-5" />
            </button>
          </div>
        </div>
      </section>
    </>
  );
}

function MimoNumber({
  value,
  suffix,
  label,
  Icon,
}: {
  value: number;
  suffix: string;
  label: string;
  Icon: React.ComponentType<{ className?: string }>;
}) {
  const { value: animated, ref } = useCountUp(value);
  return (
    <div
      ref={ref as React.RefObject<HTMLDivElement>}
      className="flex items-center gap-3 rounded-xl border border-border bg-background p-4"
    >
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-brand-blue/10 text-brand-blue">
        <Icon className="size-5" />
      </span>
      <div className="leading-tight">
        <div className="font-heading text-2xl font-extrabold tracking-tight tabular-nums">
          {animated.toLocaleString()}
          <span className="text-brand-blue">{suffix}</span>
        </div>
        <div className="text-xs text-muted-foreground font-medium">{label}</div>
      </div>
    </div>
  );
}
