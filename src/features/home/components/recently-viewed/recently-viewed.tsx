import { Container, SectionHeader } from "@/components/common";
import { ProductCard } from "@/components/product";
import { recentlyViewedProducts } from "@/data/mock";

export function RecentlyViewed() {
  return (
    <section className="py-12 sm:py-16">
      <Container>
        <SectionHeader
          eyebrow="Pick up where you left"
          title="Recently viewed"
          description="Jump back into products you already opened."
          href="/recently-viewed"
        />
        <div className="flex gap-2.5 overflow-x-auto pb-2 no-scrollbar sm:gap-3">
          {recentlyViewedProducts.map((product) => (
            <ProductCard key={product.id} product={product} variant="compact" />
          ))}
        </div>
      </Container>
    </section>
  );
}
