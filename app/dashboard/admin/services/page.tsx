"use client";

import { useState } from "react";
import { Check, ListChecks, X } from "lucide-react";
import { toast } from "sonner";
import { ConfirmDialog } from "@/components/dashboard/confirm-dialog";
import { FilterTabs } from "@/components/dashboard/filter-tabs";
import { PageHeader } from "@/components/dashboard/page-header";
import { EmptyState, ErrorState, TableSkeleton } from "@/components/dashboard/states";
import { ServiceImage } from "@/components/services/service-image";
import { ApprovalBadge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableWrap, TD, TH, THead, TR } from "@/components/ui/table";
import { useApi } from "@/hooks/use-api";
import { api } from "@/lib/api";
import { formatCurrency } from "@/lib/utils";
import type { ApprovalStatus, Service } from "@/lib/types";

type Filter = "all" | ApprovalStatus;

export default function AdminServicesPage() {
  const { data, setData, loading, error, reload } = useApi<Service[]>("/api/admin/services");
  const [filter, setFilter] = useState<Filter>("pending"); // pending first, as the brief asks
  const [busyId, setBusyId] = useState<string | null>(null);
  const [rejecting, setRejecting] = useState<Service | null>(null);
  const services = data ?? [];
  const visible = filter === "all" ? services : services.filter((s) => s.approvalStatus === filter);
  const count = (f: Filter) => (f === "all" ? services.length : services.filter((s) => s.approvalStatus === f).length);

  async function decide(s: Service, approvalStatus: "approved" | "rejected") {
    setBusyId(s._id);
    try {
      await api.patch(`/api/admin/services/${s._id}/approval`, { approvalStatus });
      setData((cur) => cur?.map((x) => (x._id === s._id ? { ...x, approvalStatus } : x)));
      toast.success(approvalStatus === "approved" ? "Service approved and live" : "Service rejected");
      return true;
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Could not update the service");
      return false;
    } finally {
      setBusyId(null);
    }
  }

  return (
    <>
      <PageHeader title="Service Approval" description="Only approved and available services appear on public pages." />
      <div className="mb-6">
        <FilterTabs<Filter>
          value={filter}
          onChange={setFilter}
          options={[
            { value: "pending", label: "Pending", count: count("pending") },
            { value: "approved", label: "Approved", count: count("approved") },
            { value: "rejected", label: "Rejected", count: count("rejected") },
            { value: "all", label: "All", count: count("all") },
          ]}
        />
      </div>

      {error ? (
        <ErrorState message={error} onRetry={() => reload()} />
      ) : loading ? (
        <TableSkeleton />
      ) : visible.length === 0 ? (
        <EmptyState icon={ListChecks} title={filter === "pending" ? "Review queue is clear" : "Nothing here"} description="Services submitted by technicians will show up for review." />
      ) : (
        <TableWrap>
          <Table className="min-w-[900px]">
            <THead>
              <tr>
                <TH>Service</TH>
                <TH>Technician</TH>
                <TH>Category</TH>
                <TH>Price</TH>
                <TH>Status</TH>
                <TH className="text-right">Decision</TH>
              </tr>
            </THead>
            <tbody>
              {visible.map((s) => (
                <TR key={s._id}>
                  <TD>
                    <div className="flex items-center gap-3">
                      <ServiceImage src={s.image} alt="" category={s.category} sizes="56px" className="size-14 shrink-0 rounded-xl" />
                      <div className="min-w-0">
                        <p className="max-w-[220px] truncate font-semibold">{s.title}</p>
                        <p className="text-xs text-muted-foreground">{s.serviceMode} · {s.serviceArea}</p>
                      </div>
                    </div>
                  </TD>
                  <TD>
                    <p className="font-medium">{s.technicianName}</p>
                    <p className="text-xs text-muted-foreground">{s.technicianEmail}</p>
                  </TD>
                  <TD>{s.category}</TD>
                  <TD className="font-semibold">{formatCurrency(s.basePrice)}</TD>
                  <TD><ApprovalBadge status={s.approvalStatus} /></TD>
                  <TD>
                    <div className="flex justify-end gap-2">
                      {s.approvalStatus !== "approved" && (
                        <Button size="sm" loading={busyId === s._id} onClick={() => decide(s, "approved")}><Check /> Approve</Button>
                      )}
                      {s.approvalStatus !== "rejected" && (
                        <Button size="sm" variant="outline" className="text-destructive" disabled={busyId === s._id} onClick={() => setRejecting(s)}><X /> Reject</Button>
                      )}
                    </div>
                  </TD>
                </TR>
              ))}
            </tbody>
          </Table>
        </TableWrap>
      )}

      <ConfirmDialog
        open={!!rejecting}
        onOpenChange={(o) => !o && setRejecting(null)}
        title="Reject this service?"
        description={`"${rejecting?.title}" will be hidden from public pages. The technician can edit it and send it back for review.`}
        confirmLabel="Reject service"
        destructive
        loading={busyId === rejecting?._id}
        onConfirm={async () => {
          if (rejecting && (await decide(rejecting, "rejected"))) setRejecting(null);
        }}
      />
    </>
  );
}
