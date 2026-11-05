"use client";

import Link from "next/link";
import {
  ArrowLeft,
  Check,
  CreditCard,
  MapPin,
  Package,
  Truck,
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";

import { Container, PageBreadcrumb } from "@/components/common";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/features/auth/store";
import { getOrder } from "@/features/orders/api";
import {
  formatOrderDate,
  formatOrderStatusLabel,
  mapOrderStatus,
  orderIsTrackable,
  orderProgressMeta,
  orderStatusSummary,
  orderTrackUrl,
} from "@/features/orders/lib/map-order";
import type { HistoryStatus } from "@/features/orders/lib/order-history";
import { formatPrice } from "@/lib/format";
import { cn } from "@/lib/utils";

type OrderDetailViewProps = {
  orderId: string;
};

const STATUS_BADGE: Record<HistoryStatus, string> = {
  placed: "bg-slate-500/15 text-slate-700 dark:text-slate-300",
  confirmed: "bg-violet-500/15 text-violet-700 dark:text-violet-300",
  shipped: "bg-sky-500/15 text-sky-700 dark:text-sky-300",
  out_for_delivery: "bg-amber-500/15 text-amber-800 dark:text-amber-300",
  delivered: "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300",
  cancelled: "bg-destructive/10 text-destructive",
};

function formatShippingAddress(shipping: {
  line1: string;
  line2: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}) {
  return [
    shipping.line1,
    shipping.line2,
    shipping.city,
    shipping.state,
    shipping.postalCode,
    shipping.country,
  ]
    .filter(Boolean)
    .join(", ");
}

function OrderDetailSkeleton() {
  return (
    <Container className="py-8 sm:py-10">
      <div className="h-4 w-56 animate-pulse rounded-md bg-muted" />
      <div className="mt-6 space-y-3">
        <div className="h-8 w-2/3 max-w-md animate-pulse rounded-lg bg-muted" />
        <div className="h-4 w-40 animate-pulse rounded-md bg-muted" />
      </div>
      <div className="mt-8 h-[28rem] animate-pulse rounded-[1.75rem] bg-muted/80" />
    </Container>
  );
}

export function OrderDetailView({ orderId }: OrderDetailViewProps) {
  const authStatus = useAuthStore((state) => state.status);
  const user = useAuthStore((state) => state.user);

  const orderQuery = useQuery({
    queryKey: ["order", orderId],
    enabled: authStatus === "authenticated" && Boolean(orderId),
    queryFn: () => getOrder(orderId),
  });

  if (authStatus === "loading") {
    return <OrderDetailSkeleton />;
  }

  if (authStatus !== "authenticated") {
    return (
      <Container className="py-10 text-center">
        <div className="mx-auto max-w-md rounded-[1.75rem] border border-dashed border-border bg-card px-6 py-12">
          <Package
            className="mx-auto size-10 text-muted-foreground"
            aria-hidden
          />
          <h1 className="mt-4 text-xl font-semibold">
            Sign in to view this order
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Order details are linked to your NexCart account.
          </p>
          <Button
            nativeButton={false}
            render={<Link href={`/login?next=/orders/${orderId}`} />}
            className="auth-orange-button mt-6"
          >
            Sign in
          </Button>
        </div>
      </Container>
    );
  }

  if (orderQuery.isLoading) {
    return <OrderDetailSkeleton />;
  }

  if (orderQuery.isError || !orderQuery.data) {
    return (
      <Container className="py-10 text-center">
        <div className="mx-auto max-w-md rounded-[1.75rem] border border-border bg-card px-6 py-12">
          <h1 className="text-xl font-semibold">Order not found</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            This order may have been removed or you do not have access.
          </p>
          <Button
            nativeButton={false}
            render={<Link href="/orders" />}
            className="auth-orange-button mt-6"
          >
            Back to orders
          </Button>
        </div>
      </Container>
    );
  }

  const order = orderQuery.data;
  const shipping = order.shipping;
  const trackable = orderIsTrackable(order);
  const trackHref =
    user?.email && trackable ? orderTrackUrl(order, user.email) : null;
  const historyStatus = mapOrderStatus(order.status);
  const progress = orderProgressMeta(order.status);
  const summary = orderStatusSummary(order);
  const addressLine = formatShippingAddress(shipping);
  const itemCount = order.items.reduce((sum, item) => sum + item.quantity, 0);
  const showProgress = progress.variant === "active";

  return (
    <Container className="py-8 sm:py-10">
      <PageBreadcrumb
        items={[
          { label: "Home", href: "/" },
          { label: "Orders", href: "/orders" },
          { label: order.orderNumber },
        ]}
      />

      <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
        <Button
          nativeButton={false}
          variant="ghost"
          size="sm"
          className="-ml-2 gap-1.5 text-muted-foreground hover:text-foreground"
          render={<Link href="/orders" />}
        >
          <ArrowLeft className="size-4" />
          All orders
        </Button>
        <span
          className={cn(
            "inline-flex rounded-full px-3 py-1 text-sm font-medium capitalize",
            STATUS_BADGE[historyStatus],
          )}
        >
          {formatOrderStatusLabel(order.status)}
        </span>
      </div>

      <article className="mt-4 overflow-hidden rounded-[1.75rem] border border-border bg-card shadow-sm shadow-black/[0.03]">
        <div className="grid lg:grid-cols-[minmax(0,1fr)_22rem]">
          <div className="px-5 py-6 sm:px-8 sm:py-8">
            <p className="text-xs font-semibold tracking-[0.18em] text-primary uppercase">
              Order details
            </p>
            <h1 className="mt-2 font-display text-3xl tracking-tight sm:text-4xl">
              {order.orderNumber}
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Placed {formatOrderDate(order.createdAt)}
              <span className="mx-2 text-border">·</span>
              {itemCount} {itemCount === 1 ? "item" : "items"}
            </p>
            <p className="mt-4 max-w-xl text-sm leading-relaxed text-foreground/90">
              {summary}
            </p>

            {showProgress ? (
              <div className="mt-8">
                <ol className="hidden gap-2 sm:grid sm:grid-cols-5">
                  {progress.steps.map((step, index) => {
                    const completed = index <= progress.activeIndex;
                    const current = index === progress.activeIndex;

                    return (
                      <li
                        key={step.id}
                        className={cn(
                          "flex flex-col items-center gap-2 text-center",
                          !completed && "opacity-50",
                        )}
                      >
                        <span
                          className={cn(
                            "flex size-8 items-center justify-center rounded-full text-xs font-semibold ring-4 ring-card",
                            completed
                              ? current
                                ? "bg-primary text-primary-foreground"
                                : "bg-primary/90 text-primary-foreground"
                              : "bg-muted text-muted-foreground",
                          )}
                          aria-hidden
                        >
                          {completed ? <Check className="size-4" /> : index + 1}
                        </span>
                        <span
                          className={cn(
                            "text-[11px] font-medium leading-tight",
                            current ? "text-primary" : "text-muted-foreground",
                          )}
                        >
                          {step.label}
                        </span>
                      </li>
                    );
                  })}
                </ol>

                <div className="mt-6 px-1.5 sm:mt-8">
                  <div className="relative h-1.5 rounded-full bg-border">
                    <span
                      className="absolute inset-y-0 left-0 rounded-full bg-primary transition-[width] duration-500"
                      style={{ width: `${progress.progress * 100}%` }}
                    />
                    <span
                      className="absolute top-1/2 size-3.5 -translate-y-1/2 rounded-full bg-primary ring-4 ring-card"
                      style={{
                        left: `calc(${progress.progress * 100}% - 7px)`,
                      }}
                    />
                  </div>
                  <div className="mt-3 flex items-center justify-between gap-3 text-xs text-muted-foreground">
                    <span>{progress.steps[0]?.label}</span>
                    <span className="font-medium text-primary">
                      {formatOrderStatusLabel(order.status)}
                    </span>
                    <span>{progress.steps.at(-1)?.label}</span>
                  </div>
                </div>
              </div>
            ) : null}

            {order.deliveryOutcome || order.refundStatus ? (
              <div className="mt-6 rounded-xl border border-amber-500/25 bg-amber-500/8 px-4 py-3 text-sm">
                {order.deliveryOutcome ? (
                  <p>
                    <span className="font-medium text-amber-950 dark:text-amber-100">
                      Delivery outcome:{" "}
                    </span>
                    {formatOrderStatusLabel(order.deliveryOutcome)}
                  </p>
                ) : null}
                {order.refundStatus ? (
                  <p className={order.deliveryOutcome ? "mt-1" : undefined}>
                    <span className="font-medium text-amber-950 dark:text-amber-100">
                      Refund:{" "}
                    </span>
                    {formatOrderStatusLabel(order.refundStatus)}
                  </p>
                ) : null}
                {order.status === "delivered" ? (
                  <p className="mt-2 text-muted-foreground">
                    Accepting delivery ends return eligibility for this order.
                  </p>
                ) : null}
              </div>
            ) : null}

            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
              {trackHref ? (
                <Button
                  nativeButton={false}
                  render={<Link href={trackHref} />}
                  className="auth-orange-button inline-flex h-12 w-full items-center justify-center gap-2 rounded-full px-6 sm:w-auto"
                >
                  <Truck className="size-4" />
                  Track shipment
                </Button>
              ) : null}
              <Button
                nativeButton={false}
                variant="outline"
                className="inline-flex h-12 w-full items-center justify-center rounded-full px-6 text-[0.95rem] font-semibold sm:w-auto"
                render={<Link href="/products" />}
              >
                Continue shopping
              </Button>
            </div>
          </div>

          <aside className="flex flex-col border-t border-dashed border-border bg-surface-muted/80 px-5 py-6 sm:px-6 lg:border-t-0 lg:border-l">
            <p className="text-[11px] font-semibold tracking-[0.16em] text-muted-foreground uppercase">
              In this order
            </p>
            <ul className="mt-4 max-h-72 space-y-3 overflow-y-auto pr-1">
              {order.items.map((item) => {
                const row = (
                  <>
                    <span className="relative flex size-14 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-surface-muted ring-1 ring-border/60">
                      <Package
                        className="size-5 text-muted-foreground/70"
                        aria-hidden
                      />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="line-clamp-2 text-sm font-medium leading-snug">
                        {item.productName}
                      </span>
                      <span className="mt-0.5 block text-xs text-muted-foreground">
                        {item.storeName}
                        <span className="mx-1 text-border">·</span>
                        Qty {item.quantity}
                      </span>
                      <span className="mt-1 block text-sm font-medium tabular-nums">
                        {formatPrice(item.lineTotal)}
                      </span>
                    </span>
                  </>
                );

                return (
                  <li
                    key={`${item.variantId}-${item.productName}`}
                    className="flex items-start gap-3"
                  >
                    {item.productId ? (
                      <Link
                        href={`/products/${item.productId}`}
                        className="flex min-w-0 flex-1 items-start gap-3 transition-opacity hover:opacity-90"
                      >
                        {row}
                      </Link>
                    ) : (
                      <div className="flex min-w-0 flex-1 items-start gap-3">
                        {row}
                      </div>
                    )}
                  </li>
                );
              })}
            </ul>

            <dl className="mt-auto space-y-4 border-t border-dashed border-border pt-5 text-sm">
              <div className="flex gap-3">
                <MapPin
                  className="mt-0.5 size-4 shrink-0 text-primary"
                  aria-hidden
                />
                <div className="min-w-0">
                  <dt className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
                    Deliver to
                  </dt>
                  <dd className="mt-1 font-medium">{shipping.recipientName}</dd>
                  <dd className="text-muted-foreground">{shipping.phone}</dd>
                  <dd className="mt-1 text-muted-foreground">{addressLine}</dd>
                </div>
              </div>

              <div className="flex gap-3 border-t border-dashed border-border pt-4">
                <CreditCard
                  className="mt-0.5 size-4 shrink-0 text-primary"
                  aria-hidden
                />
                <div className="min-w-0 flex-1">
                  <dt className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
                    Payment
                  </dt>
                  <dd className="mt-1 capitalize">{order.paymentMethod}</dd>
                  <dd className="mt-0.5 text-xs text-muted-foreground capitalize">
                    {order.paymentStatus.replace(/_/g, " ")}
                  </dd>
                </div>
                <dd className="font-display text-2xl tracking-tight tabular-nums">
                  {formatPrice(order.totals.grandTotal)}
                </dd>
              </div>
            </dl>
          </aside>
        </div>
      </article>

      <section className="mt-6 overflow-hidden rounded-[1.75rem] border border-border bg-card">
        <div className="border-b border-border px-5 py-4 sm:px-6">
          <h2 className="font-display text-lg font-semibold">
            Price breakdown
          </h2>
          <p className="mt-0.5 text-sm text-muted-foreground">
            Subtotal, discounts, and delivery fees for this order.
          </p>
        </div>
        <dl className="divide-y divide-border text-sm">
          <div className="flex items-center justify-between gap-4 px-5 py-3.5 sm:px-6">
            <dt className="text-muted-foreground">Items subtotal</dt>
            <dd className="tabular-nums">
              {formatPrice(order.totals.itemsSubtotal)}
            </dd>
          </div>
          {order.totals.couponDiscount > 0 ? (
            <div className="flex items-center justify-between gap-4 px-5 py-3.5 text-primary sm:px-6">
              <dt>
                Coupon
                {order.totals.couponCode ? ` (${order.totals.couponCode})` : ""}
              </dt>
              <dd className="tabular-nums">
                −{formatPrice(order.totals.couponDiscount)}
              </dd>
            </div>
          ) : null}
          <div className="flex items-center justify-between gap-4 px-5 py-3.5 sm:px-6">
            <dt className="text-muted-foreground">Delivery fee</dt>
            <dd className="tabular-nums">
              {formatPrice(order.totals.deliveryFee)}
            </dd>
          </div>
          {(order.totals.amountRefunded ?? 0) > 0 ? (
            <div className="flex items-center justify-between gap-4 px-5 py-3.5 text-primary sm:px-6">
              <dt>Refunded</dt>
              <dd className="tabular-nums">
                {formatPrice(order.totals.amountRefunded ?? 0)}
              </dd>
            </div>
          ) : null}
          {order.totals.balanceDue > 0 ? (
            <div className="flex items-center justify-between gap-4 px-5 py-3.5 text-primary sm:px-6">
              <dt>Balance due on delivery</dt>
              <dd className="tabular-nums">
                {formatPrice(order.totals.balanceDue)}
              </dd>
            </div>
          ) : null}
          <div className="flex items-center justify-between gap-4 bg-surface-muted/50 px-5 py-4 sm:px-6">
            <dt className="font-semibold">Order total</dt>
            <dd className="font-display text-xl font-semibold tracking-tight tabular-nums">
              {formatPrice(order.totals.grandTotal)}
            </dd>
          </div>
        </dl>
      </section>

      {order.note ? (
        <section className="mt-6 rounded-2xl border border-border bg-card px-5 py-4 text-sm sm:px-6">
          <h2 className="font-display text-base font-semibold">Order note</h2>
          <p className="mt-2 text-muted-foreground">{order.note}</p>
        </section>
      ) : null}
    </Container>
  );
}
