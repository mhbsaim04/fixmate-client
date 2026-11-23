"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState, useTransition } from "react";
import { Loader2, Search, X } from "lucide-react";
import { CATEGORIES, SERVICE_MODES, SORT_OPTIONS } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";

/**
 * Search / filter / sort live in the URL (?search=&category=&mode=&sort=&page=).
 * The Next.js server page reads them and asks MongoDB through the API, so nothing is filtered on the client
 * and filters survive a reload or a shared link.
 */
export function ServiceFilters() {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  const [pending, startTransition] = useTransition();
  const [query, setQuery] = useState(params.get("search") ?? "");

  const push = (patch: Record<string, string | undefined>) => {
    const next = new URLSearchParams(params.toString());
    Object.entries(patch).forEach(([k, v]) => (v ? next.set(k, v) : next.delete(k)));
    next.delete("page");
    startTransition(() => router.replace(`${pathname}?${next.toString()}`, { scroll: false }));
  };

  // Debounce typing so we don't hit the API on every keystroke.
  useEffect(() => {
    const t = setTimeout(() => {
      if ((params.get("search") ?? "") !== query.trim()) push({ search: query.trim() || undefined });
    }, 400);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query]);

  // Keep the box in sync when the URL changes from elsewhere (e.g. "Clear filters").
  useEffect(() => {
    setQuery(params.get("search") ?? "");
  }, [params]);

  const hasFilters = ["search", "category", "mode", "sort"].some((k) => params.get(k));

  return (
    <div className="rounded-2xl border bg-card p-4 shadow-sm md:p-5">
      <div className="grid gap-3 md:grid-cols-[1.6fr_1fr_1fr_1fr_auto]">
        <div className="relative">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by title or category"
            aria-label="Search services"
            className="pl-10 pr-10"
          />
          {pending && <Loader2 className="absolute right-3.5 top-1/2 size-4 -translate-y-1/2 animate-spin text-muted-foreground" />}
        </div>
        <Select aria-label="Category" value={params.get("category") ?? ""} onChange={(e) => push({ category: e.target.value || undefined })}>
          <option value="">All categories</option>
          {CATEGORIES.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </Select>
        <Select aria-label="Service mode" value={params.get("mode") ?? ""} onChange={(e) => push({ mode: e.target.value || undefined })}>
          <option value="">Any service mode</option>
          {SERVICE_MODES.map((m) => (
            <option key={m} value={m}>
              {m}
            </option>
          ))}
        </Select>
        <Select aria-label="Sort" value={params.get("sort") ?? "newest"} onChange={(e) => push({ sort: e.target.value === "newest" ? undefined : e.target.value })}>
          {SORT_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </Select>
        <Button
          variant="ghost"
          disabled={!hasFilters}
          onClick={() => {
            setQuery("");
            startTransition(() => router.replace(pathname, { scroll: false }));
          }}
        >
          <X /> Clear
        </Button>
      </div>
    </div>
  );
}
