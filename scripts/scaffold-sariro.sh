#!/usr/bin/env bash
# ============================================================================
#  sariro — Sariro site scaffolder
#  ----------------------------------------------------------------------------
#  Generates a new real Next.js App Router page (e.g. /podcast) with a data file,
#  a view component, the route page, navbar + footer link, and metadata.
#
#  USAGE:
#    bash scripts/scaffold-sariro.sh <route-id> "<Display Name>" [accent]
#
#  EXAMPLES:
#    bash scripts/scaffold-sariro.sh podcast "Podcast" blue
#    bash scripts/scaffold-sariro.sh community "Community" green
#
#  WHAT IT CREATES:
#    - src/app/<id>/page.tsx                  (real route page + metadata)
#    - src/components/sariro/views/<id>-view.tsx  (the page UI)
#    - src/lib/data-<id>.ts                    (starter data file)
#  AND REGISTERS:
#    - <id> in src/lib/nav.ts                   (RouteId union + ROUTES map)
#    - a navbar link in src/lib/data.ts         (NAV_LINKS)
# ============================================================================

set -euo pipefail

B="\033[1;34m"; G="\033[1;32m"; Y="\033[1;33m"; R="\033[1;31m"; N="\033[0m"

if [[ $# -lt 2 ]]; then
  echo -e "${R}Usage:${N} bash scripts/scaffold-sariro.sh <route-id> \"<Display Name>\" [accent: blue|green]"
  echo -e "  ${Y}Example:${N} bash scripts/scaffold-sariro.sh podcast \"Podcast\" blue"
  exit 1
fi

ID="$1"
NAME="$2"
ACCENT="${3:-blue}"
ROOT="$(cd "$(dirname "$0")/.." && pwd)"

if ! [[ "$ID" =~ ^[a-z][a-z0-9-]*$ ]]; then
  echo -e "${R}Error:${N} route-id must be lowercase letters/numbers/hyphens (e.g. 'podcast', 'community-2026')."
  exit 1
fi
if [[ "$ACCENT" != "blue" && "$ACCENT" != "green" ]]; then
  echo -e "${R}Error:${N} accent must be 'blue' or 'green'."
  exit 1
fi

COMPONENT_ID="$(echo "$ID" | sed 's/-\(.\)/\U\1/g; s/^./\U&/')"   # podcast -> Podcast
DATA_CONST="$(echo "$ID" | tr 'a-z-' 'A-Z_')_ITEMS"               # podcast -> PODCAST_ITEMS
NAME_LOWER="$(echo "$NAME" | tr '[:upper:]' '[:lower:]')"
if [[ "$ACCENT" == "green" ]]; then BTN_CLASS="green"; else BTN_CLASS="primary"; fi

ROUTE_DIR="$ROOT/src/app/${ID}"
PAGE_FILE="$ROUTE_DIR/page.tsx"
VIEW_FILE="$ROOT/src/components/sariro/views/${ID}-view.tsx"
DATA_FILE="$ROOT/src/lib/data-${ID}.ts"

if [[ -f "$PAGE_FILE" ]]; then
  echo -e "${R}Error:${N} route page already exists: $PAGE_FILE"
  exit 1
fi

echo -e "${B}▸ Scaffolding Sariro route:${N} /${ID} (${NAME}) [accent: ${ACCENT}]"
echo

# ---------- 1. route page ----------
mkdir -p "$ROUTE_DIR"
cat > "$PAGE_FILE" <<'TEMPLATE'
import type { Metadata } from "next";
import { __COMPONENT__View } from "@/components/sariro/views/__ID__-view";

export const metadata: Metadata = {
  title: "__NAME__ — Sariro",
  description: "__NAME__ on Sariro — AI & technology education by Mimo Patra.",
};

export default function Page() {
  return <__COMPONENT__View />;
}
TEMPLATE
sed -i \
  -e "s|__ID__|${ID}|g" \
  -e "s|__NAME__|${NAME}|g" \
  -e "s|__COMPONENT__|${COMPONENT_ID}|g" \
  "$PAGE_FILE"
echo -e "  ${G}✓${N} created $PAGE_FILE"

# ---------- 2. view component ----------
mkdir -p "$(dirname "$VIEW_FILE")"
cat > "$VIEW_FILE" <<'TEMPLATE'
"use client";

import { useState, useMemo } from "react";
import { PageHero } from "../ui-bits/page-hero";
import { Breadcrumb } from "../ui-bits/breadcrumb";
import { SectionHeader } from "../ui-bits/section-header";
import { __DATA_CONST__ } from "@/lib/data-__ID__";
import { ArrowRight, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * __NAME__ page — scaffolded by scripts/scaffold-sariro.sh
 * Edit freely. Data lives in src/lib/data-__ID__.ts.
 */
export function __COMPONENT__View() {
  const [filter, setFilter] = useState<string>("All");
  const categories = useMemo(
    () => ["All", ...Array.from(new Set(__DATA_CONST__.map((i) => i.tag)))],
    []
  );
  const items = filter === "All" ? __DATA_CONST__ : __DATA_CONST__.filter((i) => i.tag === filter);

  return (
    <>
      <PageHero
        eyebrow="__NAME__"
        title={<>__NAME__, <span className="text-brand-__ACCENT__">made simple.</span></>}
        subtitle="This page was scaffolded. Replace this copy with your real content in src/components/sariro/views/__ID__-view.tsx."
        accent="__ACCENT__"
      />

      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Breadcrumb items={[{ label: "__NAME__" }]} />

          <div className="flex flex-wrap items-end justify-between gap-6">
            <SectionHeader
              eyebrow="All __NAME_LOWER__"
              title="Browse everything"
              subtitle="Filter by category to find what you need."
              accent="__ACCENT__"
            />
            <div className="flex flex-wrap gap-2">
              {categories.map((c) => (
                <button
                  key={c}
                  onClick={() => setFilter(c)}
                  className={cn(
                    "rounded-full px-4 py-2 text-sm font-semibold cursor-pointer transition-colors border",
                    filter === c
                      ? "bg-foreground text-background border-foreground"
                      : "bg-background text-foreground/70 border-border hover:border-foreground/40"
                  )}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-10 grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {items.map((item) => (
              <article
                key={item.id}
                className="group flex flex-col rounded-2xl border border-border bg-background p-6 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
              >
                <span className="inline-flex w-fit items-center gap-1.5 rounded-full px-3 py-1 text-xs font-mono-display font-semibold uppercase tracking-wider bg-brand-__ACCENT__/10 text-brand-__ACCENT__">
                  <Sparkles className="size-3" />
                  {item.tag}
                </span>
                <h3 className="mt-4 font-heading text-xl font-bold tracking-tight">{item.title}</h3>
                <p className="mt-2 text-sm text-foreground/70 font-medium leading-relaxed flex-1">
                  {item.description}
                </p>
                <button className="btn-tactile btn-tactile-__BTN__ mt-5 inline-flex items-center justify-center gap-2 px-4 py-2.5 text-sm">
                  View
                  <ArrowRight className="size-4" />
                </button>
              </article>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
TEMPLATE
sed -i \
  -e "s|__ID__|${ID}|g" \
  -e "s|__NAME__|${NAME}|g" \
  -e "s|__NAME_LOWER__|${NAME_LOWER}|g" \
  -e "s|__COMPONENT__|${COMPONENT_ID}|g" \
  -e "s|__DATA_CONST__|${DATA_CONST}|g" \
  -e "s|__ACCENT__|${ACCENT}|g" \
  -e "s|__BTN__|${BTN_CLASS}|g" \
  "$VIEW_FILE"
echo -e "  ${G}✓${N} created $VIEW_FILE"

# ---------- 3. data file ----------
cat > "$DATA_FILE" <<'TEMPLATE'
// Starter data for the __NAME__ page. Edit freely.
export interface __COMPONENT__Item {
  id: string;
  title: string;
  description: string;
  tag: string;
}

export const __DATA_CONST__: __COMPONENT__Item[] = [
  {
    id: "sample-1",
    title: "Sample __NAME__ item #1",
    description: "Replace this with real content. Each item shows up as a card on the __NAME__ page.",
    tag: "Category A",
  },
  {
    id: "sample-2",
    title: "Sample __NAME__ item #2",
    description: "Add more items to this array in src/lib/data-__ID__.ts and they appear automatically.",
    tag: "Category B",
  },
  {
    id: "sample-3",
    title: "Sample __NAME__ item #3",
    description: "The filter chips at the top are generated from the unique 'tag' values.",
    tag: "Category A",
  },
];
TEMPLATE
sed -i \
  -e "s|__ID__|${ID}|g" \
  -e "s|__NAME__|${NAME}|g" \
  -e "s|__COMPONENT__|${COMPONENT_ID}|g" \
  -e "s|__DATA_CONST__|${DATA_CONST}|g" \
  "$DATA_FILE"
echo -e "  ${G}✓${N} created $DATA_FILE"

# ---------- 4. register route id in nav.ts ----------
NAV_FILE="$ROOT/src/lib/nav.ts"
if grep -q "\"${ID}\"" "$NAV_FILE"; then
  echo -e "  ${Y}~${N} nav.ts already knows about '${ID}' (skipped)"
else
  python3 - "$NAV_FILE" "$ID" <<'PY'
import sys
path, rid = sys.argv[1], sys.argv[2]
s = open(path).read()
# add to RouteId union (before the closing ";")
s = s.replace('  | "blog";', f'  | "blog"\n  | "{rid}";', 1)
# add to ROUTES map (before the closing "};")
s = s.replace('  blog: "/blog",', f'  blog: "/blog",\n  {rid}: "/{rid}",', 1)
open(path, "w").write(s)
PY
  echo -e "  ${G}✓${N} registered '/${ID}' in nav.ts (RouteId + ROUTES)"
fi

# ---------- 5. add navbar link in data.ts ----------
DATA_TS="$ROOT/src/lib/data.ts"
if grep -q "view: \"${ID}\"" "$DATA_TS"; then
  echo -e "  ${Y}~${N} NAV_LINKS already has '${ID}' (skipped)"
else
  python3 - "$DATA_TS" "$ID" "$NAME" <<'PY'
import sys
path, rid, name = sys.argv[1], sys.argv[2], sys.argv[3]
s = open(path).read()
link_line = f'  {{ label: "{name}", view: "{rid}" }},\n'
marker = "];\n\nexport const TRUSTED_BY"
s = s.replace(marker, link_line + marker, 1)
open(path, "w").write(s)
PY
  echo -e "  ${G}✓${N} added navbar link '${NAME}' in data.ts"
fi

echo
echo -e "${G}✅ Done!${N} The '${NAME}' page is live at ${B}/${ID}${N}"
echo
echo -e "${B}Next steps:${N}"
echo -e "  1. Edit real content in  ${Y}src/lib/data-${ID}.ts${N}"
echo -e "  2. Customize the layout in  ${Y}src/components/sariro/views/${ID}-view.tsx${N}"
echo -e "  3. Run  ${Y}bun run lint${N}  to verify, then preview."
echo -e "  4. Visit  ${Y}/${ID}${N}  in the preview."
