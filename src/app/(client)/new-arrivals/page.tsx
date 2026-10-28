import type { Metadata } from "next";

import { CatalogListing, type ProductSearchParams } from "@/features/products";

type NewArrivalsPageProps = {
  searchParams: Promise<ProductSearchParams>;
};

export const metadata: Metadata = {
  title: "New arrivals",
  description: "Fresh inventory from vendors who listed recently.",
};

export default async function NewArrivalsPage({
  searchParams,
}: NewArrivalsPageProps) {
  return (
    <CatalogListing
      searchParams={await searchParams}
      defaults={{ collection: "new-arrivals" }}
    />
  );
}
