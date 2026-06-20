"use client";

import { cn } from "@/lib/utils";

export function SectionHeader({
  eyebrow,
  title,
  subtitle,
  align = "left",
  accent = "blue",
  className,
}: {
  eyebrow?: string;
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  align?: "left" | "center";
  accent?: "blue" | "green";
  className?: string;
}) {
  return (
    <div
      className={cn(
        "max-w-2xl",
        align === "center" && "mx-auto text-center",
        className
      )}
    >
      {eyebrow && (
        <p
          className={cn(
            "font-mono-display text-xs uppercase tracking-[0.2em] font-semibold",
            accent === "green" ? "text-brand-green" : "text-brand-blue"
          )}
        >
          {eyebrow}
        </p>
      )}
      <h2 className="mt-3 font-heading text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-foreground text-balance">
        {title}
      </h2>
      {subtitle && (
        <p className="mt-4 text-lg text-foreground/70 font-medium leading-relaxed">
          {subtitle}
        </p>
      )}
    </div>
  );
}
