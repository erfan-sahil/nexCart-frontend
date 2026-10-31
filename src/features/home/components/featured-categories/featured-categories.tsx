import { Container, SectionHeader } from "@/components/common";
import { CategoryCard } from "@/components/category";
import type { Category } from "@/types";

type FeaturedCategoriesProps = {
  categories: Category[];
};

export function FeaturedCategories({ categories }: FeaturedCategoriesProps) {
  return (
    <section className="py-12 sm:py-16">
      <Container>
        <SectionHeader
          eyebrow="Browse"
          title="Featured categories"
          description="Jump into the aisles shoppers open first."
          href="/categories"
        />
        {categories.length > 0 ? (
          <div className="flex gap-3 overflow-x-auto pb-1 no-scrollbar sm:grid sm:grid-cols-4 sm:overflow-visible lg:grid-cols-8">
            {categories.map((category) => (
              <CategoryCard key={category.id} category={category} />
            ))}
          </div>
        ) : (
          <p className="rounded-2xl border border-dashed border-border bg-card px-6 py-10 text-center text-sm text-muted-foreground">
            No categories available right now.
          </p>
        )}
      </Container>
    </section>
  );
}
