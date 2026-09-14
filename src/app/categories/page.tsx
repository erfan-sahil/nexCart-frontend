import type { Metadata } from "next";

import { CategoriesView } from "@/features/categories";

export const metadata: Metadata = {
  title: "All categories",
  description:
    "Browse NexCart departments and aisles — electronics, fashion, home, beauty, and more from thousands of stores.",
};

export default function CategoriesPage() {
  return <CategoriesView />;
}
