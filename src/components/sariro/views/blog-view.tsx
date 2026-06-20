"use client";

import { useState, useMemo } from "react";
import { PageHero } from "../ui-bits/page-hero";
import { Breadcrumb } from "../ui-bits/breadcrumb";
import { BLOG_POSTS } from "@/lib/data";
import { ArrowRight, Clock, User } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export function BlogView() {
  const [cat, setCat] = useState<string>("All");
  const categories = useMemo(
    () => ["All", ...Array.from(new Set(BLOG_POSTS.map((p) => p.category)))],
    []
  );
  const posts = cat === "All" ? BLOG_POSTS : BLOG_POSTS.filter((p) => p.category === cat);
  const [featured, ...rest] = posts;

  return (
    <>
      <PageHero
        eyebrow="Blog"
        title={
          <>
            Field notes from{" "}
            <span className="text-brand-blue">the edge of AI.</span>
          </>
        }
        subtitle="Philosophy, practical guides, and learning science — written by Mimo and the Sariro team."
        accent="blue"
      />

      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Breadcrumb items={[{ label: "Blog" }]} />

          {/* Filters */}
          <div className="flex flex-wrap gap-2">
            {categories.map((c) => (
              <button
                key={c}
                onClick={() => setCat(c)}
                className={cn(
                  "rounded-full px-4 py-2 text-sm font-semibold cursor-pointer transition-colors border",
                  cat === c
                    ? "bg-foreground text-background border-foreground"
                    : "bg-background text-foreground/70 border-border hover:border-foreground/40"
                )}
              >
                {c}
              </button>
            ))}
          </div>

          {/* Featured post */}
          {featured && (
            <article className="mt-8 group grid lg:grid-cols-2 gap-8 rounded-3xl border border-border bg-brand-panel p-6 sm:p-8 hover:shadow-xl transition-all duration-300">
              <div className="relative overflow-hidden rounded-2xl bg-foreground min-h-[220px] flex items-center justify-center">
                <div
                  className="absolute inset-0 opacity-20"
                  style={{
                    backgroundImage:
                      "linear-gradient(to right, rgba(255,255,255,0.4) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.4) 1px, transparent 1px)",
                    backgroundSize: "30px 30px",
                  }}
                  aria-hidden
                />
                <span className="relative font-heading text-7xl font-extrabold text-white/15">
                  {featured.category}
                </span>
                <span className={cn(
                  "absolute top-4 left-4 inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-mono-display font-semibold uppercase tracking-wider",
                  featured.accent === "green" ? "bg-brand-green text-white" : "bg-brand-blue text-white"
                )}>
                  Featured
                </span>
              </div>
              <div className="flex flex-col justify-center">
                <span className="text-xs font-mono-display uppercase tracking-wider text-muted-foreground">
                  {featured.category}
                </span>
                <h2 className="mt-2 font-heading text-2xl sm:text-3xl font-extrabold tracking-tight leading-tight">
                  {featured.title}
                </h2>
                <p className="mt-3 text-base text-foreground/70 font-medium leading-relaxed">
                  {featured.excerpt}
                </p>
                <div className="mt-4 flex items-center gap-4 text-xs text-muted-foreground font-medium">
                  <span className="inline-flex items-center gap-1"><User className="size-3.5" />{featured.author}</span>
                  <span className="inline-flex items-center gap-1"><Clock className="size-3.5" />{featured.readTime}</span>
                  <span>{featured.date}</span>
                </div>
                <button
                  onClick={() => toast.info("Full article coming soon — subscribe to the newsletter for updates.")}
                  className={cn(
                    "btn-tactile mt-6 inline-flex w-fit items-center gap-2 px-5 py-3 text-base",
                    featured.accent === "green" ? "btn-tactile-green" : "btn-tactile-primary"
                  )}
                >
                  Read article
                  <ArrowRight className="size-4" />
                </button>
              </div>
            </article>
          )}

          {/* Rest grid */}
          {rest.length > 0 && (
            <div className="mt-8 grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {rest.map((p) => {
                const isGreen = p.accent === "green";
                return (
                  <article
                    key={p.id}
                    className="group flex flex-col rounded-2xl border border-border bg-background p-6 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                  >
                    <span className={cn(
                      "inline-flex w-fit items-center gap-1.5 rounded-full px-3 py-1 text-xs font-mono-display font-semibold uppercase tracking-wider",
                      isGreen ? "bg-brand-green/10 text-brand-green" : "bg-brand-blue/10 text-brand-blue"
                    )}>
                      {p.category}
                    </span>
                    <h3 className="mt-4 font-heading text-lg font-bold tracking-tight leading-snug">{p.title}</h3>
                    <p className="mt-2 text-sm text-foreground/70 font-medium leading-relaxed flex-1">{p.excerpt}</p>
                    <div className="mt-4 flex items-center gap-4 text-xs text-muted-foreground font-medium">
                      <span className="inline-flex items-center gap-1"><Clock className="size-3.5" />{p.readTime}</span>
                      <span>{p.date}</span>
                    </div>
                    <button
                      onClick={() => toast.info("Full article coming soon.")}
                      className="mt-4 inline-flex w-fit items-center gap-1 text-sm font-semibold text-brand-blue hover:text-brand-blue/80 cursor-pointer"
                    >
                      Read
                      <ArrowRight className="size-4" />
                    </button>
                  </article>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
