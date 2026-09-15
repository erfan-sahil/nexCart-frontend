"use client";

import { useRouter } from "next/navigation";

import {
  PRODUCT_SORT_OPTIONS,
  productsHref,
  type ProductQuery,
  type ProductSort,
} from "../lib/query";

type ProductsSortProps = {
  query: ProductQuery;
};

export function ProductsSort({ query }: ProductsSortProps) {
  const router = useRouter();

  return (
    <label className="inline-flex items-center gap-2 text-sm">
      <span className="hidden text-muted-foreground sm:inline">Sort</span>
      <select
        value={query.sort}
        onChange={(event) => {
          router.push(
            productsHref({
              ...query,
              sort: event.target.value as ProductSort,
            }),
          );
        }}
        className="h-9 rounded-full border border-border bg-background px-3 text-sm text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
        aria-label="Sort products"
      >
        {PRODUCT_SORT_OPTIONS.map((option) => (
          <option key={option.id} value={option.id}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  );
}
