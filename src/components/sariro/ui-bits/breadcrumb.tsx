"use client";

import Link from "next/link";
import { ChevronRight, Home } from "lucide-react";
import { ROUTES, type RouteId } from "@/lib/nav";

export function Breadcrumb({
  items,
}: {
  items: { label: string; view?: RouteId }[];
}) {
  return (
    <nav aria-label="Breadcrumb" className="mb-8">
      <ol className="flex flex-wrap items-center gap-1.5 text-sm">
        <li>
          <Link
            href={ROUTES.home}
            className="inline-flex items-center gap-1 text-muted-foreground hover:text-foreground transition-colors cursor-pointer font-medium"
          >
            <Home className="size-3.5" />
            Home
          </Link>
        </li>
        {items.map((it, i) => (
          <li key={i} className="flex items-center gap-1.5">
            <ChevronRight className="size-3.5 text-muted-foreground/50" />
            {it.view ? (
              <Link
                href={ROUTES[it.view]}
                className="text-muted-foreground hover:text-foreground transition-colors cursor-pointer font-medium"
              >
                {it.label}
              </Link>
            ) : (
              <span className="text-foreground font-semibold">{it.label}</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
