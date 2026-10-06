import Link from "next/link";
import { ArrowRight, Zap } from "lucide-react";

import { Container, CountdownTimer } from "@/components/common";
import { ProductCard } from "@/components/product";
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
            <Link
              href="/products?collection=flash-deals"
              className="group inline-flex h-10 shrink-0 items-center gap-2.5 rounded-full border border-border bg-card py-1 pr-1 pl-3.5 text-sm font-semibold text-foreground transition-colors duration-300 hover:border-primary hover:bg-brand-soft"
            >
              See all
              <span className="flex size-8 items-center justify-center rounded-full bg-primary text-primary-foreground transition duration-300 group-hover:translate-x-0.5 group-hover:bg-ink group-hover:text-primary">
                <ArrowRight className="size-4" />
              </span>
            </Link>
          </div>
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
