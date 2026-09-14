import { Container, SectionHeader } from "@/components/common";
import { SubcategoryCard } from "@/components/category";
import { ProductGrid } from "@/components/product";
import { products } from "@/data/mock";
import type { Category, Product } from "@/types";

import { CategoryHero, HashScroll } from "./components";

type CategoryDetailViewProps = {
  category: Category;
};

function productsForCategory(slug: string, catalog: Product[]) {
  const offset = slug
    .split("")
    .reduce((sum, char) => sum + char.charCodeAt(0), 0);
  const start = offset % catalog.length;
  return [...catalog.slice(start), ...catalog.slice(0, start)].slice(0, 10);
}

export function CategoryDetailView({ category }: CategoryDetailViewProps) {
  const trending = productsForCategory(category.slug, products);

  return (
    <>
      <HashScroll />
      <CategoryHero category={category} />
      <section className="py-10 sm:py-14">
        <Container>
          <SectionHeader
            eyebrow="Browse aisles"
            title={`Shop ${category.name.toLowerCase()}`}
            description="Pick a subcategory to narrow the catalog."
          />
          <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 sm:gap-3 lg:grid-cols-4">
            {category.subcategories.map((subcategory) => (
              <div
                key={subcategory.id}
                id={subcategory.slug}
                className="scroll-mt-40"
              >
                <SubcategoryCard
                  subcategory={subcategory}
                  href={`/categories/${category.slug}#${subcategory.slug}`}
                />
              </div>
            ))}
          </div>
        </Container>
      </section>
      <section className="border-t border-border bg-surface-muted py-10 sm:py-14">
        <Container>
          <SectionHeader
            eyebrow="In this department"
            title={`Trending in ${category.name.toLowerCase()}`}
            description="A snapshot of what shoppers are adding from this aisle."
            href="/products"
          />
          <ProductGrid products={trending} />
        </Container>
      </section>
    </>
  );
}
