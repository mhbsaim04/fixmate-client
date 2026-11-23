"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { CheckCircle2, Loader2, TriangleAlert } from "lucide-react";
import { api } from "@/lib/api";
import { formatCurrency } from "@/lib/utils";
import type { Payment } from "@/lib/types";
import { Button } from "@/components/ui/button";

/** Calls GET /api/payments/verify?session_id=... once. The server must be idempotent (never saves a payment twice). */
export function PaymentVerifier() {
  const sessionId = useSearchParams().get("session_id");
  const started = useRef(false);
  const [state, setState] = useState<"loading" | "ok" | "error">("loading");
  const [payment, setPayment] = useState<Payment | null>(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (started.current) return;
    started.current = true;
    if (!sessionId) {
      setState("error");
      setMessage("This page needs a Stripe session. Open it from your bookings.");
      return;
    }
    api
      .get<{ payment: Payment }>(`/api/payments/verify?session_id=${encodeURIComponent(sessionId)}`)
      .then((res) => {
        setPayment(res.payment);
        setState("ok");
      })
      .catch((e: Error) => {
        setMessage(e.message);
        setState("error");
      });
  }, [sessionId]);

  if (state === "loading") {
    return (
      <div className="text-center">
        <Loader2 className="mx-auto size-10 animate-spin text-primary" />
        <p className="mt-4 font-semibold">Confirming your payment with Stripe…</p>
      </div>
    );
  }

  if (state === "error") {
    return (
      <div className="max-w-md rounded-2xl border bg-card p-10 text-center shadow-sm">
        <TriangleAlert className="mx-auto size-12 text-amber-500" />
        <h1 className="mt-5 font-display text-2xl font-extrabold">We couldn&apos;t confirm the payment</h1>
        <p className="mt-3 text-sm text-muted-foreground">{message}</p>
        <Button asChild className="mt-6">
          <Link href="/dashboard/customer/bookings">Back to My Bookings</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md overflow-hidden rounded-2xl border bg-card text-center shadow-sm">
      <div className="hazard h-2" aria-hidden />
      <div className="p-10">
        <CheckCircle2 className="mx-auto size-16 text-emerald-500" />
        <h1 className="mt-5 font-display text-3xl font-extrabold">Payment successful</h1>
        <p className="mt-2 text-muted-foreground">Thanks! Your technician has been paid for this job.</p>
        <dl className="mt-8 space-y-3 rounded-xl bg-muted p-5 text-left text-sm">
          <div className="flex justify-between gap-4">
            <dt className="text-muted-foreground">Service</dt>
            <dd className="text-right font-semibold">{payment?.serviceTitle}</dd>
          </div>
          <div className="flex justify-between gap-4">
            <dt className="text-muted-foreground">Amount</dt>
            <dd className="font-display text-lg font-extrabold">{formatCurrency(payment?.amount)}</dd>
          </div>
          <div className="flex justify-between gap-4">
            <dt className="text-muted-foreground">Transaction ID</dt>
            <dd className="break-all text-right font-mono text-xs">{payment?.transactionId}</dd>
          </div>
        </dl>
        <Button asChild size="lg" className="mt-8 w-full">
          <Link href="/dashboard/customer/bookings">Back to My Bookings</Link>
        </Button>
      </div>
    </div>
  );
}
