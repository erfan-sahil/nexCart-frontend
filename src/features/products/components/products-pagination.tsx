import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";

import { cn } from "@/lib/utils";

import { productsHref, type ProductQuery } from "../lib/query";

type ProductsPaginationProps = {
  query: ProductQuery;
  page: number;
  totalPages: number;
};

function pagesFor(page: number, totalPages: number) {
  const pages = new Set<number>([1, totalPages, page - 1, page, page + 1]);
  return [...pages]
    .filter((item) => item >= 1 && item <= totalPages)
    .sort((a, b) => a - b);
}

export function ProductsPagination({
  query,
  page,
  totalPages,
}: ProductsPaginationProps) {
  if (totalPages <= 1) return null;

  const pages = pagesFor(page, totalPages);

  return (
    <nav
      aria-label="Pagination"
      className="flex items-center justify-center gap-1 pt-2"
    >
      <PageLink
        href={productsHref(query, page - 1)}
        disabled={page <= 1}
        label="Previous page"
      >
        <ChevronLeft className="size-4" />
      </PageLink>
      {pages.map((item, index) => {
        const previous = pages[index - 1];
        const gap = previous && item - previous > 1;

        return (
          <span key={item} className="inline-flex items-center gap-1">
            {gap ? (
              <span className="px-1 text-sm text-muted-foreground">…</span>
            ) : null}
            <PageLink href={productsHref(query, item)} active={item === page}>
              {item}
            </PageLink>
          </span>
        );
      })}
      <PageLink
        href={productsHref(query, page + 1)}
        disabled={page >= totalPages}
        label="Next page"
      >
        <ChevronRight className="size-4" />
      </PageLink>
    </nav>
  );
}

function PageLink({
  href,
  children,
  active,
  disabled,
  label,
}: {
  href: string;
  children: React.ReactNode;
  active?: boolean;
  disabled?: boolean;
  label?: string;
}) {
  if (disabled) {
    return (
      <span
        aria-disabled="true"
        className="inline-flex size-9 items-center justify-center rounded-full text-muted-foreground/50"
      >
        {children}
      </span>
    );
  }

  return (
    <Link
      href={href}
      aria-label={label}
      aria-current={active ? "page" : undefined}
      className={cn(
        "inline-flex size-9 items-center justify-center rounded-full text-sm transition-colors",
        active
          ? "bg-primary font-semibold text-[#fff4f2]"
          : "text-foreground hover:bg-surface-muted",
      )}
    >
      {children}
    </Link>
  );
}
