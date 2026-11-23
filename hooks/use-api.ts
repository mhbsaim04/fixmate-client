"use client";

import { useCallback, useEffect, useState } from "react";
import { api } from "@/lib/api";

/** Tiny data hook for private endpoints: { data, loading, error, reload }. */
export function useApi<T>(path: string | null) {
  const [data, setData] = useState<T | undefined>();
  const [loading, setLoading] = useState(Boolean(path));
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(
    async (silent = false) => {
      if (!path) return;
      if (!silent) setLoading(true);
      setError(null);
      try {
        setData(await api.get<T>(path));
      } catch (e) {
        setError(e instanceof Error ? e.message : "Something went wrong");
      } finally {
        setLoading(false);
      }
    },
    [path],
  );

  useEffect(() => {
    load();
  }, [load]);

  return { data, setData, loading, error, reload: load };
}
