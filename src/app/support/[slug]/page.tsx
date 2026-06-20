import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import {
  ShieldCheck,
  AlertCircle,
  ScrollText,
  RotateCcw,
  Mail,
  ChevronRight,
  Home,
  ArrowRight,
} from "lucide-react";
import { SUPPORT_PAGES, getSupportPage, getRelatedPages } from "@/lib/support";
import { PageHero } from "@/components/sariro/ui-bits/page-hero";

// ── Icon resolver ────────────────────────────────────────────────────────────
const ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  ShieldCheck,
  AlertCircle,
  ScrollText,
  RotateCcw,
  Mail,
};

// ── Static params (pre-generate all 5 pages) ────────────────────────────────
export function generateStaticParams() {
  return SUPPORT_PAGES.map((p) => ({ slug: p.slug }));
}

// ── Per-page metadata ───────────────────────────────────────────────────────
export function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  return params.then((p) => {
    const page = getSupportPage(p.slug);
    return {
      title: page ? `${page.title} — Sariro` : "Sariro",
      description: page?.excerpt ?? "Sariro support",
    };
  });
}

export default async function SupportPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const page = getSupportPage(slug);
  if (!page) notFound();

  const related = getRelatedPages(slug);
  const Icon = ICONS[page.icon] ?? ShieldCheck;

  return (
    <>
      <PageHero
        eyebrow="Support"
        title={page.title}
        subtitle={page.excerpt}
        accent="blue"
      />

      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb */}
          <nav aria-label="Breadcrumb" className="mb-8">
            <ol className="flex flex-wrap items-center gap-1.5 text-sm">
              <li>
                <Link
                  href="/"
                  className="inline-flex items-center gap-1 text-muted-foreground hover:text-foreground transition-colors cursor-pointer font-medium"
                >
                  <Home className="size-3.5" />
                  Home
                </Link>
              </li>
              <li className="flex items-center gap-1.5">
                <ChevronRight className="size-3.5 text-muted-foreground/50" />
                <span className="text-muted-foreground font-medium">Support</span>
              </li>
              <li className="flex items-center gap-1.5">
                <ChevronRight className="size-3.5 text-muted-foreground/50" />
                <span className="text-foreground font-semibold">{page.title}</span>
              </li>
            </ol>
          </nav>

          <div className="grid lg:grid-cols-12 gap-10">
            {/* Main content */}
            <article className="lg:col-span-8">
              {/* Header card */}
              <div className="flex items-start gap-4 rounded-2xl border border-border bg-brand-panel p-6 mb-6">
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-brand-blue/10 text-brand-blue">
                  <Icon className="size-6" />
                </span>
                <div>
                  <h1 className="font-heading text-3xl sm:text-4xl font-extrabold tracking-tight">
                    {page.title}
                  </h1>
                  <p className="mt-1 text-sm text-muted-foreground font-medium">
                    Last updated: {page.lastUpdated}
                  </p>
                </div>
              </div>

              {/* Content body — preserves line breaks */}
              <div className="rounded-2xl border border-border bg-background p-6 sm:p-8">
                <div className="prose-sariro text-foreground/80 font-medium leading-relaxed whitespace-pre-wrap text-base">
                  {page.content}
                </div>
              </div>

              {/* Bottom CTA */}
              <div className="mt-8 rounded-2xl border border-border bg-foreground text-white p-6 sm:p-8 text-center">
                <h2 className="font-heading text-xl sm:text-2xl font-bold tracking-tight">
                  Still have questions?
                </h2>
                <p className="mt-2 text-white/70 font-medium">
                  Our team replies to every email within 2 business days.
                </p>
                <a
                  href="mailto:courses@sariro.com"
                  className="btn-tactile btn-tactile-light mt-5 inline-flex items-center gap-2 px-5 py-3 text-base"
                >
                  <Mail className="size-4" />
                  Email courses@sariro.com
                  <ArrowRight className="size-4" />
                </a>
              </div>
            </article>

            {/* Sidebar — related support pages */}
            <aside className="lg:col-span-4">
              <div className="sticky top-28">
                <h2 className="font-heading text-sm font-bold uppercase tracking-wider text-muted-foreground mb-4">
                  Support pages
                </h2>
                <nav className="space-y-2">
                  {SUPPORT_PAGES.map((p) => {
                    const SideIcon = ICONS[p.icon] ?? ShieldCheck;
                    const active = p.slug === slug;
                    return (
                      <Link
                        key={p.slug}
                        href={`/support/${p.slug}`}
                        className={
                          "flex items-center gap-3 rounded-xl border p-3.5 transition-all cursor-pointer " +
                          (active
                            ? "border-brand-blue bg-brand-blue/5"
                            : "border-border bg-background hover:border-foreground/20 hover:bg-muted/50")
                        }
                      >
                        <span
                          className={
                            "flex h-9 w-9 shrink-0 items-center justify-center rounded-lg " +
                            (active
                              ? "bg-brand-blue text-white"
                              : "bg-brand-blue/10 text-brand-blue")
                          }
                        >
                          <SideIcon className="size-5" />
                        </span>
                        <div className="min-w-0">
                          <p className="font-heading font-bold text-sm leading-tight">
                            {p.title}
                          </p>
                          <p className="text-xs text-muted-foreground font-medium mt-0.5 line-clamp-1">
                            {p.excerpt}
                          </p>
                        </div>
                      </Link>
                    );
                  })}
                </nav>

                {/* Quick contact card */}
                <div className="mt-6 rounded-2xl border border-border bg-brand-panel p-5">
                  <p className="font-mono-display text-xs uppercase tracking-wider text-muted-foreground">
                    Need a human?
                  </p>
                  <p className="mt-2 font-heading font-bold text-sm">
                    Talk to the Sariro team
                  </p>
                  <div className="mt-3 space-y-1.5 text-xs">
                    <a
                      href="mailto:mimo@sariro.com"
                      className="block text-brand-blue hover:underline font-semibold"
                    >
                      mimo@sariro.com
                    </a>
                    <a
                      href="mailto:courses@sariro.com"
                      className="block text-brand-blue hover:underline font-semibold"
                    >
                      courses@sariro.com
                    </a>
                    <a
                      href="mailto:schools@sariro.com"
                      className="block text-brand-blue hover:underline font-semibold"
                    >
                      schools@sariro.com
                    </a>
                  </div>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </section>
    </>
  );
}
