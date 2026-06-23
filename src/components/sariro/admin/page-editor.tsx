"use client";

import { useState, useEffect } from "react";
import { Loader2, Save, Trash2, X, Eye } from "lucide-react";
import { isSupabaseConfigured } from "@/lib/auth-client";
import { toast } from "sonner";

interface PageData {
  slug: string;
  title: string;
  category: string;
  excerpt: string;
  content: string;
  published: boolean;
}

interface Props {
  page: PageData | null;
  open: boolean;
  onClose: () => void;
  onSaved: () => void;
}

export function PageEditor({ page, open, onClose, onSaved }: Props) {
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState<PageData>({
    slug: "", title: "", category: "Support", excerpt: "", content: "", published: true,
  });

  useEffect(() => {
    if (page) {
    // eslint-disable-next-line react-hooks/set-state-in-effect
      setForm({ ...page });
    } else {
     
      setForm({ slug: "", title: "", category: "Blog", excerpt: "", content: "", published: true });
    }
  }, [page, open]);

  if (!open) return null;

  const update = (field: keyof PageData, value: string | boolean) =>
    setForm((f) => ({ ...f, [field]: value }));

  async function handleSave() {
    if (!form.title.trim() || !form.slug.trim()) {
      toast.error("Title and slug are required.");
      return;
    }
    if (!isSupabaseConfigured()) { toast.error("Add Supabase keys to .env first."); return; }
    setSaving(true);
    try {
      const { getSupabaseBrowser } = await import("@/db/supabase-browser");
      const supabase = getSupabaseBrowser();
      const { error } = await supabase.from("pages").upsert({
        slug: form.slug, title: form.title, category: form.category,
        excerpt: form.excerpt, content: form.content, published: form.published,
        last_updated: new Date().toISOString(),
      }, { onConflict: "slug" });
      if (error) throw error;
      toast.success(page ? "Page updated!" : "Page created!");
      onSaved();
      onClose();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not save.");
    } finally { setSaving(false); }
  }

  async function handleDelete() {
    if (!page) return;
    if (!confirm(`Delete "${page.title}"?`)) return;
    setSaving(true);
    try {
      const { getSupabaseBrowser } = await import("@/db/supabase-browser");
      const supabase = getSupabaseBrowser();
      const { error } = await supabase.from("pages").delete().eq("slug", page.slug);
      if (error) throw error;
      toast.success("Page deleted.");
      onSaved();
      onClose();
    } catch { toast.error("Could not delete."); }
    finally { setSaving(false); }
  }

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-black/50 animate-in fade-in duration-200">
      <div className="bg-background rounded-2xl border border-border shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto scroll-sariro">
        <div className="sticky top-0 bg-background border-b border-border px-6 py-4 flex items-center justify-between z-10">
          <h2 className="font-heading text-xl font-bold">{page ? "Edit page" : "New page"}</h2>
          <button onClick={onClose} className="rounded-lg p-2 hover:bg-muted cursor-pointer"><X className="size-5" /></button>
        </div>
        <div className="p-6 space-y-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <label className="block">
              <span className="block text-xs font-semibold mb-1 text-muted-foreground uppercase tracking-wider">Slug (URL)</span>
              <input value={form.slug} onChange={(e) => update("slug", e.target.value.toLowerCase().replace(/\s+/g, "-"))} placeholder="privacy-policy" className="h-10 w-full rounded-lg border border-input bg-background px-3 text-sm font-medium outline-none focus-visible:border-brand-blue focus-visible:ring-[3px] focus-visible:ring-brand-blue/20" />
              <span className="block text-xs text-muted-foreground mt-1">/support/{form.slug || "slug"}</span>
            </label>
            <label className="block">
              <span className="block text-xs font-semibold mb-1 text-muted-foreground uppercase tracking-wider">Category</span>
              <select value={form.category} onChange={(e) => update("category", e.target.value)} className="h-10 w-full rounded-lg border border-input bg-background px-3 text-sm font-medium outline-none focus-visible:border-brand-blue cursor-pointer">
                <option>Support</option>
                <option>Blog</option>
                <option>Legal</option>
              </select>
            </label>
          </div>
          <label className="block">
            <span className="block text-xs font-semibold mb-1 text-muted-foreground uppercase tracking-wider">Title</span>
            <input value={form.title} onChange={(e) => update("title", e.target.value)} placeholder="Privacy Policy" className="h-10 w-full rounded-lg border border-input bg-background px-3 text-sm font-medium outline-none focus-visible:border-brand-blue focus-visible:ring-[3px] focus-visible:ring-brand-blue/20" />
          </label>
          <label className="block">
            <span className="block text-xs font-semibold mb-1 text-muted-foreground uppercase tracking-wider">Excerpt (short description)</span>
            <input value={form.excerpt} onChange={(e) => update("excerpt", e.target.value)} placeholder="How we handle your data." className="h-10 w-full rounded-lg border border-input bg-background px-3 text-sm font-medium outline-none focus-visible:border-brand-blue focus-visible:ring-[3px] focus-visible:ring-brand-blue/20" />
          </label>
          <label className="block">
            <span className="block text-xs font-semibold mb-1 text-muted-foreground uppercase tracking-wider">Content (plain text — use blank lines for paragraphs)</span>
            <textarea
              value={form.content}
              onChange={(e) => update("content", e.target.value)}
              rows={14}
              placeholder={"Last updated: June 2026\n\nSection 1: Introduction\n\nWrite your content here..."}
              className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm font-mono leading-relaxed outline-none focus-visible:border-brand-blue focus-visible:ring-[3px] focus-visible:ring-brand-blue/20 resize-y font-medium"
            />
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" checked={form.published} onChange={(e) => update("published", e.target.checked)} className="size-4 accent-brand-blue" />
            <span className="text-sm font-semibold">Published (visible to public)</span>
          </label>
        </div>
        <div className="sticky bottom-0 bg-background border-t border-border px-6 py-4 flex items-center justify-between gap-3">
          {page ? (
            <button onClick={handleDelete} disabled={saving} className="inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold text-red-600 hover:bg-red-50 cursor-pointer disabled:opacity-50">
              <Trash2 className="size-4" /> Delete
            </button>
          ) : <div />}
          <div className="flex gap-2">
            {page && (
              <a href={`/support/${page.slug}`} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-xl border border-border px-4 py-2.5 text-sm font-semibold hover:bg-muted cursor-pointer">
                <Eye className="size-4" /> View live
              </a>
            )}
            <button onClick={onClose} className="rounded-xl border border-border px-4 py-2.5 text-sm font-semibold hover:bg-muted cursor-pointer">Cancel</button>
            <button onClick={handleSave} disabled={saving} className="btn-tactile btn-tactile-primary inline-flex items-center gap-2 px-5 py-2.5 text-sm disabled:opacity-50">
              {saving ? <Loader2 className="size-4 animate-spin" /> : <Save className="size-4" />}
              {page ? "Save changes" : "Create page"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
