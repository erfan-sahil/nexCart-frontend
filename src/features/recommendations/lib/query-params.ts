import { findCategory, type CategoryNode } from "@/features/catalog";
import type { CatalogListQuery } from "@/features/catalog/api";
import {
  PRICE_FILTERS,
  type ProductQuery,
} from "@/features/products/lib/query";

function priceBounds(query: ProductQuery) {
  const price = PRICE_FILTERS.find((item) => item.id === query.price);
  if (!price) return {};

  return {
    minPrice: price.min,
    maxPrice: Number.isFinite(price.max)
      ? Number((price.max - 0.01).toFixed(2))
      : undefined,
  };
}

function sortFor(query: ProductQuery) {
  if (query.sortExplicit) return query.sort;
  return undefined;
}

export function recommendationsQueryFromProductQuery(
  query: ProductQuery,
  page: number,
  limit: number,
  categories: CategoryNode[],
): CatalogListQuery {
  const slug = query.subcategory || query.category;
  const category = slug ? findCategory(categories, slug) : undefined;

  return {
    page,
    limit,
    search: query.q,
    categoryId: category?.id,
    minRating: query.rating,
    sort: sortFor(query),
    ...priceBounds(query),
  };
}
