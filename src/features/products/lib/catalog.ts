import {
  flashDealProducts,
  newArrivalProducts,
  products,
  recentlyViewedProducts,
  recommendedProducts,
  topSellingProducts,
  trendingProducts,
} from "@/data/mock";
import type { Product } from "@/types";

import {
  PRICE_FILTERS,
  type ProductCollection,
  type ProductQuery,
} from "./query";

const COLLECTION_CATALOG: Record<ProductCollection, Product[]> = {
  bestsellers: topSellingProducts,
  "new-arrivals": newArrivalProducts,
  trending: trendingProducts,
  "flash-deals": flashDealProducts,
  recommended: recommendedProducts,
  "recently-viewed": recentlyViewedProducts,
};

function matchesQuery(product: Product, q: string) {
  const haystack = [
    product.name,
    product.store.name,
    product.categorySlug,
    product.subcategorySlug,
    product.badge,
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();

  return haystack.includes(q);
}

export function queryProducts(query: ProductQuery): Product[] {
  const source = query.collection
    ? COLLECTION_CATALOG[query.collection]
    : products;

  const q = query.q?.toLowerCase();
  const price = PRICE_FILTERS.find((item) => item.id === query.price);

  const filtered = source.filter((product) => {
    if (q && !matchesQuery(product, q)) return false;
    if (query.category && product.categorySlug !== query.category) return false;
    if (query.subcategory && product.subcategorySlug !== query.subcategory) {
      return false;
    }
    if (price && (product.price < price.min || product.price >= price.max)) {
      return false;
    }
    if (query.rating && product.rating < query.rating) return false;
    return true;
  });

  const sorted = [...filtered];

  switch (query.sort) {
    case "newest":
      sorted.sort((a, b) => Date.parse(b.listedAt) - Date.parse(a.listedAt));
      break;
    case "bestsellers":
      sorted.sort((a, b) => (b.sold ?? 0) - (a.sold ?? 0));
      break;
    case "price-asc":
      sorted.sort((a, b) => a.price - b.price);
      break;
    case "price-desc":
      sorted.sort((a, b) => b.price - a.price);
      break;
    case "rating":
      sorted.sort(
        (a, b) => b.rating - a.rating || b.reviewCount - a.reviewCount,
      );
      break;
    default:
      break;
  }

  return sorted;
}
