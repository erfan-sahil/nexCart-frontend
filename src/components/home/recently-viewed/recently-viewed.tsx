import { ProductCard } from "@/components/product/product-card";
import { Container } from "@/components/shared/container";
import { SectionHeader } from "@/components/shared/section-header";
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
        <div className="flex gap-4 overflow-x-auto pb-2 no-scrollbar">
          {recentlyViewedProducts.map((product) => (
            <ProductCard key={product.id} product={product} variant="compact" />
          ))}
        </div>
      </Container>
    </section>
  );
}
