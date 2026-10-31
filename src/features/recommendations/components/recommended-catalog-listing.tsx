import { getCategoryTree } from "@/features/catalog";

import {
  parsePage,
  parseProductSearchParams,
  type ProductQuery,
  type ProductSearchParams,
} from "@/features/products/lib/query";
import { toFilterCategories } from "@/features/products/lib/load";

import { RecommendedCatalogListingClient } from "./recommended-catalog-listing-client";

type RecommendedCatalogListingProps = {
  searchParams: ProductSearchParams;
  defaults?: Partial<ProductQuery>;
};

export async function RecommendedCatalogListing({
  searchParams,
  defaults,
}: RecommendedCatalogListingProps) {
  const query = parseProductSearchParams(searchParams, defaults);
  const page = parsePage(searchParams);
  const tree = await getCategoryTree();
  const categories = toFilterCategories(tree);
  const category =
    categories.find((item) => item.slug === query.category) ?? null;

  return (
    <RecommendedCatalogListingClient
      query={query}
      page={page}
      categories={categories}
      category={category}
      categoryTree={tree}
    />
  );
}
