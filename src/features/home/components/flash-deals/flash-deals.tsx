import { Zap } from "lucide-react";

import { Container, CountdownTimer, SeeAllLink } from "@/components/common";
import { ProductGrid } from "@/components/product";
import { flashDealEndsAt, flashDealProducts } from "@/data/mock";

export function FlashDeals() {
  return (
    <section className="bg-surface-dark py-12 sm:py-16">
      <Container>
        <div className="mb-8 flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div className="min-w-0">
            <p className="mb-1 inline-flex items-center gap-1.5 text-xs font-semibold tracking-[0.18em] text-primary uppercase">
              <Zap className="size-3.5 fill-primary" />
              Limited time
            </p>
            <h2 className="text-2xl text-white sm:text-3xl">Flash deals</h2>
            <p className="mt-1.5 text-sm text-white/65 sm:text-base">
              Prices drop hard, then they are gone.
            </p>
          </div>
          <div className="flex items-center justify-between gap-3 lg:justify-end lg:gap-4">
            <CountdownTimer target={flashDealEndsAt} />
            <SeeAllLink href="/products?collection=flash-deals" />
          </div>
        </div>
        <ProductGrid products={flashDealProducts} columns="flash" />
      </Container>
    </section>
  );
}
