"use client";

import { useQuery } from "@tanstack/react-query";

import type { CatalogListQuery } from "@/features/catalog/api";
import { toProduct } from "@/features/catalog/map";
import { useAuthStore } from "@/features/auth/store";
import type { Product } from "@/types";
import type { PaginationMeta } from "@/lib/api/types";

import { listRecommendations } from "./api";

export type RecommendationsData = {
  products: Product[];
  pagination: PaginationMeta;
  personalized: boolean;
};

function stableParams(params: CatalogListQuery) {
  return {
    page: params.page ?? 1,
    limit: params.limit,
    search: params.search,
    categoryId: params.categoryId,
    minPrice: params.minPrice,
    maxPrice: params.maxPrice,
    minRating: params.minRating,
    sort: params.sort,
  };
}

export function recommendationsQueryKey(
  userKey: string,
  params: CatalogListQuery,
) {
  return ["recommendations", userKey, stableParams(params)] as const;
}

function userKeyFromAuth(status: string, userId?: string, role?: string) {
  if (status === "authenticated" && role === "customer" && userId) {
    return userId;
  }

  return "guest";
}

export function useRecommendations(params: CatalogListQuery) {
  const status = useAuthStore((state) => state.status);
  const user = useAuthStore((state) => state.user);
  const userKey = userKeyFromAuth(status, user?.id, user?.role);
  const enabled = status !== "loading";

  return useQuery({
    queryKey: recommendationsQueryKey(userKey, params),
    enabled,
    queryFn: async (): Promise<RecommendationsData> => {
      const result = await listRecommendations(params);

      return {
        products: result.items.map(toProduct),
        pagination: result.pagination,
        personalized: result.personalized,
      };
    },
  });
}
