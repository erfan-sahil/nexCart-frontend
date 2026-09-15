import Link from "next/link";
import { SearchX } from "lucide-react";

import { productsHref } from "../lib/query";

type ProductsEmptyProps = {
  queryLabel?: string;
};

export function ProductsEmpty({ queryLabel }: ProductsEmptyProps) {
  return (
    <div className="rounded-2xl border border-dashed border-border px-6 py-16 text-center">
      <SearchX className="mx-auto size-8 text-muted-foreground" />
      <p className="mt-4 text-base font-medium">No products found</p>
      <p className="mt-1 text-sm text-muted-foreground">
        {queryLabel
          ? `Nothing matched ${queryLabel}. Try another search or clear filters.`
          : "Try another department, price range, or clear the current filters."}
      </p>
      <Link
        href={productsHref({})}
        className="mt-4 inline-flex text-sm font-medium text-primary hover:text-brand-hover"
      >
        Browse all products
      </Link>
    </div>
  );
}
