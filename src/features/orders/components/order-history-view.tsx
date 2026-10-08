"use client";

import Image from "next/image";
import Link from "next/link";
import { useLayoutEffect, useMemo, useRef, useState } from "react";

import { Container, PageBreadcrumb } from "@/components/common";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { formatPrice } from "@/lib/format";
import { cn } from "@/lib/utils";

import {
  HISTORY_FILTERS,
  historyStatusLabel,
  matchesHistoryFilter,
  orderHistory,
  orderTotal,
  type HistoryFilter,
  type HistoryOrder,
  type HistoryStatus,
} from "../lib/order-history";
import type { TrackedItem } from "../types";

const STATUS_BADGE: Record<HistoryStatus, string> = {
  placed: "bg-slate-500/15 text-slate-700 dark:text-slate-300",
  confirmed: "bg-violet-500/15 text-violet-700 dark:text-violet-300",
  shipped: "bg-sky-500/15 text-sky-700 dark:text-sky-300",
  out_for_delivery: "bg-amber-500/15 text-amber-800 dark:text-amber-300",
  delivered: "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300",
  cancelled: "bg-destructive/10 text-destructive",
};

function statusBadge(status: HistoryStatus) {
  return STATUS_BADGE[status];
}

export function OrderHistoryView() {
  const orders = useMemo(() => orderHistory(), []);
  const [filter, setFilter] = useState<HistoryFilter>("all");
  const visible = orders.filter((order) =>
    matchesHistoryFilter(order.status, filter),
  );

  return (
    <Container className="py-8 sm:py-10">
      <PageBreadcrumb
        items={[
          { label: "Home", href: "/" },
          { label: "Account", href: "/account" },
          { label: "Order history" },
        ]}
      />

      <div className="mt-6">
        <p className="text-xs font-semibold tracking-[0.18em] text-primary uppercase">
          Account
        </p>
        <h1 className="mt-1 text-3xl sm:text-4xl">Order history</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          {orders.length} orders placed with this account.
        </p>
      </div>

      <OrderFilterTabs orders={orders} filter={filter} onChange={setFilter} />

      {visible.length === 0 ? (
        <div className="mt-6 rounded-2xl border border-dashed border-border px-6 py-14 text-center">
          <h2 className="text-xl">No orders in this view</h2>
          <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
            Switch filters, or keep shopping and new orders will land here.
          </p>
          <Button
            nativeButton={false}
            render={<Link href="/products" />}
            className="auth-orange-button mt-6 px-6"
          >
            Continue shopping
          </Button>
        </div>
      ) : (
        <div className="mt-4 overflow-x-auto rounded-2xl border border-border bg-card">
          <table className="w-full min-w-[50rem] border-collapse text-left text-sm">
            <thead>
              <tr className="border-b border-border text-xs tracking-wide text-muted-foreground uppercase">
                <th className="px-4 py-3 font-medium">Order</th>
                <th className="px-4 py-3 font-medium">Items</th>
                <th className="px-4 py-3 text-center font-medium">Products</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium">Placed</th>
                <th className="px-4 py-3 text-right font-medium">Total</th>
                <th className="px-4 py-3 text-right font-medium">
                  <span className="sr-only">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {visible.map((order) => (
                <tr
                  key={order.id}
                  className="border-b border-border align-middle last:border-b-0"
                >
                  <td className="px-4 py-3 font-medium whitespace-nowrap">
                    {order.id}
                  </td>
                  <td className="w-72 px-4 py-3">
                    <ItemList items={order.items} />
                  </td>
                  <td className="px-4 py-3 text-center whitespace-nowrap">
                    <ProductCount count={order.items.length} />
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <span
                      className={cn(
                        "inline-flex rounded-full px-2.5 py-0.5 font-medium",
                        statusBadge(order.status),
                      )}
                    >
                      {historyStatusLabel(order.status)}
                    </span>
                    <p className="mt-1 text-muted-foreground">
                      {order.summary}
                    </p>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-muted-foreground">
                    {order.placedOn}
                  </td>
                  <td className="px-4 py-3 text-right font-medium whitespace-nowrap tabular-nums">
                    {formatPrice(orderTotal(order.items))}
                  </td>
                  <td className="px-4 py-3 text-right whitespace-nowrap">
                    {order.trackable ? (
                      <Link
                        href={`/track-order?order=${order.id}&email=${encodeURIComponent(order.email)}`}
                        className="font-medium text-primary hover:underline"
                      >
                        Track
                      </Link>
                    ) : (
                      <span className="text-muted-foreground">—</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </Container>
  );
}

function ProductCount({ count }: { count: number }) {
  return <span className="tabular-nums">{count}</span>;
}

function ItemList({ items }: { items: TrackedItem[] }) {
  const list = (
    <ul>
      {items.map((item) => (
        <li key={item.slug} className="flex h-10 items-center gap-2 pr-2">
          <span className="relative size-8 shrink-0 overflow-hidden rounded-md bg-surface-muted">
            <Image
              src={item.image}
              alt=""
              fill
              sizes="32px"
              className="object-cover"
            />
          </span>
          <span className="min-w-0 truncate">{item.name}</span>
          <span className="shrink-0 text-muted-foreground">
            ×{item.quantity}
          </span>
        </li>
      ))}
    </ul>
  );

  if (items.length < 2) return list;

  return <ScrollArea className="h-10">{list}</ScrollArea>;
}

function OrderFilterTabs({
  orders,
  filter,
  onChange,
}: {
  orders: HistoryOrder[];
  filter: HistoryFilter;
  onChange: (filter: HistoryFilter) => void;
}) {
  const listRef = useRef<HTMLDivElement>(null);
  const indicatorRef = useRef<HTMLSpanElement>(null);
  const tabsRef = useRef<(HTMLButtonElement | null)[]>([]);
  const canAnimate = useRef(false);
  const activeIndex = HISTORY_FILTERS.findIndex((item) => item.id === filter);

  useLayoutEffect(() => {
    const list = listRef.current;
    const indicator = indicatorRef.current;
    const tab = tabsRef.current[activeIndex];
    if (!indicator || !tab) return;

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    indicator.style.transition =
      canAnimate.current && !reduceMotion
        ? "left 300ms cubic-bezier(0.22, 1, 0.36, 1), width 300ms cubic-bezier(0.22, 1, 0.36, 1)"
        : "none";
    indicator.style.left = `${tab.offsetLeft}px`;
    indicator.style.width = `${tab.offsetWidth}px`;
    canAnimate.current = true;

    if (!list) return;
    const observer = new ResizeObserver(() => {
      const current = tabsRef.current[activeIndex];
      if (!current) return;
      indicator.style.transition = "none";
      indicator.style.left = `${current.offsetLeft}px`;
      indicator.style.width = `${current.offsetWidth}px`;
    });
    observer.observe(list);
    return () => observer.disconnect();
  }, [activeIndex]);

  return (
    <div
      ref={listRef}
      className="relative mt-6 inline-flex max-w-full gap-1 overflow-x-auto rounded-xl border border-border bg-card p-1"
      role="tablist"
      aria-label="Filter orders"
    >
      <span
        ref={indicatorRef}
        aria-hidden
        className="pointer-events-none absolute top-1 bottom-1 left-0 w-0 rounded-lg bg-surface-muted"
      />
      {HISTORY_FILTERS.map((item, index) => {
        const count = orders.filter((order) =>
          matchesHistoryFilter(order.status, item.id),
        ).length;
        const selected = filter === item.id;

        return (
          <button
            key={item.id}
            ref={(node) => {
              tabsRef.current[index] = node;
            }}
            type="button"
            role="tab"
            aria-selected={selected}
            className={cn(
              "relative z-10 inline-flex h-9 shrink-0 items-center gap-2 rounded-lg px-3 text-sm transition-colors",
              selected
                ? "font-medium text-foreground"
                : "text-muted-foreground hover:text-foreground",
            )}
            onClick={() => onChange(item.id)}
          >
            {item.label}
            <span
              className={cn(
                "inline-flex h-5 min-w-5 items-center justify-center rounded-full px-1 text-xs tabular-nums",
                selected
                  ? "bg-primary text-[#fff4f2]"
                  : "bg-muted text-muted-foreground",
              )}
            >
              {count}
            </span>
          </button>
        );
      })}
    </div>
  );
}
