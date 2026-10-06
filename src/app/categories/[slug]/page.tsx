import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { categories, getCategoryBySlug } from "@/data/mock";
import {
  ProductsView,
  parseProductSearchParams,
  type ProductSearchParams,
} from "@/features/products";

type CategoryPageProps = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<ProductSearchParams>;
};

export function generateStaticParams() {
  return categories.map((category) => ({ slug: category.slug }));
}

export async function generateMetadata({
  params,
}: CategoryPageProps): Promise<Metadata> {
  const { slug } = await params;
  const category = getCategoryBySlug(slug);

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
  const category = getCategoryBySlug(slug);

  if (!category) {
    notFound();
  }

  const query = parseProductSearchParams(await searchParams, {
    category: slug,
  });

  return <ProductsView query={query} />;
}
