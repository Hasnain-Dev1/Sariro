"use client";

import { useState, useMemo } from "react";
import { PageHero } from "../ui-bits/page-hero";
import { Breadcrumb } from "../ui-bits/breadcrumb";
import { SectionHeader } from "../ui-bits/section-header";
import { COURSES, type Course, type Level, type Audience } from "@/lib/data";
import { useGo } from "@/lib/nav";
import {
  ArrowRight,
  Clock,
  Users,
  Layers,
  Check,
  CalendarDays,
  Sparkles,
  GraduationCap,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { toast } from "sonner";

const LEVELS: (Level | "All")[] = ["All", "Beginner", "Intermediate", "Advanced"];
const AUDIENCES: (Audience | "All")[] = ["All", "Students", "Schools", "Professionals"];

export function CoursesView() {
  const go = useGo();
  const [level, setLevel] = useState<Level | "All">("All");
  const [audience, setAudience] = useState<Audience | "All">("All");
  const [active, setActive] = useState<Course | null>(null);

  const filtered = useMemo(
    () =>
      COURSES.filter(
        (c) =>
          (level === "All" || c.level === level) &&
          (audience === "All" || c.audience === audience)
      ),
    [level, audience]
  );

  return (
    <>
      <PageHero
        eyebrow="Courses"
        title={
          <>
            Cohort-based courses that{" "}
            <span className="text-brand-blue">make you ship.</span>
          </>
        }
        subtitle="Every course ends with a real project — not a certificate. Filter by level and audience to find your path."
        accent="blue"
      >
        <div className="flex flex-wrap gap-6 text-sm">
          <span className="inline-flex items-center gap-2 font-semibold">
            <Sparkles className="size-4 text-brand-blue" />
            {COURSES.length} courses
          </span>
          <span className="inline-flex items-center gap-2 font-semibold">
            <CalendarDays className="size-4 text-brand-green" />
            Next cohort: Jan 12, 2026
          </span>
          <span className="inline-flex items-center gap-2 font-semibold">
            <GraduationCap className="size-4 text-brand-blue" />
            5,000+ alumni
          </span>
        </div>
      </PageHero>

      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Breadcrumb items={[{ label: "Courses" }]} />

          {/* Filters */}
          <div className="space-y-4 rounded-2xl border border-border bg-brand-panel p-5 sm:p-6">
            <div>
              <p className="font-mono-display text-xs uppercase tracking-wider text-muted-foreground mb-2">
                Level
              </p>
              <div className="flex flex-wrap gap-2">
                {LEVELS.map((l) => (
                  <FilterChip key={l} active={level === l} onClick={() => setLevel(l)}>
                    {l}
                  </FilterChip>
                ))}
              </div>
            </div>
            <div>
              <p className="font-mono-display text-xs uppercase tracking-wider text-muted-foreground mb-2">
                Audience
              </p>
              <div className="flex flex-wrap gap-2">
                {AUDIENCES.map((a) => (
                  <FilterChip key={a} active={audience === a} onClick={() => setAudience(a)}>
                    {a}
                  </FilterChip>
                ))}
              </div>
            </div>
          </div>

          {/* Results count */}
          <p className="mt-6 text-sm text-muted-foreground font-medium">
            Showing <span className="text-foreground font-semibold">{filtered.length}</span> of{" "}
            {COURSES.length} courses
          </p>

          {/* Catalog grid */}
          <div className="mt-6 grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((c) => (
              <article
                key={c.id}
                className="group flex flex-col rounded-2xl border border-border bg-background p-6 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
              >
                <div className="flex items-center justify-between">
                  <span
                    className={cn(
                      "inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-mono-display font-semibold uppercase tracking-wider",
                      c.accent === "green"
                        ? "bg-brand-green/10 text-brand-green"
                        : "bg-brand-blue/10 text-brand-blue"
                    )}
                  >
                    {c.featured && <Sparkles className="size-3" />}
                    {c.level}
                  </span>
                  <span className="text-xs font-medium text-muted-foreground">{c.format}</span>
                </div>

                <h3 className="mt-4 font-heading text-xl font-bold tracking-tight">{c.title}</h3>
                <p className="mt-2 text-sm text-foreground/70 font-medium leading-relaxed flex-1">
                  {c.tagline}
                </p>

                <div className="mt-4 grid grid-cols-3 gap-2 text-xs">
                  <Meta icon={<Clock className="size-3.5" />} label={`${c.durationWeeks}w`} />
                  <Meta icon={<Layers className="size-3.5" />} label={`${c.modules} mods`} />
                  <Meta icon={<Users className="size-3.5" />} label={c.audience} />
                </div>

                <div className="mt-5 flex items-center justify-between">
                  <span className="font-heading text-2xl font-extrabold">{c.priceLabel}</span>
                  <button
                    onClick={() => setActive(c)}
                    className="text-sm font-semibold text-brand-blue hover:text-brand-blue/80 cursor-pointer"
                  >
                    View details
                  </button>
                </div>

                <button
                  onClick={() => {
                    setActive(c);
                  }}
                  className={cn(
                    "btn-tactile mt-4 inline-flex items-center justify-center gap-2 px-5 py-3 text-base",
                    c.accent === "green" ? "btn-tactile-green" : "btn-tactile-primary"
                  )}
                >
                  Reserve my seat
                  <ArrowRight className="size-4" />
                </button>
              </article>
            ))}
          </div>

          {filtered.length === 0 && (
            <div className="mt-12 text-center py-16 rounded-2xl border border-dashed border-border">
              <p className="font-heading text-xl font-bold">No courses match those filters.</p>
              <button
                onClick={() => {
                  setLevel("All");
                  setAudience("All");
                }}
                className="mt-4 text-sm font-semibold text-brand-blue hover:text-brand-blue/80 cursor-pointer"
              >
                Reset filters
              </button>
            </div>
          )}

          {/* CTA strip */}
          <div className="mt-16 rounded-3xl border border-border bg-foreground text-white p-8 sm:p-12 text-center">
            <SectionHeader
              align="center"
              eyebrow="Not sure where to start?"
              title={<span className="text-white">Book a free 15-minute path consult.</span>}
              accent="blue"
            />
            <button
              onClick={() => go("schools")}
              className="btn-tactile btn-tactile-light mt-6 inline-flex items-center gap-2 px-6 py-3.5 text-base"
            >
              Talk to Sariro
              <ArrowRight className="size-4" />
            </button>
          </div>
        </div>
      </section>

      {/* Course detail dialog */}
      <Dialog open={!!active} onOpenChange={(o) => !o && setActive(null)}>
        <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto scroll-sariro">
          {active && <CourseDetail course={active} onEnroll={() => {
            toast.success(`Seat reserved for "${active.title}"! We'll email you next steps.`);
            setActive(null);
          }} />}
        </DialogContent>
      </Dialog>
    </>
  );
}

