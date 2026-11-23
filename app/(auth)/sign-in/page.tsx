import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { AuthShell } from "@/components/auth/auth-shell";
import { SignInForm } from "@/components/auth/sign-in-form";
import { getServerSession } from "@/lib/session";

export const metadata: Metadata = { title: "Sign In" };

export default async function SignInPage() {
  if (await getServerSession()) redirect("/dashboard");
  return (
    <AuthShell
      title="Welcome back"
      subtitle="Sign in to track your repairs or manage your jobs."
      footer={
        <>
          New to FixMate?{" "}
          <Link href="/sign-up" className="font-semibold text-primary hover:underline">
            Create an account
          </Link>
        </>
      }
    >
      <Suspense>
        <SignInForm />
      </Suspense>
    </AuthShell>
  );
}
