// ============================================================================
//  Sariro — Client-side auth helpers (safe for "use client" components)
//  ----------------------------------------------------------------------------
//  NO server-only imports here. This is what login page, user-menu, and
//  navbar import.
// ============================================================================

import { getSupabaseBrowser, isSupabaseConfigured } from "@/db/supabase-browser";

export type UserRole = "student" | "teacher" | "admin";

export interface SariroUser {
  id: string;
  email: string;
  displayName: string;
  avatarInitial: string;
  avatarUrl: string | null;
  isAdmin: boolean;
  role: UserRole;
  provider: string;
}

// ── Helper: derive a display name from an email ─────────────────────────────
function deriveNameFromEmail(email: string): string {
  const local = email.split("@")[0] ?? "";
  const clean = local.replace(/[0-9._-]+/g, " ").trim();
  const first = clean.split(" ")[0] || "there";
  return first.charAt(0).toUpperCase() + first.slice(1).toLowerCase();
}

// ── Helper: fetch profile with retry (handles race on first signup) ─────────
async function fetchProfile(userId: string): Promise<{
  display_name: string | null;
  avatar_initial: string | null;
  avatar_url: string | null;
  is_admin: boolean;
  role: string | null;
  provider: string | null;
} | null> {
  const supabase = getSupabaseBrowser();
  for (let attempt = 0; attempt < 3; attempt++) {
    const { data, error } = await supabase
      .from("profiles")
      .select("display_name, avatar_initial, avatar_url, is_admin, role, provider")
      .eq("id", userId)
      .single();
    if (data) return data;
    if (attempt < 2) await new Promise((r) => setTimeout(r, 500));
  }
  return null;
}

// ── OAuth sign-in helpers (Google, Facebook, GitHub) ────────────────────────
// All request ONLY email + name + avatar. Privacy first.
async function signInWithProvider(provider: "google" | "facebook" | "github") {
  if (!isSupabaseConfigured()) {
    throw new Error("Supabase is not configured. Add your keys to .env");
  }
  const supabase = getSupabaseBrowser();
  const { error } = await supabase.auth.signInWithOAuth({
    provider,
    options: {
      redirectTo: `${window.location.origin}/auth/callback?next=/dashboard`,
    },
  });
  if (error) throw error;
}

export const signInWithGoogle = () => signInWithProvider("google");
export const signInWithFacebook = () => signInWithProvider("facebook");
export const signInWithGitHub = () => signInWithProvider("github");

// ── Sign up with email + password ───────────────────────────────────────────
export async function signUpWithEmail(
  email: string,
  password: string
): Promise<{ needsEmailConfirm: boolean }> {
  if (!isSupabaseConfigured()) {
    throw new Error("Supabase is not configured. Add your keys to .env");
  }
  const supabase = getSupabaseBrowser();
  const { data, error } = await supabase.auth.signUp({ email, password });
  if (error) throw error;
  return { needsEmailConfirm: !data.session };
}

// ── Sign in with email + password ───────────────────────────────────────────
export async function signInWithEmail(
  email: string,
  password: string
): Promise<void> {
  if (!isSupabaseConfigured()) {
    throw new Error("Supabase is not configured. Add your keys to .env");
  }
  const supabase = getSupabaseBrowser();
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) throw error;
}

// ── Sign out ────────────────────────────────────────────────────────────────
export async function signOut(): Promise<void> {
  if (!isSupabaseConfigured()) return;
  const supabase = getSupabaseBrowser();
  await supabase.auth.signOut();
}

// ── Subscribe to auth state changes (for navbar reactivity) ─────────────────
export function onAuthChange(
  callback: (user: SariroUser | null) => void
): () => void {
  if (!isSupabaseConfigured()) {
    callback(null);
    return () => {};
  }
  const supabase = getSupabaseBrowser();

  const buildUser = async (
    session: { user: { id: string; email?: string } } | null
  ) => {
    if (!session?.user) {
      callback(null);
      return;
    }
    const email = session.user.email ?? "";
    const profile = await fetchProfile(session.user.id);
    const displayName = profile?.display_name || deriveNameFromEmail(email);
    const avatarInitial =
      profile?.avatar_initial || displayName.charAt(0).toUpperCase() || "S";
    const role = (profile?.role as UserRole) || "student";

    callback({
      id: session.user.id,
      email,
      displayName,
      avatarInitial,
      avatarUrl: profile?.avatar_url ?? null,
      isAdmin: profile?.is_admin ?? false,
      role,
      provider: profile?.provider ?? "email",
    });
  };

  const { data } = supabase.auth.onAuthStateChange((_event, session) => {
    buildUser(session);
  });

  supabase.auth.getSession().then(({ data: { session } }) => buildUser(session));

  return () => data.subscription.unsubscribe();
}

export { isSupabaseConfigured };
