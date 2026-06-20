"use client";

import { Users, BookOpen, CalendarDays, MessageSquare, TrendingUp, AlertCircle } from "lucide-react";

export function OverviewTab() {
  return (
    <div>
      <h2 className="font-heading text-2xl font-bold tracking-tight mb-6">
        Platform overview
      </h2>

      {/* KPI cards */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <KpiCard
          icon={<Users className="size-5" />}
          label="Total users"
          value="—"
          hint="Connect Supabase"
          accent="blue"
        />
        <KpiCard
          icon={<BookOpen className="size-5" />}
          label="Courses"
          value="8"
          hint="Active cohorts"
          accent="green"
        />
        <KpiCard
          icon={<CalendarDays className="size-5" />}
          label="Events"
          value="6"
          hint="Upcoming"
          accent="blue"
        />
        <KpiCard
          icon={<MessageSquare className="size-5" />}
          label="Inquiries"
          value="—"
          hint="Connect Supabase"
          accent="green"
        />
      </div>

      {/* Not connected notice */}
      <div className="rounded-2xl border border-amber-200 bg-amber-50 p-6 flex items-start gap-4">
        <AlertCircle className="size-6 text-amber-600 shrink-0 mt-0.5" />
        <div>
          <h3 className="font-heading font-bold text-amber-900">
            Supabase not connected
          </h3>
          <p className="mt-1 text-sm text-amber-800 font-medium leading-relaxed">
            Live data (users, inquiries, chat logs) will appear here once you
            add your Supabase keys to <code className="bg-amber-100 px-1.5 py-0.5 rounded text-xs">.env</code> and run the SQL schema
            in your Supabase dashboard.
          </p>
        </div>
      </div>

      {/* Quick links */}
      <div className="mt-8">
        <h3 className="font-heading text-lg font-bold tracking-tight mb-4 flex items-center gap-2">
          <TrendingUp className="size-5 text-brand-blue" />
          Quick actions
        </h3>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          <QuickLink href="#users" label="Manage users" desc="Promote admins, ban accounts" />
          <QuickLink href="#courses" label="Edit courses" desc="Update catalog & pricing" />
          <QuickLink href="#pages" label="Edit content" desc="Support pages & blog" />
          <QuickLink href="#events" label="Manage events" desc="Cohorts & webinars" />
          <QuickLink href="#inquiries" label="View inquiries" desc="Contact form submissions" />
          <QuickLink href="#chat-logs" label="Chat logs" desc="Review bot conversations" />
        </div>
      </div>
    </div>
  );
}

function KpiCard({
  icon,
  label,
  value,
  hint,
  accent,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  hint: string;
  accent: "blue" | "green";
}) {
  return (
    <div className="rounded-2xl border border-border bg-brand-panel p-5">
      <span
        className={`flex h-10 w-10 items-center justify-center rounded-xl ${
          accent === "green" ? "bg-brand-green/10 text-brand-green" : "bg-brand-blue/10 text-brand-blue"
        }`}
      >
        {icon}
      </span>
      <p className="mt-3 font-heading text-3xl font-extrabold tracking-tight">{value}</p>
      <p className="text-sm font-semibold text-foreground">{label}</p>
      <p className="text-xs text-muted-foreground font-medium mt-0.5">{hint}</p>
    </div>
  );
}

function QuickLink({ href, label, desc }: { href: string; label: string; desc: string }) {
  return (
    <a
      href={href}
      className="block rounded-xl border border-border bg-brand-panel p-4 hover:border-foreground/20 hover:bg-muted/50 transition-colors cursor-pointer"
    >
      <p className="font-semibold text-sm">{label}</p>
      <p className="text-xs text-muted-foreground font-medium mt-0.5">{desc}</p>
    </a>
  );
}
