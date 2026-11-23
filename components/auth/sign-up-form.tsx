"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Check, Eye, EyeOff, UserRound, Wrench } from "lucide-react";
import { toast } from "sonner";
import { authClient } from "@/lib/auth-client";
import { clearTokenCache } from "@/lib/api";
import { roleHome } from "@/lib/constants";
import { signUpSchema, type SignUpValues } from "@/lib/schemas";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { GoogleButton } from "./google-button";

const ROLES = [
  { value: "customer", title: "Customer", text: "Book repairs and pay after the job", icon: UserRound },
  { value: "technician", title: "Technician", text: "List services and manage jobs", icon: Wrench },
] as const;

export function SignUpForm() {
  const router = useRouter();
  const [show, setShow] = useState(false);
  const {
    register,
    control,
    watch,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignUpValues>({
    resolver: zodResolver(signUpSchema),
    defaultValues: { role: "customer", name: "", email: "", password: "" },
  });

  const password = watch("password") ?? "";
  const rules = [
    { ok: password.length >= 6, text: "At least 6 characters" },
    { ok: /[A-Z]/.test(password), text: "One uppercase letter" },
    { ok: /[a-z]/.test(password), text: "One lowercase letter" },
  ];

  async function onSubmit(values: SignUpValues) {
    const { error } = await authClient.signUp.email({
      name: values.name,
      email: values.email,
      password: values.password,
      role: values.role,
    });
    if (error) {
      toast.error(error.message || "Could not create your account. Try a different email.");
      return;
    }
    clearTokenCache();
    toast.success("Account created. Welcome to FixMate!");
    router.push(roleHome(values.role));
    router.refresh();
  }

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
        <Field label="I want to join as" error={errors.role?.message}>
          <Controller
            control={control}
            name="role"
            render={({ field }) => (
              <div className="grid grid-cols-2 gap-3" role="radiogroup">
                {ROLES.map(({ value, title, text, icon: Icon }) => {
                  const active = field.value === value;
                  return (
                    <button
                      key={value}
                      type="button"
                      role="radio"
                      aria-checked={active}
                      onClick={() => field.onChange(value)}
                      className={cn(
                        "relative rounded-xl border-2 p-4 text-left transition-all",
                        active ? "border-primary bg-primary/5" : "border-input bg-card hover:border-primary/40",
                      )}
                    >
                      {active && (
                        <span className="absolute right-2.5 top-2.5 grid size-5 place-items-center rounded-full bg-primary text-primary-foreground">
                          <Check className="size-3" strokeWidth={3} />
                        </span>
                      )}
                      <Icon className={cn("size-6", active ? "text-primary" : "text-muted-foreground")} />
                      <p className="mt-2 text-sm font-bold">{title}</p>
                      <p className="mt-0.5 text-xs leading-snug text-muted-foreground">{text}</p>
                    </button>
                  );
                })}
              </div>
            )}
          />
        </Field>

        <Field label="Full name" htmlFor="name" error={errors.name?.message}>
          <Input id="name" autoComplete="name" placeholder="Rahim Uddin" aria-invalid={!!errors.name} {...register("name")} />
        </Field>
        <Field label="Email" htmlFor="email" error={errors.email?.message}>
          <Input id="email" type="email" autoComplete="email" placeholder="you@example.com" aria-invalid={!!errors.email} {...register("email")} />
        </Field>
        <Field label="Password" htmlFor="password" error={errors.password?.message}>
          <div className="relative">
            <Input
              id="password"
              type={show ? "text" : "password"}
              autoComplete="new-password"
              placeholder="Create a password"
              aria-invalid={!!errors.password}
              className="pr-11"
              {...register("password")}
            />
            <button
              type="button"
              onClick={() => setShow((v) => !v)}
              aria-label={show ? "Hide password" : "Show password"}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              {show ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
            </button>
          </div>
          <ul className="mt-2 flex flex-wrap gap-x-4 gap-y-1">
            {rules.map((r) => (
              <li key={r.text} className={cn("flex items-center gap-1.5 text-xs", r.ok ? "text-emerald-600 dark:text-emerald-400" : "text-muted-foreground")}>
                <Check className={cn("size-3.5", !r.ok && "opacity-30")} strokeWidth={3} />
                {r.text}
              </li>
            ))}
          </ul>
        </Field>

        <Button type="submit" size="lg" className="w-full" loading={isSubmitting}>
          Create account
        </Button>
      </form>

      <div className="flex items-center gap-3 text-xs text-muted-foreground">
        <span className="h-px flex-1 bg-border" /> or <span className="h-px flex-1 bg-border" />
      </div>
      <GoogleButton callbackURL="/dashboard" />
    </div>
  );
}
