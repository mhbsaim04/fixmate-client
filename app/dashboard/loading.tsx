import { StatsSkeleton, TableSkeleton } from "@/components/dashboard/states";
import { Skeleton } from "@/components/ui/skeleton";

export default function DashboardLoading() {
  return (
    <div className="space-y-8" aria-busy="true" aria-label="Loading">
      <Skeleton className="h-9 w-64" />
      <StatsSkeleton />
      <TableSkeleton />
    </div>
  );
}
