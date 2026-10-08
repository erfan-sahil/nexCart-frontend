"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronDown, SlidersHorizontal, Star } from "lucide-react";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

import {
  PRICE_FILTERS,
  PRODUCT_SORT_OPTIONS,
  RATING_FILTERS,
  productsHref,
  type ProductQuery,
} from "../lib/query";

type ProductsSortProps = {
  query: ProductQuery;
};

const triggerClass =
  "inline-flex h-9 items-center gap-1.5 rounded-full border border-border bg-card px-3 text-sm text-foreground outline-none transition-colors hover:border-primary focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/20 data-popup-open:border-primary";

function optionClass(active: boolean) {
  return cn(
    "flex w-full items-center rounded-lg px-2.5 py-2 text-left text-sm transition-colors",
    active
      ? "bg-brand-soft font-medium text-primary"
      : "text-foreground hover:bg-surface-muted",
  );
}

export function ProductsSort({ query }: ProductsSortProps) {
  const [sortOpen, setSortOpen] = useState(false);
  const [filterOpen, setFilterOpen] = useState(false);
  const sortLabel =
    PRODUCT_SORT_OPTIONS.find((option) => option.id === query.sort)?.label ??
    "Featured";
  const filterCount =
    Number(Boolean(query.price)) + Number(Boolean(query.rating));

  return (
    <div className="flex items-center gap-2">
      <Popover open={filterOpen} onOpenChange={setFilterOpen}>
        <PopoverTrigger
          className={cn(
            triggerClass,
            filterCount > 0 && "border-primary bg-brand-soft text-primary",
          )}
        >
          <SlidersHorizontal className="size-4" />
          Filters
          {filterCount > 0 ? (
            <span className="inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1 text-[11px] font-semibold text-[#fff4f2]">
              {filterCount}
            </span>
          ) : null}
        </PopoverTrigger>
        <PopoverContent
          align="end"
          className="w-64 gap-4 p-3 shadow-none ring-border"
        >
          <div>
            <p className="px-2.5 pb-1.5 text-[11px] font-semibold tracking-wider text-muted-foreground uppercase">
              Price
            </p>
            <div className="space-y-0.5">
              {PRICE_FILTERS.map((item) => {
                const active = query.price === item.id;

                return (
                  <Link
                    key={item.id}
                    href={productsHref({
                      ...query,
                      price: active ? undefined : item.id,
                    })}
                    onClick={() => setFilterOpen(false)}
                    className={optionClass(active)}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </div>
          </div>
          <div>
            <p className="px-2.5 pb-1.5 text-[11px] font-semibold tracking-wider text-muted-foreground uppercase">
              Rating
            </p>
            <div className="space-y-0.5">
              {RATING_FILTERS.map((item) => {
                const active = query.rating === item.value;

                return (
                  <Link
                    key={item.value}
                    href={productsHref({
                      ...query,
                      rating: active ? undefined : item.value,
                    })}
                    onClick={() => setFilterOpen(false)}
                    className={optionClass(active)}
                  >
                    <Star className="mr-1.5 size-3.5 fill-primary text-primary" />
                    {item.label}
                  </Link>
                );
              })}
            </div>
          </div>
          {filterCount > 0 ? (
            <Link
              href={productsHref({
                ...query,
                price: undefined,
                rating: undefined,
              })}
              onClick={() => setFilterOpen(false)}
              className="px-2.5 text-sm font-medium text-primary hover:text-brand-hover"
            >
              Clear filters
            </Link>
          ) : null}
        </PopoverContent>
      </Popover>

      <Popover open={sortOpen} onOpenChange={setSortOpen}>
        <PopoverTrigger className={triggerClass}>
          <span className="text-muted-foreground">Sort</span>
          <span className="font-medium">{sortLabel}</span>
          <ChevronDown
            className={cn(
              "size-4 text-muted-foreground transition-transform duration-200",
              sortOpen && "rotate-180",
            )}
          />
        </PopoverTrigger>
        <PopoverContent
          align="end"
          className="w-56 gap-0.5 p-1.5 shadow-none ring-border"
        >
          {PRODUCT_SORT_OPTIONS.map((option) => (
            <Link
              key={option.id}
              href={productsHref({ ...query, sort: option.id })}
              onClick={() => setSortOpen(false)}
              className={optionClass(query.sort === option.id)}
            >
              {option.label}
            </Link>
          ))}
        </PopoverContent>
      </Popover>
    </div>
  );
}
