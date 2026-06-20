"use client";

import { useState, useEffect } from "react";
import { MessageSquare, RefreshCw, AlertCircle, ThumbsUp, ThumbsDown } from "lucide-react";
import { isSupabaseConfigured } from "@/lib/auth-client";
import { toast } from "sonner";

interface ChatLog {
  id: string;
  session_id: string | null;
  message: string;
  matched_id: string | null;
  score: number | null;
  feedback: string | null;
  created_at: string;
}

export function ChatLogsTab() {
  const [logs, setLogs] = useState<ChatLog[]>([]);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState<"all" | "unmatched" | "feedback">("all");
  const configured = isSupabaseConfigured();

  async function load() {
    if (!configured) return;
    setLoading(true);
    try {
      const { getSupabaseBrowser } = await import("@/db/supabase-browser");
      const supabase = getSupabaseBrowser();
      const { data, error } = await supabase
        .from("chat_logs")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(100);
      if (error) throw error;
      setLogs(data || []);
    } catch {
      toast.error("Could not load chat logs");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    load();
     
  }, []);

  const filtered = logs.filter((l) => {
    if (filter === "unmatched") return !l.matched_id;
    if (filter === "feedback") return l.feedback !== null;
    return true;
  });

  const unmatchedCount = logs.filter((l) => !l.matched_id).length;
  const matchRate = logs.length > 0
    ? Math.round(((logs.length - unmatchedCount) / logs.length) * 100)
    : 0;

  if (!configured) {
    return (
      <div className="rounded-2xl border border-amber-200 bg-amber-50 p-6 flex items-start gap-4">
        <AlertCircle className="size-6 text-amber-600 shrink-0 mt-0.5" />
        <div>
          <h3 className="font-heading font-bold text-amber-900">
            Chat logs require Supabase
          </h3>
          <p className="mt-1 text-sm text-amber-800 font-medium leading-relaxed">
            Once connected, every chatbot conversation will be logged here.
            Unanswered questions (fallbacks) are highlighted so you can add
            them to the knowledge base. Feedback (👍/👎) is tracked too.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-heading text-2xl font-bold tracking-tight flex items-center gap-2">
          <MessageSquare className="size-6 text-brand-blue" />
          Chat Logs
        </h2>
        <button
          onClick={load}
          className="inline-flex items-center gap-2 rounded-xl border border-border px-3 py-2 text-sm font-semibold hover:bg-muted cursor-pointer"
        >
          <RefreshCw className={`size-4 ${loading ? "animate-spin" : ""}`} />
          Refresh
        </button>
      </div>

      {/* Stats */}
      <div className="grid sm:grid-cols-3 gap-3 mb-6">
        <div className="rounded-xl border border-border bg-brand-panel p-4">
          <p className="font-heading text-2xl font-extrabold">{logs.length}</p>
          <p className="text-xs text-muted-foreground font-medium">Total messages</p>
        </div>
        <div className="rounded-xl border border-border bg-brand-panel p-4">
          <p className="font-heading text-2xl font-extrabold text-amber-600">{unmatchedCount}</p>
          <p className="text-xs text-muted-foreground font-medium">Unanswered (fallbacks)</p>
        </div>
        <div className="rounded-xl border border-border bg-brand-panel p-4">
          <p className="font-heading text-2xl font-extrabold text-brand-green">{matchRate}%</p>
          <p className="text-xs text-muted-foreground font-medium">Match rate</p>
        </div>
      </div>

      {/* Filter */}
      <div className="flex gap-2 mb-4">
        {([
          ["all", "All"],
          ["unmatched", "Unanswered only"],
          ["feedback", "With feedback"],
        ] as const).map(([id, label]) => (
          <button
            key={id}
            onClick={() => setFilter(id)}
            className={`rounded-full px-3.5 py-1.5 text-xs font-semibold cursor-pointer border transition-colors ${
              filter === id
                ? "bg-foreground text-white border-foreground"
                : "bg-background text-foreground/70 border-border hover:border-foreground/40"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Logs */}
      {filtered.length === 0 ? (
        <div className="py-12 text-center rounded-2xl border border-dashed border-border">
          <MessageSquare className="mx-auto size-8 text-muted-foreground/40" />
          <p className="mt-2 text-sm font-medium text-muted-foreground">
            No chat logs yet.
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {filtered.map((l) => (
            <div
              key={l.id}
              className={`rounded-xl border p-3 ${
                !l.matched_id
                  ? "border-amber-200 bg-amber-50"
                  : "border-border bg-brand-panel"
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold">{l.message}</p>
                  <div className="mt-1 flex items-center gap-3 text-xs text-muted-foreground font-medium">
                    {!l.matched_id ? (
                      <span className="text-amber-700 font-bold">⚠ No match (fallback)</span>
                    ) : (
                      <span className="text-brand-green font-semibold">
                        ✓ {l.matched_id} (score: {l.score})
                      </span>
                    )}
                    <span>{new Date(l.created_at).toLocaleString()}</span>
                  </div>
                </div>
                {l.feedback && (
                  <span className="shrink-0">
                    {l.feedback === "thumbsup" ? (
                      <ThumbsUp className="size-4 text-brand-green" />
                    ) : (
                      <ThumbsDown className="size-4 text-red-500" />
                    )}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
