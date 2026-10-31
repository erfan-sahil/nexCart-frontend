import type { CatalogListQuery } from "@/features/catalog/api";
import type { CatalogProduct } from "@/features/catalog/types";
import { api } from "@/lib/api/client";
import { toApiError } from "@/lib/api/errors";
import type { ApiSuccess, PaginationMeta } from "@/lib/api/types";

export type RecommendationsResult = {
  items: CatalogProduct[];
  pagination: PaginationMeta;
  personalized: boolean;
};

function paginationOf(
  meta: ApiSuccess<CatalogProduct[]>["meta"],
  fallback: { page: number; limit: number; count: number },
): PaginationMeta {
  if (meta?.pagination) return meta.pagination;

  return {
    page: fallback.page,
    limit: fallback.limit,
    total: fallback.count,
    totalPages: fallback.count > 0 ? 1 : 0,
  };
}

export async function listRecommendations(query: CatalogListQuery = {}) {
  try {
    const page = query.page ?? 1;
    const limit = query.limit;
    const { data } = await api.get<ApiSuccess<CatalogProduct[]>>(
      "/catalog/recommendations",
      { params: { ...query, page, limit } },
    );

    return {
      items: data.data,
      pagination: paginationOf(data.meta, {
        page,
        limit: limit ?? data.data.length,
        count: data.data.length,
      }),
      personalized: data.meta?.personalized ?? false,
    } satisfies RecommendationsResult;
  } catch (error) {
    throw toApiError(error);
  }
}
