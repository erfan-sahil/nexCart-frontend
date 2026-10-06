import { api } from "@/lib/api/client";
import { toApiError } from "@/lib/api/errors";
import type { ApiSuccess } from "@/lib/api/types";

import type {
  SaveVendorApplicationPayload,
  SellingCategory,
  VendorApplication,
} from "./types";

export async function getMyApplication() {
  try {
    const { data } = await api.get<ApiSuccess<VendorApplication>>(
      "/vendor-applications/me",
    );
    return data.data;
  } catch (error) {
    const apiError = toApiError(error);

    if (apiError.status === 404) return null;

    throw apiError;
  }
}

export async function saveMyApplication(payload: SaveVendorApplicationPayload) {
  try {
    const { data } = await api.patch<ApiSuccess<VendorApplication>>(
      "/vendor-applications/me",
      payload,
    );
    return data.data;
  } catch (error) {
    throw toApiError(error);
  }
}

export async function submitMyApplication() {
  try {
    const { data } = await api.post<ApiSuccess<VendorApplication>>(
      "/vendor-applications/me/submit",
    );
    return data.data;
  } catch (error) {
    throw toApiError(error);
  }
}

export async function listSellingCategories() {
  try {
    const { data } = await api.get<ApiSuccess<SellingCategory[]>>(
      "/categories",
      {
        params: { level: 1, isActive: true, limit: 100, sort: "sortOrder" },
      },
    );
    return data.data;
  } catch (error) {
    throw toApiError(error);
  }
}
