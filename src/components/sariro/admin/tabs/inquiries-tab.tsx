"use client";

import { useState, useEffect } from "react";
import { LifeBuoy, RefreshCw, AlertCircle, Mail, Clock } from "lucide-react";
import { isSupabaseConfigured } from "@/lib/auth-client";
import { toast } from "sonner";

interface Inquiry {
  id: string;
  name: string;
  email: string;
  type: string;
  message: string;
  status: string;
  created_at: string;
}

export function InquiriesTab() {
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [loading, setLoading] = useState(false);
  const configured = isSupabaseConfigured();

  async function load() {
    if (!configured) return;
    setLoading(true);
    try {
      const { getSupabaseBrowser } = await import("@/db/supabase-browser");
      const supabase = getSupabaseBrowser();
      const { data, error } = await supabase
        .from("inquiries")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      setInquiries(data || []);
    } catch {
      toast.error("Could not load inquiries");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    load();
     
  }, []);

  async function updateStatus(id: string, status: string) {
    try {
      const { getSupabaseBrowser } = await import("@/db/supabase-browser");
      const supabase = getSupabaseBrowser();
      const { error } = await supabase
        .from("inquiries")
        .update({ status })
        .eq("id", id);
      if (error) throw error;
      toast.success(`Marked as ${status}`);
      load();
    } catch {
      toast.error("Could not update inquiry");
    }
  }

  if (!configured) {
    return (
      <div className="rounded-2xl border border-amber-200 bg-amber-50 p-6 flex items-start gap-4">
        <AlertCircle className="size-6 text-amber-600 shrink-0 mt-0.5" />
        <div>
          <h3 className="font-heading font-bold text-amber-900">
            Inquiries require Supabase
          </h3>
          <p className="mt-1 text-sm text-amber-800 font-medium leading-relaxed">
            Once connected, all contact-form and school-inquiry submissions
            will appear here. You can mark them as responded or closed.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-heading text-2xl font-bold tracking-tight flex items-center gap-2">
          <LifeBuoy className="size-6 text-brand-green" />
          Inquiries ({inquiries.length})
        </h2>
        <button
          onClick={load}
          className="inline-flex items-center gap-2 rounded-xl border border-border px-3 py-2 text-sm font-semibold hover:bg-muted cursor-pointer"
        >
          <RefreshCw className={`size-4 ${loading ? "animate-spin" : ""}`} />
          Refresh
        </button>
      </div>

      {loading && inquiries.length === 0 ? (
        <div className="py-12 text-center">
          <RefreshCw className="mx-auto size-8 text-brand-blue animate-spin" />
        </div>
      ) : inquiries.length === 0 ? (
        <div className="py-12 text-center rounded-2xl border border-dashed border-border">
          <LifeBuoy className="mx-auto size-8 text-muted-foreground/40" />
          <p className="mt-2 text-sm font-medium text-muted-foreground">
            No inquiries yet. Submissions from the contact form will appear here.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {inquiries.map((inq) => (
            <div key={inq.id} className="rounded-xl border border-border bg-brand-panel p-4">
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="font-heading font-bold text-sm">{inq.name}</h3>
                    <span className="rounded bg-muted px-1.5 py-0.5 text-[10px] font-bold uppercase text-muted-foreground">
                      {inq.type}
                    </span>
                    <span
                      className={`rounded px-1.5 py-0.5 text-[10px] font-bold uppercase ${
                        inq.status === "new"
                          ? "bg-blue-100 text-blue-700"
                          : inq.status === "responded"
                          ? "bg-amber-100 text-amber-700"
                          : "bg-green-100 text-green-700"
                      }`}
                    >
                      {inq.status}
                    </span>
                  </div>
                  <a
                    href={`mailto:${inq.email}`}
                    className="mt-1 inline-flex items-center gap-1 text-xs text-brand-blue font-semibold hover:underline"
                  >
                    <Mail className="size-3" />
                    {inq.email}
                  </a>
                  <p className="mt-2 text-sm text-foreground/70 font-medium leading-relaxed">
                    {inq.message}
                  </p>
                  <p className="mt-2 text-xs text-muted-foreground font-medium flex items-center gap-1">
                    <Clock className="size-3" />
                    {new Date(inq.created_at).toLocaleString()}
                  </p>
                </div>
              </div>
              <div className="mt-3 flex gap-2">
                {inq.status !== "responded" && (
                  <button
                    onClick={() => updateStatus(inq.id, "responded")}
                    className="rounded-lg bg-amber-50 px-3 py-1.5 text-xs font-semibold text-amber-700 hover:bg-amber-100 cursor-pointer"
                  >
                    Mark responded
                  </button>
                )}
                {inq.status !== "closed" && (
                  <button
                    onClick={() => updateStatus(inq.id, "closed")}
                    className="rounded-lg bg-green-50 px-3 py-1.5 text-xs font-semibold text-green-700 hover:bg-green-100 cursor-pointer"
                  >
                    Close
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
