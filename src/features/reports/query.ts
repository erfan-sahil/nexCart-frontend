"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { REPORTS_QUERY_ROOT } from "./constants";
import { createProductReport, fetchMyProductReport } from "./api";

export function myProductReportQueryKey(productId: string) {
  return [REPORTS_QUERY_ROOT, "mine", productId] as const;
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
