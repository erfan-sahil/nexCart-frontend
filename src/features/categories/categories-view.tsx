import { categories, getCatalogStats, getPopularAisles } from "@/data/mock";

import {
  CategoriesHeader,
  CategoryDirectory,
  PopularAisles,
} from "./components";

export function CategoriesView() {
  const stats = getCatalogStats();

  return (
    <>
      <CategoriesHeader {...stats} />
      <PopularAisles aisles={getPopularAisles()} />
      <CategoryDirectory categories={categories} />
    </>
  );
}
