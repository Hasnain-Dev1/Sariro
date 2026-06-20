"use client";

import { useRouter, usePathname } from "next/navigation";
import { useCallback, useMemo } from "react";

/**
 * Sariro navigation — real URL routes.
 * Each "page" is a real Next.js App Router route (e.g. /courses).
 * `useGo()` returns a push-based navigator keyed by route id,
 * so components can call `go("courses")` and land on /courses.
 */

export type RouteId =
  | "home"
  | "courses"
  | "schools"
  | "resources"
  | "youtube"
  | "about"
  | "events"
  | "pricing"
  | "faq"
  | "careers"
  | "blog"

export const ROUTES: Record<RouteId, string> = {
  home: "/",
  courses: "/courses",
  schools: "/schools",
  resources: "/resources",
  youtube: "/youtube",
  about: "/about",
  events: "/events",
  pricing: "/pricing",
  faq: "/faq",
  careers: "/careers",
  blog: "/blog",
};

export const ALL_ROUTES: RouteId[] = Object.keys(ROUTES) as RouteId[];

/** Convert a pathname like "/courses" to its route id, defaulting to "home". */
export function pathToRoute(pathname: string): RouteId {
  const clean = pathname.replace(/\/$/, "") || "/";
  const entry = (Object.entries(ROUTES) as [RouteId, string][]).find(
    ([, p]) => p === clean
  );
  return entry ? entry[0] : "home";
}

/** Push-based navigation by route id. */
export function useGo() {
  const router = useRouter();
  return useCallback(
    (route: RouteId) => {
      router.push(ROUTES[route] ?? "/");
    },
    [router]
  );
}

/** Returns the currently active route id (derived from the real pathname). */
export function useActiveRoute(): RouteId {
  const pathname = usePathname() ?? "/";
  return useMemo(() => pathToRoute(pathname), [pathname]);
}
