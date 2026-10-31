"use client";

import { useCallback, useRef } from "react";
import { useQueryClient } from "@tanstack/react-query";

import type { Product } from "@/types";

import { FlashDeals } from "./flash-deals";

type HomeFlashDealsProps = {
  products: Product[];
  endsAt: string | null;
  title: string;
};

export function HomeFlashDeals({
  products,
  endsAt,
  title,
}: HomeFlashDealsProps) {
  const queryClient = useQueryClient();
  const handled = useRef(false);

  const onExpired = useCallback(() => {
    if (handled.current) {
      return;
    }

    handled.current = true;
    void queryClient.invalidateQueries({ queryKey: ["catalog-home"] });
    void queryClient.invalidateQueries({
      queryKey: ["catalog-collection", "flash-deals"],
    });
    void queryClient.invalidateQueries({ queryKey: ["checkout-quote"] });
    window.location.reload();
  }, [queryClient]);

  return (
    <FlashDeals
      products={products}
      endsAt={endsAt}
      title={title}
      onExpired={onExpired}
    />
  );
}
