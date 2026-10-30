"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { toProduct } from "@/features/catalog/map";
import { useAuthStore } from "@/features/auth/store";
import type { Product } from "@/types";

import {
  addWishlistItem,
  clearWishlist,
  listWishlist,
  removeWishlistItem,
} from "./api";

export function wishlistQueryKey(userId: string) {
  return ["wishlist", userId] as const;
}

function customerId() {
  const { status, user } = useAuthStore.getState();

  if (status === "authenticated" && user?.role === "customer") {
    return user.id;
  }

  return null;
}

export function useWishlist() {
  const status = useAuthStore((state) => state.status);
  const user = useAuthStore((state) => state.user);
  const enabled = status === "authenticated" && user?.role === "customer";

  const query = useQuery({
    queryKey: wishlistQueryKey(user?.id ?? "anonymous"),
    enabled,
    queryFn: async () => {
      const items = await listWishlist();
      return items.map(toProduct);
    },
  });

  if (!enabled) {
    return { ...query, data: undefined };
  }

  return query;
}

export function useWishlistCount() {
  const wishlist = useWishlist();
  return wishlist.data?.length ?? 0;
}

export function useAddWishlistItem() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (product: Product) => addWishlistItem(product.id),
    onMutate: async (product) => {
      const userId = customerId();

      if (!userId) {
        return { previous: undefined };
      }

      const key = wishlistQueryKey(userId);
      await queryClient.cancelQueries({ queryKey: key });
      const previous = queryClient.getQueryData<Product[]>(key) ?? [];

      queryClient.setQueryData<Product[]>(key, (current = []) =>
        current.some((item) => item.id === product.id)
          ? current
          : [product, ...current],
      );

      return { previous, userId };
    },
    onError: (_error, _product, context) => {
      if (!context?.userId) return;
      queryClient.setQueryData(
        wishlistQueryKey(context.userId),
        context.previous,
      );
    },
  });
}

export function useRemoveWishlistItem() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (productId: string) => removeWishlistItem(productId),
    onMutate: async (productId) => {
      const userId = customerId();

      if (!userId) {
        return { previous: undefined };
      }

      const key = wishlistQueryKey(userId);
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
        wishlistQueryKey(context.userId),
        context.previous,
      );
    },
  });
}

export function useClearWishlist() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: clearWishlist,
    onMutate: async () => {
      const userId = customerId();

      if (!userId) {
        return { previous: undefined };
      }

      const key = wishlistQueryKey(userId);
      await queryClient.cancelQueries({ queryKey: key });
      const previous = queryClient.getQueryData<Product[]>(key) ?? [];
      queryClient.setQueryData<Product[]>(key, []);

      return { previous, userId };
    },
    onError: (_error, _variables, context) => {
      if (!context?.userId) return;
      queryClient.setQueryData(
        wishlistQueryKey(context.userId),
        context.previous,
      );
    },
  });
}
