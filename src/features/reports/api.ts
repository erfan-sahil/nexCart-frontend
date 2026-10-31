import { api } from "@/lib/api/client";
import { toApiError } from "@/lib/api/errors";
import type { ApiSuccess } from "@/lib/api/types";

import type { ProductReportType } from "./constants";
import type { ProductReport, ProductReportMinePayload } from "./types";

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
