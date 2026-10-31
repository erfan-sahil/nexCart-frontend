"use client";

import { Container, SectionHeader } from "@/components/common";
import { RecommendedForYou } from "@/features/home/components/recommended-for-you";
import { ProductCardSkeleton } from "@/features/wishlist/components/product-card-skeleton";

import {
  HOME_RECOMMENDATIONS_LIMIT,
  PUBLIC_RECOMMENDATIONS_DESCRIPTION,
} from "../constants";
import { useRecommendations } from "../query";

export function RecommendedSection() {
  const recommendations = useRecommendations({
    page: 1,
    limit: HOME_RECOMMENDATIONS_LIMIT,
  });

  if (recommendations.isPending) {
    return (
      <section className="bg-brand-soft/60 py-12 sm:py-16 dark:bg-surface-muted">
        <Container>
          <SectionHeader
            eyebrow="For you"
            title="Recommended for you"
            description={PUBLIC_RECOMMENDATIONS_DESCRIPTION}
            href="/products?collection=recommended"
          />
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 md:grid-cols-4 lg:grid-cols-5">
            {Array.from({ length: HOME_RECOMMENDATIONS_LIMIT }).map(
              (_, index) => (
                <ProductCardSkeleton key={index} />
              ),
            )}
          </div>
        </Container>
      </section>
    );
  }

  if (recommendations.isError || !recommendations.data?.products.length) {
    return (
      <RecommendedForYou
        products={[]}
        personalized={recommendations.data?.personalized ?? false}
      />
    );
  }

  return (
    <RecommendedForYou
      products={recommendations.data.products}
      personalized={recommendations.data.personalized}
    />
  );
}
