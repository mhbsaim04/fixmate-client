"use client";

import { Banknote, CalendarCheck, ListChecks, ShieldCheck, Users, Wrench } from "lucide-react";
import { ChartCard, DonutChart, TrendChart } from "@/components/dashboard/charts";
import { PageHeader } from "@/components/dashboard/page-header";
import { ErrorState, StatsSkeleton } from "@/components/dashboard/states";
import { StatsCard } from "@/components/dashboard/stats-card";
import { Skeleton } from "@/components/ui/skeleton";
import { useApi } from "@/hooks/use-api";
import { BOOKING_STATUS } from "@/lib/constants";
import { monthlySeries } from "@/lib/utils";
import type { AppUser, Booking, BookingStatus, Payment, Service } from "@/lib/types";

export default function AdminOverview() {
  const users = useApi<AppUser[]>("/api/admin/users");
  const services = useApi<Service[]>("/api/admin/services");
  const bookings = useApi<Booking[]>("/api/admin/bookings");
  const payments = useApi<Payment[]>("/api/admin/payments");

  const loading = users.loading || services.loading || bookings.loading || payments.loading;
  const error = users.error ?? services.error ?? bookings.error ?? payments.error;
  const u = users.data ?? [];
  const s = services.data ?? [];
  const b = bookings.data ?? [];
  const p = payments.data ?? [];
  const revenue = p.reduce((sum, x) => sum + x.amount, 0);

  return (
    <>
      <PageHeader title="Platform overview" description="Users, listings, jobs and revenue across FixMate." />
      {error ? (
        <ErrorState message={error} onRetry={() => { users.reload(); services.reload(); bookings.reload(); payments.reload(); }} />
      ) : loading ? (
        <>
          <StatsSkeleton count={6} columns={3} />
          <Skeleton className="mt-6 h-72 rounded-2xl" />
        </>
      ) : (
        <div className="space-y-6">
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            <StatsCard label="Total Users" value={u.length} icon={Users} tone="blue" href="/dashboard/admin/users" />
            <StatsCard label="Total Technicians" value={u.filter((x) => x.role === "technician").length} icon={Wrench} tone="violet" href="/dashboard/admin/users" />
            <StatsCard label="Pending Services" value={s.filter((x) => x.approvalStatus === "pending").length} icon={ListChecks} tone="amber" hint="Waiting for your review" href="/dashboard/admin/services" />
            <StatsCard label="Total Bookings" value={b.length} icon={CalendarCheck} tone="rose" href="/dashboard/admin/bookings" />
            <StatsCard label="Revenue (Stripe)" value={revenue} prefix="$" decimals={2} icon={Banknote} tone="green" href="/dashboard/admin/transactions" />
            <StatsCard label="Approved Services" value={s.filter((x) => x.approvalStatus === "approved").length} icon={ShieldCheck} tone="green" href="/dashboard/admin/services" />
          </div>
          <div className="grid gap-6 xl:grid-cols-2">
            <ChartCard title="Users by role">
              <DonutChart
                data={[
                  { name: "Customers", color: "#0ea5e9", value: u.filter((x) => x.role === "customer").length },
                  { name: "Technicians", color: "#8b5cf6", value: u.filter((x) => x.role === "technician").length },
                  { name: "Admins", color: "#f43f5e", value: u.filter((x) => x.role === "admin").length },
                ]}
              />
            </ChartCard>
            <ChartCard title="Bookings by status">
              <DonutChart
                data={(Object.keys(BOOKING_STATUS) as BookingStatus[]).map((k) => ({
                  name: BOOKING_STATUS[k].label,
                  color: BOOKING_STATUS[k].hex,
                  value: b.filter((x) => x.status === k).length,
                }))}
              />
            </ChartCard>
          </div>
          <ChartCard title="Revenue per month" subtitle="Paid jobs, last six months">
            <TrendChart data={monthlySeries(p, (x) => x.paidAt, (x) => x.amount)} color="#10b981" prefix="$" />
          </ChartCard>
        </div>
      )}
    </>
  );
}
