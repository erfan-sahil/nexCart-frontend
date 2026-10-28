import { Container, SectionHeader } from "@/components/common";
import { ProductGrid } from "@/components/product";
import type { Product } from "@/types";

import { SectionEmpty } from "../section-empty";

type RecentlyViewedProps = {
  products?: Product[];
};

export function RecentlyViewed({ products = [] }: RecentlyViewedProps) {
  return (
    <section className="py-12 sm:py-16">
      <Container>
        <SectionHeader
          eyebrow="Pick up where you left"
          title="Recently viewed"
          description="Jump back into products you already opened."
          href="/products?collection=recently-viewed"
        />
        {products.length > 0 ? (
          <ProductGrid products={products} columns="rail" />
        ) : (
          <SectionEmpty message="No recently viewed products available right now." />
        )}
      </Container>
    </section>
  );
}
