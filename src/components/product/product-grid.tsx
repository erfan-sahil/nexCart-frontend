import { cn } from "@/lib/utils";
import type { Product } from "@/types";

import { ProductCard } from "./product-card";

type ProductGridProps = {
  products: Product[];
  className?: string;
  columns?: "default" | "promo";
};

const columnClass = {
  default: "grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5",
  promo: "grid-cols-2 sm:grid-cols-3 lg:grid-cols-4",
} as const;

export function ProductGrid({
  products,
  className,
  columns = "default",
}: ProductGridProps) {
  return (
    <div
      className={cn("grid gap-2.5 sm:gap-3", columnClass[columns], className)}
    >
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
