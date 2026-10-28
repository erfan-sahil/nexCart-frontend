"use client";

import { ProductSearchField } from "@/components/search/product-search-field";

import type { FilterCategory, ProductQuery } from "../lib/query";

type ProductsSearchProps = {
  query: ProductQuery;
  category?: FilterCategory | null;
};

function scopeCategoryId(
  query: ProductQuery,
  category?: FilterCategory | null,
) {
  if (!category) return undefined;
  if (!query.subcategory) return category.id;

  return (
    category.children.find((child) => child.slug === query.subcategory)?.id ??
    category.id
  );
}

export function ProductsSearch({ query, category }: ProductsSearchProps) {
  const categoryId = scopeCategoryId(query, category);
  const hidden = {
    collection: query.collection ?? "",
    category: query.category ?? "",
    subcategory: query.subcategory ?? "",
    sort: query.sortExplicit || query.sort !== "featured" ? query.sort : "",
    price: query.price ?? "",
    rating: query.rating ? String(query.rating) : "",
  };

  return (
    <ProductSearchField
      key={`${query.q ?? ""}:${query.category ?? ""}:${query.subcategory ?? ""}`}
      className="min-w-0 flex-1"
      defaultQuery={query.q ?? ""}
      hidden={hidden}
      categoryId={categoryId}
      placeholder="Search this catalog"
      label="Search products"
      shellClassName="border-border bg-card"
      emptyMessage={
        categoryId
          ? "No close matches in this catalog."
          : "No close matches. Search the full catalog instead."
      }
    />
  );
}
