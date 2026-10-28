import { CatalogListing, type ProductSearchParams } from "@/features/products";
import type { Category } from "@/types";

type CategoryDetailViewProps = {
  category: Category;
  searchParams?: ProductSearchParams;
};

export function CategoryDetailView({
  category,
  searchParams = {},
}: CategoryDetailViewProps) {
  return (
    <CatalogListing
      searchParams={searchParams}
      defaults={{ category: category.slug }}
    />
  );
}
