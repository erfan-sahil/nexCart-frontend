import type { Metadata } from "next";

import {
  ProductsView,
  parseProductSearchParams,
  type ProductSearchParams,
} from "@/features/products";

type NewArrivalsPageProps = {
  searchParams: Promise<ProductSearchParams>;
};

export const metadata: Metadata = {
  title: "New arrivals",
  description: "Fresh inventory from vendors who listed this week.",
};

export default async function NewArrivalsPage({
  searchParams,
}: NewArrivalsPageProps) {
  const query = parseProductSearchParams(await searchParams, {
    collection: "new-arrivals",
  });

  return <ProductsView query={query} />;
}
