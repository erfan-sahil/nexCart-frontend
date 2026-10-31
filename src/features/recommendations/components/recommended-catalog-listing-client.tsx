"use client";

import { ApiError } from "@/lib/api/errors";
import { CATALOG_PAGE_SIZE } from "@/features/catalog/api";
import type { CategoryNode } from "@/features/catalog";
import { ProductsView } from "@/features/products/products-view";
import type {
  FilterCategory,
  ProductQuery,
} from "@/features/products/lib/query";
import { ProductCardSkeleton } from "@/features/wishlist/components/product-card-skeleton";

import { PUBLIC_RECOMMENDATIONS_DESCRIPTION } from "../constants";
import { useRecommendations } from "../query";
import { recommendationsQueryFromProductQuery } from "../lib/query-params";

type RecommendedCatalogListingClientProps = {
  query: ProductQuery;
  page: number;
  categories: FilterCategory[];
  category: FilterCategory | null;
  categoryTree: CategoryNode[];
};

export function RecommendedCatalogListingClient({
  query,
  page,
  categories,
  category,
  categoryTree,
}: RecommendedCatalogListingClientProps) {
  const apiQuery = recommendationsQueryFromProductQuery(
    query,
    page,
    CATALOG_PAGE_SIZE,
    categoryTree,
  );
  const recommendations = useRecommendations(apiQuery);

  if (recommendations.isPending) {
    return (
      <ProductsView
        query={query}
        products={[]}
        total={0}
        page={page}
        totalPages={0}
        categories={categories}
        category={category}
        descriptionOverride={PUBLIC_RECOMMENDATIONS_DESCRIPTION}
        isLoading
      />
    );
  }

  if (recommendations.isError) {
    const message =
      recommendations.error instanceof ApiError
        ? recommendations.error.message
        : "Recommendations could not be loaded. Check that the API is running.";

    return (
      <ProductsView
        query={query}
        products={[]}
        total={0}
        page={page}
        totalPages={0}
        categories={categories}
        category={category}
        notice={message}
        descriptionOverride={PUBLIC_RECOMMENDATIONS_DESCRIPTION}
      />
    );
  }

  const { products, pagination, personalized } = recommendations.data;

  return (
    <ProductsView
      query={query}
      products={products}
      total={pagination.total}
      page={pagination.page}
      totalPages={pagination.totalPages}
      categories={categories}
      category={category}
      descriptionOverride={
        personalized ? undefined : PUBLIC_RECOMMENDATIONS_DESCRIPTION
      }
    />
  );
}
