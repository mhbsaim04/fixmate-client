import { redirect } from "next/navigation";
import { roleHome } from "@/lib/constants";
import { requireRole } from "@/lib/session";

/** /dashboard sends each person to their own dashboard. */
export default async function DashboardIndex() {
  const { role } = await requireRole(["customer", "technician", "admin"]);
  redirect(roleHome(role));
}
