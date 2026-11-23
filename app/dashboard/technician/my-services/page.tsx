"use client";

import Link from "next/link";
import { useState } from "react";
import { Pencil, PlusCircle, Trash2, Wrench } from "lucide-react";
import { toast } from "sonner";
import { ConfirmDialog } from "@/components/dashboard/confirm-dialog";
import { PageHeader } from "@/components/dashboard/page-header";
import { ServiceForm } from "@/components/dashboard/service-form";
import { EmptyState, ErrorState, TableSkeleton } from "@/components/dashboard/states";
import { ServiceImage } from "@/components/services/service-image";
import { ApprovalBadge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { Table, TableWrap, TD, TH, THead, TR } from "@/components/ui/table";
import { useApi } from "@/hooks/use-api";
import { api } from "@/lib/api";
import { formatCurrency } from "@/lib/utils";
import type { Service } from "@/lib/types";

export default function MyServicesPage() {
  const { data, setData, loading, error, reload } = useApi<Service[]>("/api/services/mine");
  const services = data ?? [];
  const [editing, setEditing] = useState<Service | null>(null);
  const [deleting, setDeleting] = useState<Service | null>(null);
  const [busy, setBusy] = useState(false);

  async function toggle(s: Service, value: boolean) {
    const before = data;
    setData((cur) => cur?.map((x) => (x._id === s._id ? { ...x, isAvailable: value } : x)));
    try {
      await api.patch(`/api/services/${s._id}/availability`, { isAvailable: value });
      toast.success(value ? "Service is now visible to customers" : "Service hidden from public pages");
    } catch (e) {
      setData(before);
      toast.error(e instanceof Error ? e.message : "Could not change availability");
    }
  }

  async function remove() {
    if (!deleting) return;
    setBusy(true);
    try {
      await api.delete(`/api/services/${deleting._id}`);
      toast.success("Service deleted");
      setDeleting(null);
      reload(true);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Could not delete the service");
    } finally {
      setBusy(false);
    }
  }

  return (
    <>
      <PageHeader
        title="My Services"
        description="Edit, hide or remove your listings. Edited services go back to the admin for approval."
        action={<Button asChild><Link href="/dashboard/technician/add-service"><PlusCircle /> Add a service</Link></Button>}
      />

      {error ? (
        <ErrorState message={error} onRetry={() => reload()} />
      ) : loading ? (
        <TableSkeleton />
      ) : services.length === 0 ? (
        <EmptyState icon={Wrench} title="You haven't listed anything yet" description="Add your first repair service. Once an admin approves it, customers can find and book it." ctaHref="/dashboard/technician/add-service" ctaLabel="Add a service" />
      ) : (
        <TableWrap>
          <Table className="min-w-[860px]">
            <THead>
              <tr>
                <TH>Service</TH>
                <TH>Category</TH>
                <TH>Price</TH>
                <TH>Approval</TH>
                <TH>Available</TH>
                <TH className="text-right">Actions</TH>
              </tr>
            </THead>
            <tbody>
              {services.map((s) => (
                <TR key={s._id}>
                  <TD>
                    <div className="flex items-center gap-3">
                      <ServiceImage src={s.image} alt="" category={s.category} sizes="56px" className="size-14 shrink-0 rounded-xl" />
                      <p className="max-w-[220px] truncate font-semibold">{s.title}</p>
                    </div>
                  </TD>
                  <TD>{s.category}</TD>
                  <TD className="font-semibold">{formatCurrency(s.basePrice)}</TD>
                  <TD><ApprovalBadge status={s.approvalStatus} /></TD>
                  <TD>
                    <Switch checked={s.isAvailable} onCheckedChange={(v) => toggle(s, v)} aria-label={`Toggle availability of ${s.title}`} />
                  </TD>
                  <TD>
                    <div className="flex justify-end gap-2">
                      <Button variant="outline" size="sm" onClick={() => setEditing(s)}><Pencil /> Edit</Button>
                      <Button variant="outline" size="sm" className="text-destructive" onClick={() => setDeleting(s)}><Trash2 /> Delete</Button>
                    </div>
                  </TD>
                </TR>
              ))}
            </tbody>
          </Table>
        </TableWrap>
      )}

      <Dialog open={!!editing} onOpenChange={(o) => !o && setEditing(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit service</DialogTitle>
            <DialogDescription>Saving sends the listing back to the admin for approval.</DialogDescription>
          </DialogHeader>
          {editing && (
            <ServiceForm
              service={editing}
              onSaved={() => {
                setEditing(null);
                reload(true);
              }}
            />
          )}
        </DialogContent>
      </Dialog>

      <ConfirmDialog
        open={!!deleting}
        onOpenChange={(o) => !o && setDeleting(null)}
        title="Delete this service?"
        description={`"${deleting?.title}" will be removed permanently. Existing bookings keep their own copy of the details.`}
        confirmLabel="Delete service"
        destructive
        loading={busy}
        onConfirm={remove}
      />
    </>
  );
}
