import Image from "next/image";
import Link from "next/link";
import { X } from "lucide-react";

import { Container, PageBreadcrumb } from "@/components/common";
import { formatCount } from "@/lib/format";
import { cn } from "@/lib/utils";
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

function Chip({
  href,
  children,
  onImage,
}: {
  href: string;
  children: React.ReactNode;
  onImage?: boolean;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-xs transition-colors hover:border-primary hover:text-primary",
        onImage
          ? "border-white/25 bg-white/10 text-white backdrop-blur-sm"
          : "border-border bg-background text-foreground",
      )}
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

  const content = (
    <>
      <PageBreadcrumb items={copy.breadcrumbs} invert={Boolean(category)} />
      <p className="mt-5 text-xs font-semibold tracking-[0.18em] text-primary uppercase">
        {copy.eyebrow}
      </p>
      <div className="mt-1.5 max-w-xl">
        <h1
          className={cn(
            "text-3xl sm:text-4xl",
            category ? "text-white" : "text-foreground",
          )}
        >
          {copy.title}
        </h1>
        <p
          className={cn(
            "mt-2 text-sm sm:text-base",
            category ? "text-white/80" : "text-muted-foreground",
          )}
        >
          {copy.description}
        </p>
        <p
          className={cn(
            "mt-3 text-sm font-medium tabular-nums",
            category ? "text-white" : "text-muted-foreground",
          )}
        >
          {formatCount(resultCount)}{" "}
          {resultCount === 1 ? "product" : "products"}
        </p>
      </div>

      {showChips ? (
        <div className="mt-5 flex flex-wrap items-center gap-2">
          {query.q ? (
            <Chip
              onImage={Boolean(category)}
              href={productsHref(queryWithout(query, ["q"]))}
            >
              Search: {query.q}
            </Chip>
          ) : null}
          {query.collection ? (
            <Chip
              onImage={Boolean(category)}
              href={productsHref(queryWithout(query, ["collection"]))}
            >
              {getCollectionCopy(query.collection).title}
            </Chip>
          ) : null}
          {priceLabel ? (
            <Chip
              onImage={Boolean(category)}
              href={productsHref(queryWithout(query, ["price"]))}
            >
              {priceLabel}
            </Chip>
          ) : null}
          {query.rating ? (
            <Chip
              onImage={Boolean(category)}
              href={productsHref(queryWithout(query, ["rating"]))}
            >
              {query.rating}+ stars
            </Chip>
          ) : null}
          {hasActiveFilters(query) ? (
            <Link
              href="/products"
              className={cn(
                "text-xs font-medium underline-offset-4 hover:underline",
                category ? "text-white hover:text-primary" : "text-primary",
              )}
            >
              Clear all
            </Link>
          ) : null}
        </div>
      ) : null}
    </>
  );

  if (!category) {
    return (
      <section className="border-b border-border bg-surface-muted">
        <Container className="py-8 sm:py-10">{content}</Container>
      </section>
    );
  }

  return (
    <section className="border-b border-border bg-surface-muted">
      <Container className="py-6 sm:py-8">
        <div className="relative flex min-h-64 items-center overflow-hidden rounded-3xl bg-ink sm:min-h-72">
          <Image
            src={category.image}
            alt=""
            fill
            priority
            sizes="(max-width: 1024px) 100vw, 1120px"
            className="object-cover object-[78%_center]"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-ink via-ink/95 via-[42%] to-ink/72 lg:hidden" />
          <div className="absolute inset-0 hidden bg-gradient-to-r from-ink from-0% via-ink/75 via-[32%] to-transparent to-[68%] lg:block" />
          <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-ink/35 to-transparent" />
          <div className="pointer-events-none absolute inset-0 ring-1 ring-white/10 ring-inset" />
          <div className="relative w-full max-w-xl px-5 py-8 sm:px-8 sm:py-10 lg:max-w-2xl">
            {content}
          </div>
        </div>
      </Container>
    </section>
  );
}
