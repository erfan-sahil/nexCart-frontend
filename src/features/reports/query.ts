"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import type { ProductReportStatus } from "./constants";
import { REPORTS_QUERY_ROOT } from "./constants";
import {
  createProductReport,
  fetchMyProductReport,
  fetchProductReports,
  updateProductReportStatus,
} from "./api";

export function myProductReportQueryKey(productId: string) {
  return [REPORTS_QUERY_ROOT, "mine", productId] as const;
}

export function productReportsInboxQueryKey(
  page: number,
  status?: ProductReportStatus,
) {
  return [REPORTS_QUERY_ROOT, "inbox", page, status ?? "all"] as const;
}

export function useMyProductReport(productId: string, enabled = true) {
  return useQuery({
    queryKey: myProductReportQueryKey(productId),
    queryFn: () => fetchMyProductReport(productId),
    enabled,
  });
}

export function useCreateProductReport(productId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createProductReport,
    onSuccess: (result) => {
      queryClient.setQueryData(myProductReportQueryKey(productId), {
        report: result.report,
      });
      void queryClient.invalidateQueries({ queryKey: [REPORTS_QUERY_ROOT] });
    },
  });
}

export function useProductReportsInbox(
  page: number,
  status?: ProductReportStatus,
) {
  return useQuery({
    queryKey: productReportsInboxQueryKey(page, status),
    queryFn: () => fetchProductReports(page, 20, status),
  });
}

export function useUpdateProductReportStatus(
  page: number,
  status?: ProductReportStatus,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateProductReportStatus,
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: productReportsInboxQueryKey(page, status),
      });
    },
  });
}
