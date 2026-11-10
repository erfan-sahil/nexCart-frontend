"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { Check, X } from "@/lib/icons";

import { Container, PageBreadcrumb } from "@/components/common";
import { Button } from "@/components/ui/button";
import { getOrder } from "@/features/orders/api";
import {
  formatOrderDate,
  formatOrderStatusLabel,
  orderStatusSummary,
} from "@/features/orders/lib/map-order";
import { formatPrice } from "@/lib/format";
import { cn } from "@/lib/utils";

const RESULT_COPY = {
  success: {
    title: "Payment received",
    detail:
      "We’re confirming your order. Refresh if status still shows pending.",
    tone: "success",
  },
  fail: {
    title: "Payment failed",
    detail: "You can try checkout again from your cart.",
    tone: "fail",
  },
  cancel: {
    title: "Payment cancelled",
    detail: "No charge was made. Your cart is unchanged if items were cleared.",
    tone: "cancel",
  },
} as const;

const actionButtonClass =
  "h-12 w-full rounded-full px-6 font-display text-[0.95rem] font-semibold sm:flex-1";

export function CheckoutResultView() {
  const params = useSearchParams();
  const orderId = params.get("orderId") ?? "";
  const result = (params.get("result") ??
    "success") as keyof typeof RESULT_COPY;
  const copy = RESULT_COPY[result] ?? RESULT_COPY.success;
  const Icon = copy.tone === "success" ? Check : X;

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

      <article className="mx-auto mt-8 max-w-lg overflow-hidden rounded-3xl border border-border bg-card shadow-[0_24px_60px_-36px_rgba(42,18,24,0.45)]">
        <div
          className={cn(
            "px-6 pt-10 pb-8 text-center",
            copy.tone === "success" ? "bg-brand-soft" : "bg-muted/80",
          )}
        >
          <span
            className={cn(
              "mx-auto grid size-16 place-items-center rounded-full ring-8",
              copy.tone === "success" &&
                "bg-brand text-[#fff4f2] ring-brand/20",
              copy.tone === "fail" &&
                "bg-destructive text-white ring-destructive/15",
              copy.tone === "cancel" &&
                "bg-foreground text-background ring-foreground/10",
            )}
          >
            <Icon className="size-7" strokeWidth={2.5} />
          </span>
          <h1 className="mt-5 font-display text-2xl font-semibold tracking-tight sm:text-[1.75rem]">
            {copy.title}
          </h1>
          <p className="mx-auto mt-2 max-w-sm text-sm leading-relaxed text-muted-foreground">
            {copy.detail}
          </p>
        </div>

        <div className="px-5 py-6 sm:px-6">
          {order ? (
            <div className="rounded-2xl border border-border bg-background p-4 sm:p-5">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-xs font-semibold tracking-[0.16em] text-muted-foreground uppercase">
                    Order
                  </p>
                  <p className="mt-1 truncate font-display text-lg font-semibold">
                    {order.orderNumber}
                  </p>
                </div>
                <span className="shrink-0 rounded-full bg-brand-soft px-2.5 py-1 text-xs font-semibold text-primary capitalize">
                  {formatOrderStatusLabel(order.status)}
                </span>
              </div>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                {orderStatusSummary(order)}
              </p>
              <dl className="mt-4 grid grid-cols-2 gap-3 border-t border-border pt-4 text-sm">
                <div>
                  <dt className="text-muted-foreground">Total</dt>
                  <dd className="mt-0.5 font-semibold tabular-nums">
                    {formatPrice(order.totals.grandTotal)}
                  </dd>
                </div>
                <div className="text-right">
                  <dt className="text-muted-foreground">Placed</dt>
                  <dd className="mt-0.5 font-medium">
                    {formatOrderDate(order.createdAt)}
                  </dd>
                </div>
              </dl>
            </div>
          ) : orderId ? (
            <p className="rounded-2xl border border-dashed border-border px-4 py-6 text-center text-sm text-muted-foreground">
              {orderQuery.isLoading
                ? "Loading order…"
                : "Could not load order details."}
            </p>
          ) : null}

          <div
            className={cn(
              "flex flex-col gap-3 sm:flex-row sm:items-stretch",
              order || orderId ? "mt-5" : "mt-0",
            )}
          >
            {order ? (
              <Button
                nativeButton={false}
                render={<Link href={`/orders/${order.id}`} />}
                className={cn("auth-orange-button", actionButtonClass)}
              >
                View order
              </Button>
            ) : null}
            <Button
              nativeButton={false}
              render={<Link href="/products" />}
              variant={order ? "outline" : undefined}
              className={cn(
                actionButtonClass,
                order
                  ? "border-border bg-background hover:bg-muted"
                  : "auth-orange-button",
              )}
            >
              Continue shopping
            </Button>
          </div>
        </div>
      </article>
    </Container>
  );
}
