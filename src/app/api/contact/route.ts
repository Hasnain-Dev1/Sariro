import { NextRequest, NextResponse } from "next/server";
import { getSupabaseService, isSupabaseConfigured } from "@/db/supabase";

export const runtime = "nodejs";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const VALID_TYPES = ["general", "media", "courses", "schools"] as const;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => null);
    const name = typeof body?.name === "string" ? body.name.trim() : "";
    const email =
      typeof body?.email === "string" ? body.email.trim().toLowerCase() : "";
    const message =
      typeof body?.message === "string" ? body.message.trim() : "";
    const typeRaw = typeof body?.type === "string" ? body.type : "general";
    const type = (VALID_TYPES as readonly string[]).includes(typeRaw)
      ? typeRaw
      : "general";

    if (name.length < 2) {
      return NextResponse.json(
        { ok: false, error: "Please tell us your name." },
        { status: 400 }
      );
    }
    if (!EMAIL_RE.test(email)) {
      return NextResponse.json(
        { ok: false, error: "Please enter a valid email address." },
        { status: 400 }
      );
    }
    if (message.length < 10) {
      return NextResponse.json(
        {
          ok: false,
          error: "Please write a message of at least 10 characters.",
        },
        { status: 400 }
      );
    }

    // If Supabase isn't configured, acknowledge but don't persist
    if (!isSupabaseConfigured()) {
      return NextResponse.json({
        ok: true,
        message:
          "Thanks for reaching out! (Connect Supabase to actually store inquiries.)",
      });
    }

    const supabase = getSupabaseService();
    const { error } = await supabase
      .from("inquiries")
      .insert({ name, email, type, message });

    if (error) {
      console.error("[contact] insert error:", error.message);
      return NextResponse.json(
        { ok: false, error: "Could not submit inquiry. Please try again." },
        { status: 500 }
      );
    }

    return NextResponse.json({
      ok: true,
      message:
        "Thanks for reaching out! We'll get back to you within 2 business days.",
    });
  } catch (err) {
    console.error("[contact] error", err);
    return NextResponse.json(
      { ok: false, error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}
