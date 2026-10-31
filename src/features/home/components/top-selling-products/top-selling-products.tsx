import { Container, SectionHeader } from "@/components/common";
import { ProductShowcase } from "@/components/product";
import type { Product, PromoSlot } from "@/types";

import { SectionEmpty } from "../section-empty";

type TopSellingProductsProps = {
  products: Product[];
  promo?: PromoSlot;
};

export function TopSellingProducts({
  products = [],
  promo,
}: TopSellingProductsProps) {
  return (
    <section className="py-12 sm:py-16">
      <Container>
        <SectionHeader
          eyebrow="Bestsellers"
          title="Top selling products"
          description="What the marketplace cannot keep in stock."
          href="/products?collection=bestsellers"
        />
        {products.length > 0 ? (
          <ProductShowcase
            products={products}
            promo={promo}
            promoPosition="start"
          />
        ) : (
          <SectionEmpty message="No top selling products available right now." />
        )}
      </Container>
    </section>
  );
}
