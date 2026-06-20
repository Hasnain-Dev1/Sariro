"use client";

import { TRUSTED_BY } from "@/lib/data";

export function TrustedBy() {
  // duplicate the list a few times so the marquee loops seamlessly
  const items = [...TRUSTED_BY, ...TRUSTED_BY, ...TRUSTED_BY, ...TRUSTED_BY];

  return (
    <section className="py-10 border-y border-border bg-brand-panel" aria-label="Trusted and featured by">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <p className="text-center text-xs font-mono-display uppercase tracking-[0.2em] text-muted-foreground">
          Trusted &amp; featured by
        </p>
        <div className="relative mt-6 marquee-mask overflow-hidden">
          <div className="flex w-max animate-marquee items-center gap-12">
            {items.map((name, i) => (
              <span
                key={`${name}-${i}`}
                className="font-heading text-2xl sm:text-3xl font-extrabold text-foreground/30 whitespace-nowrap select-none"
              >
                {name}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
