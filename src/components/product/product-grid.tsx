import { cn } from "@/lib/utils";
import type { Product } from "@/types";

import { ProductCard } from "./product-card";

type ProductGridProps = {
  products: Product[];
  className?: string;
  columns?: "default" | "promo" | "catalog" | "rail" | "flash";
};

const layoutClass = {
  default: "grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5",
  promo: "grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4",
  catalog: "grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4",
  rail: "flex overflow-x-auto pb-2 no-scrollbar",
  flash:
    "flex overflow-x-auto pb-2 no-scrollbar lg:grid lg:grid-cols-6 lg:overflow-visible",
} as const;

const itemClass = {
  default: "min-w-0",
  promo: "min-w-0",
  catalog: "min-w-0",
  rail: "w-44 shrink-0 sm:w-48",
  flash: "w-44 shrink-0 sm:w-48 lg:w-auto",
} as const;

export function ProductGrid({
  products,
  className,
  columns = "default",
}: ProductGridProps) {
  return (
    <div className={cn("gap-3 sm:gap-4", layoutClass[columns], className)}>
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          className={itemClass[columns]}
        />
      ))}
    </div>
  );
}
