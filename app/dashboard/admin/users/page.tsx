"use client";

import { useState } from "react";
import { Users } from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "@/components/dashboard/page-header";
import { EmptyState, ErrorState, TableSkeleton } from "@/components/dashboard/states";
import { RoleBadge } from "@/components/ui/badge";
import { Table, TableWrap, TD, TH, THead, TR } from "@/components/ui/table";
import { UserAvatar } from "@/components/ui/user-avatar";
import { useApi } from "@/hooks/use-api";
import { api } from "@/lib/api";
import { authClient } from "@/lib/auth-client";
import { formatDate } from "@/lib/utils";
import type { AppUser, Role } from "@/lib/types";

export default function AdminUsersPage() {
  const { data, setData, loading, error, reload } = useApi<AppUser[]>("/api/admin/users");
  const { data: session } = authClient.useSession();
  const [busyId, setBusyId] = useState<string | null>(null);
  const users = data ?? [];

  async function changeRole(u: AppUser, role: Role) {
    if (role === u.role) return;
    setBusyId(u._id);
    try {
      await api.patch(`/api/admin/users/${u._id}/role`, { role });
      setData((cur) => cur?.map((x) => (x._id === u._id ? { ...x, role } : x)));
      toast.success(`${u.name} is now a ${role}`);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Could not change the role");
    } finally {
      setBusyId(null);
    }
  }

  return (
    <>
      <PageHeader title="Manage Users" description="Change roles for customers and technicians. You can't change your own role." />
      {error ? (
        <ErrorState message={error} onRetry={() => reload()} />
      ) : loading ? (
        <TableSkeleton />
      ) : users.length === 0 ? (
        <EmptyState icon={Users} title="No users yet" description="Accounts appear here as soon as people sign up." />
      ) : (
        <TableWrap>
          <Table>
            <THead>
              <tr>
                <TH>User</TH>
                <TH>Email</TH>
                <TH>Role</TH>
                <TH>Change role</TH>
                <TH>Joined</TH>
              </tr>
            </THead>
            <tbody>
              {users.map((u) => {
                const self = u.email === session?.user.email;
                return (
                  <TR key={u._id}>
                    <TD>
                      <div className="flex items-center gap-3">
                        <UserAvatar src={u.image} name={u.name} />
                        <span className="font-semibold">{u.name}{self && <span className="ml-2 text-xs font-normal text-muted-foreground">(you)</span>}</span>
                      </div>
                    </TD>
                    <TD className="text-muted-foreground">{u.email}</TD>
                    <TD><RoleBadge role={u.role} /></TD>
                    <TD>
                      <div className="w-40">
                        <select
                          aria-label={`Role for ${u.name}`}
                          value={u.role}
                          disabled={self || busyId === u._id}
                          title={self ? "You can't change your own role" : undefined}
                          onChange={(e) => changeRole(u, e.target.value as Role)}
                          className="h-9 w-full rounded-lg border border-input bg-transparent px-2.5 text-sm"
                        >
                          <option value="customer">Customer</option>
                          <option value="technician">Technician</option>
                          <option value="admin">Admin</option>
                        </select>
                      </div>
                    </TD>
                    <TD className="whitespace-nowrap">{formatDate(u.createdAt)}</TD>
                  </TR>
                );
              })}
            </tbody>
          </Table>
        </TableWrap>
      )}
    </>
  );
}
