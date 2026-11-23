import Link from "next/link";
import { Button } from "@/components/ui/button";

export function TechnicianCta() {
  return (
    <section className="container section-pad">
      <div className="relative overflow-hidden rounded-3xl bg-accent p-8 text-accent-foreground md:p-14">
        <div className="hazard absolute inset-x-0 top-0 h-3" aria-hidden />
        <div className="flex flex-col items-start justify-between gap-8 pt-3 md:flex-row md:items-center">
          <div className="max-w-xl">
            <h2 className="font-display text-3xl font-extrabold leading-tight md:text-4xl">
              Fix things for a living? List your services on FixMate.
            </h2>
            <p className="mt-3 text-base leading-relaxed text-accent-foreground/80">
              Get structured requests, update job status in one click and receive payment after every completed job.
            </p>
          </div>
          <Button asChild size="lg" variant="secondary" className="shrink-0">
            <Link href="/sign-up">Join as a technician</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
