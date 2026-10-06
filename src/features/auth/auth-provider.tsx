"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import type { ReactNode } from "react";

import { restoreSession } from "./api";
import { setupAuthInterceptor } from "./interceptor";
import { sessionQueryKey } from "./query";

export function AuthProvider({ children }: { children: ReactNode }) {
  const queryClient = useQueryClient();
  setupAuthInterceptor(queryClient);

  useQuery({
    queryKey: sessionQueryKey,
    queryFn: restoreSession,
    enabled: typeof window !== "undefined",
    retry: false,
    staleTime: Infinity,
    refetchOnMount: false,
    refetchOnReconnect: false,
    refetchOnWindowFocus: false,
  });

  return children;
}
