import type { Metadata } from "next";

import {
  ProductsView,
  parseProductSearchParams,
  type ProductSearchParams,
} from "@/features/products";

type DealsPageProps = {
  searchParams: Promise<ProductSearchParams>;
};

export const metadata: Metadata = {
  title: "Flash deals",
  description: "Limited-time marketplace prices from independent stores.",
};

export default async function DealsPage({ searchParams }: DealsPageProps) {
  const query = parseProductSearchParams(await searchParams, {
    collection: "flash-deals",
  });

  return <ProductsView query={query} />;
}
