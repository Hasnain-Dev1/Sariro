"use client";

import { useState, useEffect, useCallback } from "react";
import { SariroEvent } from "@/lib/data";
import { CalendarDays, Clock, MapPin, Edit3, Plus, RefreshCw, AlertCircle } from "lucide-react";
import { isSupabaseConfigured } from "@/lib/auth-client";
import { EventEditor } from "../event-editor";
import { toast } from "sonner";

export function EventsTab({ events: fallbackEvents }: { events: SariroEvent[] }) {
  const [events, setEvents] = useState<SariroEvent[]>(fallbackEvents);
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState<SariroEvent | null>(null);
  const [editorOpen, setEditorOpen] = useState(false);
  const configured = isSupabaseConfigured();

  const load = useCallback(async () => {
    if (!configured) return;
    setLoading(true);
    try {
      const { getSupabaseBrowser } = await import("@/db/supabase-browser");
      const supabase = getSupabaseBrowser();
      const { data, error } = await supabase.from("events").select("*").order("date");
      if (error) throw error;
      const dbEvents: SariroEvent[] = (data || []).map((r: Record<string, unknown>) => ({
        id: r.event_id as string,
        title: r.title as string,
        type: (r.type as SariroEvent["type"]) || "Webinar",
        date: (r.date as string) || "",
        time: (r.time as string) || "",
        format: (r.format as SariroEvent["format"]) || "Online",
        location: (r.location as string) || "",
        description: (r.description as string) || "",
        capacity: (r.capacity as string) || "",
        price: (r.price as string) || "",
        status: (r.status as SariroEvent["status"]) || "open",
        accent: (r.accent as "blue" | "green") || "blue",
      }));
      // MERGE: DB events first, then demo events not in DB
      const dbIds = new Set(dbEvents.map((e) => e.id));
      const merged: SariroEvent[] = [
        ...dbEvents,
        ...fallbackEvents.filter((e) => !dbIds.has(e.id)),
      ];
      setEvents(merged);
    } catch { /* keep fallback */ }
    finally { setLoading(false); }
  }, [configured, fallbackEvents]);

  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => { load(); }, [load]);

  function handleNew() {
    if (!configured) { toast.error("Add Supabase keys to .env to create events."); return; }
    setEditing(null); setEditorOpen(true);
  }
  function handleEdit(e: SariroEvent) {
    if (!configured) { toast.error("Add Supabase keys to .env to edit events."); return; }
    setEditing(e); setEditorOpen(true);
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-heading text-2xl font-bold tracking-tight flex items-center gap-2">
          <CalendarDays className="size-6 text-brand-green" />
          Events ({events.length})
        </h2>
        <div className="flex gap-2">
          {configured && (
            <button onClick={load} className="inline-flex items-center gap-2 rounded-xl border border-border px-3 py-2 text-sm font-semibold hover:bg-muted cursor-pointer">
              <RefreshCw className={`size-4 ${loading ? "animate-spin" : ""}`} /> Refresh
            </button>
          )}
          <button onClick={handleNew} className="btn-tactile btn-tactile-green inline-flex items-center gap-2 px-4 py-2.5 text-sm">
            <Plus className="size-4" /> New event
          </button>
        </div>
      </div>

      {!configured && (
        <div className="mb-4 rounded-xl border border-amber-200 bg-amber-50 p-4 flex items-start gap-3">
          <AlertCircle className="size-5 text-amber-600 shrink-0 mt-0.5" />
          <p className="text-sm text-amber-800 font-medium">
            Showing demo data. Add Supabase keys to <code>.env</code> to create, edit, and delete events.
          </p>
        </div>
      )}

      <div className="grid gap-3">
        {events.map((ev) => (
          <div key={ev.id} className="flex items-center gap-4 rounded-xl border border-border bg-brand-panel p-4 hover:border-foreground/20 transition-colors">
            <span className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${ev.accent === "green" ? "bg-brand-green/10 text-brand-green" : "bg-brand-blue/10 text-brand-blue"}`}>
              <CalendarDays className="size-6" />
            </span>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <h3 className="font-heading font-bold text-sm truncate">{ev.title}</h3>
                <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase ${ev.status === "open" ? "bg-brand-green/10 text-brand-green" : ev.status === "filling" ? "bg-amber-100 text-amber-700" : "bg-muted text-muted-foreground"}`}>
                  {ev.status}
                </span>
              </div>
              <div className="mt-1 flex flex-wrap items-center gap-3 text-xs text-muted-foreground font-medium">
                <span className="inline-flex items-center gap-1"><CalendarDays className="size-3" />{ev.date}</span>
                <span className="inline-flex items-center gap-1"><Clock className="size-3" />{ev.time}</span>
                <span className="inline-flex items-center gap-1"><MapPin className="size-3" />{ev.format}</span>
                <span className="rounded bg-muted px-1.5 py-0.5">{ev.type}</span>
                <span className="font-bold text-foreground">{ev.price}</span>
              </div>
            </div>
            <button onClick={() => handleEdit(ev)} className="inline-flex items-center gap-1.5 rounded-lg border border-border px-3 py-2 text-xs font-semibold hover:bg-muted cursor-pointer">
              <Edit3 className="size-3.5" /> Edit
            </button>
          </div>
        ))}
      </div>

      <EventEditor
        event={editing}
        open={editorOpen}
        onClose={() => setEditorOpen(false)}
        onSaved={load}
      />
    </div>
  );
}
