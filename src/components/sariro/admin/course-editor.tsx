"use client";

import { useState, useEffect } from "react";
import { Course } from "@/lib/data";
import { Loader2, Save, Trash2, Plus, X } from "lucide-react";
import { isSupabaseConfigured } from "@/lib/auth-client";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface Props {
  course: Course | null; // null = creating new
  open: boolean;
  onClose: () => void;
  onSaved: () => void;
}

export function CourseEditor({ course, open, onClose, onSaved }: Props) {
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    course_id: "",
    title: "",
    tagline: "",
    level: "Beginner" as Course["level"],
    audience: "All" as Course["audience"],
    format: "Cohort" as Course["format"],
    duration_weeks: 4,
    modules: 6,
    price: 149,
    next_cohort: "",
    featured: false,
    accent: "blue" as "blue" | "green",
    syllabus: [] as string[],
    outcomes: [] as string[],
  });

  useEffect(() => {
    if (course) {
    // eslint-disable-next-line react-hooks/set-state-in-effect
      setForm({
        course_id: course.id,
        title: course.title,
        tagline: course.tagline,
        level: course.level,
        audience: course.audience,
        format: course.format,
        duration_weeks: course.durationWeeks,
        modules: course.modules,
        price: course.price,
        next_cohort: course.nextCohort,
        featured: course.featured,
        accent: course.accent,
        syllabus: [...course.syllabus],
        outcomes: [...course.outcomes],
      });
    } else {
      setForm({
        course_id: "",
        title: "",
        tagline: "",
        level: "Beginner",
        audience: "All",
        format: "Cohort",
        duration_weeks: 4,
        modules: 6,
        price: 149,
        next_cohort: "",
        featured: false,
        accent: "blue",
        syllabus: [""],
        outcomes: [""],
      });
    }
  }, [course, open]);

  if (!open) return null;

  const update = (field: string, value: unknown) =>
    setForm((f) => ({ ...f, [field]: value }));

  async function handleSave() {
    if (!form.title.trim() || !form.course_id.trim()) {
      toast.error("Title and Course ID are required.");
      return;
    }
    if (!isSupabaseConfigured()) {
      toast.error("Add Supabase keys to .env first.");
      return;
    }
    setSaving(true);
    try {
      const { getSupabaseBrowser } = await import("@/db/supabase-browser");
      const supabase = getSupabaseBrowser();
      const payload = {
        course_id: form.course_id,
        title: form.title,
        tagline: form.tagline,
        level: form.level,
        audience: form.audience,
        format: form.format,
        duration_weeks: form.duration_weeks,
        modules: form.modules,
        price: form.price,
        next_cohort: form.next_cohort,
        featured: form.featured,
        accent: form.accent,
        syllabus: form.syllabus.filter((s) => s.trim()),
        outcomes: form.outcomes.filter((s) => s.trim()),
      };
      const { error } = await supabase
        .from("courses")
        .upsert(payload, { onConflict: "course_id" });
      if (error) throw error;
      toast.success(course ? "Course updated!" : "Course created!");
      onSaved();
      onClose();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not save.");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!course) return;
    if (!confirm(`Delete "${course.title}"? This cannot be undone.`)) return;
    setSaving(true);
    try {
      const { getSupabaseBrowser } = await import("@/db/supabase-browser");
      const supabase = getSupabaseBrowser();
      const { error, count } = await supabase
        .from("courses")
        .delete({ count: "exact" })
        .eq("course_id", course.id);
      if (error) {
        if (error.message.includes("row-level security") || error.code === "42501") {
          throw new Error("Permission denied. Only admins can delete courses. Make sure is_admin=true for your account.");
        }
        throw error;
      }
      if (count === 0) {
        toast.info("This course is demo data (not in the database). It will reappear on refresh. To permanently remove it, delete it from src/lib/data.ts.", { duration: 8000 });
      } else {
        toast.success("Course deleted from database.");
      }
      onSaved();
      onClose();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not delete.", { duration: 8000 });
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-black/50 animate-in fade-in duration-200">
      <div className="bg-background rounded-2xl border border-border shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto scroll-sariro">
        {/* Header */}
        <div className="sticky top-0 bg-background border-b border-border px-6 py-4 flex items-center justify-between z-10">
          <h2 className="font-heading text-xl font-bold">
            {course ? "Edit course" : "New course"}
          </h2>
          <button onClick={onClose} className="rounded-lg p-2 hover:bg-muted cursor-pointer">
            <X className="size-5" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <Input label="Course ID (slug)" value={form.course_id} onChange={(v) => update("course_id", v.toLowerCase().replace(/\s+/g, "-"))} placeholder="ai-literacy" disabled={!!course} hint={course ? "Cannot change ID on existing course" : undefined} />
            <Input label="Title" value={form.title} onChange={(v) => update("title", v)} placeholder="AI Literacy Fundamentals" />
          </div>
          <Input label="Tagline" value={form.tagline} onChange={(v) => update("tagline", v)} placeholder="Understand what AI is and how to use it." />

          <div className="grid sm:grid-cols-4 gap-4">
            <Select label="Level" value={form.level} onChange={(v) => update("level", v)} options={["Beginner", "Intermediate", "Advanced"]} />
            <Select label="Audience" value={form.audience} onChange={(v) => update("audience", v)} options={["All", "Students", "Schools", "Professionals"]} />
            <Select label="Format" value={form.format} onChange={(v) => update("format", v)} options={["Cohort", "Self-paced"]} />
            <Select label="Accent" value={form.accent} onChange={(v) => update("accent", v)} options={["blue", "green"]} />
          </div>

          <div className="grid sm:grid-cols-4 gap-4">
            <NumberInput label="Duration (weeks)" value={form.duration_weeks} onChange={(v) => update("duration_weeks", v)} />
            <NumberInput label="Modules" value={form.modules} onChange={(v) => update("modules", v)} />
            <NumberInput label="Price ($)" value={form.price} onChange={(v) => update("price", v)} />
            <Input label="Next cohort" value={form.next_cohort} onChange={(v) => update("next_cohort", v)} placeholder="Jan 12, 2026" />
          </div>

          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" checked={form.featured} onChange={(e) => update("featured", e.target.checked)} className="size-4 accent-brand-blue" />
            <span className="text-sm font-semibold">Featured course</span>
          </label>

          {/* Syllabus */}
          <ListEditor label="Syllabus (one item per line)" items={form.syllabus} onChange={(items) => update("syllabus", items)} placeholder="How machines actually learn" />

          {/* Outcomes */}
          <ListEditor label="Learning outcomes (one per line)" items={form.outcomes} onChange={(items) => update("outcomes", items)} placeholder="Confidently explain AI to anyone" />
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-background border-t border-border px-6 py-4 flex items-center justify-between gap-3">
          {course ? (
            <button onClick={handleDelete} disabled={saving} className="inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold text-red-600 hover:bg-red-50 cursor-pointer disabled:opacity-50">
              <Trash2 className="size-4" />
              Delete
            </button>
          ) : <div />}
          <div className="flex gap-2">
            <button onClick={onClose} className="rounded-xl border border-border px-4 py-2.5 text-sm font-semibold hover:bg-muted cursor-pointer">
              Cancel
            </button>
            <button onClick={handleSave} disabled={saving} className="btn-tactile btn-tactile-primary inline-flex items-center gap-2 px-5 py-2.5 text-sm disabled:opacity-50">
              {saving ? <Loader2 className="size-4 animate-spin" /> : <Save className="size-4" />}
              {course ? "Save changes" : "Create course"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Reusable field components ───────────────────────────────────────────────
function Input({ label, value, onChange, placeholder, disabled, hint }: { label: string; value: string; onChange: (v: string) => void; placeholder?: string; disabled?: boolean; hint?: string }) {
  return (
    <label className="block">
      <span className="block text-xs font-semibold mb-1 text-muted-foreground uppercase tracking-wider">{label}</span>
      <input value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} disabled={disabled} className="h-10 w-full rounded-lg border border-input bg-background px-3 text-sm font-medium outline-none focus-visible:border-brand-blue focus-visible:ring-[3px] focus-visible:ring-brand-blue/20 disabled:opacity-60 disabled:cursor-not-allowed disabled:bg-muted" />
      {hint && <span className="block text-[10px] text-amber-600 font-medium mt-1">{hint}</span>}
    </label>
  );
}

function NumberInput({ label, value, onChange }: { label: string; value: number; onChange: (v: number) => void }) {
  return (
    <label className="block">
      <span className="block text-xs font-semibold mb-1 text-muted-foreground uppercase tracking-wider">{label}</span>
      <input type="number" value={value} onChange={(e) => onChange(Number(e.target.value))} className="h-10 w-full rounded-lg border border-input bg-background px-3 text-sm font-medium outline-none focus-visible:border-brand-blue focus-visible:ring-[3px] focus-visible:ring-brand-blue/20" />
    </label>
  );
}

function Select({ label, value, onChange, options }: { label: string; value: string; onChange: (v: string) => void; options: string[] }) {
  return (
    <label className="block">
      <span className="block text-xs font-semibold mb-1 text-muted-foreground uppercase tracking-wider">{label}</span>
      <select value={value} onChange={(e) => onChange(e.target.value)} className="h-10 w-full rounded-lg border border-input bg-background px-3 text-sm font-medium outline-none focus-visible:border-brand-blue focus-visible:ring-[3px] focus-visible:ring-brand-blue/20 cursor-pointer">
        {options.map((o) => <option key={o} value={o}>{o}</option>)}
      </select>
    </label>
  );
}

function ListEditor({ label, items, onChange, placeholder }: { label: string; items: string[]; onChange: (items: string[]) => void; placeholder?: string }) {
  return (
    <div>
      <span className="block text-xs font-semibold mb-1 text-muted-foreground uppercase tracking-wider">{label}</span>
      <div className="space-y-2">
        {items.map((item, i) => (
          <div key={i} className="flex gap-2">
            <input
              value={item}
              onChange={(e) => { const next = [...items]; next[i] = e.target.value; onChange(next); }}
              placeholder={placeholder}
              className="h-10 flex-1 rounded-lg border border-input bg-background px-3 text-sm font-medium outline-none focus-visible:border-brand-blue focus-visible:ring-[3px] focus-visible:ring-brand-blue/20"
            />
            <button
              onClick={() => onChange(items.filter((_, idx) => idx !== i))}
              className="rounded-lg p-2 text-muted-foreground hover:bg-red-50 hover:text-red-600 cursor-pointer"
            >
              <X className="size-4" />
            </button>
          </div>
        ))}
        <button
          onClick={() => onChange([...items, ""])}
          className="inline-flex items-center gap-1.5 rounded-lg border border-dashed border-border px-3 py-2 text-sm font-semibold text-muted-foreground hover:border-foreground/30 hover:text-foreground cursor-pointer"
        >
          <Plus className="size-4" />
          Add item
        </button>
      </div>
    </div>
  );
}
