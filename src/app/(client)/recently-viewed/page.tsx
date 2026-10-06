import type { Metadata } from "next";

import {
  ProductsView,
  parseProductSearchParams,
  type ProductSearchParams,
} from "@/features/products";

type RecentlyViewedPageProps = {
  searchParams: Promise<ProductSearchParams>;
};

export const metadata: Metadata = {
  title: "Recently viewed",
  description: "Jump back into products you already opened.",
};

export default async function RecentlyViewedPage({
  searchParams,
}: RecentlyViewedPageProps) {
  const query = parseProductSearchParams(await searchParams, {
    collection: "recently-viewed",
  });

  return <ProductsView query={query} />;
}
