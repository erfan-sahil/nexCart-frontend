import Image from "next/image";
import Link from "next/link";

import { formatCount } from "@/lib/format";
import type { Category } from "@/types";

type CategoryCardProps = {
  category: Category;
};

export function CategoryCard({ category }: CategoryCardProps) {
  return (
    <Link
      href={`/products?category=${category.slug}`}
      className="group flex min-w-[140px] flex-1 flex-col overflow-hidden rounded-2xl border border-border bg-card transition-shadow hover:shadow-[0_8px_30px_rgba(10,10,10,0.06)] dark:hover:shadow-[0_12px_32px_rgba(0,0,0,0.45)]"
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-surface-muted">
        <Image
          src={category.image}
          alt={category.name}
          fill
          sizes="(max-width: 768px) 40vw, 12vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink/55 to-transparent" />
        <p className="absolute bottom-3 left-3 text-sm font-semibold text-white">
          {category.name}
        </p>
      </div>
      <p className="px-3 py-2.5 text-xs text-muted-foreground">
        {formatCount(category.productCount)} items
      </p>
    </Link>
  );
}
