"use client";

import { useSyncExternalStore, useState } from "react";
import { Cookie, X, Check, ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";

// ============================================================================
//  Sariro — Cookie Consent Banner
//  ----------------------------------------------------------------------------
//  Shows for visitors who haven't chosen yet. Choice persists across ALL
//  navigation via localStorage (instant client read) + a cookie (server read).
//  Once accepted/rejected, the banner never reappears (until storage cleared).
//
//  Principle (Sir Mimo): "data passed between navigation and displayed"
//  → The consent state is the data. It flows: user click → storage → every
//    future page load reads storage → banner stays hidden. No re-asking.
// ============================================================================

const STORAGE_KEY = "sariro-cookie-consent";
const COOKIE_NAME = "sariro_cc";
const COOKIE_DAYS = 365;

type Consent = "accepted" | "rejected" | null;

function setCookie(name: string, value: string, days: number) {
  if (typeof document === "undefined") return;
  const expires = new Date(Date.now() + days * 864e5).toUTCString();
  document.cookie = `${name}=${value}; expires=${expires}; path=/; SameSite=Lax; Secure`;
}

// ── useSyncExternalStore: React's blessed way to read localStorage ──────────
// Returns null during SSR, real value on client. Re-renders when storage
// changes (including cross-tab). Avoids the setState-in-effect lint rule.
const subscribe = (cb: () => void) => {
  if (typeof window === "undefined") return () => {};
  window.addEventListener("storage", cb);
  return () => window.removeEventListener("storage", cb);
};
const getSnapshot = (): Consent => {
  try {
    const v = window.localStorage.getItem(STORAGE_KEY);
    return v === "accepted" || v === "rejected" ? v : null;
  } catch {
    return null;
  }
};
const getServerSnapshot = (): Consent => null;

// Track hydration without setState-in-effect: useSyncExternalStore with a
// no-op server snapshot gives us a mounted-ish signal naturally. We just need
// to gate the first client render to avoid a hydration mismatch flash.
function useHydrated() {
  return useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  );
}

export function CookieConsent() {
  const consent = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const hydrated = useHydrated();
  const [hiding, setHiding] = useState(false);

  function choose(choice: Exclude<Consent, null>) {
    // store in BOTH places — localStorage for instant client reads,
    // cookie for server-side reads (future auth/middleware)
    try {
      window.localStorage.setItem(STORAGE_KEY, choice);
      // manually fire a storage event so this tab re-renders
      // (storage event only fires cross-tab by default)
      window.dispatchEvent(new StorageEvent("storage", { key: STORAGE_KEY, newValue: choice }));
    } catch {
      /* ignore */
    }
    setCookie(COOKIE_NAME, choice, COOKIE_DAYS);

    // animate out, then the useSyncExternalStore re-render hides the banner
    setHiding(true);
    window.setTimeout(() => setHiding(false), 320);
  }

  // Don't render during SSR or if user already chose
  if (!hydrated || consent !== null) return null;

  return (
    <div
      role="dialog"
      aria-live="polite"
      aria-label="Cookie consent"
      className={cn(
        "fixed z-[55] inset-x-0 bottom-0 sm:inset-x-auto sm:bottom-5 sm:right-5 mx-auto sm:mx-0 w-full sm:w-[440px] max-w-[460px] px-3 sm:px-0 pb-3 sm:pb-0",
        "animate-in fade-in slide-in-from-bottom-4 duration-300",
        hiding && "animate-out fade-out slide-out-to-bottom-4 duration-300"
      )}
    >
      <div className="relative rounded-2xl border border-border bg-background shadow-2xl overflow-hidden">
        {/* top accent bar */}
        <div className="h-1 bg-gradient-to-r from-brand-blue to-brand-green" aria-hidden />

        {/* close (x) — dismisses + stores "rejected" so it never reappears */}
        <button
          onClick={() => choose("rejected")}
          aria-label="Dismiss cookie banner"
          className="absolute top-3 right-3 flex h-8 w-8 items-center justify-center rounded-full text-muted-foreground hover:bg-muted hover:text-foreground cursor-pointer transition-colors"
        >
          <X className="size-4" />
        </button>

        <div className="p-5">
          {/* header */}
          <div className="flex items-center gap-3">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-brand-blue/10 text-brand-blue">
              <Cookie className="size-6" />
            </span>
            <div>
              <h2 className="font-heading text-lg font-bold tracking-tight leading-tight">
                We use cookies
              </h2>
              <p className="text-xs text-muted-foreground font-medium">
                Your privacy matters at Sariro.
              </p>
            </div>
          </div>

          {/* body */}
          <p className="mt-4 text-sm text-foreground/75 font-medium leading-relaxed">
            We use essential cookies to run the site, plus optional analytics to
            understand what's working. By clicking <strong>Accept all</strong>,
            you consent to our use of cookies. You can change your choice
            anytime in your browser settings.
          </p>

          {/* actions */}
          <div className="mt-5 flex flex-col-reverse sm:flex-row gap-2.5">
            <button
              onClick={() => choose("rejected")}
              className="btn-tactile btn-tactile-light flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 text-sm"
            >
              <X className="size-4" />
              Reject
            </button>
            <button
              onClick={() => choose("accepted")}
              className="btn-tactile btn-tactile-primary flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 text-sm"
            >
              <Check className="size-4" strokeWidth={3} />
              Accept all
            </button>
          </div>

          {/* microcopy */}
          <p className="mt-3 flex items-center justify-center gap-1.5 text-xs text-muted-foreground font-medium">
            <ShieldCheck className="size-3.5 text-brand-green" />
            Essential cookies always active · No tracking until you accept
          </p>
        </div>
      </div>
    </div>
  );
}
