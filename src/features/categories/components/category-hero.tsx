import Image from "next/image";

import { Container, PageBreadcrumb } from "@/components/common";
import { formatCount } from "@/lib/format";
import type { Category } from "@/types";

type CategoryHeroProps = {
  category: Category;
};

export function CategoryHero({ category }: CategoryHeroProps) {
  return (
    <section className="relative overflow-hidden bg-surface-dark">
      <div className="relative min-h-[240px] sm:min-h-[300px]">
        <Image
          src={category.image}
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-ink via-ink/75 to-ink/25" />
        <Container className="relative flex min-h-[240px] flex-col justify-end py-10 sm:min-h-[300px] sm:py-12">
          <PageBreadcrumb
            invert
            items={[
              { label: "Home", href: "/" },
              { label: "Categories", href: "/categories" },
              { label: category.name },
            ]}
          />
          <h1 className="mt-4 max-w-xl text-3xl font-semibold tracking-tight text-white sm:text-5xl">
            {category.name}
          </h1>
          <p className="mt-3 max-w-lg text-sm text-white/70 sm:text-base">
            {category.description}
          </p>
          <p className="mt-4 text-sm font-medium text-primary">
            {formatCount(category.productCount)} products ·{" "}
            {category.subcategories.length} aisles
          </p>
        </Container>
      </div>
    </section>
  );
}
