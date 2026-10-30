import Link from "next/link";
import { BadgeCheck, Star } from "lucide-react";

import { Container, MediaImage, PageBreadcrumb } from "@/components/common";
import { ProductGrid } from "@/components/product";
import { RecordRecentlyViewed } from "@/features/recently-viewed";
import { formatCount } from "@/lib/format";
import type { Product, ProductDetail } from "@/types";

import { productsHref } from "./lib/query";
import { ProductBuyBox } from "./components/product-buy-box";
import { ProductGallery } from "./components/product-gallery";
import { ProductReviews } from "./components/product-reviews";
import { ProductSpecs } from "./components/product-specs";

type ProductDetailViewProps = {
  product: ProductDetail;
  related: Product[];
};

function ratingLabel(value: number) {
  return Number.isInteger(value) ? String(value) : value.toFixed(1);
}

export function ProductDetailView({
  product,
  related,
}: ProductDetailViewProps) {
  return (
    <Container className="py-8 sm:py-10">
      <RecordRecentlyViewed productId={product.id} />
      <PageBreadcrumb
        items={[
          { label: "Home", href: "/" },
          { label: "Products", href: "/products" },
          ...(product.categoryName
            ? [
                {
                  label: product.categoryName,
                  href: productsHref({ category: product.categorySlug }),
                },
              ]
            : []),
          { label: product.name },
        ]}
      />

      <div className="mt-6 grid items-start gap-8 lg:grid-cols-2 lg:gap-12">
        <ProductGallery images={product.images} name={product.name} />

        <div>
          <Link
            href={`/stores/${product.store.slug}`}
            className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
          >
            <span className="relative flex size-7 items-center justify-center overflow-hidden rounded-full bg-surface-muted text-[11px] font-semibold ring-1 ring-border">
              <MediaImage src={product.store.logo} alt="" sizes="28px" />
              {product.store.logo ? null : product.store.name.slice(0, 1)}
            </span>
            {product.store.name}
            {product.store.verified ? (
              <BadgeCheck
                className="size-4 text-primary"
                aria-label="Verified store"
              />
            ) : null}
          </Link>

          <h1 className="mt-3 text-3xl sm:text-4xl">{product.name}</h1>

          <a
            href="#reviews"
            className="mt-3 inline-flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-muted-foreground"
          >
            <span className="inline-flex items-center gap-1.5">
              <Star className="size-4 fill-primary text-primary" />
              <span className="font-semibold text-foreground">
                {ratingLabel(product.rating)}
              </span>
              <span>({formatCount(product.reviewCount)})</span>
            </span>
            {product.sold ? (
              <span>{formatCount(product.sold)} sold</span>
            ) : null}
            {product.badge ? (
              <span className="rounded-full bg-card px-2 py-0.5 text-[11px] font-medium text-foreground ring-1 ring-border">
                {product.badge}
              </span>
            ) : null}
          </a>

          <ProductBuyBox product={product} />

          <p className="mt-4 max-w-xl text-sm leading-6 text-muted-foreground">
            {product.description}
          </p>

          <ProductSpecs specifications={product.specifications} />
        </div>
      </div>

      <ProductReviews product={product} />

      {related.length > 0 ? (
        <section className="mt-12">
          <h2 className="text-2xl sm:text-3xl">
            More in {product.categoryName ?? "this category"}
          </h2>
          <ProductGrid products={related} columns="catalog" className="mt-6" />
        </section>
      ) : null}
    </Container>
  );
}
