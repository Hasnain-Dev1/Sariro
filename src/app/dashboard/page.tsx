import { redirect } from "next/navigation";
import Link from "next/link";
import { getCurrentUser } from "@/lib/auth";
import { COURSES, EVENTS } from "@/lib/data";
import {
  GraduationCap, Clock, CalendarDays, Award, ArrowRight, Sparkles,
  BookOpen, Trophy, PlayCircle, Users, Briefcase, Shield, TrendingUp,
  FileText, MessageSquare, LifeBuoy, BarChart3, UserCheck,
} from "lucide-react";

export const metadata = { title: "Dashboard — Sariro" };
export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const role = user.role || (user.isAdmin ? "admin" : "student");

  return (
    <div className="min-h-screen bg-brand-panel">
      {/* Greeting header */}
      <section className="border-b border-border bg-background">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
          <div className="flex items-center gap-4">
            <span className={`flex h-14 w-14 sm:h-16 sm:w-16 items-center justify-center rounded-2xl font-heading text-2xl sm:text-3xl font-extrabold text-white shadow-lg ${role === "admin" ? "bg-brand-green" : role === "teacher" ? "bg-amber-500" : "bg-brand-blue"}`}>
              {user.avatarInitial}
            </span>
            <div>
              <p className="font-mono-display text-xs uppercase tracking-wider text-muted-foreground">
                {getGreeting()}
              </p>
              <h1 className="font-heading text-3xl sm:text-4xl font-extrabold tracking-tight">
                {user.displayName} 👋
              </h1>
              <p className="mt-1 text-foreground/60 font-medium">
                {role === "admin"
                  ? "Admin access — manage the platform from the admin panel."
                  : role === "teacher"
                  ? "Teacher dashboard — manage your cohorts and students."
                  : "Continue where you left off, or explore new courses."}
              </p>
            </div>
          </div>

          {role === "admin" && (
            <Link href="/admin" className="btn-tactile btn-tactile-green mt-6 inline-flex items-center gap-2 px-5 py-3 text-base">
              <Shield className="size-5" /> Open Admin Panel <ArrowRight className="size-4" />
            </Link>
          )}
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 space-y-10">
        {role === "student" && <StudentView />}
        {role === "teacher" && <TeacherView userName={user.displayName} />}
        {role === "admin" && <AdminView />}
      </div>
    </div>
  );
}

function getGreeting() {
  const h = new Date().getHours();
  return h < 12 ? "Good morning" : h < 18 ? "Good afternoon" : "Good evening";
}

