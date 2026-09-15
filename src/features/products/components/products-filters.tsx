import Link from "next/link";
import { SlidersHorizontal, Star } from "lucide-react";

import { cn } from "@/lib/utils";
import { categories, getCategoryBySlug } from "@/data/mock";
import { CATEGORY_ICONS } from "@/constants/category-icons";

import {
  PRICE_FILTERS,
  RATING_FILTERS,
  productsHref,
  type ProductQuery,
} from "../lib/query";

type ProductsFiltersProps = {
  query: ProductQuery;
};

function FilterLink({
  href,
  active,
  children,
}: {
  href: string;
  active: boolean;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "flex w-full items-center justify-between rounded-xl px-2.5 py-2 text-left text-sm transition-colors",
        active
          ? "bg-brand-soft font-medium text-primary"
          : "text-muted-foreground hover:bg-surface-muted hover:text-foreground",
      )}
    >
      {children}
    </Link>
  );
}

export function ProductsFilters({ query }: ProductsFiltersProps) {
  const activeCategory = query.category
    ? getCategoryBySlug(query.category)
    : undefined;

  return (
    <div className="space-y-6">
      <div>
        <p className="px-2.5 pb-2 text-[11px] font-semibold tracking-wider text-muted-foreground uppercase">
          Department
        </p>
        <ul className="space-y-0.5">
          <li>
            <FilterLink
              href={productsHref({
                ...query,
                category: undefined,
                subcategory: undefined,
              })}
              active={!query.category}
            >
              All departments
            </FilterLink>
          </li>
          {categories.map((category) => {
            const Icon = CATEGORY_ICONS[category.slug];
            const active = query.category === category.slug;

            return (
              <li key={category.id}>
                <FilterLink
                  href={productsHref({
                    ...query,
                    category: active ? undefined : category.slug,
                    subcategory: undefined,
                  })}
                  active={active}
                >
                  <span className="flex min-w-0 items-center gap-2">
                    {Icon ? <Icon className="size-4 shrink-0" /> : null}
                    <span className="truncate">{category.name}</span>
                  </span>
                </FilterLink>
              </li>
            );
          })}
        </ul>
      </div>

      {activeCategory ? (
        <div>
          <p className="px-2.5 pb-2 text-[11px] font-semibold tracking-wider text-muted-foreground uppercase">
            Aisle
          </p>
          <ul className="space-y-0.5">
            <li>
              <FilterLink
                href={productsHref({ ...query, subcategory: undefined })}
                active={!query.subcategory}
              >
                All {activeCategory.name.toLowerCase()}
              </FilterLink>
            </li>
            {activeCategory.subcategories.map((aisle) => {
              const active = query.subcategory === aisle.slug;

              return (
                <li key={aisle.id}>
                  <FilterLink
                    href={productsHref({
                      ...query,
                      subcategory: active ? undefined : aisle.slug,
                    })}
                    active={active}
                  >
                    {aisle.name}
                  </FilterLink>
                </li>
              );
            })}
          </ul>
        </div>
      ) : null}

      <div>
        <p className="px-2.5 pb-2 text-[11px] font-semibold tracking-wider text-muted-foreground uppercase">
          Price
        </p>
        <ul className="space-y-0.5">
          {PRICE_FILTERS.map((item) => {
            const active = query.price === item.id;

            return (
              <li key={item.id}>
                <FilterLink
                  href={productsHref({
                    ...query,
                    price: active ? undefined : item.id,
                  })}
                  active={active}
                >
                  {item.label}
                </FilterLink>
              </li>
            );
          })}
        </ul>
      </div>

      <div>
        <p className="px-2.5 pb-2 text-[11px] font-semibold tracking-wider text-muted-foreground uppercase">
          Rating
        </p>
        <ul className="space-y-0.5">
          {RATING_FILTERS.map((item) => {
            const active = query.rating === item.value;

            return (
              <li key={item.value}>
                <FilterLink
                  href={productsHref({
                    ...query,
                    rating: active ? undefined : item.value,
                  })}
                  active={active}
                >
                  <span className="inline-flex items-center gap-1.5">
                    <Star className="size-3.5 fill-primary text-primary" />
                    {item.label}
                  </span>
                </FilterLink>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}

export function ProductsMobileFilters({ query }: ProductsFiltersProps) {
  return (
    <details className="group rounded-2xl border border-border bg-card lg:hidden">
      <summary className="flex cursor-pointer list-none items-center justify-between px-4 py-3 text-sm font-medium marker:content-none [&::-webkit-details-marker]:hidden">
        <span className="inline-flex items-center gap-2">
          <SlidersHorizontal className="size-4 text-primary" />
          Filters
        </span>
        <span className="text-xs font-normal text-muted-foreground group-open:hidden">
          Tap to refine
        </span>
      </summary>
      <div className="border-t border-border px-2 py-4">
        <ProductsFilters query={query} />
      </div>
    </details>
  );
}
