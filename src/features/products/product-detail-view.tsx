import Link from "next/link";
import { BadgeCheck } from "lucide-react";

import { Container, MediaImage, PageBreadcrumb } from "@/components/common";
import { ProductGrid } from "@/components/product";
import { RecordRecentlyViewed } from "@/features/recently-viewed";
import type { Product, ProductDetail } from "@/types";

import { productsHref } from "./lib/query";
import { ProductBuyBox } from "./components/product-buy-box";
import { ProductGallery } from "./components/product-gallery";
import { ProductReviews } from "./components/product-reviews";
import { ProductSpecs } from "./components/product-specs";
import { ProductRatingLink } from "@/features/reviews";
import { ProductReportSection } from "@/features/reports";

type ProductDetailViewProps = {
  product: ProductDetail;
  related: Product[];
};

function suggestedProducts(products: Product[]) {
  if (products.length >= 12) return products.slice(0, 12);
  if (products.length >= 6) return products.slice(0, 6);
  return products;
}

export function ProductDetailView({
  product,
  related,
}: ProductDetailViewProps) {
  const suggested = suggestedProducts(related);

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

          <ProductRatingLink
            productId={product.id}
            average={product.rating}
            count={product.reviewCount}
            sold={product.sold}
            badge={product.badge}
          />

          <ProductBuyBox product={product} />

          <p className="mt-4 max-w-xl text-sm leading-6 text-muted-foreground">
            {product.description}
          </p>

          <ProductReportSection productId={product.id} />

          <ProductSpecs specifications={product.specifications} />
        </div>
      </div>

      <ProductReviews product={product} />

      {suggested.length > 0 ? (
        <section className="mt-12">
          <h2 className="text-2xl sm:text-3xl">
            More in {product.categoryName ?? "this category"}
          </h2>
          <ProductGrid
            products={suggested}
            columns="related"
            className="mt-6"
          />
        </section>
      ) : null}
    </Container>
  );
}
