import { requireRole } from "@/lib/session";

/** Wrong role? requireRole sends the person to their own dashboard. */
export default async function CustomerLayout({ children }: { children: React.ReactNode }) {
  await requireRole(["customer"]);
  return <>{children}</>;
}
