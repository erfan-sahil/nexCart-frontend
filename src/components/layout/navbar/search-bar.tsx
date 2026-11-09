"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";

import { ProductSearchField } from "@/components/search/product-search-field";

type SearchBarProps = {
  className?: string;
  inDrawer?: boolean;
};

function SearchBarWithQuery({ className, inDrawer }: SearchBarProps) {
  const searchParams = useSearchParams();
  const hidden = {
    collection: searchParams.get("collection") ?? "",
    category: searchParams.get("category") ?? "",
    subcategory: searchParams.get("subcategory") ?? "",
    sort: searchParams.get("sort") ?? "",
    price: searchParams.get("price") ?? "",
    rating: searchParams.get("rating") ?? "",
  };

  return (
    <ProductSearchField
      key={searchParams.get("q") ?? ""}
      className={className}
      defaultQuery={searchParams.get("q") ?? ""}
      hidden={hidden}
      placeholder="Search products, brands, or stores"
      label="Search products and stores"
      hideSubmitLabelOnMobile
      inDrawer={inDrawer}
    />
  );
}

export function SearchBar({ className, inDrawer }: SearchBarProps) {
  return (
    <Suspense
      fallback={
        <ProductSearchField
          className={className}
          placeholder="Search products, brands, or stores"
          label="Search products and stores"
          hideSubmitLabelOnMobile
          inDrawer={inDrawer}
        />
      }
    >
      <SearchBarWithQuery className={className} inDrawer={inDrawer} />
    </Suspense>
  );
}
