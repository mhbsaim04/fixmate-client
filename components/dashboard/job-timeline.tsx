import { Check, X } from "lucide-react";
import { cn, formatDateTime } from "@/lib/utils";
import type { Booking } from "@/lib/types";

const FLOW = [
  { key: "requested", label: "Requested" },
  { key: "accepted", label: "Accepted" },
  { key: "in-progress", label: "In Progress" },
  { key: "completed", label: "Completed" },
  { key: "paid", label: "Paid" },
];

/** Visual tracker from statusHistory (falls back to the current status when the API has no history). */
export function JobTimeline({ booking }: { booking: Booking }) {
  const dead = booking.status === "rejected" || booking.status === "cancelled";
  const steps = dead
    ? [FLOW[0], { key: booking.status, label: booking.status === "rejected" ? "Rejected" : "Cancelled" }]
    : FLOW;

  let current = steps.findIndex((s) => s.key === booking.status);
  if (!dead && booking.paymentStatus === "paid") current = 4;
  if (dead) current = 1;

  const when = (key: string) => booking.statusHistory?.find((h) => h.status === key)?.changedAt;

  return (
    <ol className="space-y-0">
      {steps.map((s, i) => {
        const reached = i <= current;
        const isDeadStep = dead && i === 1;
        return (
          <li key={s.key} className="relative flex gap-4 pb-6 last:pb-0">
            {i < steps.length - 1 && (
              <span aria-hidden className={cn("absolute left-[15px] top-8 h-[calc(100%-2rem)] w-0.5", i < current ? "bg-primary" : "bg-border")} />
            )}
            <span
              className={cn(
                "relative z-10 grid size-8 shrink-0 place-items-center rounded-full border-2",
                isDeadStep
                  ? "border-red-500 bg-red-500 text-white"
                  : reached
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-input bg-card text-transparent",
              )}
            >
              {isDeadStep ? <X className="size-4" strokeWidth={3} /> : <Check className="size-4" strokeWidth={3} />}
            </span>
            <div className="pt-1">
              <p className={cn("text-sm font-bold", !reached && "text-muted-foreground")}>{s.label}</p>
              {when(s.key) && <p className="text-xs text-muted-foreground">{formatDateTime(when(s.key))}</p>}
              {i === current && !dead && s.key !== "paid" && <p className="text-xs font-semibold text-primary">Current stage</p>}
            </div>
          </li>
        );
      })}
    </ol>
  );
}
