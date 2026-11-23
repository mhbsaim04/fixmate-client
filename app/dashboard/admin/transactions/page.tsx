"use client";

import { Banknote, Receipt } from "lucide-react";
import { PageHeader } from "@/components/dashboard/page-header";
import { EmptyState, ErrorState, TableSkeleton } from "@/components/dashboard/states";
import { StatsCard } from "@/components/dashboard/stats-card";
import { Table, TableWrap, TD, TH, THead, TR } from "@/components/ui/table";
import { useApi } from "@/hooks/use-api";
import { formatCurrency, formatDateTime } from "@/lib/utils";
import type { Payment } from "@/lib/types";

export default function AdminTransactionsPage() {
  const { data, loading, error, reload } = useApi<Payment[]>("/api/admin/payments");
  const payments = data ?? [];
  const revenue = payments.reduce((s, p) => s + p.amount, 0);

  return (
    <>
      <PageHeader title="Transactions" description="Every payment collected through Stripe Checkout." />
      {error ? (
        <ErrorState message={error} onRetry={() => reload()} />
      ) : loading ? (
        <TableSkeleton />
      ) : (
        <div className="space-y-6">
          <div className="max-w-sm">
            <StatsCard label="Total revenue" value={revenue} prefix="$" decimals={2} icon={Banknote} tone="green" hint={`${payments.length} payments`} />
          </div>
          {payments.length === 0 ? (
            <EmptyState icon={Receipt} title="No transactions yet" description="Payments will be listed here after customers pay for completed jobs." />
          ) : (
            <TableWrap>
              <Table className="min-w-[900px]">
                <THead>
                  <tr>
                    <TH>Customer</TH>
                    <TH>Technician</TH>
                    <TH>Service</TH>
                    <TH>Amount</TH>
                    <TH>Transaction ID</TH>
                    <TH>Paid on</TH>
                  </tr>
                </THead>
                <tbody>
                  {payments.map((p) => (
                    <TR key={p._id}>
                      <TD>
                        <p className="font-medium">{p.customerName}</p>
                        <p className="text-xs text-muted-foreground">{p.customerEmail}</p>
                      </TD>
                      <TD>{p.technicianName}</TD>
                      <TD className="font-semibold">{p.serviceTitle}</TD>
                      <TD className="font-bold">{formatCurrency(p.amount)}</TD>
                      <TD><span className="font-mono text-xs">{p.transactionId}</span></TD>
                      <TD className="whitespace-nowrap">{formatDateTime(p.paidAt)}</TD>
                    </TR>
                  ))}
                </tbody>
              </Table>
            </TableWrap>
          )}
        </div>
      )}
    </>
  );
}
