import { api } from "@/lib/api/client";
import { toApiError } from "@/lib/api/errors";
import type { ApiSuccess } from "@/lib/api/types";

import type { ProductReportStatus, ProductReportType } from "./constants";
import type {
  ProductReport,
  ProductReportListPayload,
  ProductReportMinePayload,
} from "./types";

export async function fetchMyProductReport(productId: string) {
  try {
    const { data } = await api.get<ApiSuccess<ProductReportMinePayload>>(
      `/products/${productId}/reports/mine`,
    );

    return data.data;
  } catch (error) {
    throw toApiError(error);
  }
}

export async function createProductReport(input: {
  productId: string;
  type: ProductReportType;
  message: string;
}) {
  try {
    const { data } = await api.post<ApiSuccess<{ report: ProductReport }>>(
      `/products/${input.productId}/reports`,
      {
        type: input.type,
        message: input.message,
      },
    );

    return data.data;
  } catch (error) {
    throw toApiError(error);
  }
}

export async function fetchProductReports(
  page = 1,
  limit = 20,
  status?: ProductReportStatus,
) {
  try {
    const { data } = await api.get<ApiSuccess<ProductReportListPayload>>(
      "/product-reports",
      {
        params: {
          page,
          limit,
          ...(status ? { status } : {}),
        },
      },
    );

    return {
      payload: data.data,
      pagination: data.meta?.pagination,
    };
  } catch (error) {
    throw toApiError(error);
  }
}

export async function updateProductReportStatus(input: {
  reportId: string;
  status: "reviewed" | "dismissed";
}) {
  try {
    const { data } = await api.patch<ApiSuccess<{ report: ProductReport }>>(
      `/product-reports/${input.reportId}`,
      { status: input.status },
    );

    return data.data;
  } catch (error) {
    throw toApiError(error);
  }
}
