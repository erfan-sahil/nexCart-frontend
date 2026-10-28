import { ApiError } from "@/lib/api/errors";
import { serverGet } from "@/lib/api/server";
import type { PaginationMeta } from "@/lib/api/types";

import type {
  CatalogCollection,
  CatalogHome,
  CatalogProduct,
  CatalogSort,
  CatalogStore,
  CategoryNode,
} from "./types";
import { CATALOG_COLLECTIONS } from "./types";

export const CATALOG_PAGE_SIZE = 24;

const RESERVED_COLLECTIONS = new Set(["recommended", "recently-viewed"]);

export function isCatalogCollection(
  value: string | undefined,
): value is CatalogCollection {
  return Boolean(
    value && (CATALOG_COLLECTIONS as readonly string[]).includes(value),
  );
}

export function isReservedCollection(value: string | undefined) {
  return Boolean(value && RESERVED_COLLECTIONS.has(value));
}

export function findCategory(
  nodes: CategoryNode[],
  slug: string,
): CategoryNode | undefined {
  for (const node of nodes) {
    if (node.slug === slug) return node;
    const child = findCategory(node.children ?? [], slug);
    if (child) return child;
  }
}

export async function getCatalogHome() {
  const body = await serverGet<CatalogHome>("/catalog/home", undefined, {
    revalidate: 60,
  });
  return body.data;
}

export async function getCategoryTree() {
  try {
    const body = await serverGet<CategoryNode[]>(
      "/categories/tree",
      { isActive: true },
      { revalidate: 300 },
    );
    return body.data ?? [];
  } catch {
    return [];
  }
}

export async function getRelatedProducts(slug: string, limit = 8) {
  const body = await serverGet<CatalogProduct[]>(
    `/catalog/products/${encodeURIComponent(slug)}/related`,
    { limit },
  );
  return body.data;
}

export async function getProductBySlug(slug: string) {
  try {
    const body = await serverGet<CatalogProduct>(
      `/products/slug/${encodeURIComponent(slug)}`,
    );
    return body.data;
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) return null;
    throw error;
  }
}

export async function getStoreBySlug(slug: string) {
  try {
    const body = await serverGet<CatalogStore>(
      `/stores/slug/${encodeURIComponent(slug)}`,
    );
    return body.data;
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) return null;
    throw error;
  }
}

export type CatalogListQuery = {
  page?: number;
  limit?: number;
  search?: string;
  categoryId?: string;
  minPrice?: number;
  maxPrice?: number;
  minRating?: number;
  sort?: CatalogSort;
};

export type CatalogListResult = {
  items: CatalogProduct[];
  pagination: PaginationMeta;
};

function paginationOf(
  meta: PaginationMeta | undefined,
  fallback: { page: number; limit: number; count: number },
): PaginationMeta {
  if (meta) return meta;

  return {
    page: fallback.page,
    limit: fallback.limit,
    total: fallback.count,
    totalPages: fallback.count > 0 ? 1 : 0,
  };
}

export async function listCollection(
  collection: CatalogCollection,
  query: CatalogListQuery,
) {
  const page = query.page ?? 1;
  const limit = query.limit ?? CATALOG_PAGE_SIZE;
  const body = await serverGet<CatalogProduct[]>(
    `/catalog/collections/${collection}`,
    { ...query, page, limit },
  );

  return {
    items: body.data,
    pagination: paginationOf(body.meta?.pagination, {
      page,
      limit,
      count: body.data.length,
    }),
  } satisfies CatalogListResult;
}

export async function listProducts(query: CatalogListQuery) {
  const page = query.page ?? 1;
  const limit = query.limit ?? CATALOG_PAGE_SIZE;
  const body = await serverGet<CatalogProduct[]>("/products", {
    ...query,
    page,
    limit,
  });

  return {
    items: body.data,
    pagination: paginationOf(body.meta?.pagination, {
      page,
      limit,
      count: body.data.length,
    }),
  } satisfies CatalogListResult;
}
