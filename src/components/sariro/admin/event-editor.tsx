"use client";

import { useState, useEffect } from "react";
import { SariroEvent } from "@/lib/data";
import { Loader2, Save, Trash2, X } from "lucide-react";
import { isSupabaseConfigured } from "@/lib/auth-client";
import { toast } from "sonner";

interface Props {
  event: SariroEvent | null;
  open: boolean;
  onClose: () => void;
  onSaved: () => void;
}

export function EventEditor({ event, open, onClose, onSaved }: Props) {
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    event_id: "", title: "", type: "Webinar" as SariroEvent["type"],
    date: "", time: "", format: "Online" as SariroEvent["format"],
    location: "", description: "", capacity: "", price: "",
    status: "open" as SariroEvent["status"], accent: "blue" as "blue" | "green",
  });

  useEffect(() => {
    if (event) {
    // eslint-disable-next-line react-hooks/set-state-in-effect
      setForm({
        event_id: event.id, title: event.title, type: event.type,
        date: event.date, time: event.time, format: event.format,
        location: event.location, description: event.description,
        capacity: event.capacity, price: event.price,
        status: event.status, accent: event.accent,
      });
    } else {
      setForm({
        event_id: "", title: "", type: "Webinar", date: "", time: "",
        format: "Online", location: "", description: "", capacity: "",
        price: "", status: "open", accent: "blue",
      });
    }
  }, [event, open]);

  if (!open) return null;

  const update = (field: string, value: unknown) => setForm((f) => ({ ...f, [field]: value }));

  async function handleSave() {
    if (!form.title.trim() || !form.event_id.trim()) {
      toast.error("Title and Event ID are required.");
      return;
    }
    if (!isSupabaseConfigured()) { toast.error("Add Supabase keys to .env first."); return; }
    setSaving(true);
    try {
      const { getSupabaseBrowser } = await import("@/db/supabase-browser");
      const supabase = getSupabaseBrowser();
      const { error } = await supabase.from("events").upsert({
        event_id: form.event_id, title: form.title, type: form.type,
        date: form.date, time: form.time, format: form.format,
        location: form.location, description: form.description,
        capacity: form.capacity, price: form.price,
        status: form.status, accent: form.accent,
      }, { onConflict: "event_id" });
      if (error) throw error;
      toast.success(event ? "Event updated!" : "Event created!");
      onSaved();
      onClose();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not save.");
    } finally { setSaving(false); }
  }

  async function handleDelete() {
    if (!event) return;
    if (!confirm(`Delete "${event.title}"?`)) return;
    setSaving(true);
    try {
      const { getSupabaseBrowser } = await import("@/db/supabase-browser");
      const supabase = getSupabaseBrowser();
      const { error } = await supabase.from("events").delete().eq("event_id", event.id);
      if (error) throw error;
      toast.success("Event deleted.");
      onSaved();
      onClose();
    } catch { toast.error("Could not delete."); }
    finally { setSaving(false); }
  }

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-black/50 animate-in fade-in duration-200">
      <div className="bg-background rounded-2xl border border-border shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto scroll-sariro">
        <div className="sticky top-0 bg-background border-b border-border px-6 py-4 flex items-center justify-between z-10">
          <h2 className="font-heading text-xl font-bold">{event ? "Edit event" : "New event"}</h2>
          <button onClick={onClose} className="rounded-lg p-2 hover:bg-muted cursor-pointer"><X className="size-5" /></button>
        </div>
        <div className="p-6 space-y-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <Field label="Event ID (slug)" value={form.event_id} onChange={(v) => update("event_id", v.toLowerCase().replace(/\s+/g, "-"))} placeholder="ai-trends-webinar" />
            <Field label="Title" value={form.title} onChange={(v) => update("title", v)} placeholder="AI Trends 2026" />
          </div>
          <div className="grid sm:grid-cols-3 gap-4">
            <SelectField label="Type" value={form.type} onChange={(v) => update("type", v)} options={["Cohort", "Webinar", "Hackathon", "Workshop"]} />
            <SelectField label="Format" value={form.format} onChange={(v) => update("format", v)} options={["Online", "In-person", "Hybrid"]} />
            <SelectField label="Status" value={form.status} onChange={(v) => update("status", v)} options={["open", "filling", "waitlist"]} />
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <Field label="Date" value={form.date} onChange={(v) => update("date", v)} placeholder="Jan 05, 2026" />
            <Field label="Time" value={form.time} onChange={(v) => update("time", v)} placeholder="8:00 PM PKT" />
          </div>
          <Field label="Location" value={form.location} onChange={(v) => update("location", v)} placeholder="YouTube Live" />
          <div className="grid sm:grid-cols-2 gap-4">
            <Field label="Capacity" value={form.capacity} onChange={(v) => update("capacity", v)} placeholder="Unlimited" />
            <Field label="Price" value={form.price} onChange={(v) => update("price", v)} placeholder="Free" />
          </div>
          <label className="block">
            <span className="block text-xs font-semibold mb-1 text-muted-foreground uppercase tracking-wider">Description</span>
            <textarea value={form.description} onChange={(e) => update("description", e.target.value)} rows={3} placeholder="What's this event about?" className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm font-medium outline-none focus-visible:border-brand-blue focus-visible:ring-[3px] focus-visible:ring-brand-blue/20 resize-none" />
          </label>
          <SelectField label="Accent color" value={form.accent} onChange={(v) => update("accent", v)} options={["blue", "green"]} />
        </div>
        <div className="sticky bottom-0 bg-background border-t border-border px-6 py-4 flex items-center justify-between gap-3">
          {event ? (
            <button onClick={handleDelete} disabled={saving} className="inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold text-red-600 hover:bg-red-50 cursor-pointer disabled:opacity-50">
              <Trash2 className="size-4" /> Delete
            </button>
          ) : <div />}
          <div className="flex gap-2">
            <button onClick={onClose} className="rounded-xl border border-border px-4 py-2.5 text-sm font-semibold hover:bg-muted cursor-pointer">Cancel</button>
            <button onClick={handleSave} disabled={saving} className="btn-tactile btn-tactile-primary inline-flex items-center gap-2 px-5 py-2.5 text-sm disabled:opacity-50">
              {saving ? <Loader2 className="size-4 animate-spin" /> : <Save className="size-4" />}
              {event ? "Save changes" : "Create event"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function Field({ label, value, onChange, placeholder }: { label: string; value: string; onChange: (v: string) => void; placeholder?: string }) {
  return (
    <label className="block">
      <span className="block text-xs font-semibold mb-1 text-muted-foreground uppercase tracking-wider">{label}</span>
      <input value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} className="h-10 w-full rounded-lg border border-input bg-background px-3 text-sm font-medium outline-none focus-visible:border-brand-blue focus-visible:ring-[3px] focus-visible:ring-brand-blue/20" />
    </label>
  );
}
function SelectField({ label, value, onChange, options }: { label: string; value: string; onChange: (v: string) => void; options: string[] }) {
  return (
    <label className="block">
      <span className="block text-xs font-semibold mb-1 text-muted-foreground uppercase tracking-wider">{label}</span>
      <select value={value} onChange={(e) => onChange(e.target.value)} className="h-10 w-full rounded-lg border border-input bg-background px-3 text-sm font-medium outline-none focus-visible:border-brand-blue focus-visible:ring-[3px] focus-visible:ring-brand-blue/20 cursor-pointer">
        {options.map((o) => <option key={o} value={o}>{o}</option>)}
      </select>
    </label>
  );
}
