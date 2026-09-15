import { Container, SectionHeader } from "@/components/common";
import { ProductShowcase } from "@/components/product";
import { topSellingProducts, topSellingPromo } from "@/data/mock";

export function TopSellingProducts() {
  return (
    <section className="py-12 sm:py-16">
      <Container>
        <SectionHeader
          eyebrow="Bestsellers"
          title="Top selling products"
          description="What the marketplace cannot keep in stock."
          href="/products?collection=bestsellers"
        />
        <ProductShowcase
          products={topSellingProducts}
          promo={topSellingPromo}
          promoPosition="start"
        />
      </Container>
    </section>
  );
}
