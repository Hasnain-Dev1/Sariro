"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  ShieldCheck,
  Lock,
  Mail,
  Loader2,
  AlertCircle,
  User,
} from "lucide-react";
import {
  signInWithGoogle,
  signInWithEmail,
  signUpWithEmail,
  onAuthChange,
  isSupabaseConfigured,
  type SariroUser,
} from "@/lib/auth-client";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

type Tab = "google" | "email";
type Mode = "login" | "signup";

export default function LoginPage() {
  const router = useRouter();
  const [tab, setTab] = useState<Tab>("google");
  const [mode, setMode] = useState<Mode>("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const configured = isSupabaseConfigured();

  // If already logged in, redirect to dashboard
  useEffect(() => {
    const unsub = onAuthChange((u: SariroUser | null) => {
      if (u) {
        router.push("/dashboard");
      } else {
        setCheckingAuth(false);
      }
    });
    return unsub;
  }, [router]);

  async function handleGoogle() {
    setError(null);
    setLoading(true);
    try {
      await signInWithGoogle();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Google sign-in failed. Try again."
      );
      setLoading(false);
    }
  }

  async function handleEmail(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    setLoading(true);
    try {
      if (mode === "signup") {
        const { needsEmailConfirm } = await signUpWithEmail(email, password);
        if (needsEmailConfirm) {
          toast.success("Account created! Check your email to verify, then log in.");
          setMode("login");
          setPassword("");
        } else {
          toast.success("Welcome to Sariro! 🎉");
          router.push("/dashboard");
        }
      } else {
        await signInWithEmail(email, password);
        toast.success("Welcome back! 👋");
        router.push("/dashboard");
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Authentication failed.";
      // Supabase returns generic errors — make them friendlier
      if (msg.includes("Invalid login")) {
        setError("Wrong email or password. Try again.");
      } else if (msg.includes("already registered") || msg.includes("already been registered")) {
        setError("This email is already registered. Try logging in instead.");
      } else if (msg.includes("Email not confirmed")) {
        setError("Please check your email and click the verification link first.");
      } else {
        setError(msg);
      }
    } finally {
      setLoading(false);
    }
  }

  // Show loading while checking existing auth
  if (checkingAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="size-8 text-brand-blue animate-spin" />
      </div>
    );
  }

  return (
    <section className="relative min-h-screen flex items-center justify-center px-4 py-16 overflow-hidden">
      {/* Background */}
      <div className="pointer-events-none absolute inset-0 bg-grid-slate opacity-50" aria-hidden />
      <div
        className="pointer-events-none absolute -top-32 left-1/2 -translate-x-1/2 h-[420px] w-[760px] rounded-full blur-3xl"
        style={{
          background:
            "radial-gradient(closest-side, rgba(37,99,235,0.18), transparent 70%)",
        }}
        aria-hidden
      />

      <div className="relative w-full max-w-md">
        {/* Logo + heading */}
        <div className="text-center mb-8">
          <Link
            href="/"
            className="inline-flex items-center gap-2 cursor-pointer"
            aria-label="Sariro home"
          >
            <span className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-foreground text-background font-heading font-extrabold text-xl shadow-sm">
              S
              <span className="absolute -right-0.5 -top-0.5 h-2.5 w-2.5 rounded-full bg-brand-green ring-2 ring-background" />
            </span>
            <span className="font-heading text-2xl font-extrabold tracking-tight">
              Sariro<span className="text-brand-blue">.</span>
            </span>
          </Link>
          <h1 className="mt-6 font-heading text-3xl sm:text-4xl font-extrabold tracking-tight text-balance">
            {mode === "login" ? "Welcome back" : "Create your account"}
          </h1>
          <p className="mt-2 text-foreground/60 font-medium">
            {mode === "login"
              ? "Sign in to access your courses, dashboard, and community."
              : "Join Sariro and start learning AI the right way."}
          </p>
        </div>

        {/* Card */}
        <div className="rounded-3xl border border-border bg-background shadow-xl p-6 sm:p-8">
          {!configured ? (
            <div className="rounded-2xl border border-amber-200 bg-amber-50 p-5 text-center">
              <AlertCircle className="mx-auto size-8 text-amber-600" />
              <p className="mt-3 font-heading font-bold text-amber-900">
                Supabase not configured
              </p>
              <p className="mt-1.5 text-sm text-amber-800 font-medium leading-relaxed">
                Add your Supabase keys to <code className="bg-amber-100 px-1.5 py-0.5 rounded text-xs">.env</code> to enable login.
              </p>
            </div>
          ) : (
            <>
              {/* Tabs: Google | Email */}
              <div className="flex gap-1 p-1 rounded-xl bg-muted mb-6">
                <button
                  onClick={() => setTab("google")}
                  className={cn(
                    "flex-1 py-2.5 rounded-lg text-sm font-semibold transition-colors cursor-pointer",
                    tab === "google"
                      ? "bg-background shadow-sm text-foreground"
                      : "text-foreground/60 hover:text-foreground"
                  )}
                >
                  Google
                </button>
                <button
                  onClick={() => setTab("email")}
                  className={cn(
                    "flex-1 py-2.5 rounded-lg text-sm font-semibold transition-colors cursor-pointer",
                    tab === "email"
                      ? "bg-background shadow-sm text-foreground"
                      : "text-foreground/60 hover:text-foreground"
                  )}
                >
                  Email
                </button>
              </div>

              {/* GOOGLE TAB */}
              {tab === "google" && (
                <>
                  <button
                    onClick={handleGoogle}
                    disabled={loading}
                    className="btn-tactile btn-tactile-light w-full inline-flex items-center justify-center gap-3 px-5 py-3.5 text-base disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    {loading ? (
                      <Loader2 className="size-5 animate-spin text-brand-blue" />
                    ) : (
                      <GoogleIcon />
                    )}
                    {loading ? "Connecting…" : "Continue with Google"}
                  </button>

                  {error && <ErrorBanner message={error} />}

                  <Divider />

                  <PrivacyCommitments />
                </>
              )}

              {/* EMAIL TAB */}
              {tab === "email" && (
                <form onSubmit={handleEmail} className="space-y-4">
                  <Field
                    label="Email"
                    icon={<Mail className="size-4" />}
                    type="email"
                    value={email}
                    onChange={setEmail}
                    placeholder="you@example.com"
                    required
                  />
                  <Field
                    label="Password"
                    icon={<Lock className="size-4" />}
                    type="password"
                    value={password}
                    onChange={setPassword}
                    placeholder={mode === "signup" ? "Choose a password (min 6 chars)" : "Your password"}
                    required
                  />

                  {error && <ErrorBanner message={error} />}

                  <button
                    type="submit"
                    disabled={loading}
                    className="btn-tactile btn-tactile-primary w-full inline-flex items-center justify-center gap-2 px-5 py-3.5 text-base disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    {loading ? (
                      <Loader2 className="size-5 animate-spin" />
                    ) : mode === "login" ? (
                      <Lock className="size-5" />
                    ) : (
                      <User className="size-5" />
                    )}
                    {loading
                      ? "Please wait…"
                      : mode === "login"
                      ? "Sign in"
                      : "Create account"}
                  </button>

                  {/* Toggle login / signup */}
                  <p className="text-center text-sm text-foreground/60 font-medium">
                    {mode === "login" ? (
                      <>
                        New to Sariro?{" "}
                        <button
                          type="button"
                          onClick={() => {
                            setMode("signup");
                            setError(null);
                          }}
                          className="text-brand-blue font-semibold hover:underline cursor-pointer"
                        >
                          Create an account
                        </button>
                      </>
                    ) : (
                      <>
                        Already have an account?{" "}
                        <button
                          type="button"
                          onClick={() => {
                            setMode("login");
                            setError(null);
                          }}
                          className="text-brand-blue font-semibold hover:underline cursor-pointer"
                        >
                          Sign in
                        </button>
                      </>
                    )}
                  </p>
                </form>
              )}
            </>
          )}
        </div>

        {/* Footer */}
        <p className="mt-6 text-center text-xs text-muted-foreground">
          By continuing, you agree to our{" "}
          <Link href="/support/code-of-conduct" className="hover:text-foreground underline">
            Code of Conduct
          </Link>{" "}
          and{" "}
          <Link href="/support/privacy-policy" className="hover:text-foreground underline">
            Privacy Policy
          </Link>
          .
        </p>
      </div>
    </section>
  );
}

