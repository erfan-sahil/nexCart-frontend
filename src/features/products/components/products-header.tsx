import Image from "next/image";
import Link from "next/link";
import { X } from "lucide-react";

import { Container, PageBreadcrumb } from "@/components/common";
import { formatCount } from "@/lib/format";
import { getCategoryBySlug } from "@/data/mock";

import {
  PRICE_FILTERS,
  getCollectionCopy,
  hasActiveFilters,
  productsHref,
  queryWithout,
  type ProductPageCopy,
  type ProductQuery,
} from "../lib/query";

type ProductsHeaderProps = {
  query: ProductQuery;
  copy: ProductPageCopy;
  resultCount: number;
};

function Chip({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="inline-flex items-center gap-1 rounded-full border border-border bg-background px-2.5 py-1 text-xs text-foreground transition-colors hover:border-primary hover:text-primary"
    >
      {children}
      <X className="size-3" />
    </Link>
  );
}

export function ProductsHeader({
  query,
  copy,
  resultCount,
}: ProductsHeaderProps) {
  const category = query.category
    ? getCategoryBySlug(query.category)
    : undefined;
  const priceLabel = PRICE_FILTERS.find(
    (item) => item.id === query.price,
  )?.label;
  const showChips = hasActiveFilters(query);

  return (
    <section
      className={
        category
          ? "relative overflow-hidden bg-surface-dark"
          : "border-b border-border bg-surface-muted"
      }
    >
      {category ? (
        <>
          <Image
            src={category.image}
            alt=""
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-ink via-ink/80 to-ink/30" />
        </>
      ) : null}

      <Container className="relative py-8 sm:py-10">
        <PageBreadcrumb items={copy.breadcrumbs} invert={Boolean(category)} />
        <p
          className={`mt-5 text-xs font-semibold tracking-[0.18em] uppercase ${
            category ? "text-primary" : "text-primary"
          }`}
        >
          {copy.eyebrow}
        </p>
        <div className="mt-1.5 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-2xl">
            <h1
              className={`text-3xl font-semibold tracking-tight sm:text-4xl ${
                category ? "text-white" : "text-foreground"
              }`}
            >
              {copy.title}
            </h1>
            <p
              className={`mt-2 text-sm sm:text-base ${
                category ? "text-white/70" : "text-muted-foreground"
              }`}
            >
              {copy.description}
            </p>
          </div>
          <p
            className={`text-sm font-medium tabular-nums ${
              category ? "text-primary" : "text-muted-foreground"
            }`}
          >
            {formatCount(resultCount)}{" "}
            {resultCount === 1 ? "product" : "products"}
          </p>
        </div>

        {showChips ? (
          <div className="mt-5 flex flex-wrap gap-2">
            {query.q ? (
              <Chip href={productsHref(queryWithout(query, ["q"]))}>
                Search: {query.q}
              </Chip>
            ) : null}
            {query.collection ? (
              <Chip href={productsHref(queryWithout(query, ["collection"]))}>
                {getCollectionCopy(query.collection).title}
              </Chip>
            ) : null}
            {priceLabel ? (
              <Chip href={productsHref(queryWithout(query, ["price"]))}>
                {priceLabel}
              </Chip>
            ) : null}
            {query.rating ? (
              <Chip href={productsHref(queryWithout(query, ["rating"]))}>
                {query.rating}+ stars
              </Chip>
            ) : null}
            {hasActiveFilters(query) ? (
              <Link
                href="/products"
                className={`text-xs font-medium underline-offset-4 hover:underline ${
                  category ? "text-white/80 hover:text-primary" : "text-primary"
                }`}
              >
                Clear all
              </Link>
            ) : null}
          </div>
        ) : null}
      </Container>
    </section>
  );
}
