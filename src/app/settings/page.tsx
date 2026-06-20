"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  User,
  Mail,
  Lock,
  Save,
  Loader2,
  Shield,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import {
  onAuthChange,
  signOut,
  isSupabaseConfigured,
  type SariroUser,
} from "@/lib/auth-client";
import { toast } from "sonner";

export default function SettingsPage() {
  const router = useRouter();
  const [user, setUser] = useState<SariroUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [displayName, setDisplayName] = useState("");
  const [saving, setSaving] = useState(false);
  const configured = isSupabaseConfigured();

  useEffect(() => {
    const unsub = onAuthChange((u) => {
      setUser(u);
      setDisplayName(u?.displayName || "");
      setLoading(false);
      if (!u) router.push("/login");
    });
    return unsub;
  }, [router]);

  async function handleSaveName() {
    if (!displayName.trim() || !configured) return;
    setSaving(true);
    try {
      // Update profile via Supabase
      const { getSupabaseBrowser } = await import("@/db/supabase-browser");
      const supabase = getSupabaseBrowser();
      const { error } = await supabase
        .from("profiles")
        .update({
          display_name: displayName.trim(),
          avatar_initial: displayName.trim().charAt(0).toUpperCase(),
        })
        .eq("id", user?.id);
      if (error) throw error;
      toast.success("Name updated!");
    } catch {
      toast.error("Could not update name. Try again.");
    } finally {
      setSaving(false);
    }
  }

  async function handleSignOut() {
    await signOut();
    router.push("/");
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="size-8 text-brand-blue animate-spin" />
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen bg-brand-panel">
      <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
        <h1 className="font-heading text-3xl sm:text-4xl font-extrabold tracking-tight">
          Settings
        </h1>
        <p className="mt-2 text-foreground/60 font-medium">
          Manage your account and preferences.
        </p>

        {!configured && (
          <div className="mt-6 rounded-2xl border border-amber-200 bg-amber-50 p-4 flex items-start gap-3">
            <AlertCircle className="size-5 text-amber-600 shrink-0 mt-0.5" />
            <p className="text-sm text-amber-800 font-medium">
              Supabase isn't configured. Add your keys to <code>.env</code> to
              enable saving changes.
            </p>
          </div>
        )}

        {/* Profile section */}
        <section className="mt-8 rounded-2xl border border-border bg-background p-6">
          <h2 className="font-heading text-xl font-bold tracking-tight flex items-center gap-2 mb-5">
            <User className="size-5 text-brand-blue" />
            Profile
          </h2>

          <label className="block">
            <span className="block text-sm font-semibold mb-1.5">
              Display name
            </span>
            <input
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              className="h-12 w-full rounded-xl border border-input bg-background px-4 text-base font-medium outline-none focus-visible:border-brand-blue focus-visible:ring-[3px] focus-visible:ring-brand-blue/20 transition"
              placeholder="Your name"
            />
          </label>

          <button
            onClick={handleSaveName}
            disabled={saving || !displayName.trim() || !configured}
            className="btn-tactile btn-tactile-primary mt-4 inline-flex items-center gap-2 px-5 py-3 text-base disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {saving ? (
              <Loader2 className="size-5 animate-spin" />
            ) : (
              <Save className="size-5" />
            )}
            Save changes
          </button>
        </section>

        {/* Account info */}
        <section className="mt-6 rounded-2xl border border-border bg-background p-6">
          <h2 className="font-heading text-xl font-bold tracking-tight flex items-center gap-2 mb-5">
            <Mail className="size-5 text-brand-green" />
            Account
          </h2>
          <dl className="space-y-3 text-sm">
            <div className="flex items-center justify-between py-2 border-b border-border">
              <dt className="text-muted-foreground font-medium">Email</dt>
              <dd className="font-semibold">{user.email}</dd>
            </div>
            <div className="flex items-center justify-between py-2 border-b border-border">
              <dt className="text-muted-foreground font-medium">Role</dt>
              <dd className="font-semibold flex items-center gap-1.5">
                {user.isAdmin ? (
                  <>
                    <Shield className="size-4 text-brand-green" />
                    Admin
                  </>
                ) : (
                  "Student"
                )}
              </dd>
            </div>
            <div className="flex items-center justify-between py-2">
              <dt className="text-muted-foreground font-medium">
                Authentication
              </dt>
              <dd className="font-semibold flex items-center gap-1.5">
                <CheckCircle2 className="size-4 text-brand-green" />
                Google
              </dd>
            </div>
          </dl>
        </section>

        {/* Danger zone */}
        <section className="mt-6 rounded-2xl border border-red-200 bg-red-50 p-6">
          <h2 className="font-heading text-xl font-bold tracking-tight text-red-900 flex items-center gap-2 mb-3">
            <Lock className="size-5" />
            Sign out
          </h2>
          <p className="text-sm text-red-800 font-medium mb-4">
            Sign out of your Sariro account on this device.
          </p>
          <button
            onClick={handleSignOut}
            className="btn-tactile btn-tactile-light inline-flex items-center gap-2 px-5 py-3 text-base border-red-300"
          >
            <Lock className="size-5" />
            Sign out
          </button>
        </section>
      </div>
    </div>
  );
}
