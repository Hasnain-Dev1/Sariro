"use client";

import { useState, useEffect } from "react";
import { Users, Search, Shield, UserX, RefreshCw, AlertCircle } from "lucide-react";
import { isSupabaseConfigured } from "@/lib/auth-client";
import { toast } from "sonner";

interface Profile {
  id: string;
  email: string;
  display_name: string;
  is_admin: boolean;
  avatar_initial: string;
  created_at: string;
}

export function UsersTab() {
  const [users, setUsers] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const configured = isSupabaseConfigured();

  async function loadUsers() {
    if (!configured) return;
    setLoading(true);
    try {
      const { getSupabaseBrowser } = await import("@/db/supabase-browser");
      const supabase = getSupabaseBrowser();
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      setUsers(data || []);
    } catch {
      toast.error("Could not load users");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadUsers();
     
  }, []);

  async function toggleAdmin(user: Profile) {
    try {
      const { getSupabaseBrowser } = await import("@/db/supabase-browser");
      const supabase = getSupabaseBrowser();
      const { error } = await supabase
        .from("profiles")
        .update({ is_admin: !user.is_admin })
        .eq("id", user.id);
      if (error) throw error;
      toast.success(`${user.display_name} is now ${!user.is_admin ? "an admin" : "a student"}`);
      loadUsers();
    } catch {
      toast.error("Could not update role");
    }
  }

  const filtered = users.filter(
    (u) =>
      u.email.toLowerCase().includes(search.toLowerCase()) ||
      u.display_name?.toLowerCase().includes(search.toLowerCase())
  );

  if (!configured) {
    return (
      <NotConnected
        title="User management requires Supabase"
        desc="Connect Supabase to view, search, and manage user accounts. Once connected, you can promote/demote admins and see all registered users."
      />
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-heading text-2xl font-bold tracking-tight flex items-center gap-2">
          <Users className="size-6 text-brand-blue" />
          Users ({users.length})
        </h2>
        <button
          onClick={loadUsers}
          className="inline-flex items-center gap-2 rounded-xl border border-border px-3 py-2 text-sm font-semibold hover:bg-muted cursor-pointer"
        >
          <RefreshCw className={`size-4 ${loading ? "animate-spin" : ""}`} />
          Refresh
        </button>
      </div>

      {/* Search */}
      <div className="relative mb-4">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by name or email..."
          className="h-11 w-full rounded-xl border border-input bg-background pl-10 pr-4 text-sm font-medium outline-none focus-visible:border-brand-blue focus-visible:ring-[3px] focus-visible:ring-brand-blue/20"
        />
      </div>

      {/* Table */}
      {loading && users.length === 0 ? (
        <div className="py-12 text-center">
          <RefreshCw className="mx-auto size-8 text-brand-blue animate-spin" />
          <p className="mt-3 text-sm text-muted-foreground font-medium">Loading users…</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="py-12 text-center rounded-2xl border border-dashed border-border">
          <Users className="mx-auto size-8 text-muted-foreground/40" />
          <p className="mt-2 text-sm font-medium text-muted-foreground">
            {search ? "No users match your search." : "No users yet. Signups will appear here."}
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto scroll-sariro">
          <table className="w-full min-w-[600px]">
            <thead>
              <tr className="border-b border-border text-left">
                <th className="py-3 px-3 text-xs font-mono-display uppercase tracking-wider text-muted-foreground">User</th>
                <th className="py-3 px-3 text-xs font-mono-display uppercase tracking-wider text-muted-foreground">Email</th>
                <th className="py-3 px-3 text-xs font-mono-display uppercase tracking-wider text-muted-foreground">Role</th>
                <th className="py-3 px-3 text-xs font-mono-display uppercase tracking-wider text-muted-foreground text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((u) => (
                <tr key={u.id} className="border-b border-border/60 hover:bg-muted/30">
                  <td className="py-3 px-3">
                    <div className="flex items-center gap-2.5">
                      <span className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold text-white ${u.is_admin ? "bg-brand-green" : "bg-brand-blue"}`}>
                        {u.avatar_initial || "S"}
                      </span>
                      <span className="font-semibold text-sm">{u.display_name || "—"}</span>
                    </div>
                  </td>
                  <td className="py-3 px-3 text-sm text-foreground/70 font-medium">{u.email}</td>
                  <td className="py-3 px-3">
                    {u.is_admin ? (
                      <span className="inline-flex items-center gap-1 rounded-full bg-brand-green/10 px-2.5 py-0.5 text-xs font-bold text-brand-green">
                        <Shield className="size-3" />
                        Admin
                      </span>
                    ) : (
                      <span className="inline-flex items-center rounded-full bg-muted px-2.5 py-0.5 text-xs font-bold text-muted-foreground">
                        Student
                      </span>
                    )}
                  </td>
                  <td className="py-3 px-3 text-right">
                    <button
                      onClick={() => toggleAdmin(u)}
                      className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold cursor-pointer transition-colors ${
                        u.is_admin
                          ? "bg-red-50 text-red-600 hover:bg-red-100"
                          : "bg-brand-blue/10 text-brand-blue hover:bg-brand-blue/20"
                      }`}
                    >
                      {u.is_admin ? (
                        <>
                          <UserX className="size-3.5" />
                          Demote
                        </>
                      ) : (
                        <>
                          <Shield className="size-3.5" />
                          Make admin
                        </>
                      )}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function NotConnected({ title, desc }: { title: string; desc: string }) {
  return (
    <div className="rounded-2xl border border-amber-200 bg-amber-50 p-6 flex items-start gap-4">
      <AlertCircle className="size-6 text-amber-600 shrink-0 mt-0.5" />
      <div>
        <h3 className="font-heading font-bold text-amber-900">{title}</h3>
        <p className="mt-1 text-sm text-amber-800 font-medium leading-relaxed">{desc}</p>
      </div>
    </div>
  );
}
