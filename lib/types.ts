export type Role = "customer" | "technician" | "admin";
export type BookingStatus =
  | "requested"
  | "accepted"
  | "rejected"
  | "in-progress"
  | "completed"
  | "cancelled";
export type PaymentStatus = "unpaid" | "paid";
export type ApprovalStatus = "pending" | "approved" | "rejected";
export type ServiceMode = "Home Visit" | "Shop Drop-off";

export interface AppUser {
  _id: string;
  name: string;
  email: string;
  image?: string | null;
  role: Role;
  phone?: string;
  area?: string;
  bio?: string;
  createdAt?: string;
}

export interface TechnicianInfo {
  name: string;
  email?: string;
  image?: string | null;
  area?: string;
  bio?: string;
}

export interface Service {
  _id: string;
  title: string;
  category: string;
  description: string;
  image: string;
  basePrice: number;
  estimatedDuration: string;
  serviceMode: ServiceMode;
  serviceArea: string;
  technicianName: string;
  technicianEmail: string;
  approvalStatus: ApprovalStatus;
  isAvailable: boolean;
  createdAt: string;
  /** Joined by the API on GET /api/services/:id */
  technician?: TechnicianInfo;
  avgRating?: number;
  reviewCount?: number;
}

export interface StatusHistoryItem {
  status: string;
  changedAt: string;
}

export interface Booking {
  _id: string;
  serviceId: string;
  serviceTitle: string;
  serviceImage: string;
  category: string;
  basePrice: number;
  technicianName: string;
  technicianEmail: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  address: string;
  preferredDate: string;
  problemDescription: string;
  status: BookingStatus;
  finalAmount: number;
  paymentStatus: PaymentStatus;
  createdAt?: string;
  rating?: number;
  review?: string;
  statusHistory?: StatusHistoryItem[];
}

export interface Payment {
  _id: string;
  bookingId: string;
  serviceTitle: string;
  customerName: string;
  customerEmail: string;
  technicianName: string;
  technicianEmail: string;
  amount: number;
  currency: string;
  transactionId: string;
  stripeSessionId: string;
  paymentStatus: "paid";
  paidAt: string;
}

export interface ServiceQuery {
  search?: string;
  category?: string;
  mode?: string;
  sort?: string;
  page?: number;
  limit?: number;
}

export interface ServicesResponse {
  services: Service[];
  total: number;
  page: number;
  totalPages: number;
}
