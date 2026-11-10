import Link from "next/link";
import { ChevronLeft, ChevronRight } from "@/lib/icons";

import { Container, PageBreadcrumb } from "@/components/common";
import { ProductGrid } from "@/components/product";
import type { StoreProfile } from "@/features/catalog";
import { formatCount } from "@/lib/format";
import { cn } from "@/lib/utils";
import { StoreDetails } from "./store-details";
import { StoreHero } from "./store-hero";
import type { Product } from "@/types";

type StoreViewProps = {
  store: StoreProfile;
  products: Product[];
  page: number;
  total: number;
  totalPages: number;
  notice?: string;
};

export function StoreView({
  store,
  products,
  page,
  total,
  totalPages,
  notice,
}: StoreViewProps) {
  return (
    <Container className="py-8 sm:py-10">
      <PageBreadcrumb
        items={[
          { label: "Home", href: "/" },
          { label: "Stores", href: "/stores" },
          { label: store.name },
        ]}
      />

      <div className="mt-6">
        <StoreHero store={store} />
        <StoreDetails store={store} />
      </div>

      <section className="mt-12">
        <h2 className="text-2xl sm:text-3xl">Products</h2>
        <p className="mt-1.5 text-sm text-muted-foreground">
          {notice ? (
            notice
          ) : (
            <>
              Showing{" "}
              <span className="font-medium text-foreground">
                {formatCount(products.length)}
              </span>
              {total > products.length ? (
                <>
                  {" "}
                  of{" "}
                  <span className="font-medium text-foreground">
                    {formatCount(total)}
                  </span>
                </>
              ) : null}{" "}
              {total === 1 ? "item" : "items"} from {store.name}
            </>
          )}
        </p>

        {notice || products.length === 0 ? (
          <div className="mt-6 rounded-2xl border border-dashed border-border px-6 py-16 text-center">
            <p className="text-base font-medium">
              {notice ? "Products unavailable" : "No products yet"}
            </p>
            <p className="mt-1 text-sm text-muted-foreground">
              {notice
                ? "Try again in a moment."
                : "This store has not listed any products."}
            </p>
          </div>
        ) : (
          <ProductGrid products={products} columns="store" className="mt-6" />
        )}

        <StorePagination
          slug={store.slug}
          page={page}
          totalPages={totalPages}
        />
      </section>
    </Container>
  );
}

function pagesFor(page: number, totalPages: number) {
  const pages = new Set<number>([1, totalPages, page - 1, page, page + 1]);
  return [...pages]
    .filter((item) => item >= 1 && item <= totalPages)
    .sort((left, right) => left - right);
}

function storePageHref(slug: string, page: number) {
  return page > 1 ? `/stores/${slug}?page=${page}` : `/stores/${slug}`;
}

function StorePagination({
  slug,
  page,
  totalPages,
}: {
  slug: string;
  page: number;
  totalPages: number;
}) {
  if (totalPages <= 1) return null;

  const pages = pagesFor(page, totalPages);

  return (
    <nav
      aria-label="Store products"
      className="mt-6 flex items-center justify-center gap-1"
    >
      <PageLink
        href={storePageHref(slug, page - 1)}
        disabled={page <= 1}
        label="Previous page"
      >
        <ChevronLeft className="size-4" />
      </PageLink>
      {pages.map((item, index) => {
        const previous = pages[index - 1];
        const gap = previous !== undefined && item - previous > 1;

        return (
          <span key={item} className="inline-flex items-center gap-1">
            {gap ? (
              <span className="px-1 text-sm text-muted-foreground">…</span>
            ) : null}
            <PageLink href={storePageHref(slug, item)} active={item === page}>
              {item}
            </PageLink>
          </span>
        );
      })}
      <PageLink
        href={storePageHref(slug, page + 1)}
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
