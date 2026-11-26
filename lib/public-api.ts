/** Server-side fetchers for PUBLIC endpoints. They never throw so pages still render if the API is down. */
import type { Service, ServiceQuery, ServicesResponse, ServiceReview } from "./types";

const BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000";

export async function getServices(query: ServiceQuery = {}): Promise<ServicesResponse> {
  const params = new URLSearchParams();
  Object.entries(query).forEach(([key, value]) => {
    if (value !== undefined && value !== "") params.set(key, String(value));
  });
  const empty: ServicesResponse = { services: [], total: 0, page: Number(query.page) || 1, totalPages: 1 };
  try {
    const res = await fetch(`${BASE}/api/services?${params.toString()}`, { cache: "no-store" });
    if (!res.ok) return empty;
    const data = await res.json();
    return {
      services: data.services ?? [],
      total: data.total ?? 0,
      page: data.page ?? empty.page,
      totalPages: data.totalPages ?? 1,
    };
  } catch {
    return empty;
  }
}

export async function getService(id: string): Promise<Service | null> {
  try {
    const res = await fetch(`${BASE}/api/services/${encodeURIComponent(id)}`, { cache: "no-store" });
    if (!res.ok) return null;
    return (await res.json()) as Service;
  } catch {
    return null;
  }
}

export async function getServiceReviews(id: string): Promise<ServiceReview[]> {
  try {
    const res = await fetch(`${BASE}/api/services/${encodeURIComponent(id)}/reviews`, { cache: "no-store" });
    if (!res.ok) return [];
    return (await res.json()) as ServiceReview[];
  } catch {
    return [];
  }
}
