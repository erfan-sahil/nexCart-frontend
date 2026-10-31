import { cn } from "@/lib/utils";
import type { Product } from "@/types";

import { ProductCard } from "./product-card";

type ProductGridProps = {
  products: Product[];
  className?: string;
  columns?: "default" | "promo" | "catalog" | "related" | "rail" | "flash";
  /** Hide products at this index and after until the lg breakpoint. */
  visibleUntilLg?: number;
};

const layoutClass = {
  default: "grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5",
  promo: "grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4",
  catalog: "grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4",
  related: "grid grid-cols-2 gap-2 sm:grid-cols-3 sm:gap-2.5 lg:grid-cols-6",
  rail: "flex overflow-x-auto pb-2 no-scrollbar",
  flash:
    "flex overflow-x-auto pb-2 no-scrollbar lg:grid lg:grid-cols-6 lg:overflow-visible",
} as const;

/** Products shown below the laptop breakpoint on the homepage grids. */
export const PRODUCT_GRID_COMPACT_COUNT = 8;

const itemClass = {
  default: "min-w-0",
  promo: "min-w-0",
  catalog: "min-w-0",
  related: "min-w-0",
  rail: "w-44 shrink-0 sm:w-48",
  flash: "w-44 shrink-0 sm:w-48 lg:w-auto",
} as const;

export function ProductGrid({
  products,
  className,
  columns = "default",
  visibleUntilLg,
}: ProductGridProps) {
  return (
    <div className={cn("gap-3 sm:gap-4", layoutClass[columns], className)}>
      {products.map((product, index) => (
        <ProductCard
          key={product.id}
          product={product}
          size={columns === "related" ? "compact" : "default"}
          className={cn(
            itemClass[columns],
            visibleUntilLg !== undefined &&
              index >= visibleUntilLg &&
              "max-lg:hidden",
          )}
        />
      ))}
    </div>
  );
}
