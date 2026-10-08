"use client";

import Link from "next/link";
import { Heart, ShoppingBag } from "lucide-react";
import { useState } from "react";

import { Container, PageBreadcrumb } from "@/components/common";
import { ProductCard } from "@/components/product";
import { Button } from "@/components/ui/button";
import { useCartStore } from "@/features/cart";

import { resolveWishlist } from "../lib/catalog";
import { useWishlistStore } from "../store";

export function WishlistView() {
  const ids = useWishlistStore((state) => state.ids);
  const clear = useWishlistStore((state) => state.clear);
  const products = resolveWishlist(ids);
  const [added, setAdded] = useState(false);

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

      <section className="mt-6 overflow-hidden rounded-3xl border border-border bg-card">
        <div className="flex flex-col gap-5 bg-brand-soft px-5 py-6 sm:flex-row sm:items-center sm:justify-between sm:px-7">
          <div className="flex items-center gap-4">
            <span className="inline-flex size-12 shrink-0 items-center justify-center rounded-2xl bg-primary text-[#fff4f2]">
              <Heart className="size-5 fill-current" />
            </span>
            <div>
              <p className="text-xs font-semibold tracking-[0.18em] text-primary uppercase">
                Saved
              </p>
              <h1 className="mt-1 text-3xl sm:text-4xl">Wishlist</h1>
              <p className="mt-1 text-sm text-muted-foreground">
                Products you marked to come back to.
              </p>
            </div>
          </div>

          {products.length > 0 ? (
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-full bg-card px-3 py-1 text-sm font-medium ring-1 ring-border">
                {products.length} {products.length === 1 ? "item" : "items"}
              </span>
              <Button
                className="h-9 rounded-full px-4 text-sm font-semibold"
                onClick={addAllToCart}
              >
                <ShoppingBag className="size-4" />
                {added ? "Added" : "Add all"}
              </Button>
              <Button
                variant="outline"
                className="h-9 rounded-full bg-card px-3 text-sm hover:bg-destructive/10 hover:text-destructive"
                onClick={clear}
              >
                Clear
              </Button>
            </div>
          ) : null}
        </div>

        {products.length === 0 ? (
          <div className="flex flex-col items-center px-6 py-16 text-center">
            <span className="inline-flex size-14 items-center justify-center rounded-full bg-brand-soft text-primary">
              <Heart className="size-6" />
            </span>
            <h2 className="mt-4 text-2xl">Your wishlist is empty</h2>
            <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
              Save a product with the heart and it will show up here.
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
          <ul className="grid grid-cols-2 gap-3 bg-surface-muted p-3 sm:grid-cols-3 sm:p-4 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
            {products.map((product) => (
              <li key={product.id} className="min-w-0">
                <ProductCard product={product} />
              </li>
            ))}
          </ul>
        )}
      </section>
    </Container>
  );
}
