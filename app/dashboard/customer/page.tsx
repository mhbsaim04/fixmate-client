"use client";

import Link from "next/link";
import { CheckCircle2, ClipboardList, Hammer } from "lucide-react";
import { ChartCard, DonutChart, TrendChart } from "@/components/dashboard/charts";
import { PageHeader } from "@/components/dashboard/page-header";
import { ErrorState, StatsSkeleton } from "@/components/dashboard/states";
import { StatsCard } from "@/components/dashboard/stats-card";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useApi } from "@/hooks/use-api";
import { BOOKING_STATUS } from "@/lib/constants";
import { formatDate, monthlySeries } from "@/lib/utils";
import type { Booking, BookingStatus } from "@/lib/types";

export default function CustomerOverview() {
  const { data, loading, error, reload } = useApi<Booking[]>("/api/bookings/my");
  const bookings = data ?? [];

  const active = bookings.filter((b) => ["requested", "accepted", "in-progress"].includes(b.status)).length;
  const completed = bookings.filter((b) => b.status === "completed").length;
  const donut = (Object.keys(BOOKING_STATUS) as BookingStatus[]).map((s) => ({
    name: BOOKING_STATUS[s].label,
    color: BOOKING_STATUS[s].hex,
    value: bookings.filter((b) => b.status === s).length,
  }));

  return (
    <>
      <PageHeader
        title="Your repairs at a glance"
        description="Everything you've requested, what's in progress and what's done."
        action={
          <Button asChild>
            <Link href="/services">Book a new repair</Link>
          </Button>
        }
      />

      {error ? (
        <ErrorState message={error} onRetry={() => reload()} />
      ) : loading ? (
        <>
          <StatsSkeleton count={3} />
          <Skeleton className="mt-6 h-72 rounded-2xl" />
        </>
      ) : (
        <div className="space-y-6">
          <div className="grid gap-4 md:grid-cols-3">
            <StatsCard label="Total Requests" value={bookings.length} icon={ClipboardList} tone="blue" />
            <StatsCard label="Active Jobs" value={active} icon={Hammer} tone="amber" hint="Requested, accepted or in progress" />
            <StatsCard label="Completed Jobs" value={completed} icon={CheckCircle2} tone="green" />
          </div>

          <div className="grid gap-6 xl:grid-cols-2">
            <ChartCard title="Jobs by status" subtitle="Same colours you see on every badge">
              <DonutChart data={donut} />
            </ChartCard>
            <ChartCard title="Requests per month" subtitle="Last six months">
              <TrendChart data={monthlySeries(bookings, (b) => b.createdAt ?? b.preferredDate)} />
            </ChartCard>
          </div>

          <section className="rounded-2xl border bg-card p-6 shadow-sm">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-bold">Latest requests</h2>
              <Button asChild variant="ghost" size="sm">
                <Link href="/dashboard/customer/bookings">View all</Link>
              </Button>
            </div>
            {bookings.length === 0 ? (
              <p className="py-6 text-center text-sm text-muted-foreground">No requests yet. Find a technician to get started.</p>
            ) : (
              <ul className="divide-y">
                {bookings.slice(0, 5).map((b) => (
                  <li key={b._id} className="flex items-center justify-between gap-4 py-3">
                    <div className="min-w-0">
                      <p className="truncate font-semibold">{b.serviceTitle}</p>
                      <p className="text-xs text-muted-foreground">{b.technicianName} · {formatDate(b.preferredDate)}</p>
                    </div>
                    <StatusBadge status={b.status} />
                  </li>
                ))}
              </ul>
            )}
          </section>
        </div>
      )}
    </>
  );
}
