"use client";

import { useState } from "react";
import type { SariroUser } from "@/lib/auth-client";
import type { Course, SariroEvent } from "@/lib/data";
import type { SupportPage } from "@/lib/support";
import {
  LayoutDashboard,
  Users,
  BookOpen,
  CalendarDays,
  FileText,
  MessageSquare,
  LifeBuoy,
  Shield,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { OverviewTab } from "./tabs/overview-tab";
import { UsersTab } from "./tabs/users-tab";
import { CoursesTab } from "./tabs/courses-tab";
import { EventsTab } from "./tabs/events-tab";
import { PagesTab } from "./tabs/pages-tab";
import { InquiriesTab } from "./tabs/inquiries-tab";
import { ChatLogsTab } from "./tabs/chat-logs-tab";

type Tab =
  | "overview"
  | "users"
  | "courses"
  | "events"
  | "pages"
  | "inquiries"
  | "chat-logs";

const TABS: { id: Tab; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
  { id: "overview", label: "Overview", icon: LayoutDashboard },
  { id: "users", label: "Users", icon: Users },
  { id: "courses", label: "Courses", icon: BookOpen },
  { id: "events", label: "Events", icon: CalendarDays },
  { id: "pages", label: "Pages / CMS", icon: FileText },
  { id: "inquiries", label: "Inquiries", icon: LifeBuoy },
  { id: "chat-logs", label: "Chat Logs", icon: MessageSquare },
];

interface Props {
  user: SariroUser;
  initialCourses: Course[];
  initialEvents: SariroEvent[];
  initialPages: SupportPage[];
}

export function AdminPanel({
  user,
  initialCourses,
  initialEvents,
  initialPages,
}: Props) {
  const [tab, setTab] = useState<Tab>("overview");

  return (
    <div className="min-h-screen bg-brand-panel">
      {/* Header */}
      <header className="border-b border-border bg-foreground text-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-green">
              <Shield className="size-5" />
            </span>
            <div>
              <h1 className="font-heading text-xl font-extrabold tracking-tight">
                Admin Panel
              </h1>
              <p className="text-xs text-white/60 font-medium">
                Signed in as {user.displayName} · {user.email}
              </p>
            </div>
          </div>
          <span className="hidden sm:inline-flex items-center gap-1.5 rounded-full bg-brand-green/20 px-3 py-1 text-xs font-bold uppercase tracking-wider text-brand-green">
            <Shield className="size-3" />
            Admin
          </span>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
        {/* Tab navigation */}
        <nav className="flex flex-wrap gap-1 mb-6 rounded-2xl border border-border bg-background p-1.5">
          {TABS.map((t) => {
            const Icon = t.icon;
            return (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={cn(
                  "inline-flex items-center gap-2 rounded-xl px-3.5 py-2.5 text-sm font-semibold transition-colors cursor-pointer",
                  tab === t.id
                    ? "bg-foreground text-white"
                    : "text-foreground/70 hover:bg-muted"
                )}
              >
                <Icon className="size-4" />
                <span className="hidden sm:inline">{t.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Tab content */}
        <div className="rounded-2xl border border-border bg-background p-6 min-h-[500px]">
          {tab === "overview" && <OverviewTab />}
          {tab === "users" && <UsersTab />}
          {tab === "courses" && <CoursesTab courses={initialCourses} />}
          {tab === "events" && <EventsTab events={initialEvents} />}
          {tab === "pages" && <PagesTab pages={initialPages} />}
          {tab === "inquiries" && <InquiriesTab />}
          {tab === "chat-logs" && <ChatLogsTab />}
        </div>
      </div>
    </div>
  );
}
