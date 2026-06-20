"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { MessageCircle, X, Send, Sparkles, ArrowRight } from "lucide-react";
import { useChatStore, type ChatMessage } from "./use-chat";
import { CHAT_GREETING, CHAT_STARTERS } from "@/lib/chat/qa";
import { cn } from "@/lib/utils";

export function ChatWidget() {
  const open = useChatStore((s) => s.open);
  const toggle = useChatStore((s) => s.toggle);
  const messages = useChatStore((s) => s.messages);
  const loading = useChatStore((s) => s.loading);
  const push = useChatStore((s) => s.push);
  const setLoading = useChatStore((s) => s.setLoading);
  const hasInteracted = useChatStore((s) => s.hasInteracted);
  const markInteracted = useChatStore((s) => s.markInteracted);
  const setOpen = useChatStore((s) => s.setOpen);

  const [input, setInput] = useState("");
  const pathname = usePathname();
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Seed the greeting the first time the panel opens
  useEffect(() => {
    if (open && messages.length === 0) {
      push({
        role: "bot",
        text: CHAT_GREETING,
        links: [],
        suggestions: [],
      });
    }
     
  }, [open]);

  // Auto-scroll to bottom on new messages / loading
  useEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
  }, [messages, loading]);

  // Focus input when opened
  useEffect(() => {
    if (open) {
      const t = setTimeout(() => inputRef.current?.focus(), 150);
      return () => clearTimeout(t);
    }
  }, [open]);

  // Close on Escape
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && open) setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, setOpen]);

  async function send(text: string) {
    const trimmed = text.trim();
    if (!trimmed || loading) return;

    markInteracted();
    push({ role: "user", text: trimmed });
    setInput("");
    setLoading(true);

    // small artificial delay so it feels like the bot is "typing"
    await new Promise((r) => setTimeout(r, 350 + Math.random() * 350));

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: trimmed, route: pathname }),
      });
      const data = await res.json();
      push({
        role: "bot",
        text: data.reply,
        links: data.links ?? [],
        suggestions: data.suggestions ?? [],
      });
    } catch {
      push({
        role: "bot",
        text: "Network hiccup. 🔄 Try again in a moment — or email courses@sariro.com if it persists.",
        links: [{ label: "Email us", route: "mailto:courses@sariro.com" }],
        suggestions: [],
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      {/* Floating bubble */}
      <button
        onClick={toggle}
        aria-label={open ? "Close chat" : "Open chat"}
        aria-expanded={open}
        className={cn(
          "fixed z-[60] bottom-5 right-5 sm:bottom-6 sm:right-6 flex items-center justify-center rounded-full shadow-2xl cursor-pointer transition-all duration-300",
          open
            ? "size-12 bg-foreground text-background rotate-90"
            : "size-14 sm:size-16 bg-brand-blue text-white hover:scale-105 active:scale-95"
        )}
        style={{
          boxShadow: open
            ? undefined
            : "0 12px 30px -8px rgba(37,99,235,0.55), 0 0 0 0 rgba(37,99,235,0.4)",
        }}
      >
        {!open && (
          <span
            className="absolute inset-0 rounded-full bg-brand-blue animate-ping opacity-30"
            aria-hidden
          />
        )}
        {open ? (
          <X className="size-6" />
        ) : (
          <MessageCircle className="size-7 sm:size-8" />
        )}
        {!open && (
          <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-brand-green text-[10px] font-bold text-white ring-2 ring-background">
            !
          </span>
        )}
      </button>

      {/* Overlay panel — overlaps the page, bottom-right */}
      {open && (
        <div
          role="dialog"
          aria-label="Sariro assistant"
          className="fixed z-[59] inset-x-0 bottom-0 sm:inset-x-auto sm:bottom-24 sm:right-6 mx-auto sm:mx-0 w-full sm:w-[400px] max-w-[420px] h-[80vh] sm:h-[600px] max-h-[700px] bg-background rounded-t-3xl sm:rounded-3xl border border-border shadow-2xl flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-300"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3.5 bg-foreground text-white">
            <div className="flex items-center gap-3">
              <div className="relative flex h-10 w-10 items-center justify-center rounded-full bg-brand-blue">
                <Sparkles className="size-5" />
                <span className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full bg-brand-green ring-2 ring-foreground" />
              </div>
              <div className="leading-tight">
                <p className="font-heading font-bold text-sm">Sariro Assistant</p>
                <p className="text-xs text-white/60 flex items-center gap-1">
                  <span className="h-1.5 w-1.5 rounded-full bg-brand-green" />
                  Online · replies instantly
                </p>
              </div>
            </div>
            <button
              onClick={() => setOpen(false)}
              aria-label="Close chat"
              className="flex h-9 w-9 items-center justify-center rounded-full hover:bg-white/10 cursor-pointer transition-colors"
            >
              <X className="size-5" />
            </button>
          </div>

          {/* Messages */}
          <div
            ref={scrollRef}
            className="flex-1 overflow-y-auto scroll-sariro bg-brand-panel px-3.5 py-4 space-y-3"
          >
            {messages.map((m) => (
              <MessageBubble key={m.id} message={m} onSuggestion={send} />
            ))}

            {/* Starter chips before first interaction */}
            {!hasInteracted && messages.length > 0 && (
              <div className="pt-1">
                <p className="text-xs text-muted-foreground font-medium mb-2 px-1">
                  Try asking:
                </p>
                <div className="flex flex-wrap gap-2">
                  {CHAT_STARTERS.map((s) => (
                    <button
                      key={s.label}
                      onClick={() => send(s.message)}
                      className="rounded-full border border-border bg-background px-3 py-1.5 text-xs font-semibold text-foreground/80 hover:border-brand-blue hover:text-brand-blue transition-colors cursor-pointer"
                    >
                      {s.label}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Typing indicator */}
            {loading && <TypingBubble />}
          </div>

          {/* Input bar */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              send(input);
            }}
            className="flex items-center gap-2 px-3 py-3 border-t border-border bg-background"
          >
            <input
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your question..."
              disabled={loading}
              className="flex-1 h-11 rounded-full border border-input bg-brand-panel px-4 text-sm font-medium outline-none focus-visible:border-brand-blue focus-visible:ring-[3px] focus-visible:ring-brand-blue/20 transition disabled:opacity-60"
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              aria-label="Send message"
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-brand-blue text-white shadow-md hover:bg-brand-blue/90 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition-colors"
            >
              <Send className="size-5" />
            </button>
          </form>
        </div>
      )}
    </>
  );
}

function MessageBubble({
  message,
  onSuggestion,
}: {
  message: ChatMessage;
  onSuggestion: (text: string) => void;
}) {
  const isBot = message.role === "bot";
  return (
    <div className={cn("flex", isBot ? "justify-start" : "justify-end")}>
      <div
        className={cn(
          "max-w-[85%] rounded-2xl px-3.5 py-2.5 text-sm font-medium leading-relaxed whitespace-pre-wrap",
          isBot
            ? "bg-background border border-border text-foreground rounded-bl-md"
            : "bg-brand-blue text-white rounded-br-md"
        )}
      >
        {message.text}

        {/* Links (page CTAs) */}
        {isBot && message.links && message.links.length > 0 && (
          <div className="mt-2.5 flex flex-wrap gap-1.5">
            {message.links.map((l) =>
              l.route.startsWith("mailto:") ? (
                <a
                  key={l.label}
                  href={l.route}
                  className="inline-flex items-center gap-1 rounded-full border border-brand-blue/30 bg-brand-blue/5 px-2.5 py-1 text-xs font-semibold text-brand-blue hover:bg-brand-blue/10 transition-colors"
                >
                  {l.label}
                  <ArrowRight className="size-3" />
                </a>
              ) : (
                <Link
                  key={l.label}
                  href={l.route}
                  className="inline-flex items-center gap-1 rounded-full border border-brand-blue/30 bg-brand-blue/5 px-2.5 py-1 text-xs font-semibold text-brand-blue hover:bg-brand-blue/10 transition-colors"
                >
                  {l.label}
                  <ArrowRight className="size-3" />
                </Link>
              )
            )}
          </div>
        )}

        {/* Clarify suggestions */}
        {isBot && message.suggestions && message.suggestions.length > 0 && (
          <div className="mt-2.5 flex flex-wrap gap-1.5">
            {message.suggestions.map((s) => (
              <button
                key={s.id}
                onClick={() => onSuggestion(s.label)}
                className="rounded-full border border-border bg-brand-panel px-2.5 py-1 text-xs font-semibold text-foreground/75 hover:border-brand-blue hover:text-brand-blue transition-colors cursor-pointer"
              >
                {s.label}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function TypingBubble() {
  return (
    <div className="flex justify-start">
      <div className="rounded-2xl rounded-bl-md bg-background border border-border px-4 py-3 flex items-center gap-1">
        <span className="h-2 w-2 rounded-full bg-muted-foreground/50 animate-bounce" style={{ animationDelay: "0ms" }} />
        <span className="h-2 w-2 rounded-full bg-muted-foreground/50 animate-bounce" style={{ animationDelay: "150ms" }} />
        <span className="h-2 w-2 rounded-full bg-muted-foreground/50 animate-bounce" style={{ animationDelay: "300ms" }} />
      </div>
    </div>
  );
}
