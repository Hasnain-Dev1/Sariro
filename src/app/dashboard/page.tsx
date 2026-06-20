import { redirect } from "next/navigation";
import Link from "next/link";
import { getCurrentUser } from "@/lib/auth";
import { COURSES, EVENTS } from "@/lib/data";
import {
  GraduationCap,
  Clock,
  CalendarDays,
  Award,
  ArrowRight,
  Sparkles,
  BookOpen,
  Trophy,
  PlayCircle,
} from "lucide-react";

export const metadata = {
  title: "Dashboard — Sariro",
  description: "Your courses, progress, and upcoming sessions.",
};

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const isConfigured = Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL);

  // Featured courses to recommend (first 3)
  const recommended = COURSES.filter((c) => c.featured).slice(0, 3);
  // Upcoming events (first 3)
  const upcomingEvents = EVENTS.slice(0, 3);

  const greeting = (() => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  })();

  return (
    <div className="min-h-screen bg-brand-panel">
      {/* Greeting header */}
      <section className="border-b border-border bg-background">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
          <div className="flex items-center gap-4">
            <span
              className={`flex h-14 w-14 sm:h-16 sm:w-16 items-center justify-center rounded-2xl font-heading text-2xl sm:text-3xl font-extrabold text-white shadow-lg ${
                user.isAdmin ? "bg-brand-green" : "bg-brand-blue"
              }`}
            >
              {user.avatarInitial}
            </span>
            <div>
              <p className="font-mono-display text-xs uppercase tracking-wider text-muted-foreground">
                {greeting}
              </p>
              <h1 className="font-heading text-3xl sm:text-4xl font-extrabold tracking-tight">
                {user.displayName} 👋
              </h1>
              <p className="mt-1 text-foreground/60 font-medium">
                {user.isAdmin
                  ? "You have admin access — manage the platform from the admin panel."
                  : "Continue where you left off, or explore new courses."}
              </p>
            </div>
          </div>

          {user.isAdmin && (
            <Link
              href="/admin"
              className="btn-tactile btn-tactile-green mt-6 inline-flex items-center gap-2 px-5 py-3 text-base"
            >
              <Trophy className="size-5" />
              Open Admin Panel
              <ArrowRight className="size-4" />
            </Link>
          )}
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 space-y-10">
        {/* Continue learning (empty state for new users) */}
        <section>
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-heading text-2xl font-bold tracking-tight flex items-center gap-2">
              <PlayCircle className="size-6 text-brand-blue" />
              Continue learning
            </h2>
          </div>

          <div className="rounded-2xl border border-dashed border-border bg-background p-8 sm:p-12 text-center">
            <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-blue/10 text-brand-blue">
              <GraduationCap className="size-7" />
            </span>
            <h3 className="mt-4 font-heading text-xl font-bold">
              You haven't joined a cohort yet
            </h3>
            <p className="mt-2 text-foreground/60 font-medium max-w-md mx-auto">
              Browse our cohort-based courses and reserve your seat. Your
              progress will show up here once you enroll.
            </p>
            <Link
              href="/courses"
              className="btn-tactile btn-tactile-primary mt-5 inline-flex items-center gap-2 px-5 py-3 text-base"
            >
              Browse courses
              <ArrowRight className="size-4" />
            </Link>
          </div>
        </section>

        {/* Recommended courses */}
        <section>
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-heading text-2xl font-bold tracking-tight flex items-center gap-2">
              <Sparkles className="size-6 text-brand-green" />
              Recommended for you
            </h2>
            <Link
              href="/courses"
              className="text-sm font-semibold text-brand-blue hover:text-brand-blue/80 cursor-pointer"
            >
              View all →
            </Link>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {recommended.map((c) => (
              <Link
                key={c.id}
                href="/courses"
                className="group flex flex-col rounded-2xl border border-border bg-background p-5 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer"
              >
                <span
                  className={`inline-flex w-fit items-center rounded-full px-2.5 py-0.5 text-xs font-mono-display font-semibold uppercase tracking-wider ${
                    c.accent === "green"
                      ? "bg-brand-green/10 text-brand-green"
                      : "bg-brand-blue/10 text-brand-blue"
                  }`}
                >
                  {c.level}
                </span>
                <h3 className="mt-3 font-heading text-lg font-bold tracking-tight">
                  {c.title}
                </h3>
                <p className="mt-1.5 text-sm text-foreground/60 font-medium leading-relaxed flex-1">
                  {c.tagline}
                </p>
                <div className="mt-4 flex items-center justify-between">
                  <span className="text-sm font-bold">{c.priceLabel}</span>
                  <span className="text-xs text-muted-foreground font-medium flex items-center gap-1">
                    <Clock className="size-3.5" />
                    {c.durationWeeks}w
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* Two-column: certificates + upcoming events */}
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Certificates (empty state) */}
          <section className="rounded-2xl border border-border bg-background p-6">
            <h2 className="font-heading text-xl font-bold tracking-tight flex items-center gap-2 mb-4">
              <Award className="size-5 text-brand-blue" />
              My certificates
            </h2>
            <div className="rounded-xl border border-dashed border-border p-6 text-center">
              <Award className="mx-auto size-8 text-muted-foreground/40" />
              <p className="mt-2 text-sm text-foreground/60 font-medium">
                Complete a course to earn your first certificate.
              </p>
            </div>
          </section>

          {/* Upcoming events */}
          <section className="rounded-2xl border border-border bg-background p-6">
            <h2 className="font-heading text-xl font-bold tracking-tight flex items-center gap-2 mb-4">
              <CalendarDays className="size-5 text-brand-green" />
              Upcoming events
            </h2>
            <div className="space-y-3">
              {upcomingEvents.map((ev) => (
                <Link
                  key={ev.id}
                  href="/events"
                  className="flex items-start gap-3 rounded-xl p-3 hover:bg-muted/50 transition-colors cursor-pointer"
                >
                  <span
                    className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${
                      ev.accent === "green"
                        ? "bg-brand-green/10 text-brand-green"
                        : "bg-brand-blue/10 text-brand-blue"
                    }`}
                  >
                    <CalendarDays className="size-5" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold text-sm leading-snug truncate">
                      {ev.title}
                    </p>
                    <p className="text-xs text-muted-foreground font-medium mt-0.5">
                      {ev.date} · {ev.time}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        </div>

        {/* Quick actions */}
        <section>
          <h2 className="font-heading text-2xl font-bold tracking-tight mb-5">
            Quick actions
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <QuickAction
              href="/courses"
              icon={<BookOpen className="size-5" />}
              label="Browse courses"
              accent="blue"
            />
            <QuickAction
              href="/events"
              icon={<CalendarDays className="size-5" />}
              label="See events"
              accent="green"
            />
            <QuickAction
              href="/support/contact"
              icon={<Sparkles className="size-5" />}
              label="Get support"
              accent="blue"
            />
            <QuickAction
              href="/settings"
              icon={<Award className="size-5" />}
              label="Account settings"
              accent="green"
            />
          </div>
        </section>

        {/* Account summary */}
        <section className="rounded-2xl border border-border bg-background p-6">
          <h2 className="font-heading text-xl font-bold tracking-tight mb-4">
            Account
          </h2>
          <dl className="grid sm:grid-cols-3 gap-4 text-sm">
            <div>
              <dt className="text-muted-foreground font-medium">Email</dt>
              <dd className="font-semibold mt-0.5">{user.email}</dd>
            </div>
            <div>
              <dt className="text-muted-foreground font-medium">Display name</dt>
              <dd className="font-semibold mt-0.5">{user.displayName}</dd>
            </div>
            <div>
              <dt className="text-muted-foreground font-medium">Role</dt>
              <dd className="font-semibold mt-0.5">
                {user.isAdmin ? "Admin" : "Student"}
              </dd>
            </div>
          </dl>
        </section>
      </div>
    </div>
  );
}

function QuickAction({
  href,
  icon,
  label,
  accent,
}: {
  href: string;
  icon: React.ReactNode;
  label: string;
  accent: "blue" | "green";
}) {
  return (
    <Link
      href={href}
      className="group flex flex-col items-center justify-center gap-2 rounded-2xl border border-border bg-background p-5 hover:shadow-lg hover:-translate-y-0.5 transition-all cursor-pointer"
    >
      <span
        className={`flex h-11 w-11 items-center justify-center rounded-xl ${
          accent === "green"
            ? "bg-brand-green/10 text-brand-green"
            : "bg-brand-blue/10 text-brand-blue"
        }`}
      >
        {icon}
      </span>
      <span className="text-sm font-semibold text-center">{label}</span>
    </Link>
  );
}
