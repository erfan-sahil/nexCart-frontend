import type { CategoryNode } from "@/features/catalog";

import {
  categoryStats,
  popularAisles,
  toStorefrontCategories,
} from "./lib/map";

import {
  CategoriesHeader,
  CategoryDirectory,
  PopularAisles,
} from "./components";

type CategoriesViewProps = {
  tree: CategoryNode[];
};

export function CategoriesView({ tree }: CategoriesViewProps) {
  const categories = toStorefrontCategories(tree);
  const stats = categoryStats(categories);

  return (
    <>
      <CategoriesHeader {...stats} />
      <PopularAisles aisles={popularAisles(categories)} />
      <CategoryDirectory categories={categories} />
    </>
  );
}
