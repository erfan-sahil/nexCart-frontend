import type { CatalogProduct } from "@/features/catalog/types";
import { api } from "@/lib/api/client";
import { toApiError } from "@/lib/api/errors";
import type { ApiSuccess } from "@/lib/api/types";

export async function listRecentlyViewed() {
  try {
    const { data } =
      await api.get<ApiSuccess<{ items: CatalogProduct[] }>>(
        "/recently-viewed",
      );
    return data.data.items;
  } catch (error) {
    throw toApiError(error);
  }
}

export async function recordRecentlyViewedItem(productId: string) {
  try {
    const { data } = await api.post<ApiSuccess<CatalogProduct>>(
      "/recently-viewed",
      { productId },
    );
    return data.data;
  } catch (error) {
    throw toApiError(error);
  }
}

export async function removeRecentlyViewedItem(productId: string) {
  try {
    await api.delete(`/recently-viewed/${productId}`);
  } catch (error) {
    throw toApiError(error);
  }
}

export async function clearRecentlyViewed() {
  try {
    await api.delete("/recently-viewed");
  } catch (error) {
    throw toApiError(error);
  }
}