// ════════════════════════════════════════════════════════════════════════════
// STUDENT VIEW
// ════════════════════════════════════════════════════════════════════════════
function StudentView() {
  const recommended = COURSES.filter((c) => c.featured).slice(0, 3);
  const upcomingEvents = EVENTS.slice(0, 3);

  return (
    <>
      {/* Continue learning (demo: 2 enrolled courses with progress) */}
      <section>
        <h2 className="font-heading text-2xl font-bold tracking-tight flex items-center gap-2 mb-5">
          <PlayCircle className="size-6 text-brand-blue" /> Continue learning
        </h2>
        <div className="grid sm:grid-cols-2 gap-5">
          {/* Demo enrolled course 1 */}
          <EnrolledCourseCard
            title="AI Literacy Fundamentals"
            module="Module 3 of 6"
            progress={60}
            accent="blue"
          />
          {/* Demo enrolled course 2 */}
          <EnrolledCourseCard
            title="Python for Thinkers"
            module="Module 1 of 10"
            progress={10}
            accent="green"
          />
        </div>
      </section>

      {/* Recommended */}
      <section>
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-heading text-2xl font-bold tracking-tight flex items-center gap-2">
            <Sparkles className="size-6 text-brand-green" /> Recommended for you
          </h2>
          <Link href="/courses" className="text-sm font-semibold text-brand-blue hover:text-brand-blue/80 cursor-pointer">View all →</Link>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {recommended.map((c) => (
            <Link key={c.id} href="/courses" className="group flex flex-col rounded-2xl border border-border bg-background p-5 shadow-sm hover:shadow-xl transition-all hover:-translate-y-1 cursor-pointer">
              <span className={`inline-flex w-fit items-center rounded-full px-2.5 py-0.5 text-xs font-mono-display font-semibold uppercase tracking-wider ${c.accent === "green" ? "bg-brand-green/10 text-brand-green" : "bg-brand-blue/10 text-brand-blue"}`}>{c.level}</span>
              <h3 className="mt-3 font-heading text-lg font-bold tracking-tight">{c.title}</h3>
              <p className="mt-1.5 text-sm text-foreground/60 font-medium leading-relaxed flex-1">{c.tagline}</p>
              <div className="mt-4 flex items-center justify-between">
                <span className="text-sm font-bold">{c.priceLabel}</span>
                <span className="text-xs text-muted-foreground font-medium flex items-center gap-1"><Clock className="size-3.5" />{c.durationWeeks}w</span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Stats + events */}
      <div className="grid lg:grid-cols-2 gap-6">
        <section className="rounded-2xl border border-border bg-background p-6">
          <h2 className="font-heading text-xl font-bold tracking-tight flex items-center gap-2 mb-4">
            <Award className="size-5 text-brand-blue" /> My certificates
          </h2>
          <div className="rounded-xl border border-dashed border-border p-6 text-center">
            <Award className="mx-auto size-8 text-muted-foreground/40" />
            <p className="mt-2 text-sm text-foreground/60 font-medium">Complete a course to earn your first certificate.</p>
          </div>
        </section>
        <section className="rounded-2xl border border-border bg-background p-6">
          <h2 className="font-heading text-xl font-bold tracking-tight flex items-center gap-2 mb-4">
            <CalendarDays className="size-5 text-brand-green" /> Upcoming events
          </h2>
          <div className="space-y-3">
            {upcomingEvents.map((ev) => (
              <Link key={ev.id} href="/events" className="flex items-start gap-3 rounded-xl p-3 hover:bg-muted/50 transition-colors cursor-pointer">
                <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${ev.accent === "green" ? "bg-brand-green/10 text-brand-green" : "bg-brand-blue/10 text-brand-blue"}`}>
                  <CalendarDays className="size-5" />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="font-semibold text-sm leading-snug truncate">{ev.title}</p>
                  <p className="text-xs text-muted-foreground font-medium mt-0.5">{ev.date} · {ev.time}</p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      </div>

      <QuickActions />
    </>
  );
}

function EnrolledCourseCard({ title, module, progress, accent }: { title: string; module: string; progress: number; accent: "blue" | "green" }) {
  return (
    <div className="rounded-2xl border border-border bg-background p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <h3 className="font-heading font-bold text-base">{title}</h3>
        <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase ${accent === "green" ? "bg-brand-green/10 text-brand-green" : "bg-brand-blue/10 text-brand-blue"}`}>Active</span>
      </div>
      <p className="text-xs text-muted-foreground font-medium mt-1">{module}</p>
      <div className="mt-4">
        <div className="flex items-center justify-between text-xs font-semibold mb-1.5">
          <span>{progress}% complete</span>
          <span>{100 - progress}% to go</span>
        </div>
        <div className="h-2.5 rounded-full bg-muted overflow-hidden">
          <div className={`h-full rounded-full ${accent === "green" ? "bg-brand-green" : "bg-brand-blue"}`} style={{ width: `${progress}%` }} />
        </div>
      </div>
      <button className={`btn-tactile mt-4 w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 text-sm ${accent === "green" ? "btn-tactile-green" : "btn-tactile-primary"}`}>
        <PlayCircle className="size-4" /> {progress > 0 ? "Resume" : "Start"} <ArrowRight className="size-4" />
      </button>
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════════════
// TEACHER VIEW
// ════════════════════════════════════════════════════════════════════════════
function TeacherView({ userName }: { userName: string }) {
  return (
    <>
      {/* Stats */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={<BookOpen className="size-5" />} label="My cohorts" value="3" accent="blue" />
        <StatCard icon={<Users className="size-5" />} label="Total students" value="78" accent="green" />
        <StatCard icon={<FileText className="size-5" />} label="Pending submissions" value="5" accent="blue" />
        <StatCard icon={<CalendarDays className="size-5" />} label="Sessions this week" value="4" accent="green" />
      </div>

      {/* My cohorts (demo) */}
      <section>
        <h2 className="font-heading text-2xl font-bold tracking-tight flex items-center gap-2 mb-5">
          <BookOpen className="size-6 text-brand-blue" /> My cohorts
        </h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          <CohortCard title="AI Literacy Fundamentals" students={28} next="Jan 14, 7:00 PM" accent="blue" />
          <CohortCard title="Building with LLMs" students={22} next="Jan 15, 8:00 PM" accent="green" />
          <CohortCard title="Python for Thinkers" students={28} next="Jan 18, 11:00 AM" accent="blue" />
        </div>
      </section>

      {/* Schedule + submissions */}
      <div className="grid lg:grid-cols-2 gap-6">
        <section className="rounded-2xl border border-border bg-background p-6">
          <h2 className="font-heading text-xl font-bold tracking-tight flex items-center gap-2 mb-4">
            <CalendarDays className="size-5 text-brand-green" /> This week's schedule
          </h2>
          <div className="space-y-3">
            <ScheduleItem day="Mon 14" time="7:00 PM" title="AI Literacy · Module 4" />
            <ScheduleItem day="Wed 15" time="8:00 PM" title="LLMs · Module 2" />
            <ScheduleItem day="Fri 17" time="7:00 PM" title="AI Literacy · Module 5" />
            <ScheduleItem day="Sat 18" time="11:00 AM" title="Python · Module 3" />
          </div>
        </section>
        <section className="rounded-2xl border border-border bg-background p-6">
          <h2 className="font-heading text-xl font-bold tracking-tight flex items-center gap-2 mb-4">
            <FileText className="size-5 text-amber-500" /> Pending submissions
          </h2>
          <div className="space-y-2">
            <SubmissionItem name="Sarah J." course="AI Literacy" project="Capstone: AI Tool" />
            <SubmissionItem name="Marcus L." course="LLMs" project="RAG Pipeline" />
            <SubmissionItem name="Aisha R." course="Python" project="Quiz Game" />
          </div>
        </section>
      </div>

      <QuickActions />
    </>
  );
}

function CohortCard({ title, students, next, accent }: { title: string; students: number; next: string; accent: "blue" | "green" }) {
  return (
    <div className="rounded-2xl border border-border bg-background p-5 shadow-sm">
      <span className={`inline-flex w-fit items-center rounded-full px-2.5 py-0.5 text-xs font-mono-display font-semibold uppercase ${accent === "green" ? "bg-brand-green/10 text-brand-green" : "bg-brand-blue/10 text-brand-blue"}`}>Active</span>
      <h3 className="mt-3 font-heading font-bold text-base">{title}</h3>
      <div className="mt-2 flex items-center gap-4 text-xs text-muted-foreground font-medium">
        <span className="inline-flex items-center gap-1"><Users className="size-3.5" />{students} students</span>
        <span className="inline-flex items-center gap-1"><Clock className="size-3.5" />{next}</span>
      </div>
      <button className={`btn-tactile mt-4 w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 text-sm ${accent === "green" ? "btn-tactile-green" : "btn-tactile-primary"}`}>
        View cohort <ArrowRight className="size-4" />
      </button>
    </div>
  );
}

function ScheduleItem({ day, time, title }: { day: string; time: string; title: string }) {
  return (
    <div className="flex items-center gap-3 rounded-xl p-3 hover:bg-muted/50 transition-colors">
      <div className="flex flex-col items-center justify-center w-14 h-14 rounded-lg bg-brand-blue/10 text-brand-blue shrink-0">
        <span className="text-[10px] font-bold uppercase">{day.split(" ")[0]}</span>
        <span className="font-heading text-lg font-extrabold leading-none">{day.split(" ")[1]}</span>
      </div>
      <div className="min-w-0 flex-1">
        <p className="font-semibold text-sm">{title}</p>
        <p className="text-xs text-muted-foreground font-medium">{time}</p>
      </div>
    </div>
  );
}

function SubmissionItem({ name, course, project }: { name: string; course: string; project: string }) {
  return (
    <div className="flex items-center justify-between rounded-xl border border-border p-3">
      <div className="min-w-0">
        <p className="font-semibold text-sm">{name}</p>
        <p className="text-xs text-muted-foreground font-medium">{course} · {project}</p>
      </div>
      <button className="rounded-lg bg-amber-50 px-3 py-1.5 text-xs font-semibold text-amber-700 hover:bg-amber-100 cursor-pointer">Grade</button>
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════════════
// ADMIN VIEW
// ════════════════════════════════════════════════════════════════════════════
function AdminView() {
  return (
    <>
      {/* KPIs */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={<Users className="size-5" />} label="Total users" value="142" accent="blue" />
        <StatCard icon={<BookOpen className="size-5" />} label="Active courses" value="8" accent="green" />
        <StatCard icon={<TrendingUp className="size-5" />} label="Enrollments" value="98" accent="blue" />
        <StatCard icon={<LifeBuoy className="size-5" />} label="New inquiries" value="12" accent="green" />
      </div>

      {/* Quick admin actions */}
      <section>
        <h2 className="font-heading text-2xl font-bold tracking-tight flex items-center gap-2 mb-5">
          <BarChart3 className="size-6 text-brand-blue" /> Platform management
        </h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <AdminAction href="/admin" icon={<Users className="size-5" />} label="Manage users" desc="Promote teachers, ban accounts" accent="blue" />
          <AdminAction href="/admin" icon={<BookOpen className="size-5" />} label="Edit courses" desc="Update catalog & pricing" accent="green" />
          <AdminAction href="/admin" icon={<FileText className="size-5" />} label="Edit content" desc="Support pages & blog" accent="blue" />
          <AdminAction href="/admin" icon={<CalendarDays className="size-5" />} label="Manage events" desc="Cohorts & webinars" accent="green" />
          <AdminAction href="/admin" icon={<LifeBuoy className="size-5" />} label="View inquiries" desc="Contact form submissions" accent="blue" />
          <AdminAction href="/admin" icon={<MessageSquare className="size-5" />} label="Chat logs" desc="Review bot conversations" accent="green" />
        </div>
      </section>

      <QuickActions />
    </>
  );
}

// ════════════════════════════════════════════════════════════════════════════
// SHARED COMPONENTS
// ════════════════════════════════════════════════════════════════════════════
function StatCard({ icon, label, value, accent }: { icon: React.ReactNode; label: string; value: string; accent: "blue" | "green" }) {
  return (
    <div className="rounded-2xl border border-border bg-background p-5 shadow-sm">
      <span className={`flex h-10 w-10 items-center justify-center rounded-xl ${accent === "green" ? "bg-brand-green/10 text-brand-green" : "bg-brand-blue/10 text-brand-blue"}`}>{icon}</span>
      <p className="mt-3 font-heading text-3xl font-extrabold tracking-tight">{value}</p>
      <p className="text-sm font-semibold text-foreground">{label}</p>
    </div>
  );
}

function AdminAction({ href, icon, label, desc, accent }: { href: string; icon: React.ReactNode; label: string; desc: string; accent: "blue" | "green" }) {
  return (
    <Link href={href} className="group flex flex-col rounded-2xl border border-border bg-background p-5 hover:shadow-lg hover:-translate-y-0.5 transition-all cursor-pointer">
      <span className={`flex h-11 w-11 items-center justify-center rounded-xl ${accent === "green" ? "bg-brand-green/10 text-brand-green" : "bg-brand-blue/10 text-brand-blue"}`}>{icon}</span>
      <p className="mt-3 font-heading font-bold text-sm">{label}</p>
      <p className="text-xs text-muted-foreground font-medium mt-0.5">{desc}</p>
    </Link>
  );
}

function QuickActions() {
  return (
    <section>
      <h2 className="font-heading text-2xl font-bold tracking-tight mb-5">Quick actions</h2>
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <QuickAction href="/courses" icon={<BookOpen className="size-5" />} label="Browse courses" accent="blue" />
        <QuickAction href="/events" icon={<CalendarDays className="size-5" />} label="See events" accent="green" />
        <QuickAction href="/support/contact" icon={<LifeBuoy className="size-5" />} label="Get support" accent="blue" />
        <QuickAction href="/settings" icon={<UserCheck className="size-5" />} label="Account settings" accent="green" />
      </div>
    </section>
  );
}

function QuickAction({ href, icon, label, accent }: { href: string; icon: React.ReactNode; label: string; accent: "blue" | "green" }) {
  return (
    <Link href={href} className="group flex flex-col items-center justify-center gap-2 rounded-2xl border border-border bg-background p-5 hover:shadow-lg hover:-translate-y-0.5 transition-all cursor-pointer">
      <span className={`flex h-11 w-11 items-center justify-center rounded-xl ${accent === "green" ? "bg-brand-green/10 text-brand-green" : "bg-brand-blue/10 text-brand-blue"}`}>{icon}</span>
      <span className="text-sm font-semibold text-center">{label}</span>
    </Link>
  );
}
