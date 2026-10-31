import { Container, SectionHeader } from "@/components/common";
import { PRODUCT_GRID_COMPACT_COUNT, ProductGrid } from "@/components/product";
import type { Product } from "@/types";

import { SectionEmpty } from "../section-empty";

type TrendingProductsProps = {
  products: Product[];
};

export function TrendingProducts({ products = [] }: TrendingProductsProps) {
  return (
    <section className="py-12 sm:py-16">
      <Container>
        <SectionHeader
          eyebrow="Right now"
          title="Trending products"
          description="Rising fast across stores this week."
          href="/products?collection=trending"
        />
        {products.length > 0 ? (
          <ProductGrid
            products={products}
            visibleUntilLg={PRODUCT_GRID_COMPACT_COUNT}
          />
        ) : (
          <SectionEmpty message="No trending products available right now." />
        )}
      </Container>
    </section>
  );
}
