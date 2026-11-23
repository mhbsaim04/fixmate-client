import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

function pagesToShow(page: number, total: number): (number | "…")[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
  const set = new Set([1, total, page - 1, page, page + 1]);
  const sorted = [...set].filter((n) => n >= 1 && n <= total).sort((a, b) => a - b);
  const out: (number | "…")[] = [];
  sorted.forEach((n, i) => {
    if (i > 0 && n - sorted[i - 1] > 1) out.push("…");
    out.push(n);
  });
  return out;
}

/** Server-rendered pager: Previous / numbered links / Next, keeping search, filter and sort params. */
export function Pagination({
  page,
  totalPages,
  searchParams,
}: {
  page: number;
  totalPages: number;
  searchParams: Record<string, string | undefined>;
}) {
  if (totalPages <= 1) return null;
  const href = (p: number) => {
    const q = new URLSearchParams();
    Object.entries(searchParams).forEach(([k, v]) => v && k !== "page" && q.set(k, v));
    if (p > 1) q.set("page", String(p));
    const s = q.toString();
    return s ? `/services?${s}` : "/services";
  };
  const btn = "grid h-10 min-w-10 place-items-center rounded-lg border px-3 text-sm font-semibold transition-colors";

  return (
    <nav aria-label="Pagination" className="mt-12 flex flex-wrap items-center justify-center gap-2">
      {page > 1 ? (
        <Link href={href(page - 1)} className={cn(btn, "gap-1 bg-card hover:bg-muted")}>
          <span className="flex items-center gap-1"><ChevronLeft className="size-4" /> Previous</span>
        </Link>
      ) : (
        <span className={cn(btn, "cursor-not-allowed opacity-40")}><span className="flex items-center gap-1"><ChevronLeft className="size-4" /> Previous</span></span>
      )}
      {pagesToShow(page, totalPages).map((p, i) =>
        p === "…" ? (
          <span key={`gap-${i}`} className="px-1 text-muted-foreground">…</span>
        ) : (
          <Link
            key={p}
            href={href(p)}
            aria-current={p === page ? "page" : undefined}
            className={cn(btn, p === page ? "border-secondary bg-secondary text-secondary-foreground" : "bg-card hover:bg-muted")}
          >
            {p}
          </Link>
        ),
      )}
      {page < totalPages ? (
        <Link href={href(page + 1)} className={cn(btn, "bg-card hover:bg-muted")}>
          <span className="flex items-center gap-1">Next <ChevronRight className="size-4" /></span>
        </Link>
      ) : (
        <span className={cn(btn, "cursor-not-allowed opacity-40")}><span className="flex items-center gap-1">Next <ChevronRight className="size-4" /></span></span>
      )}
    </nav>
  );
}
