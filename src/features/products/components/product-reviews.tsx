"use client";

import type { ProductDetail } from "@/types";

import { ProductReviewSection } from "@/features/reviews";

type ProductReviewsProps = {
  product: ProductDetail;
};

export function ProductReviews({ product }: ProductReviewsProps) {
  return (
    <ProductReviewSection
      productId={product.id}
      initialAverage={product.rating}
      initialCount={product.reviewCount}
    />
  );
}
