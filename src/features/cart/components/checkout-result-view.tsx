"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";

import { Container, PageBreadcrumb } from "@/components/common";
import { Button } from "@/components/ui/button";
import { getOrder } from "@/features/orders/api";
import {
  formatOrderDate,
  orderStatusSummary,
} from "@/features/orders/lib/map-order";
import { formatPrice } from "@/lib/format";

const RESULT_COPY = {
  success: {
    title: "Payment received",
    detail:
      "We’re confirming your order. Refresh if status still shows pending.",
  },
  fail: {
    title: "Payment failed",
    detail: "You can try checkout again from your cart.",
  },
  cancel: {
    title: "Payment cancelled",
    detail: "No charge was made. Your cart is unchanged if items were cleared.",
  },
} as const;

export function CheckoutResultView() {
  const params = useSearchParams();
  const orderId = params.get("orderId") ?? "";
  const result = (params.get("result") ??
    "success") as keyof typeof RESULT_COPY;
  const copy = RESULT_COPY[result] ?? RESULT_COPY.success;

  const orderQuery = useQuery({
    queryKey: ["order", orderId],
    enabled: Boolean(orderId),
    queryFn: () => getOrder(orderId),
    retry: 1,
  });

  const order = orderQuery.data;

  return (
    <Container className="py-8 sm:py-10">
      <PageBreadcrumb
        items={[
          { label: "Home", href: "/" },
          { label: "Checkout", href: "/checkout" },
          { label: "Result" },
        ]}
      />

      <div className="mx-auto mt-10 max-w-lg rounded-2xl border border-border bg-card px-6 py-10 text-center">
        <p className="text-xs font-semibold tracking-[0.18em] text-primary uppercase">
          {copy.title}
        </p>
        <p className="mt-3 text-sm text-muted-foreground">{copy.detail}</p>

        {order ? (
          <dl className="mt-6 space-y-2 rounded-xl bg-muted/60 px-4 py-4 text-left text-sm">
            <div className="flex justify-between gap-4">
              <dt className="text-muted-foreground">Order</dt>
              <dd className="font-medium">{order.orderNumber}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-muted-foreground">Status</dt>
              <dd className="font-medium capitalize">
                {order.status.replace(/_/g, " ")}
              </dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-muted-foreground">Summary</dt>
              <dd className="text-right">{orderStatusSummary(order)}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-muted-foreground">Total</dt>
              <dd className="font-semibold tabular-nums">
                {formatPrice(order.totals.grandTotal)}
              </dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-muted-foreground">Placed</dt>
              <dd>{formatOrderDate(order.createdAt)}</dd>
            </div>
          </dl>
        ) : orderId ? (
          <p className="mt-6 text-sm text-muted-foreground">
            {orderQuery.isLoading
              ? "Loading order…"
              : "Could not load order details."}
          </p>
        ) : null}

        <div className="mt-6 flex flex-col gap-2 sm:flex-row sm:justify-center">
          {order ? (
            <Button
              nativeButton={false}
              render={<Link href={`/orders/${order.id}`} />}
              className="auth-orange-button px-6"
            >
              View order
            </Button>
          ) : null}
          <Button
            nativeButton={false}
            render={<Link href="/products" />}
            variant={order ? "outline" : undefined}
            className={order ? "px-6" : "auth-orange-button px-6"}
          >
            Continue shopping
          </Button>
        </div>
      </div>
    </Container>
  );
}
