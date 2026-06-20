import { type NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";

// ============================================================================
//  Middleware — refreshes the Supabase session cookie on every request.
//  This keeps users logged in without manual token refresh, and ensures
//  server components always see the current auth state.
//
//  Runs on every route except static assets.
// ============================================================================

export async function middleware(request: NextRequest) {
  // Skip if Supabase isn't configured (avoid crashing during local dev
  // before keys are added)
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return NextResponse.next({ request });

  const response = NextResponse.next({ request });

  const supabase = createServerClient(url, key, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) =>
          request.cookies.set(name, value)
        );
        cookiesToSet.forEach(({ name, value, options }) =>
          response.cookies.set(name, value, options)
        );
      },
    },
  });

  // getUser() refreshes the session if needed (the response cookies above
  // propagate the refreshed token back to the browser).
  await supabase.auth.getUser();

  return response;
}

export const config = {
  matcher: [
    // Run on all routes except static assets, Next internals, and images
    "/((?!_next/static|_next/image|favicon.ico|logo.svg|images/|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)",
  ],
};
