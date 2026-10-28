import { Container, SectionHeader } from "@/components/common";
import { ProductShowcase } from "@/components/product";
import { newArrivalsPromo } from "@/data/mock";
import type { Product } from "@/types";

import { SectionEmpty } from "../section-empty";

type NewArrivalsProps = {
  products: Product[];
};

export function NewArrivals({ products = [] }: NewArrivalsProps) {
  return (
    <section className="border-t border-border py-12 sm:py-16">
      <Container>
        <SectionHeader
          eyebrow="Just landed"
          title="New arrivals"
          description="Fresh inventory from vendors who listed recently."
          href="/products?collection=new-arrivals"
        />
        {products.length > 0 ? (
          <ProductShowcase products={products} promo={newArrivalsPromo} />
        ) : (
          <SectionEmpty message="No new arrivals available right now." />
        )}
      </Container>
    </section>
  );
}
