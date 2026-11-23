"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { PageHeader } from "@/components/dashboard/page-header";
import { ImagePicker } from "@/components/dashboard/image-picker";
import { RoleBadge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/field";
import { Input, Textarea } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { authClient, type SessionUser } from "@/lib/auth-client";
import { profileSchema, type ProfileValues } from "@/lib/schemas";
import { uploadImage } from "@/lib/upload";
import type { Role } from "@/lib/types";

export default function ProfilePage() {
  const { data: session, isPending } = authClient.useSession();
  const user = session?.user as SessionUser | undefined;
  const [file, setFile] = useState<File | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ProfileValues>({ resolver: zodResolver(profileSchema), defaultValues: { name: "", phone: "", area: "", bio: "" } });

  // Fill the form once the session arrives.
  useEffect(() => {
    if (user) reset({ name: user.name, phone: user.phone ?? "", area: user.area ?? "", bio: user.bio ?? "" });
  }, [user?.id]); // eslint-disable-line react-hooks/exhaustive-deps

  async function onSubmit(values: ProfileValues) {
    try {
      const image = file ? await uploadImage(file) : user?.image ?? undefined;
      const { error } = await authClient.updateUser({
        name: values.name,
        phone: values.phone ?? "",
        area: values.area ?? "",
        bio: values.bio ?? "",
        ...(image ? { image } : {}),
      });
      if (error) throw new Error(error.message);
      setFile(null);
      // useSession refreshes by itself, so the navbar and top bar show the new name and photo immediately.
      toast.success("Profile updated");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Could not update your profile");
    }
  }

  return (
    <>
      <PageHeader title="Update Profile" description="Your name and photo appear in the navbar and dashboard right after you save." />
      {isPending || !user ? (
        <Skeleton className="h-[520px] max-w-3xl rounded-2xl" />
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} className="max-w-3xl space-y-6 rounded-2xl border bg-card p-6 shadow-sm md:p-8" noValidate>
          <div className="flex items-center gap-5">
            <ImagePicker shape="round" existingUrl={user.image} file={file} onChange={setFile} label="Add photo" />
            <div>
              <p className="font-bold">Profile photo</p>
              <p className="text-sm text-muted-foreground">Click the circle to upload a new one. Max 5 MB.</p>
            </div>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <Field label="Email (read-only)">
              <Input value={user.email} readOnly />
            </Field>
            <Field label="Role (read-only)">
              <div className="flex h-11 items-center"><RoleBadge role={(user.role ?? "customer") as Role} /></div>
            </Field>
            <Field label="Full name" htmlFor="name" error={errors.name?.message}>
              <Input id="name" aria-invalid={!!errors.name} {...register("name")} />
            </Field>
            <Field label="Phone" htmlFor="phone" error={errors.phone?.message}>
              <Input id="phone" type="tel" placeholder="+880 1XXX-XXXXXX" {...register("phone")} />
            </Field>
          </div>
          <Field label="City / area" htmlFor="area">
            <Input id="area" placeholder="Mirpur, Dhaka" {...register("area")} />
          </Field>
          <Field label="Short bio" htmlFor="bio" error={errors.bio?.message} hint="Technicians: mention your skills and years of experience.">
            <Textarea id="bio" {...register("bio")} />
          </Field>

          <Button type="submit" size="lg" loading={isSubmitting}>Save changes</Button>
        </form>
      )}
    </>
  );
}
