import type { CategoryNode } from "@/features/catalog";
import { mediaUrl } from "@/lib/media";
import type { Category, PopularAisle, Subcategory } from "@/types";

function toAisle(node: CategoryNode): Subcategory {
  return {
    id: node.id,
    name: node.name,
    slug: node.slug,
    image: mediaUrl(node.image),
    productCount: node.productCount ?? 0,
    ...(node.sortOrder === 0 ? { popular: true } : {}),
    children: (node.children ?? []).map(toAisle),
  };
}

export function toStorefrontCategories(nodes: CategoryNode[]): Category[] {
  return nodes
    .filter((node) => node.isActive !== false)
    .map((node) => ({
      id: node.id,
      name: node.name,
      slug: node.slug,
      description: node.description,
      image: mediaUrl(node.image),
      productCount: node.productCount ?? 0,
      subcategories: (node.children ?? [])
        .filter((child) => child.isActive !== false)
        .map(toAisle),
    }));
}

export function popularAisles(categories: Category[]): PopularAisle[] {
  return categories.flatMap((category) =>
    category.subcategories
      .filter((aisle) => aisle.popular)
      .map((aisle) => ({
        ...aisle,
        categorySlug: category.slug,
        categoryName: category.name,
      })),
  );
}

export function categoryStats(categories: Category[]) {
  const aisleCount = categories.reduce(
    (total, category) =>
      total +
      category.subcategories.reduce(
        (sum, aisle) => sum + 1 + (aisle.children?.length ?? 0),
        0,
      ),
    0,
  );

  return {
    departmentCount: categories.length,
    aisleCount,
    productCount: categories.reduce(
      (total, category) => total + category.productCount,
      0,
    ),
  };
}
