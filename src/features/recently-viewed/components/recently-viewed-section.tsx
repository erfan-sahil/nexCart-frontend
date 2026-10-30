"use client";

import { useAuthStore } from "@/features/auth/store";
import { RecentlyViewed } from "@/features/home/components/recently-viewed";

import { HOME_RECENTLY_VIEWED_LIMIT } from "../constants";
import { useRecentlyViewed } from "../query";

export function RecentlyViewedSection() {
  const authStatus = useAuthStore((state) => state.status);
  const recentlyViewed = useRecentlyViewed();

  if (authStatus !== "authenticated") {
    return null;
  }

  if (recentlyViewed.isPending) {
    return null;
  }

  if (recentlyViewed.isError || !recentlyViewed.data?.length) {
    return null;
  }

  const products = recentlyViewed.data.slice(0, HOME_RECENTLY_VIEWED_LIMIT);

  return <RecentlyViewed products={products} />;
}
