import type { Metadata } from "next";
import Link from "next/link";
import { ChevronDown } from "lucide-react";
import { HowItWorks } from "@/components/home/how-it-works";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "How It Works",
  description: "How FixMate connects customers, technicians and admins around a tracked, pay-after-service repair.",
};

const ROLES = [
  {
    title: "Customers",
    points: ["Browse approved services and send a repair request", "Cancel while the request is still waiting", "Pay with Stripe after the job is completed", "Rate the work and download a PDF invoice"],
  },
  {
    title: "Technicians",
    points: ["Add services with a photo and a starting price", "Accept or reject incoming requests", "Move each job forward and set the final amount", "Turn a service on or off whenever you need"],
  },
  {
    title: "Admins",
    points: ["Approve or reject every new service listing", "Manage users and their roles", "Monitor every booking on the platform", "Track all Stripe transactions and revenue"],
  },
];

const FAQ = [
  ["When do I pay?", "Only after the technician marks the job completed. You'll see a Pay Now button in My Bookings and pay securely through Stripe Checkout."],
  ["Can I cancel a request?", "Yes, as long as the technician hasn't accepted or rejected it yet. After that the job moves forward one step at a time."],
  ["Who sets the final price?", "The listing shows a starting price. When the work is done, the technician enters the final amount, which is what you pay."],
  ["Why isn't my service visible?", "New and edited services wait for admin approval. Once approved and switched on, they appear on the public pages."],
];

export default function AboutPage() {
  return (
    <>
      <section className="bg-bench border-b">
        <div className="container py-14 md:py-20">
          <h1 className="section-title max-w-3xl">A repair shop you can watch working, and only pay once it&apos;s done.</h1>
          <p className="section-lead max-w-2xl">
            Finding a trustworthy technician is hard. Handing over a device with no updates is worse. FixMate gives every
            job a clear status and moves the payment to the end of the process.
          </p>
        </div>
      </section>

      <HowItWorks />

      <section className="section-pad container">
        <h2 className="section-title">Built for three kinds of people</h2>
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {ROLES.map((r) => (
            <div key={r.title} className="rounded-2xl border bg-card p-7 shadow-sm">
              <h3 className="text-xl font-bold">{r.title}</h3>
              <ul className="mt-4 space-y-3 text-sm leading-relaxed text-muted-foreground">
                {r.points.map((p) => (
                  <li key={p} className="flex gap-3">
                    <span className="mt-2 size-1.5 shrink-0 rounded-full bg-primary" /> {p}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      <section className="border-t bg-card section-pad">
        <div className="container max-w-3xl">
          <h2 className="section-title">Questions we hear a lot</h2>
          <div className="mt-8 divide-y rounded-2xl border bg-background">
            {FAQ.map(([q, a]) => (
              <details key={q} className="group p-5">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-bold">
                  {q}
                  <ChevronDown className="size-5 shrink-0 transition-transform group-open:rotate-180" />
                </summary>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{a}</p>
              </details>
            ))}
          </div>
          <div className="mt-10 flex gap-3">
            <Button asChild size="lg">
              <Link href="/services">Browse services</Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link href="/sign-up">Create an account</Link>
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
