import { ProductGrid } from "@/components/product/product-grid";
import { Container } from "@/components/shared/container";
import { SectionHeader } from "@/components/shared/section-header";
import { newArrivalProducts } from "@/data/mock";

export function NewArrivals() {
  return (
    <section className="border-t border-border py-12 sm:py-16">
      <Container>
        <SectionHeader
          eyebrow="Just landed"
          title="New arrivals"
          description="Fresh inventory from vendors who listed this week."
          href="/new-arrivals"
        />
        <ProductGrid products={newArrivalProducts} />
      </Container>
    </section>
  );
}
