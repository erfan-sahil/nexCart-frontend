"use client";

import Link from "next/link";
import { ShoppingBag } from "lucide-react";
import { useState } from "react";

import { Container, PageBreadcrumb } from "@/components/common";
import { Button } from "@/components/ui/button";
import { useCartStore } from "@/features/cart";
import { formatPrice } from "@/lib/format";

import { resolveWishlist } from "../lib/catalog";
import { useWishlistStore } from "../store";
import { WishlistItem } from "./wishlist-item";

export function WishlistView() {
  const ids = useWishlistStore((state) => state.ids);
  const clear = useWishlistStore((state) => state.clear);
  const products = resolveWishlist(ids);
  const [added, setAdded] = useState(false);
  const total = products.reduce((sum, product) => sum + product.price, 0);

  function addAllToCart() {
    const add = useCartStore.getState().add;
    for (const product of products) {
      add(product.id);
    }
    setAdded(true);
    window.setTimeout(() => setAdded(false), 1400);
  }

  return (
    <Container className="py-8 sm:py-10">
      <PageBreadcrumb
        items={[{ label: "Home", href: "/" }, { label: "Wishlist" }]}
      />

      <div className="mt-6 flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-xs font-semibold tracking-[0.18em] text-primary uppercase">
            Saved
          </p>
          <h1 className="mt-1 text-3xl sm:text-4xl">Your wishlist</h1>
        </div>
        {products.length > 0 ? (
          <p className="text-sm text-muted-foreground">
            {products.length} {products.length === 1 ? "item" : "items"}
          </p>
        ) : null}
      </div>

      {products.length === 0 ? (
        <div className="mt-10 rounded-2xl border border-border bg-card px-6 py-16 text-center">
          <h2 className="text-2xl">Your wishlist is empty</h2>
          <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
            Save a product with the heart and it will show up here, ready to
            move into your cart.
          </p>
          <Button
            nativeButton={false}
            render={<Link href="/products" />}
            className="auth-orange-button mt-6 px-6"
          >
            Browse products
          </Button>
        </div>
      ) : (
        <div className="mt-8 grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_20rem] lg:gap-8">
          <ul className="overflow-hidden rounded-2xl border border-border bg-card">
            {products.map((product) => (
              <WishlistItem key={product.id} product={product} />
            ))}
          </ul>

          <aside className="rounded-2xl border border-border bg-card p-5 lg:sticky lg:top-36">
            <h2 className="font-display text-lg tracking-tight">Summary</h2>
            <dl className="mt-4 space-y-3 text-sm">
              <div className="flex items-center justify-between gap-3">
                <dt className="text-muted-foreground">Saved items</dt>
                <dd className="font-medium">{products.length}</dd>
              </div>
              <div className="flex items-center justify-between gap-3 border-t border-border pt-3">
                <dt className="text-muted-foreground">Estimated total</dt>
                <dd className="text-base font-semibold">
                  {formatPrice(total)}
                </dd>
              </div>
            </dl>
            <Button
              className="auth-orange-button mt-5 w-full"
              onClick={addAllToCart}
            >
              <ShoppingBag className="size-4" />
              {added ? "Added to cart" : "Add all to cart"}
            </Button>
            <Button
              variant="ghost"
              className="mt-2 h-10 w-full rounded-full text-sm text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
              onClick={clear}
            >
              Clear wishlist
            </Button>
          </aside>
        </div>
      )}
    </Container>
  );
}