// ── Sub-components ───────────────────────────────────────────────────────────

function Divider() {
  return (
    <div className="my-6 flex items-center gap-3">
      <div className="flex-1 h-px bg-border" />
      <span className="text-xs font-mono-display uppercase tracking-wider text-muted-foreground">
        Privacy first
      </span>
      <div className="flex-1 h-px bg-border" />
    </div>
  );
}

function PrivacyCommitments() {
  return (
    <ul className="space-y-2.5">
      <PrivacyItem icon={<Lock className="size-4" />}>
        We only request <strong>email</strong> and <strong>name</strong> from Google — nothing else.
      </PrivacyItem>
      <PrivacyItem icon={<ShieldCheck className="size-4" />}>
        Sessions are stored in <strong>httpOnly cookies</strong> — protected from XSS.
      </PrivacyItem>
      <PrivacyItem icon={<Mail className="size-4" />}>
        We <strong>never sell</strong> your data. Read our{" "}
        <Link href="/support/privacy-policy" className="text-brand-blue font-semibold hover:underline">
          Privacy Policy
        </Link>
        .
      </PrivacyItem>
    </ul>
  );
}

function PrivacyItem({ icon, children }: { icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <li className="flex items-start gap-2.5 text-sm text-foreground/75 font-medium">
      <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-brand-green/10 text-brand-green">
        {icon}
      </span>
      <span>{children}</span>
    </li>
  );
}

function ErrorBanner({ message }: { message: string }) {
  return (
    <div className="mt-4 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700 font-medium flex items-start gap-2">
      <AlertCircle className="size-4 shrink-0 mt-0.5" />
      {message}
    </div>
  );
}

function Field({
  label,
  icon,
  type,
  value,
  onChange,
  placeholder,
  required,
}: {
  label: string;
  icon: React.ReactNode;
  type: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  required?: boolean;
}) {
  return (
    <label className="block">
      <span className="block text-sm font-semibold mb-1.5">{label}</span>
      <div className="relative">
        <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground">
          {icon}
        </span>
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          required={required}
          className="h-12 w-full rounded-xl border border-input bg-background pl-11 pr-4 text-base font-medium outline-none focus-visible:border-brand-blue focus-visible:ring-[3px] focus-visible:ring-brand-blue/20 transition"
        />
      </div>
    </label>
  );
}

// Official Google "G" logo (multi-color SVG)
function GoogleIcon() {
  return (
    <svg className="size-5" viewBox="0 0 24 24" aria-hidden>
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
    </svg>
  );
}
