import { Container, SectionHeader } from "@/components/common";
import { ProductGrid } from "@/components/product";
import { trendingProducts } from "@/data/mock";

export function TrendingProducts() {
  return (
    <section className="py-12 sm:py-16">
      <Container>
        <SectionHeader
          eyebrow="Right now"
          title="Trending products"
          description="Rising fast across stores in the last 24 hours."
          href="/products?sort=trending"
        />
        <ProductGrid products={trendingProducts} />
      </Container>
    </section>
  );
}
