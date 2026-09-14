import { CategoryCard } from "@/components/category/category-card";
import { Container } from "@/components/shared/container";
import { SectionHeader } from "@/components/shared/section-header";
import { categories } from "@/data/mock";

export function FeaturedCategories() {
  return (
    <section className="py-12 sm:py-16">
      <Container>
        <SectionHeader
          eyebrow="Browse"
          title="Featured categories"
          description="Jump into the aisles shoppers open first."
          href="/categories"
        />
        <div className="flex gap-3 overflow-x-auto pb-2 no-scrollbar sm:grid sm:grid-cols-4 sm:overflow-visible lg:grid-cols-8">
          {categories.map((category) => (
            <CategoryCard key={category.id} category={category} />
          ))}
        </div>
      </Container>
    </section>
  );
}
