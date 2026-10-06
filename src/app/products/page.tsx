import type { Metadata } from "next";

import {
  ProductsView,
  getProductPageCopy,
  parseProductSearchParams,
  type ProductSearchParams,
} from "@/features/products";

type ProductsPageProps = {
  searchParams: Promise<ProductSearchParams>;
};

export async function generateMetadata({
  searchParams,
}: ProductsPageProps): Promise<Metadata> {
  const query = parseProductSearchParams(await searchParams);
  const copy = getProductPageCopy(query);

  return {
    title: copy.title,
    description: copy.description,
  };
}

export default async function ProductsPage({
  searchParams,
}: ProductsPageProps) {
  const query = parseProductSearchParams(await searchParams);
  return <ProductsView query={query} />;
}
