"use client";

import { useEffect, useRef } from "react";

import { useAuthStore } from "@/features/auth/store";

import { useRecordRecentlyViewed } from "../query";

type RecordRecentlyViewedProps = {
  productId: string;
};

export function RecordRecentlyViewed({ productId }: RecordRecentlyViewedProps) {
  const status = useAuthStore((state) => state.status);
  const user = useAuthStore((state) => state.user);
  const { mutate } = useRecordRecentlyViewed();
  const lastRecordedId = useRef<string | null>(null);

  useEffect(() => {
    if (status !== "authenticated" || user?.role !== "customer") {
      return;
    }

    if (lastRecordedId.current === productId) {
      return;
    }

    lastRecordedId.current = productId;
    mutate(productId);
  }, [productId, status, user?.role, mutate]);

  return null;
}
