import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { SubcategoryCard } from "@/components/category";
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
      <div className="mb-5 flex items-start justify-between gap-4 sm:mb-6">
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
        <Link
          href={`/categories/${category.slug}`}
          className="inline-flex shrink-0 items-center gap-1 pt-1 text-sm font-medium text-primary hover:text-brand-hover"
        >
          Shop all
          <ArrowRight className="size-4" />
        </Link>
      </div>
      <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 sm:gap-3 lg:grid-cols-4">
        {category.subcategories.map((subcategory) => (
          <SubcategoryCard
            key={subcategory.id}
            subcategory={subcategory}
            href={`/categories/${category.slug}#${subcategory.slug}`}
          />
        ))}
      </div>
    </section>
  );
}
