import type { Metadata } from "next";
import Link from "next/link";
import { RotateCcw, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = { title: "Payment cancelled" };

export default function PaymentCancelPage() {
  return (
    <div className="container grid min-h-[60vh] place-items-center py-16">
      <div className="max-w-md rounded-2xl border bg-card p-10 text-center shadow-sm">
        <span className="mx-auto grid size-16 place-items-center rounded-2xl bg-slate-200 text-slate-600 dark:bg-slate-500/20 dark:text-slate-300">
          <XCircle className="size-8" />
        </span>
        <h1 className="mt-6 font-display text-3xl font-extrabold">Payment cancelled</h1>
        <p className="mt-3 text-muted-foreground">No worries, you haven&apos;t been charged and your booking is unchanged. You can pay whenever you&apos;re ready.</p>
        <Button asChild size="lg" className="mt-8">
          <Link href="/dashboard/customer/bookings">
            <RotateCcw /> Try Again
          </Link>
        </Button>
      </div>
    </div>
  );
}
