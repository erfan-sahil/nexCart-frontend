"use client";

import Link from "next/link";
import { Check, Copy } from "lucide-react";
import { useState } from "react";

import { MediaImage } from "@/components/common";
import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/format";
import { cn } from "@/lib/utils";

import { formatOrderDate } from "../lib/map-order";
import { getOrderStatusMeta } from "../lib/order-status";
import type { TrackedOrder } from "../types";
import { OrderProgress } from "./order-progress";
import { OrderStatusBadge } from "./order-status-badge";

export function TrackingResult({ order }: { order: TrackedOrder }) {
  const [copied, setCopied] = useState(false);
  const status = getOrderStatusMeta(order.status);
  const total =
    order.total ??
    order.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const latest = order.events[0];

  async function copyTrackingNumber() {
    try {
      await navigator.clipboard.writeText(order.trackingNumber);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    } catch {
      setCopied(false);
    }
  }

  return (
    <article className="mt-6 overflow-hidden rounded-[1.75rem] border border-border bg-card">
      <div className="grid lg:grid-cols-[minmax(0,1fr)_20rem]">
        <div className="px-5 py-6 sm:px-8 sm:py-8">
          <OrderStatusBadge status={order.status} />
          <h2 className="mt-3 text-4xl text-balance sm:text-5xl">
            {status.headline}
          </h2>
          <p className="mt-3 max-w-lg text-sm text-muted-foreground">
            {status.summary}
            {latest && order.timeline.length === 0
              ? ` Last scan in ${latest.location}.`
              : null}
          </p>

          <OrderProgress status={order.status} className="mt-8" />

          {order.timeline.length > 0 ? (
            <ol className="mt-8 space-y-2">
              {order.timeline.map((step) => (
                <li
                  key={step.id}
                  className={cn(
                    "flex items-start gap-3 rounded-xl border px-3 py-2.5 text-sm",
                    step.completed
                      ? "border-border bg-surface-muted/60"
                      : "border-dashed border-border/80 text-muted-foreground",
                  )}
                >
                  <span
                    className={cn(
                      "mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full text-[10px] font-bold",
                      step.completed
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-muted-foreground",
                    )}
                    aria-hidden
                  >
                    {step.completed ? <Check className="size-3" /> : "·"}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span
                      className={cn(
                        "font-medium",
                        step.completed
                          ? "text-foreground"
                          : "text-muted-foreground",
                      )}
                    >
                      {step.label}
                    </span>
                    {step.completed && step.at ? (
                      <span className="mt-0.5 block text-xs text-muted-foreground">
                        {formatOrderDate(step.at)}
                      </span>
                    ) : null}
                  </span>
                </li>
              ))}
            </ol>
          ) : (
            <ol className="mt-8 divide-y divide-border border-y border-border">
              {order.events.map((event, index) => (
                <li
                  key={event.id}
                  className="grid gap-1 py-3.5 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-baseline sm:gap-6"
                >
                  <div className="min-w-0">
                    <p
                      className={cn(
                        "text-sm",
                        index === 0
                          ? "font-semibold text-foreground"
                          : "font-medium text-foreground/80",
                      )}
                    >
                      {event.title}
                    </p>
                    <p className="mt-0.5 text-sm text-muted-foreground">
                      {event.detail}
                    </p>
                  </div>
                  <p className="text-xs text-muted-foreground sm:text-right">
                    {event.atLabel}
                    <span className="mx-1.5 text-border">/</span>
                    {event.location}
                  </p>
                </li>
              ))}
            </ol>
          )}
        </div>

        <aside className="flex flex-col border-t border-dashed border-border bg-surface-muted px-5 py-6 sm:px-6 lg:border-t-0 lg:border-l">
          <p className="text-[11px] font-semibold tracking-[0.16em] text-muted-foreground uppercase">
            In this parcel
          </p>
          <ul className="mt-4 space-y-3">
            {order.items.map((item, index) => {
              const row = (
                <>
                  <span className="relative size-16 shrink-0 overflow-hidden rounded-2xl bg-card">
                    <MediaImage src={item.image} alt="" sizes="64px" />
                  </span>
                  <span className="min-w-0">
                    <span className="line-clamp-2 text-sm font-medium">
                      {item.name}
                    </span>
                    <span className="mt-0.5 block text-xs text-muted-foreground">
                      Qty {item.quantity} · {formatPrice(item.price)}
                    </span>
                  </span>
                </>
              );

              return (
                <li key={`${item.slug}-${item.name}-${index}`}>
                  {item.slug ? (
                    <Link
                      href={`/products/${item.slug}`}
                      className="flex items-center gap-3"
                    >
                      {row}
                    </Link>
                  ) : (
                    <div className="flex items-center gap-3">{row}</div>
                  )}
                </li>
              );
            })}
          </ul>

          <dl className="mt-6 space-y-3 border-t border-dashed border-border pt-5 text-sm">
            <div>
              <dt className="text-xs text-muted-foreground">Delivering to</dt>
              <dd className="mt-0.5 font-medium">{order.shipTo}</dd>
            </div>
            <div>
              <dt className="text-xs text-muted-foreground">Carrier</dt>
              <dd className="mt-0.5 font-medium">{order.carrier}</dd>
            </div>
            <div className="flex items-end justify-between gap-3">
              <div>
                <dt className="text-xs text-muted-foreground">Tracking no.</dt>
                <dd className="mt-0.5 font-medium">
                  {order.trackingNumber || "Not available yet"}
                </dd>
              </div>
              {order.trackingNumber ? (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="rounded-full"
                  onClick={copyTrackingNumber}
                >
                  {copied ? <Check /> : <Copy />}
                  {copied ? "Copied" : "Copy"}
                </Button>
              ) : null}
            </div>
            <div className="flex items-end justify-between border-t border-dashed border-border pt-3">
              <dt className="text-xs text-muted-foreground">
                {order.paymentLabel}
              </dt>
              <dd className="font-display text-2xl tracking-tight tabular-nums">
                {formatPrice(total)}
              </dd>
            </div>
          </dl>
        </aside>
      </div>
    </article>
  );
}
