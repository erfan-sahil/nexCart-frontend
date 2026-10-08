import Image from "next/image";

import { SubcategoryCard } from "@/components/category";
import { SeeAllLink } from "@/components/common";
import { CATEGORY_ICONS } from "@/constants/category-icons";
import { formatCount } from "@/lib/format";
import type { Category } from "@/types";

type CategorySectionProps = {
  category: Category;
};

export function CategorySection({ category }: CategorySectionProps) {
  const Icon = CATEGORY_ICONS[category.slug];

  return (
    <section
      id={`category-${category.slug}`}
      className="scroll-mt-44 border-b border-border py-8 last:border-b-0 last:pb-0 sm:py-10"
    >
      <div className="mb-5 flex items-center justify-between gap-4 sm:mb-6">
        <div className="flex min-w-0 items-center gap-3">
          <div className="relative size-14 shrink-0 overflow-hidden rounded-xl bg-surface-muted sm:size-16">
            <Image
              src={category.image}
              alt=""
              fill
              sizes="64px"
              className="object-cover"
            />
          </div>
          <div className="min-w-0">
            <h2 className="flex items-center gap-2 text-xl font-semibold tracking-tight sm:text-2xl">
              {Icon ? (
                <Icon className="size-5 shrink-0 text-primary" aria-hidden />
              ) : null}
              {category.name}
            </h2>
            <p className="mt-0.5 text-sm text-muted-foreground">
              {formatCount(category.productCount)} items ·{" "}
              {category.subcategories.length} aisles
            </p>
          </div>
        </div>
        <SeeAllLink
          href={`/products?category=${category.slug}`}
          label="Shop all"
        />
      </div>
      <div className="grid grid-cols-3 gap-2 sm:grid-cols-4 sm:gap-3">
        {category.subcategories.map((subcategory) => (
          <div
            key={subcategory.id}
            id={`aisle-${category.slug}-${subcategory.slug}`}
            className="scroll-mt-44"
          >
            <SubcategoryCard
              subcategory={subcategory}
              href={`/products?category=${category.slug}&subcategory=${subcategory.slug}`}
            />
          </div>
        ))}
      </div>
    </section>
  );
}
