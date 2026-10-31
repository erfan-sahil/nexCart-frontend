import Link from "next/link";
import { ChevronLeft, ChevronRight, MapPin, Star } from "lucide-react";

import { Container, MediaImage, PageBreadcrumb } from "@/components/common";
import { ProductGrid } from "@/components/product";
import type { StoreProfile } from "@/features/catalog";
import { formatCount } from "@/lib/format";
import { cn } from "@/lib/utils";
import type { Product } from "@/types";

type StoreViewProps = {
  store: StoreProfile;
  products: Product[];
  page: number;
  total: number;
  totalPages: number;
  notice?: string;
};

function formatJoined(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";

  return new Intl.DateTimeFormat("en-US", {
    month: "long",
    year: "numeric",
  }).format(date);
}

function ratingLabel(rating: number) {
  return Number.isInteger(rating) ? String(rating) : rating.toFixed(1);
}

export function StoreView({
  store,
  products,
  page,
  total,
  totalPages,
  notice,
}: StoreViewProps) {
  const joined = formatJoined(store.joinedAt);
  const images = [
    store.banner
      ? { src: store.banner, label: "Banner", alt: `${store.name} banner` }
      : null,
    store.logo
      ? { src: store.logo, label: "Logo", alt: `${store.name} logo` }
      : null,
  ].filter((image) => image !== null);

  return (
    <Container className="py-8 sm:py-10">
      <PageBreadcrumb
        items={[
          { label: "Home", href: "/" },
          { label: "Stores", href: "/stores" },
          { label: store.name },
        ]}
      />

      <article className="mt-6 overflow-hidden rounded-2xl border border-border bg-card">
        <div className="relative h-40 bg-surface-muted sm:h-56">
          <MediaImage
            src={store.banner}
            alt={store.banner ? `${store.name} banner` : ""}
            sizes="(max-width: 1280px) 100vw, 80rem"
            priority
          />
        </div>

        <div className="px-4 pb-6 sm:px-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end">
            <span className="relative -mt-10 flex size-20 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-surface-muted text-2xl font-semibold ring-4 ring-card sm:size-24">
              <MediaImage
                src={store.logo}
                alt={store.logo ? `${store.name} logo` : ""}
                sizes="96px"
              />
              {store.logo ? null : store.name.slice(0, 1)}
            </span>

            <div className="min-w-0 flex-1 pb-1">
              <h1 className="text-3xl text-foreground sm:text-4xl">
                {store.name}
              </h1>
              <p className="mt-2 inline-flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-muted-foreground">
                <span className="inline-flex items-center gap-1">
                  <Star className="size-3.5 fill-primary text-primary" />
                  <span className="font-medium text-foreground">
                    {ratingLabel(store.rating)}
                  </span>
                  <span>({formatCount(store.reviewCount)})</span>
                </span>
                {joined ? <span>Joined {joined}</span> : null}
              </p>
            </div>
          </div>

          {store.description ? (
            <p className="mt-5 max-w-3xl text-sm leading-6 text-muted-foreground sm:text-base">
              {store.description}
            </p>
          ) : null}

          <dl className="mt-6 grid grid-cols-3 gap-4 border-t border-border pt-5 sm:max-w-lg">
            <div>
              <dt className="text-[11px] font-medium tracking-wide text-muted-foreground uppercase">
                Products
              </dt>
              <dd className="mt-1 text-xl font-semibold tabular-nums">
                {formatCount(store.productCount)}
              </dd>
            </div>
            <div>
              <dt className="text-[11px] font-medium tracking-wide text-muted-foreground uppercase">
                Orders
              </dt>
              <dd className="mt-1 text-xl font-semibold tabular-nums">
                {formatCount(store.orderCount)}
              </dd>
            </div>
            <div>
              <dt className="text-[11px] font-medium tracking-wide text-muted-foreground uppercase">
                Rating
              </dt>
              <dd className="mt-1 text-xl font-semibold tabular-nums">
                {ratingLabel(store.rating)}
              </dd>
            </div>
          </dl>
        </div>
      </article>

      {images.length > 0 ? (
        <section className="mt-8">
          <h2 className="text-2xl sm:text-3xl">Store images</h2>
          <div
            className={cn(
              "mt-4 grid gap-4",
              images.length > 1 ? "sm:grid-cols-2" : "max-w-3xl",
            )}
          >
            {images.map((image) => (
              <figure
                key={image.label}
                className="overflow-hidden rounded-2xl border border-border bg-card"
              >
                <div className="relative h-44 bg-surface-muted sm:h-56">
                  <MediaImage
                    src={image.src}
                    alt={image.alt}
                    sizes="(max-width: 768px) 100vw, 40rem"
                  />
                </div>
                <figcaption className="px-4 py-3 text-sm font-medium">
                  {image.label}
                </figcaption>
              </figure>
            ))}
          </div>
        </section>
      ) : null}

      <section className="mt-8 grid gap-4 lg:grid-cols-2">
        <InfoCard title="Store details">
          {store.address ? (
            <p className="flex items-start gap-2 text-sm leading-6 text-muted-foreground">
              <MapPin className="mt-1 size-4 shrink-0 text-primary" />
              <span>{store.address}</span>
            </p>
          ) : (
            <p className="text-sm text-muted-foreground">
              This store has not added a public address.
            </p>
          )}
          {store.email || store.phone ? (
            <dl className="mt-4 space-y-2 text-sm">
              {store.email ? (
                <div className="flex gap-3">
                  <dt className="w-16 shrink-0 text-muted-foreground">Email</dt>
                  <dd>
                    <a
                      href={`mailto:${store.email}`}
                      className="font-medium text-foreground hover:text-primary"
                    >
                      {store.email}
                    </a>
                  </dd>
                </div>
              ) : null}
              {store.phone ? (
                <div className="flex gap-3">
                  <dt className="w-16 shrink-0 text-muted-foreground">Phone</dt>
                  <dd>
                    <a
                      href={`tel:${store.phone}`}
                      className="font-medium text-foreground hover:text-primary"
                    >
                      {store.phone}
                    </a>
                  </dd>
                </div>
              ) : null}
            </dl>
          ) : null}
        </InfoCard>

        {store.shippingPolicy ? (
          <InfoCard title="Shipping">
            <p className="text-sm leading-6 whitespace-pre-line text-muted-foreground">
              {store.shippingPolicy}
            </p>
          </InfoCard>
        ) : null}

        {store.returnPolicy ? (
          <InfoCard title="Returns">
            <p className="text-sm leading-6 whitespace-pre-line text-muted-foreground">
              {store.returnPolicy}
            </p>
          </InfoCard>
        ) : null}
      </section>

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

function InfoCard({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-2xl border border-border bg-card p-5">
      <h2 className="font-display text-lg font-semibold">{title}</h2>
      <div className="mt-3">{children}</div>
    </section>
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
