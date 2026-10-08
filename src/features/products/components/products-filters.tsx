"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronDown, SlidersHorizontal } from "lucide-react";

import { cn } from "@/lib/utils";
import { categories } from "@/data/mock";
import { CATEGORY_ICONS } from "@/constants/category-icons";

import { productsHref, type ProductQuery } from "../lib/query";

type ProductsFiltersProps = {
  query: ProductQuery;
};

function navQuery(
  query: ProductQuery,
  next: Pick<ProductQuery, "category" | "subcategory">,
) {
  return {
    q: query.q,
    collection: query.collection,
    sort: query.sort,
    price: query.price,
    rating: query.rating,
    category: next.category,
    subcategory: next.subcategory,
  };
}

function FilterLink({
  href,
  active,
  children,
  className,
}: {
  href: string;
  active: boolean;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "flex min-w-0 items-center gap-2 rounded-xl px-2.5 py-2 text-left text-sm transition-colors",
        active
          ? "bg-brand-soft font-medium text-primary"
          : "text-muted-foreground hover:bg-surface-muted hover:text-foreground",
        className,
      )}
    >
      {children}
    </Link>
  );
}

export function ProductsFilters({ query }: ProductsFiltersProps) {
  const categorySlug = query.category ?? null;
  const [openSlug, setOpenSlug] = useState<string | null>(categorySlug);
  const [prevCategorySlug, setPrevCategorySlug] = useState(categorySlug);

  if (categorySlug !== prevCategorySlug) {
    setPrevCategorySlug(categorySlug);
    setOpenSlug(categorySlug);
  }

  return (
    <div>
      <p className="px-2.5 pb-2 text-[11px] font-semibold tracking-wider text-muted-foreground uppercase">
        Departments
      </p>
      <ul className="space-y-0.5">
        <li>
          <FilterLink
            href={productsHref(
              navQuery(query, { category: undefined, subcategory: undefined }),
            )}
            active={!query.category}
          >
            All departments
          </FilterLink>
        </li>
        {categories.map((category) => {
          const Icon = CATEGORY_ICONS[category.slug];
          const active = query.category === category.slug;
          const open = openSlug === category.slug;

          return (
            <li key={category.id}>
              <div
                className={cn(
                  "flex items-center rounded-xl pr-1",
                  active && !query.subcategory && "bg-brand-soft",
                )}
              >
                <FilterLink
                  href={productsHref(
                    navQuery(query, {
                      category: category.slug,
                      subcategory: undefined,
                    }),
                  )}
                  active={active && !query.subcategory}
                  className={cn(
                    "min-w-0 flex-1 bg-transparent px-2.5 hover:bg-transparent",
                    active
                      ? "font-medium text-primary"
                      : "hover:text-foreground",
                  )}
                >
                  {Icon ? <Icon className="size-4 shrink-0" /> : null}
                  <span className="truncate">{category.name}</span>
                </FilterLink>
                <button
                  type="button"
                  aria-expanded={open}
                  aria-label={`${open ? "Hide" : "Show"} ${category.name} aisles`}
                  onClick={() =>
                    setOpenSlug((current) =>
                      current === category.slug ? null : category.slug,
                    )
                  }
                  className="flex size-7 shrink-0 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground"
                >
                  <ChevronDown
                    className={cn(
                      "size-4 transition-transform duration-200",
                      open && "rotate-180",
                    )}
                  />
                </button>
              </div>
              {open ? (
                <ul className="mt-0.5 mb-1 ml-5 space-y-0.5 border-l border-border py-1 pl-2">
                  {category.subcategories.map((aisle) => {
                    const aisleActive =
                      active && query.subcategory === aisle.slug;

                    return (
                      <li key={aisle.id}>
                        <FilterLink
                          href={productsHref(
                            navQuery(query, {
                              category: category.slug,
                              subcategory: aisle.slug,
                            }),
                          )}
                          active={aisleActive}
                          className="py-1.5 text-[13px]"
                        >
                          <span className="truncate">{aisle.name}</span>
                        </FilterLink>
                      </li>
                    );
                  })}
                </ul>
              ) : null}
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export function ProductsMobileFilters({ query }: ProductsFiltersProps) {
  return (
    <details className="group rounded-2xl border border-border bg-card lg:hidden">
      <summary className="flex cursor-pointer list-none items-center justify-between px-4 py-3 text-sm font-medium marker:content-none [&::-webkit-details-marker]:hidden">
        <span className="inline-flex items-center gap-2">
          <SlidersHorizontal className="size-4 text-primary" />
          Departments
        </span>
        <span className="text-xs font-normal text-muted-foreground group-open:hidden">
          Tap to browse
        </span>
      </summary>
      <div className="border-t border-border px-2 py-4">
        <ProductsFilters query={query} />
      </div>
    </details>
  );
}
