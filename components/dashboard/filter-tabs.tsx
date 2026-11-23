"use client";

import { cn } from "@/lib/utils";

export function FilterTabs<T extends string>({
  value,
  onChange,
  options,
}: {
  value: T;
  onChange: (v: T) => void;
  options: { value: T; label: string; count?: number }[];
}) {
  return (
    <div className="flex flex-wrap gap-2" role="tablist">
      {options.map((o) => (
        <button
          key={o.value}
          role="tab"
          aria-selected={value === o.value}
          onClick={() => onChange(o.value)}
          className={cn(
            "inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold transition-colors",
            value === o.value ? "border-secondary bg-secondary text-secondary-foreground" : "bg-card text-muted-foreground hover:bg-muted hover:text-foreground",
          )}
        >
          {o.label}
          {o.count !== undefined && (
            <span className={cn("rounded-full px-2 py-0.5 text-xs", value === o.value ? "bg-white/20" : "bg-muted")}>{o.count}</span>
          )}
        </button>
      ))}
    </div>
  );
}
