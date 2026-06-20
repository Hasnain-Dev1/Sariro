import { NextResponse } from "next/server";
import { getSupabaseServer } from "@/db/supabase";

// ============================================================================
//  OAuth callback — Google redirects here after the user consents.
//  We exchange the `code` for a session (stored in httpOnly cookies by
//  @supabase/ssr), then redirect to the home page.
//
//  Privacy note: the code exchange happens server-side. The access/refresh
//  tokens never touch the browser — they live in httpOnly cookies.
// ============================================================================

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  // Default redirect after Google OAuth → dashboard (not home)
  const next = requestUrl.searchParams.get("next") || "/dashboard";

  if (code) {
    try {
      const supabase = await getSupabaseServer();
      const { error } = await supabase.auth.exchangeCodeForSession(code);
      if (error) {
        console.error("[auth/callback] code exchange error:", error.message);
        // Redirect to login with an error flag
        return NextResponse.redirect(
          new URL("/login?error=auth_failed", requestUrl.origin)
        );
      }
    } catch (err) {
      console.error("[auth/callback] unexpected error:", err);
      return NextResponse.redirect(
        new URL("/login?error=auth_failed", requestUrl.origin)
      );
    }
  }

  // Success — go home (or to the `next` path)
  return NextResponse.redirect(new URL(next, requestUrl.origin));
}
