"use client";

import { useState, useEffect, useCallback } from "react";
import { Course } from "@/lib/data";
import { BookOpen, Clock, Users, DollarSign, Edit3, Plus, RefreshCw, AlertCircle } from "lucide-react";
import { isSupabaseConfigured } from "@/lib/auth-client";
import { CourseEditor } from "../course-editor";
import { toast } from "sonner";

export function CoursesTab({ courses: fallbackCourses }: { courses: Course[] }) {
  const [courses, setCourses] = useState<Course[]>(fallbackCourses);
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState<Course | null>(null);
  const [editorOpen, setEditorOpen] = useState(false);
  const configured = isSupabaseConfigured();

  const load = useCallback(async () => {
    if (!configured) return;
    setLoading(true);
    try {
      const { getSupabaseBrowser } = await import("@/db/supabase-browser");
      const supabase = getSupabaseBrowser();
      const { data, error } = await supabase.from("courses").select("*").order("title");
      if (error) throw error;
      const dbCourses: Course[] = (data || []).map((r: Record<string, unknown>) => ({
        id: r.course_id as string,
        title: r.title as string,
        tagline: (r.tagline as string) || "",
        level: (r.level as Course["level"]) || "Beginner",
        audience: (r.audience as Course["audience"]) || "All",
        format: (r.format as Course["format"]) || "Cohort",
        durationWeeks: (r.duration_weeks as number) || 4,
        modules: (r.modules as number) || 6,
        price: (r.price as number) || 0,
        priceLabel: `$${r.price}`,
        nextCohort: (r.next_cohort as string) || "",
        featured: (r.featured as boolean) || false,
        accent: (r.accent as "blue" | "green") || "blue",
        syllabus: (r.syllabus as string[]) || [],
        outcomes: (r.outcomes as string[]) || [],
      }));
      // MERGE: DB courses (edited/created) first, then demo courses not in DB
      const dbIds = new Set(dbCourses.map((c) => c.id));
      const merged: Course[] = [
        ...dbCourses,
        ...fallbackCourses.filter((c) => !dbIds.has(c.id)),
      ];
      setCourses(merged);
    } catch {
      // keep fallback (already in state)
    } finally { setLoading(false); }
  }, [configured, fallbackCourses]);

  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => { load(); }, [load]);

  function handleNew() {
    if (!configured) { toast.error("Add Supabase keys to .env to create courses."); return; }
    setEditing(null);
    setEditorOpen(true);
  }
  function handleEdit(c: Course) {
    if (!configured) { toast.error("Add Supabase keys to .env to edit courses."); return; }
    setEditing(c);
    setEditorOpen(true);
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-heading text-2xl font-bold tracking-tight flex items-center gap-2">
          <BookOpen className="size-6 text-brand-blue" />
          Courses ({courses.length})
        </h2>
        <div className="flex gap-2">
          {configured && (
            <button onClick={load} className="inline-flex items-center gap-2 rounded-xl border border-border px-3 py-2 text-sm font-semibold hover:bg-muted cursor-pointer">
              <RefreshCw className={`size-4 ${loading ? "animate-spin" : ""}`} /> Refresh
            </button>
          )}
          <button onClick={handleNew} className="btn-tactile btn-tactile-primary inline-flex items-center gap-2 px-4 py-2.5 text-sm">
            <Plus className="size-4" /> New course
          </button>
        </div>
      </div>

      {!configured && (
        <div className="mb-4 rounded-xl border border-amber-200 bg-amber-50 p-4 flex items-start gap-3">
          <AlertCircle className="size-5 text-amber-600 shrink-0 mt-0.5" />
          <p className="text-sm text-amber-800 font-medium">
            Showing demo data. Add Supabase keys to <code>.env</code> to create, edit, and delete courses. Changes save to the <code>courses</code> table in Supabase.
          </p>
        </div>
      )}

      <div className="grid gap-3">
        {courses.map((c) => (
          <div key={c.id} className="flex items-center gap-4 rounded-xl border border-border bg-brand-panel p-4 hover:border-foreground/20 transition-colors">
            <span className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${c.accent === "green" ? "bg-brand-green/10 text-brand-green" : "bg-brand-blue/10 text-brand-blue"}`}>
              <BookOpen className="size-6" />
            </span>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <h3 className="font-heading font-bold text-sm truncate">{c.title}</h3>
                {c.featured && <span className="rounded-full bg-brand-green/10 px-2 py-0.5 text-[10px] font-bold uppercase text-brand-green">Featured</span>}
              </div>
              <div className="mt-1 flex flex-wrap items-center gap-3 text-xs text-muted-foreground font-medium">
                <span className="inline-flex items-center gap-1"><Clock className="size-3" />{c.durationWeeks}w</span>
                <span className="inline-flex items-center gap-1"><Users className="size-3" />{c.audience}</span>
                <span className="inline-flex items-center gap-1"><DollarSign className="size-3" />{c.priceLabel}</span>
                <span className="rounded bg-muted px-1.5 py-0.5">{c.level}</span>
              </div>
            </div>
            <button onClick={() => handleEdit(c)} className="inline-flex items-center gap-1.5 rounded-lg border border-border px-3 py-2 text-xs font-semibold hover:bg-muted cursor-pointer">
              <Edit3 className="size-3.5" /> Edit
            </button>
          </div>
        ))}
      </div>

      <CourseEditor
        course={editing}
        open={editorOpen}
        onClose={() => setEditorOpen(false)}
        onSaved={load}
      />
    </div>
  );
}
