import { NextRequest, NextResponse } from "next/server";
import { getSupabaseService, isSupabaseConfigured } from "@/db/supabase";

export const runtime = "nodejs";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => null);
    const email =
      typeof body?.email === "string" ? body.email.trim().toLowerCase() : "";
    const name = typeof body?.name === "string" ? body.name.trim() : null;
    const source =
      typeof body?.source === "string" ? body.source : "community";

    if (!EMAIL_RE.test(email)) {
      return NextResponse.json(
        { ok: false, error: "Please enter a valid email address." },
        { status: 400 }
      );
    }

    // If Supabase isn't configured, acknowledge but don't persist
    if (!isSupabaseConfigured()) {
      return NextResponse.json({
        ok: true,
        message:
          "You're on the list! (Connect Supabase to actually store subscribers.)",
      });
    }

    const supabase = getSupabaseService();

    // Check if already subscribed
    const { data: existing } = await supabase
      .from("subscribers")
      .select("email")
      .eq("email", email)
      .single();

    if (existing) {
      return NextResponse.json({
        ok: true,
        message: "You're already on the list. Welcome back!",
        alreadySubscribed: true,
      });
    }

    const { error } = await supabase
      .from("subscribers")
      .insert({ email, name, source });

    if (error) {
      console.error("[newsletter] insert error:", error.message);
      return NextResponse.json(
        { ok: false, error: "Could not subscribe. Please try again." },
        { status: 500 }
      );
    }

    return NextResponse.json({
      ok: true,
      message: "Welcome to the Sariro community! Check your inbox.",
    });
  } catch (err) {
    console.error("[newsletter] error", err);
    return NextResponse.json(
      { ok: false, error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}
