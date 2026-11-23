/**
 * Client helper for the Express API.
 * Every private request carries a BetterAuth-issued JWT:  Authorization: Bearer <token>
 */
import { authClient } from "./auth-client";

export const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000";

export class ApiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

let tokenCache: { token: string; at: number } | null = null;

export function clearTokenCache() {
  tokenCache = null;
}

async function getToken() {
  if (tokenCache && Date.now() - tokenCache.at < 4 * 60 * 1000) return tokenCache.token;
  const { data } = await authClient.token();
  if (!data?.token) return null;
  tokenCache = { token: data.token, at: Date.now() };
  return data.token;
}

type Options = { method?: string; body?: unknown; auth?: boolean };

async function request<T>(path: string, { method = "GET", body, auth = true }: Options = {}): Promise<T> {
  const headers: Record<string, string> = { "Content-Type": "application/json" };
  if (auth) {
    const token = await getToken();
    if (!token) throw new ApiError("Please sign in to continue.", 401);
    headers.Authorization = `Bearer ${token}`;
  }

  let res: Response;
  try {
    res = await fetch(`${API_URL}${path}`, {
      method,
      headers,
      body: body === undefined ? undefined : JSON.stringify(body),
    });
  } catch {
    throw new ApiError("Cannot reach the server. Check that the API is running.", 0);
  }

  const text = await res.text();
  const data = text ? safeJson(text) : null;
  if (!res.ok) {
    const message =
      (data && typeof data === "object" && ("message" in data || "error" in data)
        ? ((data as { message?: string; error?: string }).message ??
          (data as { error?: string }).error)
        : null) ?? `Request failed (${res.status})`;
    if (res.status === 401) clearTokenCache();
    throw new ApiError(message, res.status);
  }
  return data as T;
}

function safeJson(text: string) {
  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
}

export const api = {
  get: <T>(path: string) => request<T>(path),
  post: <T>(path: string, body?: unknown) => request<T>(path, { method: "POST", body }),
  patch: <T>(path: string, body?: unknown) => request<T>(path, { method: "PATCH", body }),
  delete: <T>(path: string) => request<T>(path, { method: "DELETE" }),
};
