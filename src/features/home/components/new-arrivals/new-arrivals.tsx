import { Container, SectionHeader } from "@/components/common";
import { ProductShowcase } from "@/components/product";
import { newArrivalProducts, newArrivalsPromo } from "@/data/mock";

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
        <ProductShowcase
          products={newArrivalProducts}
          promo={newArrivalsPromo}
        />
      </Container>
    </section>
  );
}
