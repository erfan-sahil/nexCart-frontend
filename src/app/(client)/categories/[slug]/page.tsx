import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { findCategory, getCategoryTree } from "@/features/catalog";
import { CatalogListing, type ProductSearchParams } from "@/features/products";

type CategoryPageProps = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<ProductSearchParams>;
};

export async function generateMetadata({
  params,
}: CategoryPageProps): Promise<Metadata> {
  const { slug } = await params;
  const category = findCategory(await getCategoryTree(), slug);

  if (!category) {
    return { title: "Category" };
  }

  return {
    title: category.name,
    description: category.description,
  };
}

export default async function CategoryPage({
  params,
  searchParams,
}: CategoryPageProps) {
  const { slug } = await params;
  const category = findCategory(await getCategoryTree(), slug);

  if (!category) {
    notFound();
  }

  return (
    <CatalogListing
      searchParams={await searchParams}
      defaults={{ category: slug }}
    />
  );
}
