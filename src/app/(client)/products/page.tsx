import type { Metadata } from "next";

import { CatalogListing } from "@/features/products/catalog-listing";
import {
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
  return <CatalogListing searchParams={await searchParams} />;
}
