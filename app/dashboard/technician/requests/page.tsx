"use client";

import { useState } from "react";
import { Briefcase, Check, Hammer, Play, X } from "lucide-react";
import { toast } from "sonner";
import { ConfirmDialog } from "@/components/dashboard/confirm-dialog";
import { FilterTabs } from "@/components/dashboard/filter-tabs";
import { PageHeader } from "@/components/dashboard/page-header";
import { EmptyState, ErrorState, TableSkeleton } from "@/components/dashboard/states";
import { PaymentBadge, StatusBadge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Table, TableWrap, TD, TH, THead, TR } from "@/components/ui/table";
import { useApi } from "@/hooks/use-api";
import { api } from "@/lib/api";
import { formatDate } from "@/lib/utils";
import type { Booking, BookingStatus } from "@/lib/types";

type Filter = "all" | "requested" | "accepted" | "in-progress" | "completed";

export default function TechnicianRequestsPage() {
  const { data, loading, error, reload } = useApi<Booking[]>("/api/bookings/technician");
  const jobs = data ?? [];
  const [filter, setFilter] = useState<Filter>("all");
  const [busyId, setBusyId] = useState<string | null>(null);
  const [rejecting, setRejecting] = useState<Booking | null>(null);
  const [completing, setCompleting] = useState<Booking | null>(null);
  const [amount, setAmount] = useState("");

  const visible = filter === "all" ? jobs : jobs.filter((j) => j.status === filter);
  const count = (s: Filter) => (s === "all" ? jobs.length : jobs.filter((j) => j.status === s).length);

  async function update(b: Booking, status: BookingStatus, finalAmount?: number, success?: string) {
    setBusyId(b._id);
    try {
      await api.patch(`/api/bookings/${b._id}/status`, { status, ...(finalAmount ? { finalAmount } : {}) });
      toast.success(success ?? "Job updated");
      await reload(true);
      return true;
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Could not update the job");
      return false;
    } finally {
      setBusyId(null);
    }
  }

  async function submitComplete() {
    if (!completing) return;
    const value = Number(amount);
    if (!(value > 0)) return toast.error("Enter a final amount greater than 0");
    if (await update(completing, "completed", value, "Job marked completed. The customer can now pay.")) setCompleting(null);
  }

  const actions = (b: Booking) => {
    const loadingNow = busyId === b._id;
    if (b.status === "requested")
      return (
        <div className="flex justify-end gap-2">
          <Button size="sm" loading={loadingNow} onClick={() => update(b, "accepted", undefined, "Request accepted")}><Check /> Accept</Button>
          <Button size="sm" variant="outline" className="text-destructive" disabled={loadingNow} onClick={() => setRejecting(b)}><X /> Reject</Button>
        </div>
      );
    if (b.status === "accepted")
      return <div className="flex justify-end"><Button size="sm" loading={loadingNow} onClick={() => update(b, "in-progress", undefined, "Work started")}><Play /> Start Work</Button></div>;
    if (b.status === "in-progress")
      return <div className="flex justify-end"><Button size="sm" variant="accent" onClick={() => { setCompleting(b); setAmount(String(b.basePrice)); }}><Hammer /> Mark Completed</Button></div>;
    if (b.status === "completed") return <div className="flex justify-end"><PaymentBadge status={b.paymentStatus} /></div>;
    return <span className="block text-right text-xs text-muted-foreground">No actions</span>;
  };

  return (
    <>
      <PageHeader title="Manage Requests" description="Move each job forward one step at a time. Completed jobs are paid by the customer." />
      <div className="mb-6">
        <FilterTabs<Filter>
          value={filter}
          onChange={setFilter}
          options={[
            { value: "all", label: "All", count: count("all") },
            { value: "requested", label: "Requested", count: count("requested") },
            { value: "accepted", label: "Accepted", count: count("accepted") },
            { value: "in-progress", label: "In Progress", count: count("in-progress") },
            { value: "completed", label: "Completed", count: count("completed") },
          ]}
        />
      </div>

      {error ? (
        <ErrorState message={error} onRetry={() => reload()} />
      ) : loading ? (
        <TableSkeleton />
      ) : visible.length === 0 ? (
        <EmptyState icon={Briefcase} title={filter === "all" ? "No requests yet" : "Nothing in this stage"} description="When customers request one of your approved services, the jobs show up here." ctaHref="/dashboard/technician/my-services" ctaLabel="Check my services" />
      ) : (
        <TableWrap>
          <Table className="min-w-[1100px]">
            <THead>
              <tr>
                <TH>Customer</TH>
                <TH>Phone</TH>
                <TH>Address</TH>
                <TH>Preferred date</TH>
                <TH>Problem</TH>
                <TH>Service</TH>
                <TH>Status</TH>
                <TH className="text-right">Actions</TH>
              </tr>
            </THead>
            <tbody>
              {visible.map((b) => (
                <TR key={b._id}>
                  <TD>
                    <p className="font-semibold">{b.customerName}</p>
                    <p className="text-xs text-muted-foreground">{b.customerEmail}</p>
                  </TD>
                  <TD className="whitespace-nowrap">{b.customerPhone}</TD>
                  <TD><p className="max-w-[180px] text-xs leading-snug">{b.address}</p></TD>
                  <TD className="whitespace-nowrap">{formatDate(b.preferredDate)}</TD>
                  <TD><p className="line-clamp-3 max-w-[220px] text-xs leading-snug text-muted-foreground" title={b.problemDescription}>{b.problemDescription}</p></TD>
                  <TD><p className="max-w-[160px] truncate font-medium">{b.serviceTitle}</p></TD>
                  <TD><StatusBadge status={b.status} /></TD>
                  <TD>{actions(b)}</TD>
                </TR>
              ))}
            </tbody>
          </Table>
        </TableWrap>
      )}

      <ConfirmDialog
        open={!!rejecting}
        onOpenChange={(o) => !o && setRejecting(null)}
        title="Reject this request?"
        description={`${rejecting?.customerName} will see the request as rejected. This can't be undone.`}
        confirmLabel="Reject request"
        destructive
        loading={busyId === rejecting?._id}
        onConfirm={async () => {
          if (rejecting && (await update(rejecting, "rejected", undefined, "Request rejected"))) setRejecting(null);
        }}
      />

      <Dialog open={!!completing} onOpenChange={(o) => !o && setCompleting(null)}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Set the final amount</DialogTitle>
            <DialogDescription>{completing?.serviceTitle}. The customer will be asked to pay this amount.</DialogDescription>
          </DialogHeader>
          <Field label="Final amount (USD)" htmlFor="final-amount">
            <Input id="final-amount" type="number" min="0" step="0.01" value={amount} onChange={(e) => setAmount(e.target.value)} />
          </Field>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCompleting(null)}>Cancel</Button>
            <Button loading={busyId === completing?._id} onClick={submitComplete}>Mark completed</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
