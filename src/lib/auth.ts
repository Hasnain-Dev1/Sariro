// ============================================================================
//  Sariro — Server-side auth helper (server components + route handlers ONLY)
//  ----------------------------------------------------------------------------
//  ⚠️ Do NOT import this from client components. Client components should
//  use @/lib/auth-client instead.
// ============================================================================

import { getSupabaseServer } from "@/db/supabase";
import type { SariroUser, UserRole } from "./auth-client";

// ── Server-side: read current user from session cookie ──────────────────────
export async function getCurrentUser(): Promise<SariroUser | null> {
  try {
    const supabase = await getSupabaseServer();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return null;

    const { data: profile } = await supabase
      .from("profiles")
      .select("display_name, avatar_initial, avatar_url, is_admin, role, provider")
      .eq("id", user.id)
      .single();

    const email = user.email ?? "";
    const rawName =
      profile?.display_name ||
      email.split("@")[0]?.replace(/[0-9._-]/g, " ").trim().split(" ")[0] ||
      "there";
    const displayName =
      rawName.charAt(0).toUpperCase() + rawName.slice(1).toLowerCase();
    const avatarInitial =
      profile?.avatar_initial || displayName.charAt(0).toUpperCase() || "S";
    const role = (profile?.role as UserRole) || (profile?.is_admin ? "admin" : "student");

    return {
      id: user.id,
      email,
      displayName,
      avatarInitial,
      avatarUrl: profile?.avatar_url ?? null,
      isAdmin: profile?.is_admin ?? false,
      role,
      provider: profile?.provider ?? "email",
    };
  } catch {
    return null;
  }
}
