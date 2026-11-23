import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { requireRole } from "@/lib/session";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { session, role } = await requireRole(["customer", "technician", "admin"]);
  return (
    <DashboardShell role={role} initialUser={{ name: session.user.name, image: session.user.image }}>
      {children}
    </DashboardShell>
  );
}
