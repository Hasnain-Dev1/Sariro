"use client";

import Link from "next/link";
import { PageHero } from "../ui-bits/page-hero";
import { Breadcrumb } from "../ui-bits/breadcrumb";
import { SectionHeader } from "../ui-bits/section-header";
import { PRICING_TIERS, PRICING_COMPARISON } from "@/lib/data";
import { Check, Minus, ArrowRight, ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";
import { ROUTES } from "@/lib/nav";
import { toast } from "sonner";

export function PricingView() {
  return (
    <>
      <PageHero
        eyebrow="Pricing"
        title={
          <>
            Simple pricing.{" "}
            <span className="text-brand-green">Real outcomes.</span>
          </>
        }
        subtitle="Cohort-based learning that pays for itself. 14-day money-back guarantee on every paid cohort."
        accent="green"
      >
        <div className="flex flex-wrap gap-6 text-sm">
          <span className="inline-flex items-center gap-2 font-semibold">
            <ShieldCheck className="size-4 text-brand-green" />
            14-day money-back guarantee
          </span>
          <span className="inline-flex items-center gap-2 font-semibold">
            <Check className="size-4 text-brand-blue" />
            10% scholarships in every cohort
          </span>
        </div>
      </PageHero>

      {/* Tiers */}
      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Breadcrumb items={[{ label: "Pricing" }]} />

          <div className="grid lg:grid-cols-3 gap-6">
            {PRICING_TIERS.map((tier) => {
              const isGreen = tier.accent === "green";
              return (
                <article
                  key={tier.id}
                  className={cn(
                    "relative flex flex-col rounded-2xl border bg-background p-6 sm:p-8 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl",
                    tier.popular ? "border-brand-green ring-2 ring-brand-green/20" : "border-border"
                  )}
                >
                  {tier.popular && (
                    <span className="absolute -top-3 left-1/2 -translate-x-1/2 inline-flex items-center gap-1 rounded-full bg-brand-green px-3 py-1 text-xs font-mono-display font-bold uppercase tracking-wider text-white shadow-md whitespace-nowrap">
                      Most popular
                    </span>
                  )}
                  <span
                    className={cn(
                      "inline-flex w-fit items-center rounded-full px-3 py-1 text-xs font-mono-display font-semibold uppercase tracking-wider",
                      isGreen ? "bg-brand-green/10 text-brand-green" : "bg-brand-blue/10 text-brand-blue"
                    )}
                  >
                    {tier.audience}
                  </span>
                  <h3 className="mt-4 font-heading text-2xl font-bold tracking-tight">{tier.name}</h3>
                  <p className="mt-1 text-sm text-foreground/70 font-medium">{tier.tagline}</p>

                  <div className="mt-5 flex items-end gap-1.5">
                    <span className="font-heading text-4xl sm:text-5xl font-extrabold tracking-tight">{tier.price}</span>
                    <span className="mb-1.5 text-sm text-muted-foreground font-medium">{tier.period}</span>
                  </div>

                  <ul className="mt-6 space-y-2.5 flex-1">
                    {tier.features.map((f) => (
                      <li key={f} className="flex items-start gap-2.5 text-sm font-medium">
                        <span
                          className={cn(
                            "mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full",
                            isGreen ? "bg-brand-green/10 text-brand-green" : "bg-brand-blue/10 text-brand-blue"
                          )}
                        >
                          <Check className="size-3.5" strokeWidth={3} />
                        </span>
                        {f}
                      </li>
                    ))}
                  </ul>

                  <button
                    onClick={() =>
                      tier.id === "school-pro"
                        ? toast.info("Email schools@sariro.com for a custom quote.")
                        : toast.success(`You're joining the ${tier.name} tier! Check your email.`)
                    }
                    className={cn(
                      "btn-tactile mt-7 w-full inline-flex items-center justify-center gap-2 px-5 py-3.5 text-base",
                      isGreen ? "btn-tactile-green" : "btn-tactile-primary"
                    )}
                  >
                    {tier.cta}
                    <ArrowRight className="size-5" />
                  </button>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      {/* Comparison table */}
      <section className="py-16 sm:py-20 bg-brand-panel border-y border-border">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeader
            align="center"
            eyebrow="Compare"
            title="Every feature, side by side."
            accent="green"
          />
          <div className="mt-10 overflow-x-auto scroll-sariro">
            <table className="w-full min-w-[640px] border-collapse">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-4 px-4 font-heading font-bold text-sm">Feature</th>
                  <th className="text-center py-4 px-4 font-heading font-bold text-sm">Starter</th>
                  <th className="text-center py-4 px-4 font-heading font-bold text-sm bg-brand-green/5 rounded-t-xl">Builder</th>
                  <th className="text-center py-4 px-4 font-heading font-bold text-sm">School Pro</th>
                </tr>
              </thead>
              <tbody>
                {PRICING_COMPARISON.map((row, i) => (
                  <tr key={row.feature} className={cn("border-b border-border/60", i % 2 === 1 && "bg-background/40")}>
                    <td className="py-3.5 px-4 text-sm font-medium">{row.feature}</td>
                    <td className="text-center py-3.5 px-4"><Cell value={row.starter} /></td>
                    <td className="text-center py-3.5 px-4 bg-brand-green/5"><Cell value={row.builder} highlight /></td>
                    <td className="text-center py-3.5 px-4"><Cell value={row.school} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-10 text-center">
            <p className="text-foreground/70 font-medium">Still unsure which tier fits?</p>
            <Link
              href={ROUTES.faq}
              className="btn-tactile btn-tactile-light mt-4 inline-flex items-center gap-2 px-5 py-3 text-base"
            >
              Read the FAQ
              <ArrowRight className="size-4" />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}

function Cell({ value, highlight }: { value: boolean | string; highlight?: boolean }) {
  if (value === true) {
    return (
      <Check
        className={cn(
          "mx-auto size-5",
          highlight ? "text-brand-green" : "text-brand-blue"
        )}
        strokeWidth={3}
      />
    );
  }
  if (value === false) {
    return <Minus className="mx-auto size-5 text-muted-foreground/40" />;
  }
  return <span className="text-sm font-semibold">{value}</span>;
}
