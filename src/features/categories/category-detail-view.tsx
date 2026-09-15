import {
  ProductsView,
  parseProductSearchParams,
  type ProductSearchParams,
} from "@/features/products";
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
    <ProductsView
      query={parseProductSearchParams(searchParams, {
        category: category.slug,
      })}
    />
  );
}
