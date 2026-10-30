import type { Metadata } from "next";
import { redirect } from "next/navigation";

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
  const params = await searchParams;
  const query = parseProductSearchParams(params);

  if (query.collection === "recently-viewed") {
    redirect("/recently-viewed");
  }

  return <CatalogListing searchParams={params} />;
}
