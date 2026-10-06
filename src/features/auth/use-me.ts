"use client";

import { useQuery } from "@tanstack/react-query";

import { getMe } from "./api";
import { meQueryKey } from "./query";
import { useAuthStore } from "./store";

export function useMe() {
  const status = useAuthStore((state) => state.status);

  return useQuery({
    queryKey: meQueryKey,
    queryFn: getMe,
    enabled: status === "authenticated",
    retry: false,
    staleTime: 60_000,
  });
}
