"use client";

import { useState, useEffect, useCallback } from "react";
import { SupportPage } from "@/lib/support";
import { FileText, Edit3, Eye, Plus, RefreshCw, AlertCircle } from "lucide-react";
import { isSupabaseConfigured } from "@/lib/auth-client";
import { PageEditor } from "../page-editor";
import { toast } from "sonner";

interface DBPage {
  slug: string;
  title: string;
  category: string;
  excerpt: string;
  content: string;
  published: boolean;
}

export function PagesTab({ pages: fallbackPages }: { pages: SupportPage[] }) {
  const [pages, setPages] = useState<DBPage[]>(
    fallbackPages.map((p) => ({
      slug: p.slug, title: p.title, category: p.category,
      excerpt: p.excerpt, content: p.content, published: true,
    }))
  );
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState<DBPage | null>(null);
  const [editorOpen, setEditorOpen] = useState(false);
  const configured = isSupabaseConfigured();

  const load = useCallback(async () => {
    if (!configured) return;
    setLoading(true);
    try {
      const { getSupabaseBrowser } = await import("@/db/supabase-browser");
      const supabase = getSupabaseBrowser();
      const { data, error } = await supabase.from("pages").select("*").order("title");
      if (error) throw error;
      const dbPages = (data || []) as DBPage[];
      // MERGE: DB pages first, then fallback (demo) pages not in DB
      const dbSlugs = new Set(dbPages.map((p) => p.slug));
      const fallbackMapped: DBPage[] = fallbackPages.map((p) => ({
        slug: p.slug, title: p.title, category: p.category,
        excerpt: p.excerpt, content: p.content, published: true,
      }));
      const merged: DBPage[] = [
        ...dbPages,
        ...fallbackMapped.filter((p) => !dbSlugs.has(p.slug)),
      ];
      setPages(merged);
    } catch { /* keep fallback */ }
    finally { setLoading(false); }
  }, [configured, fallbackPages]);

  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => { load(); }, [load]);

  function handleNew() {
    if (!configured) { toast.error("Add Supabase keys to .env to create pages."); return; }
    setEditing(null); setEditorOpen(true);
  }
  function handleEdit(p: DBPage) {
    if (!configured) { toast.error("Add Supabase keys to .env to edit pages."); return; }
    setEditing(p); setEditorOpen(true);
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-heading text-2xl font-bold tracking-tight flex items-center gap-2">
          <FileText className="size-6 text-brand-blue" />
          Pages / CMS ({pages.length})
        </h2>
        <div className="flex gap-2">
          {configured && (
            <button onClick={load} className="inline-flex items-center gap-2 rounded-xl border border-border px-3 py-2 text-sm font-semibold hover:bg-muted cursor-pointer">
              <RefreshCw className={`size-4 ${loading ? "animate-spin" : ""}`} /> Refresh
            </button>
          )}
          <button onClick={handleNew} className="btn-tactile btn-tactile-primary inline-flex items-center gap-2 px-4 py-2.5 text-sm">
            <Plus className="size-4" /> New page
          </button>
        </div>
      </div>

      {!configured && (
        <div className="mb-4 rounded-xl border border-amber-200 bg-amber-50 p-4 flex items-start gap-3">
          <AlertCircle className="size-5 text-amber-600 shrink-0 mt-0.5" />
          <p className="text-sm text-amber-800 font-medium">
            Showing demo data. Add Supabase keys to <code>.env</code> to edit these pages, create new blog posts, and publish content directly — no dev team needed.
          </p>
        </div>
      )}

      <p className="mb-4 text-sm text-muted-foreground font-medium">
        💡 The content team edits pages directly from here. Changes go live instantly on the public site.
      </p>

      <div className="grid gap-3">
        {pages.map((p) => (
          <div key={p.slug} className="flex items-center gap-4 rounded-xl border border-border bg-brand-panel p-4 hover:border-foreground/20 transition-colors">
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-brand-blue/10 text-brand-blue">
              <FileText className="size-6" />
            </span>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <h3 className="font-heading font-bold text-sm">{p.title}</h3>
                <span className={`rounded px-1.5 py-0.5 text-[10px] font-bold uppercase ${p.category === "Blog" ? "bg-brand-green/10 text-brand-green" : "bg-muted text-muted-foreground"}`}>
                  {p.category}
                </span>
                {!p.published && (
                  <span className="rounded bg-amber-100 px-1.5 py-0.5 text-[10px] font-bold uppercase text-amber-700">Draft</span>
                )}
              </div>
              <p className="text-xs text-muted-foreground font-medium mt-0.5 truncate">
                /support/{p.slug} · {p.excerpt}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <a href={`/support/${p.slug}`} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 rounded-lg border border-border px-3 py-2 text-xs font-semibold hover:bg-muted cursor-pointer">
                <Eye className="size-3.5" /> View
              </a>
              <button onClick={() => handleEdit(p)} className="inline-flex items-center gap-1.5 rounded-lg border border-border px-3 py-2 text-xs font-semibold hover:bg-muted cursor-pointer">
                <Edit3 className="size-3.5" /> Edit
              </button>
            </div>
          </div>
        ))}
      </div>

      <PageEditor
        page={editing}
        open={editorOpen}
        onClose={() => setEditorOpen(false)}
        onSaved={load}
      />
    </div>
  );
}
