import { Container, SectionHeader } from "@/components/common";
import { ProductGrid } from "@/components/product";
import { recommendedProducts } from "@/data/mock";

export function RecommendedForYou() {
  return (
    <section className="bg-brand-soft/60 py-12 sm:py-16">
      <Container>
        <SectionHeader
          eyebrow="For you"
          title="Recommended for you"
          description="Picked from stores and categories you tend to open."
          href="/products?collection=recommended"
        />
        <ProductGrid products={recommendedProducts} />
      </Container>
    </section>
  );
}
