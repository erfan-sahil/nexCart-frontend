import {
  CATALOG_PAGE_SIZE,
  findCategory,
  isCatalogCollection,
  isReservedCollection,
  listCollection,
  listProducts,
  toProduct,
  type CategoryNode,
} from "@/features/catalog";
import { mediaUrl } from "@/lib/media";
import type { Product } from "@/types";

import { PRICE_FILTERS, type FilterCategory, type ProductQuery } from "./query";

export type ProductListing = {
  products: Product[];
  total: number;
  page: number;
  totalPages: number;
  unavailable?: string;
};

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
  if (!query.collection) return query.sort;
  if (
    query.collection === "bestsellers" ||
    query.collection === "new-arrivals"
  ) {
    return query.sort;
  }
  return undefined;
}

export function toFilterCategories(nodes: CategoryNode[]): FilterCategory[] {
  return nodes
    .filter((node) => node.isActive)
    .map((node) => ({
      id: node.id,
      name: node.name,
      slug: node.slug,
      description: node.description,
      image: mediaUrl(node.image),
      children: (node.children ?? [])
        .filter((child) => child.isActive)
        .map((child) => ({
          id: child.id,
          name: child.name,
          slug: child.slug,
        })),
    }));
}

export async function loadProductListing(
  query: ProductQuery,
  page: number,
  categories: CategoryNode[],
): Promise<ProductListing> {
  if (isReservedCollection(query.collection)) {
    return {
      products: [],
      total: 0,
      page: 1,
      totalPages: 0,
      unavailable:
        "This collection is not available yet. Browse another section from the home page.",
    };
  }

  const slug = query.subcategory || query.category;
  const category = slug ? findCategory(categories, slug) : undefined;

  if (slug && !category) {
    return { products: [], total: 0, page: 1, totalPages: 0 };
  }

  const shared = {
    page,
    limit: CATALOG_PAGE_SIZE,
    search: query.q,
    categoryId: category?.id,
    minRating: query.rating,
    sort: sortFor(query),
    ...priceBounds(query),
  };

  const result = isCatalogCollection(query.collection)
    ? await listCollection(query.collection, shared)
    : await listProducts(shared);

  return {
    products: result.items.map(toProduct),
    total: result.pagination.total,
    page: result.pagination.page,
    totalPages: result.pagination.totalPages,
  };
}
