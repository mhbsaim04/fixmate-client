"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { BadgeCheck, Check, Search, ShieldCheck, Wallet } from "lucide-react";
import { Button } from "@/components/ui/button";

const STEPS = ["Requested", "Accepted", "In Progress", "Completed", "Paid"] as const;
const DOT = ["bg-blue-500", "bg-indigo-500", "bg-amber-500", "bg-emerald-500", "bg-emerald-600"];
const NOTE = [
  "Your request is with Tanvir. He replies within a few hours.",
  "Accepted. Bring the phone in or wait for the home visit.",
  "Screen is being replaced right now.",
  "Done. Tanvir set the final amount to $62.00.",
  "Paid with Stripe. Receipt saved to your payments.",
];

function LiveJobTicket() {
  const [step, setStep] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setStep((s) => (s + 1) % STEPS.length), 2400);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="relative mx-auto w-full max-w-[460px]">
      <div className="absolute -inset-4 -rotate-3 rounded-[2rem] bg-accent/80 dark:bg-accent/20" aria-hidden />
      <div className="relative overflow-hidden rounded-3xl border-2 border-secondary bg-card shadow-[10px_10px_0_0_hsl(var(--secondary))] dark:border-border dark:shadow-[10px_10px_0_0_hsl(var(--border))]">
        <div className="hazard h-3" aria-hidden />
        <div className="p-6 sm:p-7">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="font-mono text-xs text-muted-foreground">Job FM-2041</p>
              <h2 className="mt-1 text-xl font-bold leading-snug">iPhone 13 screen replacement</h2>
              <p className="mt-1 text-sm text-muted-foreground">Mirpur 10, Dhaka · Home visit</p>
            </div>
            <span className="rounded-lg bg-secondary px-3 py-1.5 font-display text-lg font-extrabold text-secondary-foreground">$62</span>
          </div>

          <div className="mt-7">
            <div className="relative flex justify-between">
              <div className="absolute left-3 right-3 top-3 h-1 rounded bg-muted" aria-hidden />
              <motion.div
                className="absolute left-3 top-3 h-1 origin-left rounded bg-primary"
                style={{ right: 12 }}
                animate={{ scaleX: step / (STEPS.length - 1) }}
                transition={{ duration: 0.6, ease: "easeInOut" }}
                aria-hidden
              />
              {STEPS.map((label, i) => (
                <div key={label} className="relative z-10 flex w-12 flex-col items-center gap-2">
                  <span
                    className={`grid size-7 place-items-center rounded-full border-2 border-card text-white transition-colors duration-500 ${
                      i <= step ? DOT[i] : "bg-muted text-transparent"
                    }`}
                  >
                    <Check className="size-3.5" strokeWidth={3.5} />
                  </span>
                  <span className={`text-center text-[10px] font-semibold leading-tight ${i === step ? "text-foreground" : "text-muted-foreground"}`}>
                    {label}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <motion.p
            key={step}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-6 rounded-xl bg-muted px-4 py-3 text-sm"
            aria-live="polite"
          >
            {NOTE[step]}
          </motion.p>

          <div className="mt-5 flex items-center gap-3 border-t pt-5">
            <span className="grid size-10 place-items-center rounded-full bg-accent font-bold text-accent-foreground">TH</span>
            <div className="text-sm">
              <p className="flex items-center gap-1.5 font-bold">
                Tanvir Hossain <BadgeCheck className="size-4 text-primary" />
              </p>
              <p className="text-muted-foreground">Verified technician</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function Hero() {
  const router = useRouter();
  const [q, setQ] = useState("");

  return (
    <section className="bg-bench relative overflow-hidden border-b">
      <div className="container grid items-center gap-14 py-14 md:py-20 lg:grid-cols-[1.1fr_0.9fr] lg:gap-10 lg:py-24">
        <div>
          <h1 className="font-display text-4xl font-extrabold leading-[1.05] sm:text-5xl lg:text-[3.6rem]">
            Broken device? Get it fixed by verified technicians.
          </h1>
          <p className="mt-5 max-w-xl text-lg leading-relaxed text-muted-foreground">
            Pick a repair service, send your request and watch the job move step by step. You pay only after the work is
            done.
          </p>

          <form
            className="mt-8 flex max-w-xl flex-col gap-2 rounded-2xl border bg-card p-2 shadow-lg sm:flex-row"
            onSubmit={(e) => {
              e.preventDefault();
              router.push(q.trim() ? `/services?search=${encodeURIComponent(q.trim())}` : "/services");
            }}
          >
            <label className="relative flex-1">
              <span className="sr-only">What needs fixing?</span>
              <Search className="pointer-events-none absolute left-4 top-1/2 size-5 -translate-y-1/2 text-muted-foreground" />
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="What needs fixing? e.g. AC servicing"
                className="h-12 w-full rounded-xl bg-transparent pl-12 pr-3 text-base placeholder:text-muted-foreground/70 focus-visible:ring-0 focus-visible:ring-offset-0"
              />
            </label>
            <Button type="submit" size="lg">
              Find a technician
            </Button>
          </form>

          <p className="mt-4 text-sm text-muted-foreground">
            Popular right now:{" "}
            {["Smartphone", "AC", "Laptop & PC"].map((c, i) => (
              <span key={c}>
                <Link href={`/services?category=${encodeURIComponent(c)}`} className="font-semibold text-foreground underline decoration-accent decoration-2 underline-offset-4 hover:text-primary">
                  {c}
                </Link>
                {i < 2 ? ", " : ""}
              </span>
            ))}
          </p>

          <ul className="mt-10 flex flex-wrap gap-x-8 gap-y-3 text-sm font-semibold">
            <li className="flex items-center gap-2"><ShieldCheck className="size-5 text-primary" /> Admin-approved listings</li>
            <li className="flex items-center gap-2"><Check className="size-5 text-primary" /> Live job tracking</li>
            <li className="flex items-center gap-2"><Wallet className="size-5 text-primary" /> Pay after completion</li>
          </ul>
        </div>

        <LiveJobTicket />
      </div>
    </section>
  );
}
