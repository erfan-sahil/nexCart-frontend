import { Container, SectionHeader } from "@/components/common";
import { ProductShowcase } from "@/components/product";
import type { Product, PromoSlot } from "@/types";

import { SectionEmpty } from "../section-empty";

type NewArrivalsProps = {
  products: Product[];
  promo?: PromoSlot;
};

export function NewArrivals({ products = [], promo }: NewArrivalsProps) {
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
          <ProductShowcase products={products} promo={promo} />
        ) : (
          <SectionEmpty message="No new arrivals available right now." />
        )}
      </Container>
    </section>
  );
}
