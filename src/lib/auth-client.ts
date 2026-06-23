// ============================================================================
//  Sariro — Client-side auth helpers (safe for "use client" components)
//  ----------------------------------------------------------------------------
//  NO server-only imports here. This is what login page, user-menu, and
//  navbar import.
// ============================================================================

import { getSupabaseBrowser, isSupabaseConfigured } from "@/db/supabase-browser";

export interface SariroUser {
  id: string;
  email: string;
  displayName: string;
  avatarInitial: string;
  isAdmin: boolean;
}

// ── Helper: derive a display name from an email ─────────────────────────────
// "ali@eg.com" → "Ali", "john.doe99@x.com" → "John"
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
  is_admin: boolean;
} | null> {
  const supabase = getSupabaseBrowser();
  for (let attempt = 0; attempt < 3; attempt++) {
    const { data, error } = await supabase
      .from("profiles")
      .select("display_name, avatar_initial, is_admin")
      .eq("id", userId)
      .single();
    if (data) return data;
    // Profile might not exist yet (trigger race) — wait + retry
    if (attempt < 2) await new Promise((r) => setTimeout(r, 500));
  }
  return null;
}

// ── Sign in with Google (One Tap / OAuth redirect) ──────────────────────────
// Privacy: requests ONLY email + profile scope. Nothing else.
export async function signInWithGoogle(): Promise<void> {
  if (!isSupabaseConfigured()) {
    throw new Error("Supabase is not configured. Add your keys to .env");
  }
  const supabase = getSupabaseBrowser();
  const { error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: `${window.location.origin}/auth/callback?next=/dashboard`,
    },
  });
  if (error) throw error;
}

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
  // If email confirmation is enabled in Supabase settings, user must verify
  // before they can log in. If disabled, they're logged in immediately.
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
// Gracefully no-ops if Supabase isn't configured (returns null user).
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

    callback({
      id: session.user.id,
      email,
      displayName,
      avatarInitial,
      isAdmin: profile?.is_admin ?? false,
    });
  };

  const { data } = supabase.auth.onAuthStateChange((_event, session) => {
    buildUser(session);
  });

  // Also fire immediately with the current session (for page loads)
  supabase.auth.getSession().then(({ data: { session } }) => buildUser(session));

  return () => data.subscription.unsubscribe();
}

export { isSupabaseConfigured };
