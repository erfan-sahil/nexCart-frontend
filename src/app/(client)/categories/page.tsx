import type { Metadata } from "next";

import { getCategoryTree } from "@/features/catalog";
import { CategoriesView } from "@/features/categories";

export const metadata: Metadata = {
  title: "All categories",
  description:
    "Browse NexCart departments and aisles — electronics, fashion, home, beauty, and more from independent stores.",
};

export default async function CategoriesPage() {
  const tree = await getCategoryTree();
  return <CategoriesView tree={tree} />;
}
