import { serverGet } from "@/lib/api/server";

import {
  mapFeaturedCategories,
  type FeaturedCategoryDto,
} from "./lib/featured";

export async function getFeaturedCategories() {
  try {
    const body = await serverGet<FeaturedCategoryDto[]>("/categories/featured");
    return mapFeaturedCategories(body.data ?? []);
  } catch {
    return [];
  }
}
