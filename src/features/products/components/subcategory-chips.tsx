import Link from "next/link";

import { cn } from "@/lib/utils";
import { getCategoryBySlug } from "@/data/mock";

import { productsHref, type ProductQuery } from "../lib/query";

type SubcategoryChipsProps = {
  query: ProductQuery;
};

export function SubcategoryChips({ query }: SubcategoryChipsProps) {
  if (!query.category) return null;

  const category = getCategoryBySlug(query.category);
  if (!category) return null;

  return (
    <div className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1 no-scrollbar sm:mx-0 sm:flex-wrap sm:overflow-visible sm:px-0">
      <Link
        href={productsHref({ ...query, subcategory: undefined })}
        className={cn(
          "inline-flex shrink-0 rounded-full border px-3 py-1.5 text-sm transition-colors",
          !query.subcategory
            ? "border-primary bg-brand-soft font-medium text-primary"
            : "border-border bg-card text-muted-foreground hover:border-primary hover:text-primary",
        )}
      >
        All
      </Link>
      {category.subcategories.map((aisle) => {
        const active = query.subcategory === aisle.slug;

        return (
          <Link
            key={aisle.id}
            href={productsHref({
              ...query,
              subcategory: active ? undefined : aisle.slug,
            })}
            className={cn(
              "inline-flex shrink-0 rounded-full border px-3 py-1.5 text-sm transition-colors",
              active
                ? "border-primary bg-brand-soft font-medium text-primary"
                : "border-border bg-card text-muted-foreground hover:border-primary hover:text-primary",
            )}
          >
            {aisle.name}
          </Link>
        );
      })}
    </div>
  );
}
