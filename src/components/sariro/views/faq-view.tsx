"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { PageHero } from "../ui-bits/page-hero";
import { Breadcrumb } from "../ui-bits/breadcrumb";
import { SectionHeader } from "../ui-bits/section-header";
import { FAQ_ITEMS } from "@/lib/data";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { ArrowRight, Search, HelpCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { ROUTES } from "@/lib/nav";
import { toast } from "sonner";

export function FaqView() {
  const [query, setQuery] = useState("");
  const [cat, setCat] = useState<string>("All");

  const categories = useMemo(
    () => ["All", ...Array.from(new Set(FAQ_ITEMS.map((f) => f.category)))],
    []
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return FAQ_ITEMS.filter((f) => {
      const matchCat = cat === "All" || f.category === cat;
      const matchQ =
        q === "" ||
        f.question.toLowerCase().includes(q) ||
        f.answer.toLowerCase().includes(q);
      return matchCat && matchQ;
    });
  }, [query, cat]);

  return (
    <>
      <PageHero
        eyebrow="FAQ"
        title={
          <>
            Questions, <span className="text-brand-blue">answered.</span>
          </>
        }
        subtitle="Everything you might want to know about cohorts, pricing, schools, and access. Can't find your answer? Ask us directly."
        accent="blue"
      />

      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <Breadcrumb items={[{ label: "FAQ" }]} />

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-muted-foreground" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search questions..."
              className="h-14 w-full rounded-2xl border border-border bg-background pl-12 pr-4 text-base font-medium outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/30 transition"
            />
          </div>

          {/* Category chips */}
          <div className="mt-4 flex flex-wrap gap-2">
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

          {/* Accordion */}
          <div className="mt-8">
            {filtered.length > 0 ? (
              <Accordion type="single" collapsible className="space-y-3">
                {filtered.map((item) => (
                  <AccordionItem
                    key={item.id}
                    value={item.id}
                    className="rounded-2xl border border-border bg-background px-5 shadow-sm overflow-hidden data-[state=open]:border-brand-blue/40"
                  >
                    <AccordionTrigger className="text-left font-heading text-base sm:text-lg font-bold tracking-tight hover:no-underline py-5 cursor-pointer">
                      <span className="flex items-start gap-3">
                        <span className="mt-0.5 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-brand-blue/10 text-brand-blue">
                          <HelpCircle className="size-4" />
                        </span>
                        {item.question}
                      </span>
                    </AccordionTrigger>
                    <AccordionContent className="text-base text-foreground/70 font-medium leading-relaxed pb-5 pt-0">
                      <span className="pl-9 block">{item.answer}</span>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            ) : (
              <div className="text-center py-16 rounded-2xl border border-dashed border-border">
                <p className="font-heading text-xl font-bold">No matches found.</p>
                <button
                  onClick={() => {
                    setQuery("");
                    setCat("All");
                  }}
                  className="mt-4 text-sm font-semibold text-brand-blue hover:text-brand-blue/80 cursor-pointer"
                >
                  Reset search
                </button>
              </div>
            )}
          </div>

          {/* Still have questions */}
          <div className="mt-12 rounded-3xl border border-border bg-brand-panel p-8 text-center">
            <SectionHeader
              align="center"
              eyebrow="Still stuck?"
              title="We reply to every email."
              subtitle="Real humans, within 2 business days."
            />
            <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
              <a
                href="mailto:courses@sariro.com"
                onClick={() => toast.info("Opening your email app...")}
                className="btn-tactile btn-tactile-primary inline-flex items-center gap-2 px-5 py-3 text-base"
              >
                courses@sariro.com
                <ArrowRight className="size-4" />
              </a>
              <Link
                href={ROUTES.courses}
                className="btn-tactile btn-tactile-light inline-flex items-center gap-2 px-5 py-3 text-base"
              >
                Browse courses
                <ArrowRight className="size-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
