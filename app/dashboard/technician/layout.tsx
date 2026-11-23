import { requireRole } from "@/lib/session";

/** Wrong role? requireRole sends the person to their own dashboard. */
export default async function TechnicianLayout({ children }: { children: React.ReactNode }) {
  await requireRole(["technician"]);
  return <>{children}</>;
}
