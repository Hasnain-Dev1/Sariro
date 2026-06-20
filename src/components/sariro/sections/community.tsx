"use client";

import { useState } from "react";
import { Mail, CheckCircle2, Loader2, ArrowRight } from "lucide-react";
import { toast } from "sonner";

export function Community() {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (loading) return;
    setLoading(true);
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, name: name || null, source: "community" }),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) {
        toast.error(data.error || "Something went wrong. Please try again.");
        return;
      }
      toast.success(data.message || "You're in! Welcome to Sariro.");
      setEmail("");
      setName("");
    } catch {
      toast.error("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section
      id="community"
      className="py-16 sm:py-24"
      aria-labelledby="community-heading"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-3xl border border-border bg-foreground text-white p-8 sm:p-12 lg:p-16">
          {/* decorative grid + glow */}
          <div
            className="pointer-events-none absolute inset-0 opacity-[0.08]"
            style={{
              backgroundImage:
                "linear-gradient(to right, rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.5) 1px, transparent 1px)",
              backgroundSize: "40px 40px",
            }}
            aria-hidden
          />
          <div
            className="pointer-events-none absolute -top-24 -right-16 h-[360px] w-[420px] rounded-full blur-3xl opacity-50"
            style={{
              background:
                "radial-gradient(closest-side, rgba(37,99,235,0.6), transparent 70%)",
            }}
            aria-hidden
          />
          <div
            className="pointer-events-none absolute -bottom-24 -left-16 h-[360px] w-[420px] rounded-full blur-3xl opacity-40"
            style={{
              background:
                "radial-gradient(closest-side, rgba(22,163,74,0.55), transparent 70%)",
            }}
            aria-hidden
          />

          <div className="relative grid lg:grid-cols-2 gap-10 items-center">
            <div>
              <p className="font-mono-display text-xs uppercase tracking-[0.2em] text-[#7dd3fc] font-semibold">
                Join the community
              </p>
              <h2
                id="community-heading"
                className="mt-3 font-heading text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-balance"
              >
                Get exclusive insights in your inbox.
              </h2>
              <p className="mt-4 text-lg text-white/70 font-medium leading-relaxed max-w-lg">
                Technology deep-dives, learning strategies, and early access to
                new masterclasses — straight to your inbox. No spam, ever.
              </p>
              <ul className="mt-6 space-y-2.5">
                {[
                  "Weekly AI insights you can actually use",
                  "Early access to cohort seats",
                  "Free resources & templates",
                ].map((b) => (
                  <li
                    key={b}
                    className="flex items-center gap-2.5 text-sm text-white/85 font-medium"
                  >
                    <CheckCircle2 className="size-5 text-brand-green shrink-0" />
                    {b}
                  </li>
                ))}
              </ul>
            </div>

            {/* Form card */}
            <div className="rounded-2xl bg-white p-6 sm:p-8 text-foreground shadow-2xl">
              <form onSubmit={handleSubmit} className="space-y-4" noValidate>
                <div>
                  <label
                    htmlFor="comm-name"
                    className="block text-sm font-semibold mb-1.5"
                  >
                    Your name <span className="text-muted-foreground font-normal">(optional)</span>
                  </label>
                  <input
                    id="comm-name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Alex Rivera"
                    className="h-12 w-full rounded-xl border border-input bg-background px-4 text-base outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/30 transition"
                  />
                </div>
                <div>
                  <label
                    htmlFor="comm-email"
                    className="block text-sm font-semibold mb-1.5"
                  >
                    Email address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 size-5 text-muted-foreground" />
                    <input
                      id="comm-email"
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@example.com"
                      className="h-12 w-full rounded-xl border border-input bg-background pl-11 pr-4 text-base outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/30 transition"
                    />
                  </div>
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="btn-tactile btn-tactile-primary w-full inline-flex items-center justify-center gap-2 px-5 py-3.5 text-base disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <>
                      <Loader2 className="size-5 animate-spin" />
                      Joining…
                    </>
                  ) : (
                    <>
                      Join the community
                      <ArrowRight className="size-5" />
                    </>
                  )}
                </button>
                <p className="text-center text-xs text-muted-foreground">
                  Secure signup · Unsubscribe anytime · 5,000+ members
                </p>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
