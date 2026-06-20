"use client";

import { useState } from "react";
import { PageHero } from "../ui-bits/page-hero";
import { Breadcrumb } from "../ui-bits/breadcrumb";
import { SectionHeader } from "../ui-bits/section-header";
import { JOBS, CAREERS_PERKS, type Job } from "@/lib/data";
import {
  Briefcase,
  MapPin,
  Clock,
  Check,
  ArrowRight,
  Send,
  Loader2,
  Sparkles,
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

export function CareersView() {
  const [active, setActive] = useState<Job | null>(null);

  return (
    <>
      <PageHero
        eyebrow="Careers"
        title={
          <>
            Help us{" "}
            <span className="text-brand-green">teach the future.</span>
          </>
        }
        subtitle="Sariro is a small, remote-first team on a big mission. If you believe teaching thinking matters more than teaching syntax, we want to talk."
        accent="green"
      >
        <div className="flex flex-wrap gap-6 text-sm">
          <span className="inline-flex items-center gap-2 font-semibold">
            <Briefcase className="size-4 text-brand-green" />
            {JOBS.length} open roles
          </span>
          <span className="inline-flex items-center gap-2 font-semibold">
            <MapPin className="size-4 text-brand-blue" />
            Remote-first, global
          </span>
        </div>
      </PageHero>

      {/* Perks */}
      <section className="py-14 border-b border-border">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {CAREERS_PERKS.map((perk) => (
              <div key={perk.title} className="rounded-2xl border border-border bg-brand-panel p-5">
                <Sparkles className="size-6 text-brand-green" />
                <h3 className="mt-3 font-heading text-lg font-bold tracking-tight">{perk.title}</h3>
                <p className="mt-1.5 text-sm text-foreground/70 font-medium leading-relaxed">{perk.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Jobs */}
      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Breadcrumb items={[{ label: "Careers" }]} />
          <SectionHeader
            eyebrow="Open roles"
            title="Find your seat."
            subtitle="Click a role for the full description and application form."
            accent="green"
          />

          <div className="mt-10 grid lg:grid-cols-2 gap-6">
            {JOBS.map((job) => {
              const isGreen = job.accent === "green";
              return (
                <article
                  key={job.id}
                  className="group flex flex-col rounded-2xl border border-border bg-background p-6 sm:p-7 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                >
                  <div className="flex items-center justify-between">
                    <span
                      className={cn(
                        "inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-mono-display font-semibold uppercase tracking-wider",
                        isGreen ? "bg-brand-green/10 text-brand-green" : "bg-brand-blue/10 text-brand-blue"
                      )}
                    >
                      {job.team}
                    </span>
                    <span className="text-xs font-medium text-muted-foreground">{job.type}</span>
                  </div>
                  <h3 className="mt-4 font-heading text-xl sm:text-2xl font-bold tracking-tight">{job.title}</h3>
                  <p className="mt-2 text-sm text-foreground/70 font-medium leading-relaxed flex-1">
                    {job.description}
                  </p>
                  <div className="mt-5 flex flex-wrap items-center gap-4 text-xs text-muted-foreground font-medium">
                    <span className="inline-flex items-center gap-1">
                      <MapPin className="size-3.5" />
                      {job.location}
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <Clock className="size-3.5" />
                      {job.type}
                    </span>
                  </div>
                  <button
                    onClick={() => setActive(job)}
                    className={cn(
                      "btn-tactile mt-6 inline-flex items-center justify-center gap-2 px-5 py-3 text-base",
                      isGreen ? "btn-tactile-green" : "btn-tactile-primary"
                    )}
                  >
                    View role & apply
                    <ArrowRight className="size-4" />
                  </button>
                </article>
              );
            })}
          </div>

          {JOBS.length === 0 && (
            <div className="mt-12 text-center py-16 rounded-2xl border border-dashed border-border">
              <p className="font-heading text-xl font-bold">No open roles right now — but we're always meeting good people.</p>
              <a
                href="mailto:mimo@sariro.com"
                className="mt-4 inline-block text-sm font-semibold text-brand-blue hover:text-brand-blue/80 cursor-pointer"
              >
                Email us anyway →
              </a>
            </div>
          )}
        </div>
      </section>

      {/* Application dialog */}
      <Dialog open={!!active} onOpenChange={(o) => !o && setActive(null)}>
        <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto scroll-sariro">
          {active && <JobDetail job={active} onClose={() => setActive(null)} />}
        </DialogContent>
      </Dialog>
    </>
  );
}

function JobDetail({ job, onClose }: { job: Job; onClose: () => void }) {
  const [loading, setLoading] = useState(false);
  const isGreen = job.accent === "green";

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    await new Promise((r) => setTimeout(r, 900));
    setLoading(false);
    toast.success("Application sent! We review every one and'll reply within 5 business days.");
    onClose();
  }

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
            {job.team}
          </span>
          <span className="text-xs font-medium text-muted-foreground">{job.type} · {job.location}</span>
        </div>
        <DialogTitle className="font-heading text-2xl sm:text-3xl font-extrabold tracking-tight mt-2">
          {job.title}
        </DialogTitle>
        <DialogDescription className="text-base text-foreground/70 font-medium">
          {job.description}
        </DialogDescription>
      </DialogHeader>

      <div className="mt-4 grid grid-cols-1 gap-6">
        <div>
          <h4 className="font-heading text-lg font-bold tracking-tight">What you'll do</h4>
          <ul className="mt-3 space-y-2">
            {job.responsibilities.map((r) => (
              <li key={r} className="flex items-start gap-2.5 text-sm font-medium">
                <span className={cn("mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full", isGreen ? "bg-brand-green/10 text-brand-green" : "bg-brand-blue/10 text-brand-blue")}>
                  <Check className="size-3.5" strokeWidth={3} />
                </span>
                {r}
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h4 className="font-heading text-lg font-bold tracking-tight">What we're looking for</h4>
          <ul className="mt-3 space-y-2">
            {job.requirements.map((r) => (
              <li key={r} className="flex items-start gap-2.5 text-sm font-medium">
                <span className={cn("mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full", isGreen ? "bg-brand-green/10 text-brand-green" : "bg-brand-blue/10 text-brand-blue")}>
                  <Check className="size-3.5" strokeWidth={3} />
                </span>
                {r}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="mt-6 space-y-3">
        <h4 className="font-heading text-lg font-bold tracking-tight">Apply</h4>
        <input required placeholder="Your name" className="sariro-job-input" />
        <input required type="email" placeholder="Email" className="sariro-job-input" />
        <input required placeholder="Portfolio or LinkedIn URL" className="sariro-job-input" />
        <textarea required rows={3} placeholder="Why Sariro? (1-2 sentences)" className="sariro-job-input resize-none h-auto py-3" />
        <button
          type="submit"
          disabled={loading}
          className={cn(
            "btn-tactile w-full inline-flex items-center justify-center gap-2 px-5 py-3.5 text-base disabled:opacity-70 disabled:cursor-not-allowed",
            isGreen ? "btn-tactile-green" : "btn-tactile-primary"
          )}
        >
          {loading ? (
            <>
              <Loader2 className="size-5 animate-spin" />
              Sending…
            </>
          ) : (
            <>
              <Send className="size-5" />
              Submit application
            </>
          )}
        </button>
      </form>

      <style>{`
        .sariro-job-input {
          width: 100%; height: 3rem; border-radius: 0.75rem;
          border: 1px solid var(--border); background: var(--background);
          padding: 0 1rem; font-size: 1rem; font-weight: 500; outline: none;
          transition: box-shadow .15s, border-color .15s;
        }
        .sariro-job-input:focus-visible { border-color: var(--brand-blue); box-shadow: 0 0 0 3px rgba(37,99,235,.25); }
      `}</style>
    </>
  );
}
