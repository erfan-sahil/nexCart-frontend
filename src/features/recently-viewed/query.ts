"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { toProduct } from "@/features/catalog/map";
import { useAuthStore } from "@/features/auth/store";
import type { Product } from "@/types";

import {
  clearRecentlyViewed,
  listRecentlyViewed,
  recordRecentlyViewedItem,
  removeRecentlyViewedItem,
} from "./api";
import { MAX_RECENTLY_VIEWED_ITEMS } from "./constants";

export function recentlyViewedQueryKey(userId: string) {
  return ["recently-viewed", userId] as const;
}

function customerId() {
  const { status, user } = useAuthStore.getState();

  if (status === "authenticated" && user?.role === "customer") {
    return user.id;
  }

  return null;
}

export function useRecentlyViewed() {
  const status = useAuthStore((state) => state.status);
  const user = useAuthStore((state) => state.user);
  const enabled = status === "authenticated" && user?.role === "customer";

  const query = useQuery({
    queryKey: recentlyViewedQueryKey(user?.id ?? "anonymous"),
    enabled,
    queryFn: async () => {
      const items = await listRecentlyViewed();
      return items.map(toProduct);
    },
  });

  if (!enabled) {
    return { ...query, data: undefined };
  }

  return query;
}

export function useRecordRecentlyViewed() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: recordRecentlyViewedItem,
    onSuccess: (catalogProduct) => {
      const userId = customerId();

      if (!userId) {
        return;
      }

      const product = toProduct(catalogProduct);
      const key = recentlyViewedQueryKey(userId);

      queryClient.setQueryData<Product[]>(key, (current = []) => {
        const rest = current.filter((item) => item.id !== product.id);
        return [product, ...rest].slice(0, MAX_RECENTLY_VIEWED_ITEMS);
      });
    },
  });
}

export function useRemoveRecentlyViewedItem() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (productId: string) => removeRecentlyViewedItem(productId),
    onMutate: async (productId) => {
      const userId = customerId();

      if (!userId) {
        return { previous: undefined };
      }

      const key = recentlyViewedQueryKey(userId);
      await queryClient.cancelQueries({ queryKey: key });
      const previous = queryClient.getQueryData<Product[]>(key) ?? [];

      queryClient.setQueryData<Product[]>(
        key,
        previous.filter((item) => item.id !== productId),
      );

      return { previous, userId };
    },
    onError: (_error, _productId, context) => {
      if (!context?.userId) return;
      queryClient.setQueryData(
        recentlyViewedQueryKey(context.userId),
        context.previous,
      );
    },
  });
}

export function useClearRecentlyViewed() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: clearRecentlyViewed,
    onMutate: async () => {
      const userId = customerId();

      if (!userId) {
        return { previous: undefined };
      }

      const key = recentlyViewedQueryKey(userId);
      await queryClient.cancelQueries({ queryKey: key });
      const previous = queryClient.getQueryData<Product[]>(key) ?? [];
      queryClient.setQueryData<Product[]>(key, []);

      return { previous, userId };
    },
    onError: (_error, _variables, context) => {
      if (!context?.userId) return;
      queryClient.setQueryData(
        recentlyViewedQueryKey(context.userId),
        context.previous,
      );
    },
  });
}
