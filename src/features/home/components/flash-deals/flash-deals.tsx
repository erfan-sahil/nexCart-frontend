import { Zap } from "lucide-react";

import { Container, CountdownTimer, SeeAllLink } from "@/components/common";
import { ProductGrid } from "@/components/product";
import type { Product } from "@/types";

import { SectionEmpty } from "../section-empty";

type FlashDealsProps = {
  products: Product[];
  endsAt: string | null;
};

export function FlashDeals({ products = [], endsAt }: FlashDealsProps) {
  return (
    <section className="bg-surface-dark py-12 sm:py-16">
      <Container>
        <div className="mb-8 flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div className="min-w-0">
            <p className="mb-1 inline-flex items-center gap-1.5 text-xs font-semibold tracking-[0.18em] text-primary uppercase">
              <Zap className="size-3.5 fill-primary" />
              Limited time
            </p>
            <div className="flex items-center justify-between gap-3">
              <h2 className="min-w-0 text-2xl text-white sm:text-3xl">
                Flash deals
              </h2>
              <SeeAllLink
                href="/products?collection=flash-deals"
                className="lg:hidden"
              />
            </div>
            <p className="mt-1.5 text-sm text-white/65 sm:text-base">
              Prices drop hard, then they are gone.
            </p>
          </div>
          <div className="flex items-center justify-between gap-3 lg:justify-end lg:gap-4">
            {endsAt ? <CountdownTimer target={endsAt} /> : null}
            <SeeAllLink
              href="/products?collection=flash-deals"
              className="hidden lg:inline-flex"
            />
          </div>
        </div>
        {products.length > 0 ? (
          <ProductGrid products={products} columns="flash" />
        ) : (
          <SectionEmpty invert message="No flash deals available right now." />
        )}
      </Container>
    </section>
  );
}
