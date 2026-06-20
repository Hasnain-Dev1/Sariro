"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  LogOut,
  LayoutDashboard,
  Settings,
  Shield,
  ChevronDown,
} from "lucide-react";
import { onAuthChange, signOut, type SariroUser } from "@/lib/auth-client";
import { ROUTES } from "@/lib/nav";
import { cn } from "@/lib/utils";

type AuthState = "loading" | "logged-out" | "logged-in";

export function UserMenu() {
  const router = useRouter();
  const [user, setUser] = useState<SariroUser | null>(null);
  const [authState, setAuthState] = useState<AuthState>("loading");
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const unsub = onAuthChange((u) => {
      setUser(u);
      setAuthState(u ? "logged-in" : "logged-out");
    });
    return unsub;
  }, []);

  // Close on outside click
  useEffect(() => {
    if (!open) return;
    const onClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest("[data-user-menu]")) setOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, [open]);

  async function handleSignOut() {
    await signOut();
    setUser(null);
    setOpen(false);
    router.push("/");
    router.refresh();
  }

  // While loading, render a subtle placeholder (avoids layout shift)
  if (authState === "loading") {
    return (
      <div className="hidden md:flex h-9 w-9 rounded-full bg-muted animate-pulse" />
    );
  }

  if (authState === "logged-out" || !user) {
    // Not logged in → show Login button
    return (
      <div className="hidden md:flex items-center gap-3">
        <Link
          href="/login"
          className="text-[15px] font-medium text-foreground/70 hover:text-foreground transition-colors cursor-pointer"
        >
          Login
        </Link>
        <Link
          href={ROUTES.courses}
          className="btn-tactile btn-tactile-primary inline-flex items-center gap-2 px-5 py-2.5 text-[15px]"
        >
          Enter Course Portal
        </Link>
      </div>
    );
  }

  // Logged in → show "Hi, {name}" + dropdown
  return (
    <div className="hidden md:flex items-center gap-3" data-user-menu>
      <div className="relative">
        <button
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-haspopup="true"
          className="inline-flex items-center gap-2 rounded-full border border-border bg-background pl-1.5 pr-3 py-1.5 hover:bg-muted transition-colors cursor-pointer"
        >
          <span
            className={cn(
              "flex h-7 w-7 items-center justify-center rounded-full font-heading font-bold text-sm",
              user.isAdmin
                ? "bg-brand-green text-white"
                : "bg-brand-blue text-white"
            )}
          >
            {user.avatarInitial}
          </span>
          <span className="text-sm font-semibold text-foreground max-w-[120px] truncate">
            Hi, {user.displayName}
          </span>
          {user.isAdmin && (
            <span className="inline-flex items-center gap-0.5 rounded-full bg-brand-green/10 px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-brand-green">
              <Shield className="size-2.5" />
              Admin
            </span>
          )}
          <ChevronDown
            className={cn(
              "size-3.5 text-muted-foreground transition-transform",
              open && "rotate-180"
            )}
          />
        </button>

        {open && (
          <div
            role="menu"
            className="absolute right-0 top-full mt-2 w-60 rounded-2xl border border-border bg-background shadow-2xl p-2 animate-in fade-in slide-in-from-top-2 duration-200 z-50"
          >
            {/* Header */}
            <div className="px-3 py-2.5 border-b border-border mb-1">
              <p className="text-sm font-semibold truncate">{user.displayName}</p>
              <p className="text-xs text-muted-foreground truncate">
                {user.email}
              </p>
            </div>

            {/* Dashboard */}
            <Link
              href="/dashboard"
              onClick={() => setOpen(false)}
              className="flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-medium text-foreground/80 hover:bg-muted hover:text-foreground transition-colors cursor-pointer"
            >
              <LayoutDashboard className="size-4 text-muted-foreground" />
              My Dashboard
            </Link>

            {/* Admin panel (only if isAdmin) */}
            {user.isAdmin && (
              <Link
                href="/admin"
                onClick={() => setOpen(false)}
                className="flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-semibold text-brand-green hover:bg-brand-green/5 transition-colors cursor-pointer"
              >
                <Shield className="size-4" />
                Admin Panel
              </Link>
            )}

            {/* Settings */}
            <Link
              href="/settings"
              onClick={() => setOpen(false)}
              className="flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-medium text-foreground/80 hover:bg-muted hover:text-foreground transition-colors cursor-pointer"
            >
              <Settings className="size-4 text-muted-foreground" />
              Settings
            </Link>

            <div className="my-1 h-px bg-border" />

            {/* Sign out */}
            <button
              onClick={handleSignOut}
              className="w-full flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
            >
              <LogOut className="size-4" />
              Sign out
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
