"use client";

import Image from "next/image";
import Link from "next/link";
import { Check, Copy } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/format";
import { cn } from "@/lib/utils";

import { STATUS_COPY } from "../lib/mock-orders";
import { TRACKING_STEPS, type TrackedOrder } from "../types";

export function TrackingResult({ order }: { order: TrackedOrder }) {
  const [copied, setCopied] = useState(false);
  const currentIndex = TRACKING_STEPS.findIndex(
    (step) => step.id === order.status,
  );
  const progress = currentIndex / (TRACKING_STEPS.length - 1);
  const copy = STATUS_COPY[order.status];
  const total = order.items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );
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
          <p className="text-xs font-semibold tracking-[0.18em] text-primary uppercase">
            {copy.label}
          </p>
          <h2 className="mt-2 text-4xl text-balance sm:text-5xl">
            {order.eta}
          </h2>
          <p className="mt-3 max-w-lg text-sm text-muted-foreground">
            {copy.summary}
            {latest ? ` Last scan in ${latest.location}.` : null}
          </p>

          <div className="mt-8 px-1.5">
            <div className="relative h-1.5 rounded-full bg-border">
              <span
                className="absolute inset-y-0 left-0 rounded-full bg-primary"
                style={{ width: `${progress * 100}%` }}
              />
              <span
                className="absolute top-1/2 size-3.5 -translate-y-1/2 rounded-full bg-primary ring-4 ring-card"
                style={{ left: `calc(${progress * 100}% - 7px)` }}
              />
            </div>
            <div className="mt-3 flex items-center justify-between gap-3 text-xs">
              <span className="text-muted-foreground">Placed</span>
              <span className="font-medium text-primary">{copy.label}</span>
              <span className="text-muted-foreground">Delivered</span>
            </div>
          </div>

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
        </div>

        <aside className="flex flex-col border-t border-dashed border-border bg-surface-muted px-5 py-6 sm:px-6 lg:border-t-0 lg:border-l">
          <p className="text-[11px] font-semibold tracking-[0.16em] text-muted-foreground uppercase">
            In this parcel
          </p>
          <ul className="mt-4 space-y-3">
            {order.items.map((item) => (
              <li key={item.slug}>
                <Link
                  href={`/products/${item.slug}`}
                  className="flex items-center gap-3"
                >
                  <span className="relative size-16 shrink-0 overflow-hidden rounded-2xl bg-card">
                    <Image
                      src={item.image}
                      alt=""
                      fill
                      sizes="64px"
                      className="object-cover"
                    />
                  </span>
                  <span className="min-w-0">
                    <span className="line-clamp-2 text-sm font-medium">
                      {item.name}
                    </span>
                    <span className="mt-0.5 block text-xs text-muted-foreground">
                      Qty {item.quantity} · {formatPrice(item.price)}
                    </span>
                  </span>
                </Link>
              </li>
            ))}
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
                <dd className="mt-0.5 font-medium">{order.trackingNumber}</dd>
              </div>
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
