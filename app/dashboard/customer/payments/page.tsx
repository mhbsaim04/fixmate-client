"use client";

import { Receipt } from "lucide-react";
import { PageHeader } from "@/components/dashboard/page-header";
import { EmptyState, ErrorState, TableSkeleton } from "@/components/dashboard/states";
import { Table, TableWrap, TD, TH, THead, TR } from "@/components/ui/table";
import { useApi } from "@/hooks/use-api";
import { formatCurrency, formatDateTime } from "@/lib/utils";
import type { Payment } from "@/lib/types";

export default function CustomerPaymentsPage() {
  const { data, loading, error, reload } = useApi<Payment[]>("/api/payments/my");
  const payments = data ?? [];
  const total = payments.reduce((s, p) => s + p.amount, 0);

  return (
    <>
      <PageHeader
        title="Payment History"
        description="Every job you've paid for through Stripe."
        action={payments.length > 0 ? <p className="rounded-xl bg-card px-4 py-2 text-sm border">Total paid <span className="ml-2 font-display text-lg font-extrabold">{formatCurrency(total)}</span></p> : undefined}
      />
      {error ? (
        <ErrorState message={error} onRetry={() => reload()} />
      ) : loading ? (
        <TableSkeleton />
      ) : payments.length === 0 ? (
        <EmptyState icon={Receipt} title="No payments yet" description="Once a technician completes a job and you pay, the receipt appears here." ctaHref="/dashboard/customer/bookings" ctaLabel="Go to My Bookings" />
      ) : (
        <TableWrap>
          <Table>
            <THead>
              <tr>
                <TH>Service</TH>
                <TH>Technician</TH>
                <TH>Amount</TH>
                <TH>Transaction ID</TH>
                <TH>Paid on</TH>
              </tr>
            </THead>
            <tbody>
              {payments.map((p) => (
                <TR key={p._id}>
                  <TD className="font-semibold">{p.serviceTitle}</TD>
                  <TD>{p.technicianName}</TD>
                  <TD className="font-bold">{formatCurrency(p.amount)}</TD>
                  <TD><span className="font-mono text-xs">{p.transactionId}</span></TD>
                  <TD className="whitespace-nowrap">{formatDateTime(p.paidAt)}</TD>
                </TR>
              ))}
            </tbody>
          </Table>
        </TableWrap>
      )}
    </>
  );
}
