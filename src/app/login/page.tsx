"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ShieldCheck, Lock, Mail, Loader2, AlertCircle, User,
} from "lucide-react";
import {
  signInWithGoogle, signInWithGitHub, signInWithFacebook,
  signInWithEmail, signUpWithEmail,
  onAuthChange, isSupabaseConfigured, type SariroUser,
} from "@/lib/auth-client";
import { toast } from "sonner";

export default function LoginPage() {
  const router = useRouter();
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const configured = isSupabaseConfigured();

  useEffect(() => {
    const unsub = onAuthChange((u: SariroUser | null) => {
      if (u) router.push("/dashboard");
      else setCheckingAuth(false);
    });
    return unsub;
  }, [router]);

  async function handleOAuth(provider: "google" | "facebook" | "github", fn: () => Promise<void>) {
    setError(null);
    setLoading(provider);
    try {
      await fn();
    } catch (err) {
      setError(err instanceof Error ? err.message : `${provider} sign-in failed.`);
      setLoading(null);
    }
  }

  async function handleEmail(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (password.length < 6) { setError("Password must be at least 6 characters."); return; }
    setLoading("email");
    try {
      if (mode === "signup") {
        const { needsEmailConfirm } = await signUpWithEmail(email, password);
        if (needsEmailConfirm) {
          toast.success("Account created! Check your email to verify, then log in.");
          setMode("login"); setPassword("");
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
      if (msg.includes("Invalid login")) setError("Wrong email or password. Try again.");
      else if (msg.includes("already registered") || msg.includes("already been registered"))
        setError("This email is already registered. Try logging in.");
      else if (msg.includes("Email not confirmed"))
        setError("Please check your email and click the verification link first.");
      else setError(msg);
    } finally { setLoading(null); }
  }

  if (checkingAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="size-8 text-brand-blue animate-spin" />
      </div>
    );
  }

  return (
    <section className="relative min-h-screen flex items-center justify-center px-4 py-16 overflow-hidden">
      <div className="pointer-events-none absolute inset-0 bg-grid-slate opacity-50" aria-hidden />
      <div
        className="pointer-events-none absolute -top-32 left-1/2 -translate-x-1/2 h-[420px] w-[760px] rounded-full blur-3xl"
        style={{ background: "radial-gradient(closest-side, rgba(37,99,235,0.18), transparent 70%)" }}
        aria-hidden
      />

      <div className="relative w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 cursor-pointer" aria-label="Sariro home">
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

        <div className="rounded-3xl border border-border bg-background shadow-xl p-6 sm:p-8">
          {!configured ? (
            <div className="rounded-2xl border border-amber-200 bg-amber-50 p-5 text-center">
              <AlertCircle className="mx-auto size-8 text-amber-600" />
              <p className="mt-3 font-heading font-bold text-amber-900">Supabase not configured</p>
              <p className="mt-1.5 text-sm text-amber-800 font-medium">
                Add your Supabase keys to <code className="bg-amber-100 px-1.5 py-0.5 rounded text-xs">.env</code> to enable login.
              </p>
            </div>
          ) : (
            <>
              {/* OAuth buttons */}
              <div className="space-y-2.5">
                <OAuthButton label="Continue with Google" loading={loading === "google"} onClick={() => handleOAuth("google", signInWithGoogle)} icon={<GoogleIcon />} />
                <OAuthButton label="Continue with GitHub" loading={loading === "github"} onClick={() => handleOAuth("github", signInWithGitHub)} icon={<GitHubIcon />} variant="dark" />
                <OAuthButton label="Continue with Facebook" loading={loading === "facebook"} onClick={() => handleOAuth("facebook", signInWithFacebook)} icon={<FacebookIcon />} variant="facebook" />
              </div>

              <div className="my-5 flex items-center gap-3">
                <div className="flex-1 h-px bg-border" />
                <span className="text-xs font-mono-display uppercase tracking-wider text-muted-foreground">or</span>
                <div className="flex-1 h-px bg-border" />
              </div>

              <form onSubmit={handleEmail} className="space-y-3">
                <Field label="Email" icon={<Mail className="size-4" />} type="email" value={email} onChange={setEmail} placeholder="you@example.com" required />
                <Field label="Password" icon={<Lock className="size-4" />} type="password" value={password} onChange={setPassword} placeholder={mode === "signup" ? "Choose a password (min 6 chars)" : "Your password"} required />
                {error && <ErrorBanner message={error} />}
                <button type="submit" disabled={loading === "email"} className="btn-tactile btn-tactile-primary w-full inline-flex items-center justify-center gap-2 px-5 py-3.5 text-base disabled:opacity-70 disabled:cursor-not-allowed">
                  {loading === "email" ? <Loader2 className="size-5 animate-spin" /> : mode === "login" ? <Lock className="size-5" /> : <User className="size-5" />}
                  {loading === "email" ? "Please wait…" : mode === "login" ? "Sign in" : "Create account"}
                </button>
              </form>

              <p className="mt-4 text-center text-sm text-foreground/60 font-medium">
                {mode === "login" ? (
                  <>New to Sariro? <button type="button" onClick={() => { setMode("signup"); setError(null); }} className="text-brand-blue font-semibold hover:underline cursor-pointer">Create an account</button></>
                ) : (
                  <>Already have an account? <button type="button" onClick={() => { setMode("login"); setError(null); }} className="text-brand-blue font-semibold hover:underline cursor-pointer">Sign in</button></>
                )}
              </p>
            </>
          )}
        </div>

        <div className="mt-6 flex items-center justify-center gap-2 text-xs text-muted-foreground font-medium">
          <ShieldCheck className="size-3.5 text-brand-green" />
          We only request email + name · httpOnly sessions · never sell data
        </div>
        <p className="mt-3 text-center text-xs text-muted-foreground">
          By continuing, you agree to our{" "}
          <Link href="/support/code-of-conduct" className="hover:text-foreground underline">Code of Conduct</Link> and{" "}
          <Link href="/support/privacy-policy" className="hover:text-foreground underline">Privacy Policy</Link>.
        </p>
      </div>
    </section>
  );
}

function OAuthButton({ label, loading, onClick, icon, variant = "light" }: {
  label: string; loading: boolean; onClick: () => void; icon: React.ReactNode; variant?: "light" | "dark" | "facebook";
}) {
  const base = "w-full inline-flex items-center justify-center gap-3 px-5 py-3.5 text-base font-semibold rounded-xl border transition-all cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed";
  const styles = {
    light: "bg-background border-border hover:bg-muted text-foreground",
    dark: "bg-[#24292f] border-[#24292f] hover:bg-[#24292f]/90 text-white",
    facebook: "bg-[#1877F2] border-[#1877F2] hover:bg-[#1877F2]/90 text-white",
  }[variant];
  return (
    <button onClick={onClick} disabled={loading} className={`${base} ${styles}`}>
      {loading ? <Loader2 className="size-5 animate-spin" /> : icon}
      {loading ? "Connecting…" : label}
    </button>
  );
}

function Field({ label, icon, type, value, onChange, placeholder, required }: {
  label: string; icon: React.ReactNode; type: string; value: string; onChange: (v: string) => void; placeholder?: string; required?: boolean;
}) {
  return (
    <label className="block">
      <span className="block text-sm font-semibold mb-1.5">{label}</span>
      <div className="relative">
        <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground">{icon}</span>
        <input type={type} value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} required={required}
          className="h-12 w-full rounded-xl border border-input bg-background pl-11 pr-4 text-base font-medium outline-none focus-visible:border-brand-blue focus-visible:ring-[3px] focus-visible:ring-brand-blue/20 transition" />
      </div>
    </label>
  );
}

function ErrorBanner({ message }: { message: string }) {
  return (
    <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700 font-medium flex items-start gap-2">
      <AlertCircle className="size-4 shrink-0 mt-0.5" /> {message}
    </div>
  );
}

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

function GitHubIcon() {
  return (
    <svg className="size-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
    </svg>
  );
}

function FacebookIcon() {
  return (
    <svg className="size-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    </svg>
  );
}
