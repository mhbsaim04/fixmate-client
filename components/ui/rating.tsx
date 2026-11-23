"use client";

import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

export function RatingStars({ value, count, className }: { value?: number; count?: number; className?: string }) {
  if (!value) return <span className={cn("text-xs text-muted-foreground", className)}>New</span>;
  return (
    <span className={cn("inline-flex items-center gap-1 text-xs font-semibold", className)}>
      <Star className="size-3.5 fill-accent text-accent" />
      {value.toFixed(1)}
      {count ? <span className="font-normal text-muted-foreground">({count})</span> : null}
    </span>
  );
}

export function StarPicker({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  return (
    <div className="flex gap-1" role="radiogroup" aria-label="Rating">
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          key={n}
          type="button"
          role="radio"
          aria-checked={value === n}
          aria-label={`${n} star${n > 1 ? "s" : ""}`}
          onClick={() => onChange(n)}
          className="rounded-md p-1 transition-transform hover:scale-110"
        >
          <Star className={cn("size-8", n <= value ? "fill-accent text-accent" : "text-muted-foreground/40")} />
        </button>
      ))}
    </div>
  );
}
