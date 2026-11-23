"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { api } from "@/lib/api";
import { authClient } from "@/lib/auth-client";
import { CATEGORIES, CATEGORY_META, SERVICE_MODES } from "@/lib/constants";
import { serviceSchema, type ServiceValues } from "@/lib/schemas";
import { uploadImage } from "@/lib/upload";
import type { Service } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/field";
import { Input, Textarea } from "@/components/ui/input";
import { ImagePicker } from "./image-picker";

/** One form for both "Add a Service" and "Edit service". */
export function ServiceForm({ service, onSaved }: { service?: Service; onSaved: () => void }) {
  const { data: session } = authClient.useSession();
  const [file, setFile] = useState<File | null>(null);
  const [imageError, setImageError] = useState("");
  const editing = !!service;

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<ServiceValues>({
    resolver: zodResolver(serviceSchema),
    defaultValues: service
      ? {
          title: service.title,
          category: service.category as ServiceValues["category"],
          description: service.description,
          basePrice: String(service.basePrice),
          estimatedDuration: service.estimatedDuration,
          serviceMode: service.serviceMode,
          serviceArea: service.serviceArea,
        }
      : { title: "", description: "", basePrice: "", estimatedDuration: "", serviceArea: "" },
  });

  const selectedCategory = watch("category");
  const selectedMode = watch("serviceMode");

  async function onSubmit(values: ServiceValues) {
    if (!file && !service?.image) {
      setImageError("Upload a service image");
      return;
    }
    setImageError("");
    try {
      const image = file ? await uploadImage(file) : service!.image;
      const payload = { ...values, basePrice: Number(values.basePrice), image };
      if (editing) {
        await api.patch(`/api/services/${service!._id}`, payload);
        toast.success("Service updated", { description: "It is back in the admin approval queue." });
      } else {
        await api.post("/api/services", payload);
        toast.success("Service submitted", { description: "It is waiting for admin approval." });
        reset();
        setFile(null);
      }
      onSaved();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Could not save the service");
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Technician name">
          <Input value={session?.user.name ?? ""} readOnly />
        </Field>
        <Field label="Technician email">
          <Input value={session?.user.email ?? ""} readOnly />
        </Field>
      </div>

      <Field label="Service title" htmlFor="title" error={errors.title?.message}>
        <Input id="title" placeholder="e.g. iPhone Screen Replacement" aria-invalid={!!errors.title} {...register("title")} />
      </Field>

      <Field label="Category" error={errors.category?.message}>
        <input type="hidden" {...register("category")} />
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          {CATEGORIES.map((c) => {
            const meta = CATEGORY_META[c];
            const Icon = meta.icon;
            const active = selectedCategory === c;
            return (
              <button
                key={c}
                type="button"
                onClick={() => setValue("category", c, { shouldValidate: true })}
                className={`flex flex-col items-center gap-1.5 rounded-xl border p-3 text-xs font-semibold transition-all ${
                  active
                    ? "border-primary bg-primary/10 text-primary shadow-sm ring-2 ring-primary/30"
                    : "border-input bg-card text-muted-foreground hover:border-primary/40 hover:text-foreground"
                }`}
              >
                <span className={`grid size-9 place-items-center rounded-lg ${active ? "bg-primary text-primary-foreground" : meta.tone}`}>
                  <Icon className="size-4" />
                </span>
                {c}
              </button>
            );
          })}
        </div>
      </Field>

      <Field label="Service mode" error={errors.serviceMode?.message}>
        <input type="hidden" {...register("serviceMode")} />
        <div className="grid grid-cols-2 gap-2">
          {SERVICE_MODES.map((m) => {
            const active = selectedMode === m;
            return (
              <button
                key={m}
                type="button"
                onClick={() => setValue("serviceMode", m, { shouldValidate: true })}
                className={`rounded-xl border px-4 py-3 text-sm font-semibold transition-all ${
                  active
                    ? "border-primary bg-primary text-primary-foreground shadow-sm"
                    : "border-input bg-card text-muted-foreground hover:border-primary/40 hover:text-foreground"
                }`}
              >
                {m}
              </button>
            );
          })}
        </div>
      </Field>
        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="Base price (USD)" htmlFor="basePrice" error={errors.basePrice?.message} hint="Shown on cards as the starting price.">
            <Input id="basePrice" type="number" step="0.01" min="0" placeholder="45" aria-invalid={!!errors.basePrice} {...register("basePrice")} />
          </Field>
          <Field label="Estimated duration" htmlFor="estimatedDuration" error={errors.estimatedDuration?.message}>
            <Input id="estimatedDuration" placeholder="2-3 hours" aria-invalid={!!errors.estimatedDuration} {...register("estimatedDuration")} />
          </Field>
        </div>

      <Field label="Service area" htmlFor="serviceArea" error={errors.serviceArea?.message}>
        <Input id="serviceArea" placeholder="Dhanmondi, Dhaka" aria-invalid={!!errors.serviceArea} {...register("serviceArea")} />
      </Field>

      <Field label="Description" htmlFor="description" error={errors.description?.message}>
        <Textarea id="description" placeholder="What does this service include? Parts, warranty, what to bring…" aria-invalid={!!errors.description} {...register("description")} />
      </Field>

      <Field label="Service image" error={imageError} hint="JPG, PNG or WebP up to 5 MB. Uploaded to ImgBB when you save.">
        <ImagePicker existingUrl={service?.image} file={file} onChange={(f) => { setFile(f); setImageError(""); }} label="Click to upload a banner image" />
      </Field>

      <Button type="submit" size="lg" className="w-full" loading={isSubmitting}>
        {editing ? "Save changes" : "Submit for approval"}
      </Button>
    </form>
  );
}
