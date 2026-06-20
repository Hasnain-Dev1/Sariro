"use client";

import { useState, useMemo } from "react";
import { PageHero } from "../ui-bits/page-hero";
import { Breadcrumb } from "../ui-bits/breadcrumb";
import { SectionHeader } from "../ui-bits/section-header";
import { EVENTS, type SariroEvent } from "@/lib/data";
import {
  CalendarDays,
  Clock,
  MapPin,
  Users,
  ArrowRight,
  CircleDot,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

const TYPE_FILTERS = ["All", "Cohort", "Webinar", "Hackathon", "Workshop"] as const;

const STATUS_META: Record<
  SariroEvent["status"],
  { label: string; color: string }
> = {
  open: { label: "Open", color: "text-brand-green" },
  filling: { label: "Filling fast", color: "text-amber-600" },
  waitlist: { label: "Waitlist", color: "text-muted-foreground" },
};

export function EventsView() {
  const [filter, setFilter] = useState<(typeof TYPE_FILTERS)[number]>("All");
  const list = useMemo(
    () => (filter === "All" ? EVENTS : EVENTS.filter((e) => e.type === filter)),
    [filter]
  );

  return (
    <>
      <PageHero
        eyebrow="Events"
        title={
          <>
            Learn live.{" "}
            <span className="text-brand-blue">Build together.</span>
          </>
        }
        subtitle="Cohorts, free webinars, hackathons, and workshops — all the ways to learn with Sariro in real time."
        accent="blue"
      >
        <div className="flex flex-wrap gap-6 text-sm">
          <span className="inline-flex items-center gap-2 font-semibold">
            <CalendarDays className="size-4 text-brand-blue" />
            {EVENTS.length} upcoming events
          </span>
          <span className="inline-flex items-center gap-2 font-semibold">
            <CircleDot className="size-4 text-brand-green" />
            Next: Jan 05, 2026
          </span>
        </div>
      </PageHero>

      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Breadcrumb items={[{ label: "Events" }]} />

          <div className="flex flex-wrap gap-2">
            {TYPE_FILTERS.map((t) => (
              <button
                key={t}
                onClick={() => setFilter(t)}
                className={cn(
                  "rounded-full px-4 py-2 text-sm font-semibold cursor-pointer transition-colors border",
                  filter === t
                    ? "bg-foreground text-background border-foreground"
                    : "bg-background text-foreground/70 border-border hover:border-foreground/40"
                )}
              >
                {t}
              </button>
            ))}
          </div>

          <div className="mt-8 grid lg:grid-cols-2 gap-6">
            {list.map((ev) => {
              const st = STATUS_META[ev.status];
              const isGreen = ev.accent === "green";
              return (
                <article
                  key={ev.id}
                  className="group flex flex-col rounded-2xl border border-border bg-background p-6 sm:p-7 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                >
                  <div className="flex items-center justify-between gap-3">
                    <span
                      className={cn(
                        "inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-mono-display font-semibold uppercase tracking-wider",
                        isGreen ? "bg-brand-green/10 text-brand-green" : "bg-brand-blue/10 text-brand-blue"
                      )}
                    >
                      {ev.type}
                    </span>
                    <span className={cn("inline-flex items-center gap-1.5 text-xs font-semibold", st.color)}>
                      <span className="h-1.5 w-1.5 rounded-full bg-current" />
                      {st.label}
                    </span>
                  </div>

                  <h3 className="mt-4 font-heading text-xl sm:text-2xl font-bold tracking-tight leading-snug">
                    {ev.title}
                  </h3>
                  <p className="mt-2 text-sm text-foreground/70 font-medium leading-relaxed">
                    {ev.description}
                  </p>

                  <div className="mt-5 grid grid-cols-2 gap-3 text-xs">
                    <Meta icon={<CalendarDays className="size-3.5" />} text={ev.date} />
                    <Meta icon={<Clock className="size-3.5" />} text={ev.time} />
                    <Meta icon={<MapPin className="size-3.5" />} text={`${ev.format} · ${ev.location}`} />
                    <Meta icon={<Users className="size-3.5" />} text={`${ev.capacity} · ${ev.price}`} />
                  </div>

                  <div className="mt-6 flex items-center justify-between">
                    <span className="font-heading text-2xl font-extrabold">{ev.price}</span>
                    <button
                      onClick={() =>
                        toast.success(
                          ev.price === "Free"
                            ? `You're registered for "${ev.title}"!`
                            : `Seat reserved for "${ev.title}" — check your email.`
                        )
                      }
                      className={cn(
                        "btn-tactile inline-flex items-center gap-2 px-5 py-3 text-base",
                        isGreen ? "btn-tactile-green" : "btn-tactile-primary"
                      )}
                    >
                      {ev.price === "Free" ? "Register free" : "Reserve seat"}
                      <ArrowRight className="size-4" />
                    </button>
                  </div>
                </article>
              );
            })}
          </div>

          {list.length === 0 && (
            <div className="mt-12 text-center py-16 rounded-2xl border border-dashed border-border">
              <p className="font-heading text-xl font-bold">No events of this type right now.</p>
              <button
                onClick={() => setFilter("All")}
                className="mt-4 text-sm font-semibold text-brand-blue hover:text-brand-blue/80 cursor-pointer"
              >
                Show all events
              </button>
            </div>
          )}
        </div>
      </section>
    </>
  );
}

function Meta({ icon, text }: { icon: React.ReactNode; text: string }) {
  return (
    <span className="inline-flex items-center gap-1.5 text-muted-foreground font-medium leading-tight">
      {icon}
      {text}
    </span>
  );
}
