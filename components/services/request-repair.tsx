"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Info, Wrench } from "lucide-react";
import { toast } from "sonner";
import { ApiError, api } from "@/lib/api";
import { authClient } from "@/lib/auth-client";
import { requestSchema, type RequestValues } from "@/lib/schemas";
import { todayISO } from "@/lib/utils";
import type { Service } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/field";
import { Input, Textarea } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";

export function RequestRepair({ service }: { service: Service }) {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();
  const [open, setOpen] = useState(false);
  const user = session?.user as { name: string; email: string; role?: string | null } | undefined;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<RequestValues>({ resolver: zodResolver(requestSchema) });

  if (isPending) return <Skeleton className="h-12 w-full" />;

  if (!user) {
    return (
      <Button size="lg" className="w-full" onClick={() => router.push(`/sign-in?redirect=/services/${service._id}`)}>
        <Wrench /> Request Repair
      </Button>
    );
  }

  if ((user.role ?? "customer") !== "customer") {
    return (
      <div className="space-y-3">
        <Button size="lg" className="w-full" disabled>
          <Wrench /> Request Repair
        </Button>
        <p className="flex gap-2 rounded-lg bg-muted p-3 text-sm text-muted-foreground">
          <Info className="mt-0.5 size-4 shrink-0" /> Only customers can request a repair.
        </p>
      </div>
    );
  }

  async function onSubmit(values: RequestValues) {
    try {
      await api.post("/api/bookings", { serviceId: service._id, ...values });
      toast.success("Repair request sent!", {
        description: "The technician will review it shortly.",
        action: { label: "My Bookings", onClick: () => router.push("/dashboard/customer/bookings") },
        duration: 8000,
      });
      reset();
      setOpen(false);
    } catch (e) {
      if (e instanceof ApiError && e.status === 409) {
        toast.error("You already have an active request for this service");
      } else {
        toast.error(e instanceof Error ? e.message : "Could not send your request.");
      }
    }
  }

  return (
    <>
      <Button size="lg" className="w-full" onClick={() => setOpen(true)}>
        <Wrench /> Request Repair
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-xl">
          <DialogHeader>
            <DialogTitle>Request: {service.title}</DialogTitle>
            <DialogDescription>
              {service.technicianName} will review your request. You pay only after the job is completed.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Name">
                <Input value={user.name} readOnly />
              </Field>
              <Field label="Email">
                <Input value={user.email} readOnly />
              </Field>
              <Field label="Phone" htmlFor="customerPhone" error={errors.customerPhone?.message}>
                <Input id="customerPhone" type="tel" placeholder="+880 1XXX-XXXXXX" aria-invalid={!!errors.customerPhone} {...register("customerPhone")} />
              </Field>
              <Field label="Preferred date" htmlFor="preferredDate" error={errors.preferredDate?.message}>
                <Input id="preferredDate" type="date" min={todayISO()} aria-invalid={!!errors.preferredDate} {...register("preferredDate")} />
              </Field>
            </div>
            <Field
              label={service.serviceMode === "Home Visit" ? "Service address" : "Pickup address"}
              htmlFor="address"
              error={errors.address?.message}
            >
              <Input id="address" placeholder="House, road, area, city" aria-invalid={!!errors.address} {...register("address")} />
            </Field>
            <Field label="What is wrong with the device?" htmlFor="problemDescription" error={errors.problemDescription?.message} hint="At least 20 characters. The more detail, the better the quote.">
              <Textarea id="problemDescription" placeholder="e.g. The screen is cracked and the touch stops working near the top edge." aria-invalid={!!errors.problemDescription} {...register("problemDescription")} />
            </Field>
            <Button type="submit" size="lg" className="w-full" loading={isSubmitting}>
              Send request
            </Button>
            <p className="text-center text-xs text-muted-foreground">
              Track it any time in{" "}
              <Link href="/dashboard/customer/bookings" className="font-semibold text-primary hover:underline">
                My Bookings
              </Link>
              .
            </p>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
