"use client";

import Link from "next/link";
import { Mail, Youtube, Github, Linkedin, Twitter, ArrowUpRight } from "lucide-react";
import { FOOTER_LINKS, FOOTER_CONTACTS } from "@/lib/data";
import { ROUTES, type RouteId } from "@/lib/nav";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="mt-auto bg-foreground text-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-14 sm:py-16">
        <div className="grid gap-10 lg:grid-cols-12">
          {/* Brand blurb */}
          <div className="lg:col-span-5">
            <Link
              href={ROUTES.home}
              className="flex items-center gap-2 cursor-pointer"
              aria-label="Sariro home"
            >
              <span className="relative flex h-9 w-9 items-center justify-center rounded-xl bg-white text-foreground font-heading font-extrabold text-lg">
                S
                <span className="absolute -right-0.5 -top-0.5 h-2.5 w-2.5 rounded-full bg-brand-green ring-2 ring-foreground" />
              </span>
              <span className="font-heading text-xl font-extrabold tracking-tight">
                Sariro<span className="text-[#7dd3fc]">.</span>
              </span>
            </Link>
            <p className="mt-4 max-w-sm text-white/65 font-medium leading-relaxed">
              Teaching the future. Empowering students and professionals with
              essential AI literacy and technology skills.
            </p>
            <div className="mt-6 flex items-center gap-3">
              {[
                { Icon: Youtube, label: "YouTube", route: "youtube" as RouteId },
                { Icon: Twitter, label: "Twitter", route: "home" as RouteId },
                { Icon: Linkedin, label: "LinkedIn", route: "about" as RouteId },
                { Icon: Github, label: "GitHub", route: "resources" as RouteId },
              ].map(({ Icon, label, route }) => (
                <Link
                  key={label}
                  href={ROUTES[route]}
                  aria-label={label}
                  className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/5 hover:bg-white/15 transition-colors cursor-pointer"
                >
                  <Icon className="size-5" />
                </Link>
              ))}
            </div>
          </div>

          {/* Quick links */}
          <div className="lg:col-span-3">
            <h3 className="font-heading text-sm font-bold uppercase tracking-wider text-white/50">
              Quick links
            </h3>
            <ul className="mt-4 space-y-2.5">
              {FOOTER_LINKS.map((l) => (
                <li key={l.view}>
                  <Link
                    href={ROUTES[l.view]}
                    className="inline-flex items-center gap-1 text-white/75 hover:text-white font-medium transition-colors cursor-pointer"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contacts */}
          <div className="lg:col-span-4">
            <h3 className="font-heading text-sm font-bold uppercase tracking-wider text-white/50">
              Contact
            </h3>
            <ul className="mt-4 space-y-4">
              {FOOTER_CONTACTS.map((c) => (
                <li key={c.value}>
                  <p className="text-xs text-white/45 font-mono-display uppercase tracking-wider">
                    {c.label}
                  </p>
                  <a
                    href={`mailto:${c.value}`}
                    className="mt-0.5 inline-flex items-center gap-1.5 text-white/85 hover:text-white font-semibold transition-colors cursor-pointer"
                  >
                    <Mail className="size-4 text-[#7dd3fc]" />
                    {c.value}
                  </a>
                </li>
              ))}
            </ul>
            <Link
              href={ROUTES.schools}
              className="btn-tactile btn-tactile-primary mt-6 inline-flex items-center gap-2 px-5 py-3 text-base"
            >
              Work with Sariro
              <ArrowUpRight className="size-4" />
            </Link>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-white/50 font-medium">
            © {year} Sariro. Teaching the future.
          </p>
          <div className="flex items-center gap-5 text-sm text-white/50">
            <Link href={ROUTES.home} className="hover:text-white transition-colors cursor-pointer">
              Privacy
            </Link>
            <Link href={ROUTES.home} className="hover:text-white transition-colors cursor-pointer">
              Terms
            </Link>
            <Link href={ROUTES.schools} className="hover:text-white transition-colors cursor-pointer">
              Contact
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
