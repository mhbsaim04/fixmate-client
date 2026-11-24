"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useRef, useState, useTransition } from "react";
import { Loader2, Search, X } from "lucide-react";
import { CATEGORIES, CATEGORY_META, SERVICE_MODES, SORT_OPTIONS } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

function ServiceSearch({
  initialValue,
  pending,
  onSearch,
}: {
  initialValue: string;
  pending: boolean;
  onSearch: (value: string | undefined) => void;
}) {
  const [query, setQuery] = useState(initialValue);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleShortcut = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null;
      const isTyping =
        target instanceof HTMLInputElement ||
        target instanceof HTMLTextAreaElement ||
        target?.isContentEditable;

      if (event.key === "/" && !isTyping && !event.metaKey && !event.ctrlKey && !event.altKey) {
        event.preventDefault();
        inputRef.current?.focus();
      }
    };

    window.addEventListener("keydown", handleShortcut);
    return () => window.removeEventListener("keydown", handleShortcut);
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (initialValue !== query.trim()) onSearch(query.trim() || undefined);
    }, 350);
    return () => clearTimeout(timer);
  }, [initialValue, onSearch, query]);

  const submit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onSearch(query.trim() || undefined);
  };

  const clear = () => {
    setQuery("");
    onSearch(undefined);
    inputRef.current?.focus();
  };

  return (
    <form onSubmit={submit} className="relative sm:col-span-2 lg:col-span-1">
      <label htmlFor="service-search" className="mb-1.5 block text-xs font-semibold text-muted-foreground">
        Search services
      </label>
      <div className="flex h-12 items-center gap-2 rounded-xl border border-input bg-background px-3 transition-all focus-within:border-primary/50 focus-within:ring-4 focus-within:ring-primary/10">
        <Search className="size-4 shrink-0 text-primary" aria-hidden />
        <Input
          ref={inputRef}
          id="service-search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Escape" && query) clear();
          }}
          placeholder="Try “phone screen repair”"
          aria-label="Search services"
          className="h-full min-w-0 flex-1 border-0 bg-transparent px-0 shadow-none focus-visible:ring-0"
        />
        {query && (
          <button type="button" onClick={clear} aria-label="Clear search" className="grid size-7 shrink-0 place-items-center rounded-full text-muted-foreground transition hover:bg-muted hover:text-foreground">
            <X className="size-4" />
          </button>
        )}
        {pending ? (
          <Loader2 className="size-4 shrink-0 animate-spin text-primary" aria-label="Updating results" />
        ) : (
          <kbd className="hidden shrink-0 rounded-md border bg-muted px-1.5 py-0.5 font-sans text-[10px] text-muted-foreground sm:inline">/</kbd>
        )}
        <button type="submit" className="sr-only">Search</button>
      </div>
    </form>
  );
}

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

  const push = useCallback((patch: Record<string, string | undefined>) => {
    const next = new URLSearchParams(params.toString());
    Object.entries(patch).forEach(([k, v]) => (v ? next.set(k, v) : next.delete(k)));
    next.delete("page");
    const queryString = next.toString();
    startTransition(() => router.replace(queryString ? `${pathname}?${queryString}` : pathname, { scroll: false }));
  }, [params, pathname, router, startTransition]);
  const updateSearch = useCallback((value: string | undefined) => {
    push({ search: value });
  }, [push]);

  const search = params.get("search") ?? "";
  const category = params.get("category") ?? "";
  const mode = params.get("mode") ?? "";
  const sort = params.get("sort") ?? "";
  const selectedSort = SORT_OPTIONS.find((option) => option.value === sort);
  const activeFilters = [
    ...(search ? [{ key: "search", label: `“${search}”` }] : []),
    ...(category ? [{ key: "category", label: category }] : []),
    ...(mode ? [{ key: "mode", label: mode }] : []),
    ...(selectedSort && selectedSort.value !== "newest" ? [{ key: "sort", label: selectedSort.label }] : []),
  ];
  const hasFilters = activeFilters.length > 0;

  return (
    <div className="rounded-3xl border bg-card p-4 shadow-lg shadow-secondary/5 sm:p-6">
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.14em] text-primary">Find your fix</p>
          <h2 className="mt-1 font-display text-xl font-bold">Search and filter services</h2>
        </div>
        <p className="flex items-center gap-2 text-xs text-muted-foreground" aria-live="polite">
          {pending ? <Loader2 className="size-4 animate-spin text-primary" /> : <span className="size-2 rounded-full bg-emerald-500" />}
          {pending ? "Updating results" : "Verified listings"}
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-[minmax(14rem,1.6fr)_minmax(10rem,1fr)_minmax(10rem,1fr)_minmax(10rem,1fr)_auto]">
        <ServiceSearch key={search} initialValue={search} pending={pending} onSearch={updateSearch} />
        <label className="block text-xs font-semibold text-muted-foreground">
          Category
          <select
            aria-label="Category"
            value={category}
            onChange={(e) => push({ category: e.target.value || undefined })}
            className="mt-1.5 h-11 w-full rounded-xl border border-input bg-background px-3 text-sm font-medium text-foreground outline-none transition focus-visible:ring-2 focus-visible:ring-ring"
          >
            <option value="">All categories</option>
            {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
        </label>
        <label className="block text-xs font-semibold text-muted-foreground">
          Service type
          <select
            aria-label="Service mode"
            value={mode}
            onChange={(e) => push({ mode: e.target.value || undefined })}
            className="mt-1.5 h-11 w-full rounded-xl border border-input bg-background px-3 text-sm font-medium text-foreground outline-none transition focus-visible:ring-2 focus-visible:ring-ring"
          >
            <option value="">Any service type</option>
            {SERVICE_MODES.map((m) => <option key={m} value={m}>{m}</option>)}
          </select>
        </label>
        <label className="block text-xs font-semibold text-muted-foreground">
          Sort by
          <select
            aria-label="Sort"
            value={sort || "newest"}
            onChange={(e) => push({ sort: e.target.value === "newest" ? undefined : e.target.value })}
            className="mt-1.5 h-11 w-full rounded-xl border border-input bg-background px-3 text-sm font-medium text-foreground outline-none transition focus-visible:ring-2 focus-visible:ring-ring"
          >
            {SORT_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>
        </label>
        <div className="flex items-end sm:col-span-2 lg:col-span-1">
          <Button
            variant="outline"
            className="h-11 w-full rounded-xl lg:w-auto"
            disabled={!hasFilters}
            onClick={() => startTransition(() => router.replace(pathname, { scroll: false }))}
          >
            <X /> Clear filters
          </Button>
        </div>
      </div>

      <div className="mt-5 border-t pt-4">
        <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
          <p className="text-xs font-semibold text-muted-foreground">Quick category filters</p>
          <p className="text-[11px] text-muted-foreground">Tip: press <kbd className="rounded border bg-muted px-1 py-0.5 font-sans">/</kbd> to search</p>
        </div>
        <div className="flex gap-2 overflow-x-auto pb-1 sm:flex-wrap sm:overflow-visible">
          {CATEGORIES.map((category) => {
            const Icon = CATEGORY_META[category].icon;
            const selected = params.get("category") === category;
            return (
              <button
                key={category}
                type="button"
                aria-pressed={selected}
                onClick={() => push({ category: selected ? undefined : category })}
                className={cn(
                  "inline-flex shrink-0 items-center gap-2 rounded-full border px-3.5 py-2 text-xs font-semibold transition-all duration-200 hover:-translate-y-0.5",
                  selected
                    ? "border-secondary bg-secondary text-secondary-foreground shadow-sm"
                    : "border-border bg-background text-muted-foreground hover:border-primary/40 hover:bg-primary/5 hover:text-foreground",
                )}
              >
                <Icon className="size-3.5" />
                {category}
              </button>
            );
          })}
        </div>
      </div>

      {activeFilters.length > 0 && (
        <div className="mt-4 flex flex-wrap items-center gap-2" aria-label="Active filters">
          <span className="mr-1 text-xs font-semibold text-muted-foreground">Active:</span>
          {activeFilters.map(({ key, label }) => (
            <button
              key={key}
              type="button"
              onClick={() => push({ [key]: undefined })}
              className="inline-flex max-w-full items-center gap-1.5 rounded-full border border-primary/15 bg-primary/5 py-1 pl-3 pr-1.5 text-xs font-medium text-foreground transition hover:border-destructive/30 hover:bg-destructive/5"
              aria-label={`Remove ${label} filter`}
            >
              <span className="truncate">{label}</span>
              <X className="size-3.5 shrink-0 text-muted-foreground" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
