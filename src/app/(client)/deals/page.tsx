import type { Metadata } from "next";

import { CatalogListing } from "@/features/products";
import type { ProductSearchParams } from "@/features/products";

type DealsPageProps = {
  searchParams: Promise<ProductSearchParams>;
};

export const metadata: Metadata = {
  title: "Flash deals",
  description: "Limited-time marketplace prices from independent stores.",
};

export default async function DealsPage({ searchParams }: DealsPageProps) {
  return (
    <CatalogListing
      searchParams={await searchParams}
      defaults={{ collection: "flash-deals" }}
    />
  );
}
