import type { Metadata } from "next";

import { CatalogListing, type ProductSearchParams } from "@/features/products";

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
  return (
    <CatalogListing
      searchParams={await searchParams}
      defaults={{ collection: "recently-viewed" }}
    />
  );
}
