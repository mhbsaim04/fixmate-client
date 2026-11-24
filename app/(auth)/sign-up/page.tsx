import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { AuthShell } from "@/components/auth/auth-shell";
import { SignUpForm } from "@/components/auth/sign-up-form";
import { getServerSession } from "@/lib/session";

export const metadata: Metadata = { title: "Sign Up" };

export default async function SignUpPage() {
  if (await getServerSession()) redirect("/dashboard");
  return (
    <AuthShell
      title="Create your account"
      subtitle="Join as a customer to book repairs, or as a technician to offer them."
      imageSrc="/images/FixMate_signup_image.png"
      footer={
        <>
          Already have an account?{" "}
          <Link href="/sign-in" className="font-semibold text-primary hover:underline">
            Sign in
          </Link>
        </>
      }
    >
      <SignUpForm />
    </AuthShell>
  );
}
