import Link from "next/link";
import { PackageSearch } from "lucide-react";
import { EmptyState } from "@/components/dashboard/states";
import { ServiceGrid } from "@/components/services/service-grid";
import { Button } from "@/components/ui/button";
import type { Service } from "@/lib/types";

export function FeaturedServices({ services }: { services: Service[] }) {
  return (
    <section className="section-pad container">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h2 className="section-title">Fresh from our technicians</h2>
          <p className="section-lead">The four newest services approved by our admins.</p>
        </div>
        <Button asChild variant="outline">
          <Link href="/services">Browse all services</Link>
        </Button>
      </div>
      <div className="mt-10">
        {services.length ? (
          <ServiceGrid services={services.slice(0, 4)} className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4" />
        ) : (
          <EmptyState
            icon={PackageSearch}
            title="No services published yet"
            description="Approved services will appear here as soon as technicians add them."
            ctaHref="/services"
            ctaLabel="Browse services"
          />
        )}
      </div>
    </section>
  );
}