function FilterChip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "rounded-full px-4 py-2 text-sm font-semibold cursor-pointer transition-colors border",
        active
          ? "bg-foreground text-background border-foreground"
          : "bg-background text-foreground/70 border-border hover:border-foreground/40"
      )}
    >
      {children}
    </button>
  );
}

function Meta({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <span className="inline-flex items-center gap-1 text-muted-foreground font-medium">
      {icon}
      {label}
    </span>
  );
}

function CourseDetail({ course, onEnroll }: { course: Course; onEnroll: () => void }) {
  const isGreen = course.accent === "green";
  return (
    <>
      <DialogHeader>
        <div className="flex items-center gap-2">
          <span
            className={cn(
              "inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-mono-display font-semibold uppercase tracking-wider",
              isGreen ? "bg-brand-green/10 text-brand-green" : "bg-brand-blue/10 text-brand-blue"
            )}
          >
            {course.level}
          </span>
          <span className="text-xs font-medium text-muted-foreground">
            {course.format} · {course.audience}
          </span>
        </div>
        <DialogTitle className="font-heading text-2xl sm:text-3xl font-extrabold tracking-tight mt-2">
          {course.title}
        </DialogTitle>
        <DialogDescription className="text-base text-foreground/70 font-medium">
          {course.tagline}
        </DialogDescription>
      </DialogHeader>

      <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-3">
        <DetailStat icon={<Clock className="size-4" />} value={`${course.durationWeeks}w`} label="Duration" />
        <DetailStat icon={<Layers className="size-4" />} value={`${course.modules}`} label="Modules" />
        <DetailStat icon={<CalendarDays className="size-4" />} value={course.nextCohort} label="Next cohort" />
        <DetailStat icon={<Sparkles className="size-4" />} value={course.priceLabel} label="Price" />
      </div>

      <div className="mt-6">
        <h4 className="font-heading text-lg font-bold tracking-tight">What you'll learn</h4>
        <ul className="mt-3 space-y-2">
          {course.outcomes.map((o) => (
            <li key={o} className="flex items-start gap-2.5 text-sm font-medium">
              <span className={cn("mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full", isGreen ? "bg-brand-green/10 text-brand-green" : "bg-brand-blue/10 text-brand-blue")}>
                <Check className="size-3.5" strokeWidth={3} />
              </span>
              {o}
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-6">
        <h4 className="font-heading text-lg font-bold tracking-tight">Syllabus</h4>
        <ol className="mt-3 space-y-2.5">
          {course.syllabus.map((s, i) => (
            <li key={i} className="flex items-start gap-3 text-sm">
              <span className={cn("flex h-6 w-6 shrink-0 items-center justify-center rounded-md font-mono-display text-xs font-bold", isGreen ? "bg-brand-green/10 text-brand-green" : "bg-brand-blue/10 text-brand-blue")}>
                {i + 1}
              </span>
              <span className="font-medium text-foreground/80 pt-0.5">{s}</span>
            </li>
          ))}
        </ol>
      </div>

      <button
        onClick={onEnroll}
        className={cn(
          "btn-tactile mt-7 w-full inline-flex items-center justify-center gap-2 px-5 py-3.5 text-base",
          isGreen ? "btn-tactile-green" : "btn-tactile-primary"
        )}
      >
        Reserve my seat — {course.priceLabel}
        <ArrowRight className="size-5" />
      </button>
      <p className="mt-2 text-center text-xs text-muted-foreground">
        Secure checkout · Instant access on cohort start · 14-day money-back guarantee
      </p>
    </>
  );
}

function DetailStat({
  icon,
  value,
  label,
}: {
  icon: React.ReactNode;
  value: string;
  label: string;
}) {
  return (
    <div className="rounded-xl border border-border bg-brand-panel p-3">
      <span className="text-muted-foreground">{icon}</span>
      <p className="mt-1 font-heading font-bold text-sm leading-tight">{value}</p>
      <p className="text-xs text-muted-foreground">{label}</p>
    </div>
  );
}
