import { ProductGrid } from "@/components/product/product-grid";
import { Container } from "@/components/shared/container";
import { SectionHeader } from "@/components/shared/section-header";
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
