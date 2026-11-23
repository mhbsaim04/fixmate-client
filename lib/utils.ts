export { cn } from "cn"

export function formatCurrency(value: number | undefined | null) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 2,
  }).format(value ?? 0);
}

export function formatDate(value?: string | Date | null) {
  if (!value) return "—";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleDateString("en-US", { day: "numeric", month: "short", year: "numeric" });
}

export function formatDateTime(value?: string | Date | null) {
  if (!value) return "—";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleString("en-US", {
    day: "numeric",
    month: "short",
    hour: "numeric",
    minute: "2-digit",
  });
}

export function initials(name?: string | null) {
  if (!name) return "FM";
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase())
    .join("");
}

/** yyyy-mm-dd for <input type="date" min=...> in the user's local time zone */
export function todayISO() {
  const d = new Date();
  d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
  return d.toISOString().slice(0, 10);
}

/** Buckets items into the last N calendar months (for dashboard charts). */
export function monthlySeries<T>(
  items: T[],
  getDate: (item: T) => string | undefined,
  getValue: (item: T) => number = () => 1,
  months = 6,
) {
  const now = new Date();
  const out: { key: string; label: string; value: number }[] = [];
  for (let i = months - 1; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    out.push({
      key: `${d.getFullYear()}-${d.getMonth()}`,
      label: d.toLocaleString("en-US", { month: "short" }),
      value: 0,
    });
  }
  for (const item of items) {
    const raw = getDate(item);
    if (!raw) continue;
    const d = new Date(raw);
    const slot = out.find((o) => o.key === `${d.getFullYear()}-${d.getMonth()}`);
    if (slot) slot.value += getValue(item);
  }
  return out;
}

/** Only allow same-site redirects (prevents open-redirect through ?redirect=) */
export function safeRedirect(path?: string | null, fallback = "/dashboard") {
  if (!path || !path.startsWith("/") || path.startsWith("//")) return fallback;
  return path;
}
