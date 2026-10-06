import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

import { formatCount } from "@/lib/format";
import type { Category } from "@/types";

type CategoryCardProps = {
  category: Category;
};

export function CategoryCard({ category }: CategoryCardProps) {
  return (
    <Link
      href={`/products?category=${category.slug}`}
      className="group flex min-w-[140px] flex-1 flex-col sm:min-w-0"
    >
      <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-surface-muted ring-1 ring-border transition duration-300 group-hover:ring-primary">
        <Image
          src={category.image}
          alt={category.name}
          fill
          sizes="(max-width: 640px) 42vw, (max-width: 1024px) 22vw, 12vw"
          className="object-cover transition duration-700 ease-out group-hover:scale-105"
        />
        <span className="absolute right-2 bottom-2 flex size-7 items-center justify-center rounded-full border border-primary bg-brand-soft text-primary transition-colors duration-300 group-hover:text-black dark:group-hover:text-white">
          <ArrowUpRight className="size-3.5" />
        </span>
      </div>
      <div className="px-0.5 pt-2.5">
        <p className="truncate font-display text-sm leading-none font-semibold text-foreground transition-colors duration-300 group-hover:text-primary">
          {category.name}
        </p>
        <p className="mt-1.5 text-[11px] leading-none text-muted-foreground">
          {formatCount(category.productCount)} items
        </p>
      </div>
    </Link>
  );
}
