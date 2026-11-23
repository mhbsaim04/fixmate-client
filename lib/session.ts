import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "./auth";
import { roleHome } from "./constants";
import type { Role } from "./types";

export async function getServerSession() {
  return auth.api.getSession({ headers: await headers() });
}

/** Server-side guard used by dashboard layouts. Wrong role → own dashboard, no session → /sign-in. */
export async function requireRole(roles: Role[]) {
  const session = await getServerSession();
  if (!session) redirect("/sign-in");
  const role = ((session.user as { role?: string }).role ?? "customer") as Role;
  if (!roles.includes(role)) redirect(roleHome(role));
  return { session, role };
}
