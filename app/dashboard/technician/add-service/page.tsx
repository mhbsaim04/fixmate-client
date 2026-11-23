"use client";

import { useRouter } from "next/navigation";
import { PageHeader } from "@/components/dashboard/page-header";
import { ServiceForm } from "@/components/dashboard/service-form";

export default function AddServicePage() {
  const router = useRouter();
  return (
    <>
      <PageHeader title="Add a Service" description="New services stay pending until an admin approves them, then appear on the public pages." />
      <div className="max-w-3xl rounded-2xl border bg-card p-6 shadow-sm md:p-8">
        <ServiceForm onSaved={() => router.push("/dashboard/technician/my-services")} />
      </div>
    </>
  );
}
