"use client";

import { useState } from "react";
import { CalendarX } from "lucide-react";
import { FilterTabs } from "@/components/dashboard/filter-tabs";
import { PageHeader } from "@/components/dashboard/page-header";
import { EmptyState, ErrorState, TableSkeleton } from "@/components/dashboard/states";
import { PaymentBadge, StatusBadge } from "@/components/ui/badge";
import { Table, TableWrap, TD, TH, THead, TR } from "@/components/ui/table";
import { useApi } from "@/hooks/use-api";
import { BOOKING_STATUS } from "@/lib/constants";
import { formatCurrency, formatDate } from "@/lib/utils";
import type { Booking, BookingStatus } from "@/lib/types";

type Filter = "all" | BookingStatus;

export default function AdminBookingsPage() {
  const { data, loading, error, reload } = useApi<Booking[]>("/api/admin/bookings");
  const [filter, setFilter] = useState<Filter>("all");
  const bookings = data ?? [];
  const visible = filter === "all" ? bookings : bookings.filter((b) => b.status === filter);

  return (
    <>
      <PageHeader title="All Bookings" description="A read-only view of every repair job on the platform." />
      <div className="mb-6">
        <FilterTabs<Filter>
          value={filter}
          onChange={setFilter}
          options={[
            { value: "all", label: "All", count: bookings.length },
            ...(Object.keys(BOOKING_STATUS) as BookingStatus[]).map((s) => ({
              value: s as Filter,
              label: BOOKING_STATUS[s].label,
              count: bookings.filter((b) => b.status === s).length,
            })),
          ]}
        />
      </div>

      {error ? (
        <ErrorState message={error} onRetry={() => reload()} />
      ) : loading ? (
        <TableSkeleton />
      ) : visible.length === 0 ? (
        <EmptyState icon={CalendarX} title="No bookings in this view" description="Try another status filter." />
      ) : (
        <TableWrap>
          <Table className="min-w-[960px]">
            <THead>
              <tr>
                <TH>Service</TH>
                <TH>Customer</TH>
                <TH>Technician</TH>
                <TH>Date</TH>
                <TH>Status</TH>
                <TH>Payment</TH>
                <TH className="text-right">Amount</TH>
              </tr>
            </THead>
            <tbody>
              {visible.map((b) => (
                <TR key={b._id}>
                  <TD><p className="max-w-[200px] truncate font-semibold">{b.serviceTitle}</p></TD>
                  <TD>
                    <p className="font-medium">{b.customerName}</p>
                    <p className="text-xs text-muted-foreground">{b.customerEmail}</p>
                  </TD>
                  <TD>{b.technicianName}</TD>
                  <TD className="whitespace-nowrap">{formatDate(b.preferredDate)}</TD>
                  <TD><StatusBadge status={b.status} /></TD>
                  <TD><PaymentBadge status={b.paymentStatus} /></TD>
                  <TD className="text-right font-bold">{formatCurrency(b.status === "completed" ? b.finalAmount : b.basePrice)}</TD>
                </TR>
              ))}
            </tbody>
          </Table>
        </TableWrap>
      )}
    </>
  );
}
