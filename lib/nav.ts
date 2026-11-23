import {
  Briefcase,
  CalendarCheck,
  ClipboardList,
  CreditCard,
  LayoutDashboard,
  ListChecks,
  PlusCircle,
  Receipt,
  UserCog,
  Users,
  Wrench,
  type LucideIcon,
} from "lucide-react";
import type { Role } from "./types";

export interface NavItem {
  href: string;
  label: string;
  icon: LucideIcon;
  exact?: boolean;
}

export const DASHBOARD_NAV: Record<Role, NavItem[]> = {
  customer: [
    { href: "/dashboard/customer", label: "Overview", icon: LayoutDashboard, exact: true },
    { href: "/dashboard/customer/bookings", label: "My Bookings", icon: ClipboardList },
    { href: "/dashboard/customer/payments", label: "Payment History", icon: CreditCard },
    { href: "/dashboard/profile", label: "Update Profile", icon: UserCog },
  ],
  technician: [
    { href: "/dashboard/technician", label: "Overview", icon: LayoutDashboard, exact: true },
    { href: "/dashboard/technician/add-service", label: "Add a Service", icon: PlusCircle },
    { href: "/dashboard/technician/my-services", label: "My Services", icon: Wrench },
    { href: "/dashboard/technician/requests", label: "Manage Requests", icon: Briefcase },
    { href: "/dashboard/profile", label: "Update Profile", icon: UserCog },
  ],
  admin: [
    { href: "/dashboard/admin", label: "Overview", icon: LayoutDashboard, exact: true },
    { href: "/dashboard/admin/users", label: "Manage Users", icon: Users },
    { href: "/dashboard/admin/services", label: "Service Approval", icon: ListChecks },
    { href: "/dashboard/admin/bookings", label: "All Bookings", icon: CalendarCheck },
    { href: "/dashboard/admin/transactions", label: "Transactions", icon: Receipt },
    { href: "/dashboard/profile", label: "Update Profile", icon: UserCog },
  ],
};
