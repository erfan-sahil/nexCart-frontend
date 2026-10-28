import { Container, SectionHeader } from "@/components/common";
import { ProductGrid } from "@/components/product";
import type { Product } from "@/types";

import { SectionEmpty } from "../section-empty";

type RecommendedForYouProps = {
  products?: Product[];
};

export function RecommendedForYou({ products = [] }: RecommendedForYouProps) {
  return (
    <section className="bg-brand-soft/60 py-12 sm:py-16 dark:bg-surface-muted">
      <Container>
        <SectionHeader
          eyebrow="For you"
          title="Recommended for you"
          description="Picked from stores and categories you tend to open."
          href="/products?collection=recommended"
        />
        {products.length > 0 ? (
          <ProductGrid products={products} />
        ) : (
          <SectionEmpty message="No recommended products available right now." />
        )}
      </Container>
    </section>
  );
}
