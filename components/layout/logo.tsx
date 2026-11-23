import Link from "next/link";
import { Wrench } from "lucide-react";
import { cn } from "@/lib/utils";

/** Same mark, same size, on every page. `light` is for dark surfaces (footer). */
export function Logo({ light = false, compact = false, className }: { light?: boolean; compact?: boolean; className?: string }) {
  return (
    <Link href="/" aria-label="FixMate home" className={cn("inline-flex items-center gap-2.5", className)}>
      <span className="grid size-10 place-items-center rounded-xl bg-accent text-accent-foreground shadow-[0_6px_16px_-6px_hsl(var(--accent)/0.9)] ring-2 ring-secondary/90 dark:ring-transparent">
        <Wrench className="size-5 -rotate-45" strokeWidth={2.6} />
      </span>
      {!compact && (
        <span className={cn("font-display text-[22px] font-extrabold tracking-tight", light && "text-white")}>
          FixMate
        </span>
      )}
    </Link>
  );
}
