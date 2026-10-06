import { Container, SectionHeader } from "@/components/common";
import { ProductGrid } from "@/components/product";
import { recentlyViewedProducts } from "@/data/mock";

export function RecentlyViewed() {
  return (
    <section className="py-12 sm:py-16">
      <Container>
        <SectionHeader
          eyebrow="Pick up where you left"
          title="Recently viewed"
          description="Jump back into products you already opened."
          href="/products?collection=recently-viewed"
        />
        <ProductGrid products={recentlyViewedProducts} columns="rail" />
      </Container>
    </section>
  );
}
