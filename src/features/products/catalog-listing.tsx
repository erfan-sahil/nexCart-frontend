import { getCategoryTree } from "@/features/catalog";
import { RecommendedCatalogListing } from "@/features/recommendations";
import { ApiError } from "@/lib/api/errors";

import { ProductsView } from "./products-view";
import { loadProductListing, toFilterCategories } from "./lib/load";
import {
  parsePage,
  parseProductSearchParams,
  type ProductQuery,
  type ProductSearchParams,
} from "./lib/query";

type CatalogListingProps = {
  searchParams: ProductSearchParams;
  defaults?: Partial<ProductQuery>;
};

export async function CatalogListing({
  searchParams,
  defaults,
}: CatalogListingProps) {
  const query = parseProductSearchParams(searchParams, defaults);
  const page = parsePage(searchParams);

  if (query.collection === "recommended") {
    return (
      <RecommendedCatalogListing
        searchParams={searchParams}
        defaults={defaults}
      />
    );
  }

  const tree = await getCategoryTree();
  const categories = toFilterCategories(tree);
  const category =
    categories.find((item) => item.slug === query.category) ?? null;

  let products: Awaited<ReturnType<typeof loadProductListing>>["products"] = [];
  let total = 0;
  let currentPage = 1;
  let totalPages = 0;
  let notice: string | undefined;

  try {
    const listing = await loadProductListing(query, page, tree);
    products = listing.products;
    total = listing.total;
    currentPage = listing.page;
    totalPages = listing.totalPages;
    notice = listing.unavailable;
  } catch (error) {
    notice =
      error instanceof ApiError
        ? error.message
        : "The catalog could not be loaded. Check that the API is running.";
  }

  return (
    <ProductsView
      query={query}
      products={products}
      total={total}
      page={currentPage}
      totalPages={totalPages}
      categories={categories}
      category={category}
      notice={notice}
    />
  );
}
