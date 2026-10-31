import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";

import { Container, PageBreadcrumb } from "@/components/common";
import { StoreCard } from "@/components/store";
import type { Store } from "@/types";

type StoresViewProps = {
  stores: Store[];
  page: number;
  total: number;
  totalPages: number;
  notice?: string;
};

export function StoresView({
  stores,
  page,
  total,
  totalPages,
  notice,
}: StoresViewProps) {
  return (
    <>
      <section className="border-b border-border bg-surface-muted">
        <Container className="py-8 sm:py-10">
          <PageBreadcrumb
            items={[{ label: "Home", href: "/" }, { label: "Stores" }]}
          />
          <div className="mt-5 max-w-2xl">
            <p className="text-xs font-semibold tracking-[0.18em] text-primary uppercase">
              Vendors
            </p>
            <h1 className="mt-1.5 text-3xl text-foreground sm:text-4xl">
              Stores
            </h1>
            <p className="mt-2 text-sm text-muted-foreground sm:text-base">
              Open a store to see its banner, logo, and the products it sells.
            </p>
          </div>
        </Container>
      </section>

      <Container className="py-8 sm:py-10">
        {notice ? (
          <p className="rounded-2xl border border-dashed border-border px-6 py-16 text-center text-sm text-muted-foreground">
            {notice}
          </p>
        ) : stores.length === 0 ? (
          <p className="rounded-2xl border border-dashed border-border px-6 py-16 text-center text-sm text-muted-foreground">
            No stores are listed yet.
          </p>
        ) : (
          <>
            <p className="mb-5 text-sm text-muted-foreground">
              <span className="font-medium text-foreground">{total}</span>{" "}
              {total === 1 ? "store" : "stores"}
            </p>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {stores.map((store) => (
                <StoreCard key={store.id} store={store} />
              ))}
            </div>
            <StoresPagination page={page} totalPages={totalPages} />
          </>
        )}
      </Container>
    </>
  );
}

function StoresPagination({
  page,
  totalPages,
}: {
  page: number;
  totalPages: number;
}) {
  if (totalPages <= 1) return null;

  const href = (next: number) =>
    next > 1 ? `/stores?page=${next}` : "/stores";

  return (
    <nav
      aria-label="Stores"
      className="mt-8 flex items-center justify-center gap-2"
    >
      {page > 1 ? (
        <Link
          href={href(page - 1)}
          aria-label="Previous page"
          className="inline-flex size-9 items-center justify-center rounded-full text-foreground hover:bg-surface-muted"
        >
          <ChevronLeft className="size-4" />
        </Link>
      ) : (
        <span className="inline-flex size-9 items-center justify-center rounded-full text-muted-foreground/50">
          <ChevronLeft className="size-4" />
        </span>
      )}
      <span className="text-sm text-muted-foreground">
        Page <span className="font-medium text-foreground">{page}</span> of{" "}
        {totalPages}
      </span>
      {page < totalPages ? (
        <Link
          href={href(page + 1)}
          aria-label="Next page"
          className="inline-flex size-9 items-center justify-center rounded-full text-foreground hover:bg-surface-muted"
        >
          <ChevronRight className="size-4" />
        </Link>
      ) : (
        <span className="inline-flex size-9 items-center justify-center rounded-full text-muted-foreground/50">
          <ChevronRight className="size-4" />
        </span>
      )}
    </nav>
  );
}
