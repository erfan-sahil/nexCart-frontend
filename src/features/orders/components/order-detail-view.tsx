"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";

import { Container, PageBreadcrumb } from "@/components/common";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/features/auth/store";
import { getOrder } from "@/features/orders/api";
import {
  formatOrderDate,
  orderItemsToTracked,
  orderStatusSummary,
} from "@/features/orders/lib/map-order";
import { formatPrice } from "@/lib/format";

type OrderDetailViewProps = {
  orderId: string;
};

export function OrderDetailView({ orderId }: OrderDetailViewProps) {
  const authStatus = useAuthStore((state) => state.status);

  const orderQuery = useQuery({
    queryKey: ["order", orderId],
    enabled: authStatus === "authenticated" && Boolean(orderId),
    queryFn: () => getOrder(orderId),
  });

  if (authStatus === "loading") {
    return (
      <Container className="py-16">
        <p className="text-sm text-muted-foreground">Loading…</p>
      </Container>
    );
  }

  if (authStatus !== "authenticated") {
    return (
      <Container className="py-10 text-center">
        <p className="text-sm text-muted-foreground">
          Sign in to view this order.
        </p>
        <Button
          nativeButton={false}
          render={<Link href={`/login?next=/orders/${orderId}`} />}
          className="auth-orange-button mt-4"
        >
          Sign in
        </Button>
      </Container>
    );
  }

  if (orderQuery.isLoading) {
    return (
      <Container className="py-16">
        <p className="text-sm text-muted-foreground">Loading order…</p>
      </Container>
    );
  }

  if (orderQuery.isError || !orderQuery.data) {
    return (
      <Container className="py-10 text-center">
        <h1 className="text-xl">Order not found</h1>
        <Button
          nativeButton={false}
          render={<Link href="/orders" />}
          className="auth-orange-button mt-4"
        >
          Back to orders
        </Button>
      </Container>
    );
  }

  const order = orderQuery.data;
  const items = orderItemsToTracked(order);
  const shipping = order.shipping;

  return (
    <Container className="py-8 sm:py-10">
      <PageBreadcrumb
        items={[
          { label: "Home", href: "/" },
          { label: "Orders", href: "/orders" },
          { label: order.orderNumber },
        ]}
      />

      <div className="mt-6 flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-xs font-semibold tracking-[0.18em] text-primary uppercase">
            Order
          </p>
          <h1 className="mt-1 text-3xl sm:text-4xl">{order.orderNumber}</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Placed {formatOrderDate(order.createdAt)}
          </p>
        </div>
        <span className="rounded-full bg-brand-soft px-3 py-1 text-sm font-medium capitalize">
          {order.status.replace(/_/g, " ")}
        </span>
      </div>

      <p className="mt-4 text-sm text-muted-foreground">
        {orderStatusSummary(order)}
      </p>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <section className="rounded-2xl border border-border bg-card p-5">
          <h2 className="font-display text-lg font-semibold">Items</h2>
          <ul className="mt-4 space-y-3">
            {items.map((item) => (
              <li
                key={`${item.slug}-${item.name}`}
                className="flex justify-between gap-3 text-sm"
              >
                <span>
                  {item.name}{" "}
                  <span className="text-muted-foreground">
                    ×{item.quantity}
                  </span>
                </span>
                <span className="font-medium tabular-nums">
                  {formatPrice(item.price)}
                </span>
              </li>
            ))}
          </ul>
        </section>

        <section className="space-y-4">
          <div className="rounded-2xl border border-border bg-card p-5 text-sm">
            <h2 className="font-display text-lg font-semibold">Delivery</h2>
            <p className="mt-3 font-medium">{shipping.recipientName}</p>
            <p className="text-muted-foreground">{shipping.phone}</p>
            <p className="mt-2 text-muted-foreground">
              {[
                shipping.line1,
                shipping.city,
                shipping.state,
                shipping.postalCode,
                shipping.country,
              ]
                .filter(Boolean)
                .join(", ")}
            </p>
          </div>

          <div className="rounded-2xl border border-border bg-card p-5 text-sm">
            <h2 className="font-display text-lg font-semibold">Payment</h2>
            <dl className="mt-3 space-y-2">
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Method</dt>
                <dd className="capitalize">{order.paymentMethod}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Subtotal</dt>
                <dd>{formatPrice(order.totals.itemsSubtotal)}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Delivery</dt>
                <dd>{formatPrice(order.totals.deliveryFee)}</dd>
              </div>
              <div className="flex justify-between font-semibold">
                <dt>Total</dt>
                <dd>{formatPrice(order.totals.grandTotal)}</dd>
              </div>
              {order.totals.balanceDue > 0 ? (
                <div className="flex justify-between text-primary">
                  <dt>Balance due</dt>
                  <dd>{formatPrice(order.totals.balanceDue)}</dd>
                </div>
              ) : null}
            </dl>
          </div>
        </section>
      </div>
    </Container>
  );
}
