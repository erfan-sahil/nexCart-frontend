import { Container, SectionHeader } from "@/components/common";
import { SubcategoryCard } from "@/components/category";
import type { PopularAisle } from "@/types";

type PopularAislesProps = {
  aisles: PopularAisle[];
};

export function PopularAisles({ aisles }: PopularAislesProps) {
  if (aisles.length === 0) return null;

  return (
    <section className="border-b border-border py-8 sm:py-10">
      <Container>
        <SectionHeader
          eyebrow="Start here"
          title="Popular aisles"
          description="What shoppers open first this week."
          className="mb-5 sm:mb-6"
        />
        <div className="flex gap-3 overflow-x-auto pb-1 no-scrollbar">
          {aisles.map((aisle) => (
            <SubcategoryCard
              key={aisle.id}
              subcategory={aisle}
              categoryName={aisle.categoryName}
              href={`/categories/${aisle.categorySlug}#${aisle.slug}`}
              variant="compact"
            />
          ))}
        </div>
      </Container>
    </section>
  );
}
