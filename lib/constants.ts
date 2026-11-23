import {
  Droplets,
  Fan,
  Laptop,
  Smartphone,
  Snowflake,
  Tv,
  Zap,
  type LucideIcon,
} from "lucide-react";
import type { ApprovalStatus, BookingStatus, PaymentStatus, Role, ServiceMode } from "./types";

export const CATEGORIES = [
  "Smartphone",
  "Laptop & PC",
  "AC",
  "Refrigerator",
  "TV",
  "Washing Machine",
  "Electrical",
] as const;

export const SERVICE_MODES: ServiceMode[] = ["Home Visit", "Shop Drop-off"];

export const SORT_OPTIONS = [
  { value: "newest", label: "Newest first" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
];

export const CATEGORY_META: Record<string, { icon: LucideIcon; blurb: string; tone: string }> = {
  Smartphone: {
    icon: Smartphone,
    blurb: "Screens, batteries, charging ports",
    tone: "bg-sky-100 text-sky-700 dark:bg-sky-500/15 dark:text-sky-300",
  },
  "Laptop & PC": {
    icon: Laptop,
    blurb: "Servicing, upgrades, data rescue",
    tone: "bg-violet-100 text-violet-700 dark:bg-violet-500/15 dark:text-violet-300",
  },
  AC: {
    icon: Fan,
    blurb: "Gas refill, cleaning, installation",
    tone: "bg-cyan-100 text-cyan-700 dark:bg-cyan-500/15 dark:text-cyan-300",
  },
  Refrigerator: {
    icon: Snowflake,
    blurb: "Cooling faults and compressor repair",
    tone: "bg-teal-100 text-teal-700 dark:bg-teal-500/15 dark:text-teal-300",
  },
  TV: {
    icon: Tv,
    blurb: "Panel, backlight and board repair",
    tone: "bg-rose-100 text-rose-700 dark:bg-rose-500/15 dark:text-rose-300",
  },
  "Washing Machine": {
    icon: Droplets,
    blurb: "Drum, drain and motor problems",
    tone: "bg-indigo-100 text-indigo-700 dark:bg-indigo-500/15 dark:text-indigo-300",
  },
  Electrical: {
    icon: Zap,
    blurb: "Wiring, switches and safe fittings",
    tone: "bg-amber-100 text-amber-800 dark:bg-amber-500/15 dark:text-amber-300",
  },
};

export const ROLE_LABEL: Record<Role, string> = {
  customer: "Customer",
  technician: "Technician",
  admin: "Admin",
};

export const ROLE_TONE: Record<Role, string> = {
  customer: "bg-sky-100 text-sky-700 dark:bg-sky-500/15 dark:text-sky-300",
  technician: "bg-violet-100 text-violet-700 dark:bg-violet-500/15 dark:text-violet-300",
  admin: "bg-rose-100 text-rose-700 dark:bg-rose-500/15 dark:text-rose-300",
};

export function roleHome(role?: string | null) {
  if (role === "admin") return "/dashboard/admin";
  if (role === "technician") return "/dashboard/technician";
  return "/dashboard/customer";
}

/** One colour language for every dashboard: blue → indigo → amber → green, with red/gray for dead ends. */
export const BOOKING_STATUS: Record<
  BookingStatus,
  { label: string; tone: string; hex: string }
> = {
  requested: {
    label: "Requested",
    tone: "bg-blue-100 text-blue-700 dark:bg-blue-500/15 dark:text-blue-300",
    hex: "#3b82f6",
  },
  accepted: {
    label: "Accepted",
    tone: "bg-indigo-100 text-indigo-700 dark:bg-indigo-500/15 dark:text-indigo-300",
    hex: "#6366f1",
  },
  "in-progress": {
    label: "In Progress",
    tone: "bg-amber-100 text-amber-800 dark:bg-amber-500/15 dark:text-amber-300",
    hex: "#f59e0b",
  },
  completed: {
    label: "Completed",
    tone: "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300",
    hex: "#10b981",
  },
  rejected: {
    label: "Rejected",
    tone: "bg-red-100 text-red-700 dark:bg-red-500/15 dark:text-red-300",
    hex: "#ef4444",
  },
  cancelled: {
    label: "Cancelled",
    tone: "bg-slate-200 text-slate-700 dark:bg-slate-500/20 dark:text-slate-300",
    hex: "#94a3b8",
  },
};

export const PAYMENT_STATUS: Record<PaymentStatus, { label: string; tone: string }> = {
  unpaid: {
    label: "Unpaid",
    tone: "bg-orange-100 text-orange-700 dark:bg-orange-500/15 dark:text-orange-300",
  },
  paid: {
    label: "Paid",
    tone: "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300",
  },
};

export const APPROVAL_STATUS: Record<ApprovalStatus, { label: string; tone: string }> = {
  pending: {
    label: "Pending",
    tone: "bg-amber-100 text-amber-800 dark:bg-amber-500/15 dark:text-amber-300",
  },
  approved: {
    label: "Approved",
    tone: "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300",
  },
  rejected: {
    label: "Rejected",
    tone: "bg-red-100 text-red-700 dark:bg-red-500/15 dark:text-red-300",
  },
};
