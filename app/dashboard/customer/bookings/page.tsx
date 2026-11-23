"use client";

import { useState } from "react";
import { ClipboardList, CreditCard, Download, Route, Star, XCircle } from "lucide-react";
import { toast } from "sonner";
import { ConfirmDialog } from "@/components/dashboard/confirm-dialog";
import { JobTimeline } from "@/components/dashboard/job-timeline";
import { PageHeader } from "@/components/dashboard/page-header";
import { ReviewDialog } from "@/components/dashboard/review-dialog";
import { EmptyState, ErrorState, TableSkeleton } from "@/components/dashboard/states";
import { PaymentBadge, StatusBadge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { RatingStars } from "@/components/ui/rating";
import { Table, TableWrap, TD, TH, THead, TR } from "@/components/ui/table";
import { ServiceImage } from "@/components/services/service-image";
import { useApi } from "@/hooks/use-api";
import { api } from "@/lib/api";
import { downloadInvoice } from "@/lib/invoice";
import { formatCurrency, formatDate } from "@/lib/utils";
import type { Booking, Payment } from "@/lib/types";

export default function CustomerBookingsPage() {
  const { data, loading, error, reload } = useApi<Booking[]>("/api/bookings/my");
  const { data: payments } = useApi<Payment[]>("/api/payments/my");
  const bookings = data ?? [];

  const [cancelTarget, setCancelTarget] = useState<Booking | null>(null);
  const [cancelling, setCancelling] = useState(false);
  const [payingId, setPayingId] = useState<string | null>(null);
  const [trackTarget, setTrackTarget] = useState<Booking | null>(null);
  const [reviewTarget, setReviewTarget] = useState<Booking | null>(null);

  async function cancel() {
    if (!cancelTarget) return;
    setCancelling(true);
    try {
      await api.patch(`/api/bookings/${cancelTarget._id}/cancel`);
      toast.success("Request cancelled");
      setCancelTarget(null);
      reload(true);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Could not cancel this request");
    } finally {
      setCancelling(false);
    }
  }

  async function payNow(b: Booking) {
    setPayingId(b._id);
    try {
      // The server loads the booking and prices the session itself. We never send an amount.
      const { url } = await api.post<{ url: string }>("/api/payments/create-checkout-session", { bookingId: b._id });
      window.location.href = url;
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Could not start the payment");
      setPayingId(null);
    }
  }

  async function invoice(b: Booking) {
    try {
      await downloadInvoice(b, payments?.find((p) => p.bookingId === b._id));
      toast.success("Invoice downloaded");
    } catch {
      toast.error("Could not create the invoice");
    }
  }

  const price = (b: Booking) => (b.status === "completed" ? formatCurrency(b.finalAmount) : `From ${formatCurrency(b.basePrice)}`);

  const actions = (b: Booking) => (
    <div className="flex flex-wrap items-center justify-end gap-2">
      <Button variant="ghost" size="sm" onClick={() => setTrackTarget(b)}>
        <Route /> Track
      </Button>
      {b.status === "requested" && (
        <Button variant="outline" size="sm" className="text-destructive" onClick={() => setCancelTarget(b)}>
          <XCircle /> Cancel
        </Button>
      )}
      {b.status === "completed" && b.paymentStatus === "unpaid" && (
        <Button size="sm" loading={payingId === b._id} onClick={() => payNow(b)}>
          <CreditCard /> Pay Now
        </Button>
      )}
      {b.paymentStatus === "paid" && (
        <>
          {!b.rating && (
            <Button variant="soft" size="sm" onClick={() => setReviewTarget(b)}>
              <Star /> Rate
            </Button>
          )}
          <Button variant="outline" size="sm" onClick={() => invoice(b)}>
            <Download /> Invoice
          </Button>
        </>
      )}
    </div>
  );

  return (
    <>
      <PageHeader title="My Bookings" description="Track every repair request, pay for finished jobs and download invoices." />

      {error ? (
        <ErrorState message={error} onRetry={() => reload()} />
      ) : loading ? (
        <TableSkeleton />
      ) : bookings.length === 0 ? (
        <EmptyState icon={ClipboardList} title="No bookings yet" description="When you request a repair, it will show up here with live status updates." ctaHref="/services" ctaLabel="Browse services" />
      ) : (
        <>
          {/* Table on tablet/desktop */}
          <TableWrap className="hidden md:block">
            <Table className="min-w-[900px]">
              <THead>
                <tr>
                  <TH>Service</TH>
                  <TH>Technician</TH>
                  <TH>Preferred date</TH>
                  <TH>Price</TH>
                  <TH>Status</TH>
                  <TH>Payment</TH>
                  <TH className="text-right">Actions</TH>
                </tr>
              </THead>
              <tbody>
                {bookings.map((b) => (
                  <TR key={b._id}>
                    <TD>
                      <div className="flex items-center gap-3">
                        <ServiceImage src={b.serviceImage} alt="" category={b.category} sizes="56px" className="size-14 shrink-0 rounded-xl" />
                        <div className="min-w-0">
                          <p className="max-w-[200px] truncate font-semibold">{b.serviceTitle}</p>
                          <p className="text-xs text-muted-foreground">{b.category}</p>
                        </div>
                      </div>
                    </TD>
                    <TD>{b.technicianName}</TD>
                    <TD className="whitespace-nowrap">{formatDate(b.preferredDate)}</TD>
                    <TD className="whitespace-nowrap font-semibold">{price(b)}</TD>
                    <TD><StatusBadge status={b.status} /></TD>
                    <TD>
                      <div className="space-y-1">
                        <PaymentBadge status={b.paymentStatus} />
                        {b.rating ? <div><RatingStars value={b.rating} /></div> : null}
                      </div>
                    </TD>
                    <TD>{actions(b)}</TD>
                  </TR>
                ))}
              </tbody>
            </Table>
          </TableWrap>

          {/* Cards on mobile */}
          <div className="space-y-4 md:hidden">
            {bookings.map((b) => (
              <article key={b._id} className="rounded-2xl border bg-card p-4 shadow-sm">
                <div className="flex gap-3">
                  <ServiceImage src={b.serviceImage} alt="" category={b.category} sizes="64px" className="size-16 shrink-0 rounded-xl" />
                  <div className="min-w-0 flex-1">
                    <p className="font-bold leading-snug">{b.serviceTitle}</p>
                    <p className="text-xs text-muted-foreground">{b.technicianName} · {formatDate(b.preferredDate)}</p>
                    <p className="mt-1 text-sm font-semibold">{price(b)}</p>
                  </div>
                </div>
                <div className="mt-3 flex flex-wrap gap-2">
                  <StatusBadge status={b.status} />
                  <PaymentBadge status={b.paymentStatus} />
                </div>
                <div className="mt-4 border-t pt-3">{actions(b)}</div>
              </article>
            ))}
          </div>
        </>
      )}

      <ConfirmDialog
        open={!!cancelTarget}
        onOpenChange={(o) => !o && setCancelTarget(null)}
        title="Cancel this request?"
        description={`Your request for "${cancelTarget?.serviceTitle}" will be cancelled. You can send a new request later.`}
        confirmLabel="Yes, cancel request"
        destructive
        loading={cancelling}
        onConfirm={cancel}
      />

      <Dialog open={!!trackTarget} onOpenChange={(o) => !o && setTrackTarget(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Job tracker</DialogTitle>
            <DialogDescription>{trackTarget?.serviceTitle}</DialogDescription>
          </DialogHeader>
          {trackTarget && <JobTimeline booking={trackTarget} />}
        </DialogContent>
      </Dialog>

      <ReviewDialog booking={reviewTarget} onClose={() => setReviewTarget(null)} onDone={() => reload(true)} />
    </>
  );
}
