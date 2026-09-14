import { Container, SectionHeader } from "@/components/common";
import { ProductGrid } from "@/components/product";
import { topSellingProducts } from "@/data/mock";

export function TopSellingProducts() {
  return (
    <section className="py-12 sm:py-16">
      <Container>
        <SectionHeader
          eyebrow="Bestsellers"
          title="Top selling products"
          description="What the marketplace cannot keep in stock."
          href="/products?sort=bestsellers"
        />
        <ProductGrid products={topSellingProducts} />
      </Container>
    </section>
  );
}
