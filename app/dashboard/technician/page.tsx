"use client";

import Link from "next/link";
import { BadgeCheck, Banknote, Inbox, Wrench } from "lucide-react";
import { ChartCard, DonutChart, TrendChart } from "@/components/dashboard/charts";
import { PageHeader } from "@/components/dashboard/page-header";
import { ErrorState, StatsSkeleton } from "@/components/dashboard/states";
import { StatsCard } from "@/components/dashboard/stats-card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useApi } from "@/hooks/use-api";
import { APPROVAL_STATUS, BOOKING_STATUS } from "@/lib/constants";
import { monthlySeries } from "@/lib/utils";
import type { ApprovalStatus, Booking, BookingStatus, Service } from "@/lib/types";

const APPROVAL_HEX: Record<ApprovalStatus, string> = { pending: "#f59e0b", approved: "#10b981", rejected: "#ef4444" };

export default function TechnicianOverview() {
  const services = useApi<Service[]>("/api/services/mine");
  const requests = useApi<Booking[]>("/api/bookings/technician");
  const loading = services.loading || requests.loading;
  const error = services.error ?? requests.error;
  const svc = services.data ?? [];
  const jobs = requests.data ?? [];

  const earned = jobs.filter((j) => j.paymentStatus === "paid").reduce((s, j) => s + j.finalAmount, 0);

  return (
    <>
      <PageHeader
        title="Your workshop"
        description="Services, incoming requests and earnings in one place."
        action={<Button asChild><Link href="/dashboard/technician/add-service">Add a service</Link></Button>}
      />
      {error ? (
        <ErrorState message={error} onRetry={() => { services.reload(); requests.reload(); }} />
      ) : loading ? (
        <>
          <StatsSkeleton count={4} />
          <Skeleton className="mt-6 h-72 rounded-2xl" />
        </>
      ) : (
        <div className="space-y-6">
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <StatsCard label="Total Services" value={svc.length} icon={Wrench} tone="violet" href="/dashboard/technician/my-services" />
            <StatsCard label="Approved Services" value={svc.filter((s) => s.approvalStatus === "approved").length} icon={BadgeCheck} tone="green" href="/dashboard/technician/my-services" />
            <StatsCard label="Pending Requests" value={jobs.filter((j) => j.status === "requested").length} icon={Inbox} tone="amber" hint="Waiting for your reply" href="/dashboard/technician/requests" />
            <StatsCard label="Paid earnings" value={earned} prefix="$" icon={Banknote} tone="blue" href="/dashboard/technician/requests" />
          </div>
          <div className="grid gap-6 xl:grid-cols-2">
            <ChartCard title="Services by approval" subtitle="Where your listings stand">
              <DonutChart
                data={(Object.keys(APPROVAL_STATUS) as ApprovalStatus[]).map((k) => ({
                  name: APPROVAL_STATUS[k].label,
                  color: APPROVAL_HEX[k],
                  value: svc.filter((s) => s.approvalStatus === k).length,
                }))}
              />
            </ChartCard>
            <ChartCard title="Jobs by status">
              <DonutChart
                data={(Object.keys(BOOKING_STATUS) as BookingStatus[]).map((k) => ({
                  name: BOOKING_STATUS[k].label,
                  color: BOOKING_STATUS[k].hex,
                  value: jobs.filter((j) => j.status === k).length,
                }))}
              />
            </ChartCard>
          </div>
          <ChartCard title="Requests per month" subtitle="Last six months">
            <TrendChart data={monthlySeries(jobs, (j) => j.createdAt ?? j.preferredDate)} />
          </ChartCard>
        </div>
      )}
    </>
  );
}
