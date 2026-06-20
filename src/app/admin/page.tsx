import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { AdminPanel } from "@/components/sariro/admin/admin-panel";
import { COURSES, EVENTS } from "@/lib/data";
import { SUPPORT_PAGES } from "@/lib/support";

export const metadata = {
  title: "Admin Panel — Sariro",
  description: "Manage users, courses, events, and content.",
};

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const user = await getCurrentUser();

  // Auth guard: must be logged in + admin
  if (!user) redirect("/login");
  if (!user.isAdmin) redirect("/dashboard");

  return (
    <AdminPanel
      user={user}
      initialCourses={COURSES}
      initialEvents={EVENTS}
      initialPages={SUPPORT_PAGES}
    />
  );
}
