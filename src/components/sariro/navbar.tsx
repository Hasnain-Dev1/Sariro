"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, ArrowRight, ChevronDown, LifeBuoy } from "lucide-react";
import { NAV_LINKS } from "@/lib/data";
import { useActiveRoute, type RouteId } from "@/lib/nav";
import { cn } from "@/lib/utils";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet";
import { ROUTES } from "@/lib/nav";
import { SUPPORT_NAV } from "@/lib/support";
import { UserMenu } from "./user-menu";

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [supportOpen, setSupportOpen] = useState(false);
  const active = useActiveRoute();
  const pathname = usePathname();
  const supportRef = useRef<HTMLLIElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close support dropdown on outside click (route-change close is handled
  // by each Link's onClick — no effect needed, avoiding setState-in-effect).
  useEffect(() => {
    if (!supportOpen) return;
    const onClick = (e: MouseEvent) => {
      if (supportRef.current && !supportRef.current.contains(e.target as Node)) {
        setSupportOpen(false);
      }
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, [supportOpen]);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full transition-all duration-300",
        scrolled
          ? "bg-background/85 backdrop-blur-xl border-b border-border shadow-[0_4px_30px_-12px_rgba(15,23,42,0.12)]"
          : "bg-transparent border-b border-transparent"
      )}
    >
      <nav
        className="mx-auto flex h-16 sm:h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8"
        aria-label="Primary"
      >
        {/* Wordmark */}
        <Link
          href={ROUTES.home}
          className="group flex items-center gap-2 cursor-pointer"
          aria-label="Sariro home"
        >
          <span className="relative flex h-9 w-9 items-center justify-center rounded-xl bg-foreground text-background font-heading font-extrabold text-lg shadow-sm">
            S
            <span className="absolute -right-0.5 -top-0.5 h-2.5 w-2.5 rounded-full bg-brand-green ring-2 ring-background" />
          </span>
          <span className="font-heading text-xl font-extrabold tracking-tight text-foreground">
            Sariro<span className="text-brand-blue">.</span>
          </span>
        </Link>

        {/* Desktop links */}
        <ul className="hidden md:flex items-center gap-1">
          {NAV_LINKS.map((link) => (
            <li key={link.view}>
              <Link
                href={ROUTES[link.view]}
                className={cn(
                  "relative px-4 py-2 rounded-lg text-[15px] font-medium transition-colors cursor-pointer",
                  active === link.view
                    ? "text-foreground bg-muted"
                    : "text-foreground/70 hover:text-foreground hover:bg-muted"
                )}
              >
                {link.label}
              </Link>
            </li>
          ))}

          {/* Support dropdown */}
          <li ref={supportRef} className="relative">
            <button
              onClick={() => setSupportOpen((v) => !v)}
              aria-expanded={supportOpen}
              aria-haspopup="true"
              className={cn(
                "relative px-4 py-2 rounded-lg text-[15px] font-medium transition-colors cursor-pointer inline-flex items-center gap-1",
                pathname.startsWith("/support")
                  ? "text-foreground bg-muted"
                  : "text-foreground/70 hover:text-foreground hover:bg-muted"
              )}
            >
              <LifeBuoy className="size-4" />
              Support
              <ChevronDown
                className={cn(
                  "size-3.5 transition-transform",
                  supportOpen && "rotate-180"
                )}
              />
            </button>

            {supportOpen && (
              <div
                role="menu"
                className="absolute right-0 top-full mt-2 w-64 rounded-2xl border border-border bg-background shadow-2xl p-2 animate-in fade-in slide-in-from-top-2 duration-200 z-50"
              >
                <p className="px-3 py-2 font-mono-display text-xs uppercase tracking-wider text-muted-foreground">
                  Support &amp; legal
                </p>
                {SUPPORT_NAV.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setSupportOpen(false)}
                    className="flex items-center justify-between gap-2 rounded-xl px-3 py-2.5 text-sm font-medium text-foreground/80 hover:bg-muted hover:text-foreground transition-colors cursor-pointer"
                  >
                    {item.label}
                    <ArrowRight className="size-3.5 text-muted-foreground" />
                  </Link>
                ))}
              </div>
            )}
          </li>
        </ul>

        {/* Desktop CTA — shows Login button (logged out) OR UserMenu (logged in) */}
        <UserMenu />

        {/* Mobile trigger */}
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <button
              className="md:hidden inline-flex items-center justify-center size-11 rounded-lg hover:bg-muted cursor-pointer"
              aria-label="Open menu"
            >
              <Menu className="size-6" />
            </button>
          </SheetTrigger>
          <SheetContent side="right" className="w-[300px] sm:w-[360px] p-0">
            <SheetHeader className="px-6 pt-6 pb-2">
              <div className="flex items-center justify-between">
                <SheetTitle className="font-heading text-xl font-extrabold">
                  Sariro<span className="text-brand-blue">.</span>
                </SheetTitle>
                <SheetClose asChild>
                  <button
                    className="inline-flex items-center justify-center size-9 rounded-lg hover:bg-muted cursor-pointer"
                    aria-label="Close menu"
                  >
                    <X className="size-5" />
                  </button>
                </SheetClose>
              </div>
            </SheetHeader>
            <div className="px-6 py-4 flex flex-col gap-1">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.view}
                  href={ROUTES[link.view]}
                  onClick={() => setOpen(false)}
                  className={cn(
                    "px-4 py-3 rounded-xl text-base font-medium transition-colors cursor-pointer",
                    active === link.view
                      ? "bg-muted text-foreground"
                      : "text-foreground/80 hover:bg-muted hover:text-foreground"
                  )}
                >
                  {link.label}
                </Link>
              ))}

              {/* Support section in mobile menu */}
              <div className="pt-3 mt-2 border-t border-border">
                <p className="px-4 pb-1 font-mono-display text-xs uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                  <LifeBuoy className="size-3.5" />
                  Support
                </p>
                {SUPPORT_NAV.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className="px-4 py-2.5 pl-8 rounded-xl text-sm font-medium text-foreground/70 hover:bg-muted hover:text-foreground transition-colors cursor-pointer"
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            </div>
            <div className="mt-auto px-6 pb-8 pt-4 border-t border-border">
              <Link
                href="/login"
                onClick={() => setOpen(false)}
                className="block w-full text-center text-sm font-semibold text-foreground/70 hover:text-foreground transition-colors cursor-pointer mb-3"
              >
                Login / Sign up
              </Link>
              <Link
                href={ROUTES.courses}
                onClick={() => setOpen(false)}
                className="btn-tactile btn-tactile-primary w-full inline-flex items-center justify-center gap-2 px-5 py-3.5 text-base"
              >
                Enter Course Portal
                <ArrowRight className="size-5" />
              </Link>
              <p className="mt-3 text-center text-xs text-muted-foreground">
                Secure access · Instant video unlock
              </p>
            </div>
          </SheetContent>
        </Sheet>
      </nav>
    </header>
  );
}

// keep RouteId referenced for type-compat with older callers (no-op)
export type { RouteId };
