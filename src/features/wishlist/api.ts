import type { CatalogProduct } from "@/features/catalog/types";
import { api } from "@/lib/api/client";
import { toApiError } from "@/lib/api/errors";
import type { ApiSuccess } from "@/lib/api/types";

export async function listWishlist() {
  try {
    const { data } =
      await api.get<ApiSuccess<{ items: CatalogProduct[] }>>("/wishlist");
    return data.data.items;
  } catch (error) {
    throw toApiError(error);
  }
}

export async function addWishlistItem(productId: string) {
  try {
    const { data } = await api.post<ApiSuccess<CatalogProduct>>("/wishlist", {
      productId,
    });
    return data.data;
  } catch (error) {
    throw toApiError(error);
  }
}

export async function removeWishlistItem(productId: string) {
  try {
    await api.delete(`/wishlist/${productId}`);
  } catch (error) {
    throw toApiError(error);
  }
}

export async function clearWishlist() {
  try {
    await api.delete("/wishlist");
  } catch (error) {
    throw toApiError(error);
  }
}
