"use client";

import { useState } from "react";
import { PageHero } from "../ui-bits/page-hero";
import { Breadcrumb } from "../ui-bits/breadcrumb";
import { SectionHeader } from "../ui-bits/section-header";
import {
  SCHOOL_PACKAGES,
  SCHOOL_OUTCOMES,
} from "@/lib/data";
import { useCountUp } from "../use-count-up";
import {
  ArrowRight,
  Check,
  Building2,
  Trophy,
  BookOpen,
  Users,
  Loader2,
  Send,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { useGo } from "@/lib/nav";

const PROCESS_STEPS = [
  {
    icon: BookOpen,
    title: "Discovery call",
    text: "We learn your school's goals, grade levels, and existing tech literacy.",
  },
  {
    icon: Building2,
    title: "Tailored proposal",
    text: "You get a custom package — workshops, curriculum, or full lab setup.",
  },
  {
    icon: Users,
    title: "Delivery & training",
    text: "We run the program and train your teachers to sustain it.",
  },
  {
    icon: Trophy,
    title: "Impact report",
    text: "You receive measurable outcomes — engagement, skills, and next steps.",
  },
];

export function SchoolsView() {
  return (
    <>
      <PageHero
        eyebrow="For Schools"
        title={
          <>
            Bring the future{" "}
            <span className="text-brand-green">into your classrooms.</span>
          </>
        }
        subtitle="Curriculum consultation, hackathons, and immersive workshops — built for K-12 schools that want to lead in AI literacy."
        accent="green"
      >
        <div className="flex flex-wrap gap-6 text-sm">
          <span className="inline-flex items-center gap-2 font-semibold">
            <Building2 className="size-4 text-brand-green" />
            120+ schools engaged
          </span>
          <span className="inline-flex items-center gap-2 font-semibold">
            <Users className="size-4 text-brand-blue" />
            15,000+ students reached
          </span>
          <span className="inline-flex items-center gap-2 font-semibold">
            <Trophy className="size-4 text-brand-green" />
            98% would recommend
          </span>
        </div>
      </PageHero>

      {/* Outcomes band */}
      <section className="py-14 border-b border-border">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {SCHOOL_OUTCOMES.map((s) => (
              <OutcomeStat key={s.label} {...s} />
            ))}
          </div>
        </div>
      </section>

      {/* Packages */}
      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Breadcrumb items={[{ label: "For Schools" }]} />
          <SectionHeader
            eyebrow="Partnership packages"
            title={<>Choose the engagement that fits your school.</>}
            subtitle="From a single immersive day to a year-long AI lab transformation."
            accent="green"
          />

          <div className="mt-10 grid md:grid-cols-2 gap-6">
            {SCHOOL_PACKAGES.map((pkg) => (
              <article
                key={pkg.id}
                className={cn(
                  "relative flex flex-col rounded-2xl border bg-background p-6 sm:p-8 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl",
                  pkg.popular ? "border-brand-green ring-2 ring-brand-green/20" : "border-border"
                )}
              >
                {pkg.popular && (
                  <span className="absolute -top-3 left-6 inline-flex items-center gap-1 rounded-full bg-brand-green px-3 py-1 text-xs font-mono-display font-bold uppercase tracking-wider text-white shadow-md">
                    <Trophy className="size-3" />
                    Most popular
                  </span>
                )}
                <div className="flex items-center justify-between">
                  <h3 className="font-heading text-2xl font-bold tracking-tight">{pkg.name}</h3>
                  <span
                    className={cn(
                      "rounded-full px-3 py-1 text-xs font-mono-display font-semibold uppercase tracking-wider",
                      pkg.accent === "green"
                        ? "bg-brand-green/10 text-brand-green"
                        : "bg-brand-blue/10 text-brand-blue"
                    )}
                  >
                    {pkg.duration}
                  </span>
                </div>
                <p className="mt-2 text-sm text-muted-foreground font-medium">{pkg.audience}</p>
                <p className="mt-4 text-base text-foreground/75 font-medium leading-relaxed">
                  {pkg.description}
                </p>

                <ul className="mt-5 space-y-2.5 flex-1">
                  {pkg.features.map((f) => (
                    <li key={f} className="flex items-start gap-2.5 text-sm font-medium">
                      <span
                        className={cn(
                          "mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full",
                          pkg.accent === "green"
                            ? "bg-brand-green/10 text-brand-green"
                            : "bg-brand-blue/10 text-brand-blue"
                        )}
                      >
                        <Check className="size-3.5" strokeWidth={3} />
                      </span>
                      {f}
                    </li>
                  ))}
                </ul>

                <div className="mt-6 flex items-end justify-between">
                  <span className="font-heading text-2xl font-extrabold">{pkg.priceLabel}</span>
                  <a
                    href="#inquiry"
                    className={cn(
                      "btn-tactile inline-flex items-center gap-2 px-5 py-3 text-base",
                      pkg.accent === "green" ? "btn-tactile-green" : "btn-tactile-primary"
                    )}
                  >
                    Request quote
                    <ArrowRight className="size-4" />
                  </a>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Process */}
      <section className="py-16 sm:py-20 bg-brand-panel border-y border-border">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeader
            align="center"
            eyebrow="How it works"
            title={<>From first call to impact report in 4 steps.</>}
            accent="green"
          />
          <div className="mt-12 grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {PROCESS_STEPS.map((step, i) => {
              const Icon = step.icon;
              return (
                <div
                  key={step.title}
                  className="relative rounded-2xl border border-border bg-background p-6"
                >
                  <span className="font-heading text-5xl font-extrabold text-brand-green/15 absolute top-3 right-4">
                    0{i + 1}
                  </span>
                  <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-green/10 text-brand-green">
                    <Icon className="size-6" />
                  </span>
                  <h3 className="mt-4 font-heading text-lg font-bold tracking-tight">
                    {step.title}
                  </h3>
                  <p className="mt-2 text-sm text-foreground/70 font-medium leading-relaxed">
                    {step.text}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Inquiry form */}
      <SchoolInquiryForm />
    </>
  );
}

function OutcomeStat({
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
    <div ref={ref as React.RefObject<HTMLDivElement>} className="text-center">
      <div className="font-heading font-extrabold tracking-tight text-foreground text-4xl sm:text-5xl tabular-nums">
        {animated.toLocaleString()}
        <span className="text-brand-green">{suffix}</span>
      </div>
      <div className="mt-1 font-mono-display text-xs uppercase tracking-wider text-muted-foreground">
        {label}
      </div>
    </div>
  );
}

function SchoolInquiryForm() {
  const go = useGo();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    school: "",
    role: "",
    message: "",
    package: "workshop",
  });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (loading) return;
    setLoading(true);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          type: "schools",
          message: `[School: ${form.school || "—"} | Role: ${form.role || "—"} | Package: ${form.package}] ${form.message}`,
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) {
        toast.error(data.error || "Something went wrong.");
        return;
      }
      toast.success("Inquiry sent! Our schools team will reach out within 2 business days.");
      setForm({ name: "", email: "", school: "", role: "", message: "", package: "workshop" });
    } catch {
      toast.error("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section id="inquiry" className="py-16 sm:py-20">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <SectionHeader
          align="center"
          eyebrow="Get in touch"
          title={<>Tell us about your school.</>}
          subtitle="Share your goals and we'll craft a proposal within 2 business days."
          accent="green"
        />

        <form
          onSubmit={handleSubmit}
          className="mt-10 rounded-3xl border border-border bg-brand-panel p-6 sm:p-8 space-y-4"
          noValidate
        >
          <div className="grid sm:grid-cols-2 gap-4">
            <Field label="Your name" required>
              <input
                required
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="sariro-input"
                placeholder="e.g. Dr. Lena Foster"
              />
            </Field>
            <Field label="Work email" required>
              <input
                type="email"
                required
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="sariro-input"
                placeholder="you@school.edu"
              />
            </Field>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <Field label="School name">
              <input
                value={form.school}
                onChange={(e) => setForm({ ...form, school: e.target.value })}
                className="sariro-input"
                placeholder="Oakridge Academy"
              />
            </Field>
            <Field label="Your role">
              <input
                value={form.role}
                onChange={(e) => setForm({ ...form, role: e.target.value })}
                className="sariro-input"
                placeholder="Principal / Curriculum Director"
              />
            </Field>
          </div>
          <Field label="Which package interests you?">
            <select
              value={form.package}
              onChange={(e) => setForm({ ...form, package: e.target.value })}
              className="sariro-input cursor-pointer"
            >
              {SCHOOL_PACKAGES.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name} — {p.priceLabel}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Tell us your goals" required>
            <textarea
              required
              rows={4}
              value={form.message}
              onChange={(e) => setForm({ ...form, message: e.target.value })}
              className="sariro-input resize-none"
              placeholder="We want to introduce AI literacy to grades 6-8 over the spring semester..."
            />
          </Field>
          <button
            type="submit"
            disabled={loading}
            className="btn-tactile btn-tactile-green w-full inline-flex items-center justify-center gap-2 px-5 py-3.5 text-base disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <Loader2 className="size-5 animate-spin" />
                Sending…
              </>
            ) : (
              <>
                <Send className="size-5" />
                Send inquiry
              </>
            )}
          </button>
          <p className="text-center text-xs text-muted-foreground">
            We reply within 2 business days · No spam, ever
          </p>
        </form>

        <p className="mt-6 text-center text-sm text-muted-foreground">
          Prefer to explore courses first?{" "}
          <button
            onClick={() => go("courses")}
            className="font-semibold text-brand-blue hover:text-brand-blue/80 cursor-pointer"
          >
            Browse the course catalog
          </button>
        </p>
      </div>

      <style>{`
        .sariro-input {
          width: 100%;
          height: 3rem;
          border-radius: 0.75rem;
          border: 1px solid var(--border);
          background: var(--background);
          padding: 0 1rem;
          font-size: 1rem;
          font-weight: 500;
          outline: none;
          transition: box-shadow .15s, border-color .15s;
        }
        textarea.sariro-input { height: auto; padding: 0.75rem 1rem; }
        .sariro-input:focus-visible {
          border-color: var(--brand-blue);
          box-shadow: 0 0 0 3px rgba(37,99,235,0.25);
        }
      `}</style>
    </section>
  );
}

function Field({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="block text-sm font-semibold mb-1.5">
        {label} {required && <span className="text-brand-green">*</span>}
      </span>
      {children}
    </label>
  );
}
