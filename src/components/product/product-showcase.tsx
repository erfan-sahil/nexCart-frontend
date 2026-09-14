import { PromoColumn } from "@/components/promo";
import { cn } from "@/lib/utils";
import type { Product, PromoSlot } from "@/types";

import { ProductGrid } from "./product-grid";

type ProductShowcaseProps = {
  products: Product[];
  promo: PromoSlot;
  promoPosition?: "start" | "end";
};

export function ProductShowcase({
  products,
  promo,
  promoPosition = "end",
}: ProductShowcaseProps) {
  const grid = (
    <ProductGrid products={products} columns="promo" className="min-w-0" />
  );

  const rail = (
    <aside className="relative min-h-64 lg:min-h-0">
      <PromoColumn
        promo={promo}
        className="min-h-64 lg:absolute lg:inset-0 lg:min-h-0"
      />
    </aside>
  );

  return (
    <div
      className={cn(
        "grid gap-2.5 sm:gap-3 lg:items-stretch",
        promoPosition === "start"
          ? "lg:grid-cols-[18rem_minmax(0,1fr)] xl:grid-cols-[20rem_minmax(0,1fr)]"
          : "lg:grid-cols-[minmax(0,1fr)_18rem] xl:grid-cols-[minmax(0,1fr)_20rem]",
      )}
    >
      {promoPosition === "start" ? (
        <>
          {rail}
          {grid}
        </>
      ) : (
        <>
          {grid}
          {rail}
        </>
      )}
    </div>
  );
}
