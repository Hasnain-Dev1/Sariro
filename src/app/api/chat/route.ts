import { NextRequest, NextResponse } from "next/server";
import { matchAnswer } from "@/lib/chat/match";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => null);
    const message = typeof body?.message === "string" ? body.message.trim() : "";

    if (!message) {
      return NextResponse.json(
        {
          reply: "Type a question and I'll do my best to help! 🙂",
          matchedId: null,
          score: 0,
          links: [],
          suggestions: [],
        },
        { status: 200 }
      );
    }

    // Pure local computation — no LLM, no DB, no network. ~1ms.
    const result = matchAnswer(message);

    return NextResponse.json(result, { status: 200 });
  } catch (err) {
    console.error("[chat] error", err);
    return NextResponse.json(
      {
        reply:
          "Oops, something glitched on my end. 🛠️ Try again, or email courses@sariro.com if it keeps happening.",
        matchedId: null,
        score: 0,
        links: [{ label: "Email us", route: "mailto:courses@sariro.com" }],
        suggestions: [],
      },
      { status: 500 }
    );
  }
}
