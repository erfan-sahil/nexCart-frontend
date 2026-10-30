"use client";

import Link from "next/link";
import { Clock, ShoppingBag } from "lucide-react";
import { useState } from "react";

import { Container, PageBreadcrumb } from "@/components/common";
import { ProductCard } from "@/components/product";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/features/auth/store";
import { useCartStore } from "@/features/cart";
import { ProductCardSkeleton } from "@/features/wishlist/components/product-card-skeleton";

import { useClearRecentlyViewed, useRecentlyViewed } from "../query";

const SKELETON_CARDS = 6;

export function RecentlyViewedView() {
  const authStatus = useAuthStore((state) => state.status);
  const user = useAuthStore((state) => state.user);
  const recentlyViewed = useRecentlyViewed();
  const clearRecentlyViewed = useClearRecentlyViewed();
  const [added, setAdded] = useState(false);

  if (authStatus !== "loading" && authStatus !== "authenticated") {
    return (
      <Container className="py-10 text-center">
        <h1 className="text-2xl">Sign in to see recently viewed</h1>
        <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
          Products you open stay on your account so you can jump back in.
        </p>
        <Button
          nativeButton={false}
          render={<Link href="/login?next=/recently-viewed" />}
          className="auth-orange-button mt-6 px-6"
        >
          Sign in
        </Button>
      </Container>
    );
  }

  if (authStatus === "authenticated" && user?.role !== "customer") {
    return (
      <Container className="py-10 text-center">
        <h1 className="text-2xl">Recently viewed is for customer accounts</h1>
        <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
          Sign in with a customer account to keep your browsing history.
        </p>
      </Container>
    );
  }

  const loading =
    authStatus === "loading" ||
    (user?.role === "customer" && recentlyViewed.isPending);

  if (!loading && recentlyViewed.isError) {
    return (
      <Container className="py-10 text-center">
        <h1 className="text-2xl">Could not load recently viewed</h1>
        <Button
          className="auth-orange-button mt-6 px-6"
          onClick={() => recentlyViewed.refetch()}
        >
          Try again
        </Button>
      </Container>
    );
  }

  const products = loading ? [] : (recentlyViewed.data ?? []);

  function addAllToCart() {
    const add = useCartStore.getState().add;
    for (const product of products) {
      add(product, 1);
    }
    setAdded(true);
    window.setTimeout(() => setAdded(false), 1400);
  }

  return (
    <Container className="py-8 sm:py-10">
      <PageBreadcrumb
        items={[{ label: "Home", href: "/" }, { label: "Recently viewed" }]}
      />

      <section className="mt-6 overflow-hidden rounded-3xl border border-border bg-card">
        <div className="flex flex-col gap-5 bg-brand-soft px-5 py-6 sm:flex-row sm:items-center sm:justify-between sm:px-7">
          <div className="flex items-center gap-4">
            <span className="inline-flex size-12 shrink-0 items-center justify-center rounded-2xl bg-primary text-[#fff4f2]">
              <Clock className="size-5" />
            </span>
            <div>
              <p className="text-xs font-semibold tracking-[0.18em] text-primary uppercase">
                Pick up where you left
              </p>
              <h1 className="mt-1 text-3xl sm:text-4xl">Recently viewed</h1>
              <p className="mt-1 text-sm text-muted-foreground">
                Jump back into products you already opened.
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
                disabled={clearRecentlyViewed.isPending}
                onClick={() => clearRecentlyViewed.mutate()}
              >
                Clear
              </Button>
            </div>
          ) : null}
        </div>

        {loading ? (
          <ul
            aria-busy="true"
            aria-label="Loading recently viewed"
            className="grid grid-cols-2 gap-3 bg-surface-muted p-3 sm:grid-cols-3 sm:p-4 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6"
          >
            {Array.from({ length: SKELETON_CARDS }, (_, index) => (
              <li key={index} className="min-w-0">
                <ProductCardSkeleton />
              </li>
            ))}
          </ul>
        ) : products.length === 0 ? (
          <div className="flex flex-col items-center px-6 py-16 text-center">
            <span className="inline-flex size-14 items-center justify-center rounded-full bg-brand-soft text-primary">
              <Clock className="size-6" />
            </span>
            <h2 className="mt-4 text-2xl">Nothing here yet</h2>
            <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
              Open a product page while signed in and it will show up here.
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
