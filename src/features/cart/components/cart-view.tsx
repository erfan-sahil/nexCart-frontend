"use client";

import Image from "next/image";
import Link from "next/link";
import { BadgeCheck, Trash2 } from "lucide-react";

import { Container, PageBreadcrumb } from "@/components/common";
import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/format";

import { groupCartByStore, resolveCartLines } from "../lib/catalog";
import { getCartTotals } from "../lib/totals";
import { useCartStore } from "../store";
import { OrderSummary } from "./order-summary";
import { QuantityStepper } from "./quantity-stepper";

export function CartView() {
  const lines = useCartStore((state) => state.lines);
  const setQuantity = useCartStore((state) => state.setQuantity);
  const remove = useCartStore((state) => state.remove);
  const resolved = resolveCartLines(lines);
  const groups = groupCartByStore(resolved);
  const totals = getCartTotals(resolved);

  return (
    <Container className="py-8 sm:py-10">
      <PageBreadcrumb
        items={[{ label: "Home", href: "/" }, { label: "Cart" }]}
      />

      <div className="mt-6 flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-xs font-semibold tracking-[0.18em] text-primary uppercase">
            Bag
          </p>
          <h1 className="mt-1 text-3xl sm:text-4xl">Your cart</h1>
        </div>
        {totals.itemCount > 0 ? (
          <p className="text-sm text-muted-foreground">
            {totals.itemCount} {totals.itemCount === 1 ? "item" : "items"}
          </p>
        ) : null}
      </div>

      {resolved.length === 0 ? (
        <div className="mt-10 rounded-2xl border border-border bg-card px-6 py-16 text-center">
          <h2 className="text-2xl">Your cart is empty</h2>
          <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
            Add something from the marketplace and it will show up here, ready
            for checkout.
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
        <div className="mt-8 grid items-start gap-8 lg:grid-cols-[minmax(0,1fr)_22rem]">
          <div className="space-y-4">
            {groups.map((group) => (
              <section
                key={group.store.id}
                className="overflow-hidden rounded-2xl border border-border bg-card"
              >
                <div className="flex items-center gap-2 border-b border-border px-4 py-3">
                  <span className="relative size-7 overflow-hidden rounded-full bg-surface-muted ring-1 ring-border">
                    <Image
                      src={group.store.logo}
                      alt=""
                      fill
                      sizes="28px"
                      className="object-cover"
                    />
                  </span>
                  <Link
                    href={`/stores/${group.store.slug}`}
                    className="text-sm font-medium transition-colors hover:text-primary"
                  >
                    {group.store.name}
                  </Link>
                  {group.store.verified ? (
                    <BadgeCheck
                      className="size-4 text-primary"
                      aria-label="Verified store"
                    />
                  ) : null}
                </div>
                <ul>
                  {group.lines.map((line) => (
                    <li
                      key={line.product.id}
                      className="flex items-center gap-3 border-t border-border px-4 py-2.5 first:border-t-0"
                    >
                      <Link
                        href={`/products/${line.product.slug}`}
                        className="relative size-14 shrink-0 overflow-hidden rounded-lg bg-surface-muted"
                      >
                        <Image
                          src={line.product.image}
                          alt={line.product.name}
                          fill
                          sizes="56px"
                          className="object-cover"
                        />
                      </Link>
                      <div className="flex min-w-0 flex-1 flex-col gap-2 sm:flex-row sm:items-center">
                        <div className="min-w-0 flex-1">
                          <Link
                            href={`/products/${line.product.slug}`}
                            className="line-clamp-1 font-display text-sm font-semibold transition-colors hover:text-primary"
                          >
                            {line.product.name}
                          </Link>
                          <p className="mt-0.5 text-sm font-medium">
                            {formatPrice(line.product.price)}
                            {line.product.originalPrice ? (
                              <span className="ml-2 text-xs font-normal text-muted-foreground line-through">
                                {formatPrice(line.product.originalPrice)}
                              </span>
                            ) : null}
                          </p>
                        </div>
                        <div className="flex items-center justify-between gap-3 sm:justify-end">
                          <QuantityStepper
                            quantity={line.quantity}
                            label={line.product.name}
                            onChange={(quantity) =>
                              setQuantity(line.product.id, quantity)
                            }
                          />
                          <p className="min-w-16 text-right font-semibold tabular-nums">
                            {formatPrice(line.product.price * line.quantity)}
                          </p>
                          <button
                            type="button"
                            className="inline-flex size-8 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
                            aria-label={`Remove ${line.product.name}`}
                            onClick={() => remove(line.product.id)}
                          >
                            <Trash2 className="size-4" />
                          </button>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </section>
            ))}
          </div>
          <OrderSummary totals={totals} />
        </div>
      )}
    </Container>
  );
}
