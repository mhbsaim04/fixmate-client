import type { Metadata } from "next";
import { Suspense } from "react";
import { PaymentVerifier } from "@/components/services/payment-verifier";
import { requireRole } from "@/lib/session";

export const metadata: Metadata = { title: "Payment" };

export default async function PaymentSuccessPage() {
  await requireRole(["customer"]);
  return (
    <div className="container grid min-h-[60vh] place-items-center py-16">
      <Suspense>
        <PaymentVerifier />
      </Suspense>
    </div>
  );
}
