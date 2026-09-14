import { Zap } from "lucide-react";

import { Container, CountdownTimer } from "@/components/common";
import { ProductCard } from "@/components/product";
import { flashDealEndsAt, flashDealProducts } from "@/data/mock";

export function FlashDeals() {
  return (
    <section className="bg-surface-dark py-12 sm:py-16">
      <Container>
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="mb-1 inline-flex items-center gap-1.5 text-xs font-semibold tracking-[0.18em] text-primary uppercase">
              <Zap className="size-3.5 fill-primary" />
              Limited time
            </p>
            <h2 className="text-2xl font-semibold tracking-tight text-white sm:text-3xl">
              Flash deals
            </h2>
            <p className="mt-1.5 text-sm text-white/65 sm:text-base">
              Prices drop hard, then they are gone.
            </p>
          </div>
          <CountdownTimer target={flashDealEndsAt} />
        </div>
        <div className="flex gap-2.5 overflow-x-auto pb-2 no-scrollbar sm:gap-3 lg:grid lg:grid-cols-6 lg:overflow-visible">
          {flashDealProducts.map((product) => (
            <div key={product.id} className="w-36 shrink-0 sm:w-40 lg:w-auto">
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
