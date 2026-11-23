"use client";

import { useRouter } from "next/navigation";
import { PageHeader } from "@/components/dashboard/page-header";
import { ServiceForm } from "@/components/dashboard/service-form";

export default function AddServicePage() {
  const router = useRouter();
  return (
    <>
      <PageHeader title="Add a Service" description="New services stay pending until an admin approves them, then appear on the public pages." />
      <div className="max-w-3xl overflow-hidden rounded-2xl border bg-card shadow-sm">
        <div className="bg-gradient-to-r from-primary/15 via-accent/10 to-transparent px-6 py-5 md:px-8">
          <p className="text-sm font-semibold text-primary">Technician service listing</p>
          <p className="mt-1 text-xs text-muted-foreground">Fill in the details, upload a banner image, and submit for approval.</p>
        </div>
        <div className="p-6 md:p-8">
          <ServiceForm onSaved={() => router.push("/dashboard/technician/my-services")} />
        </div>
      </div>
    </>
  );
}
