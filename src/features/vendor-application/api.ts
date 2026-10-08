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

async function postFile(
  path: string,
  field: string,
  file: Blob,
  filename: string,
) {
  const body = new FormData();
  body.append(field, file, filename);

  try {
    const { data } = await api.post<ApiSuccess<{ url: string }>>(path, body, {
      headers: { "Content-Type": "multipart/form-data" },
      transformRequest: (payload, headers) => {
        if (
          headers &&
          typeof headers === "object" &&
          "delete" in headers &&
          typeof headers.delete === "function"
        ) {
          headers.delete("Content-Type");
        }

        return payload;
      },
    });
    return data.data.url;
  } catch (error) {
    throw toApiError(error);
  }
}

export function uploadSelfie(file: Blob) {
  return postFile(
    "/vendor-applications/me/selfie",
    "selfie",
    file,
    "selfie.jpg",
  );
}

export function uploadApplicationFile(file: File) {
  return postFile("/vendor-applications/me/files", "file", file, file.name);
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
