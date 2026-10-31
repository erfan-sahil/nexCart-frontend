import { mediaUrl } from "@/lib/media";
import type { Category } from "@/types";

export type FeaturedCategoryDto = {
  id: string;
  name: string;
  slug: string;
  description: string;
  image: string;
  productCount: number;
};

export function mapFeaturedCategories(
  items: FeaturedCategoryDto[],
): Category[] {
  return items.map((item) => ({
    id: item.id,
    name: item.name,
    slug: item.slug,
    description: item.description,
    image: mediaUrl(item.image),
    productCount: item.productCount,
    subcategories: [],
  }));
}
