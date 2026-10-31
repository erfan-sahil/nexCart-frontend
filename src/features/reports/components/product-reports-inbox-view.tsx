"use client";

import Link from "next/link";
import { useState } from "react";

import { Container, PageBreadcrumb } from "@/components/common";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAuthStore } from "@/features/auth/store";
import { cn } from "@/lib/utils";

import {
  PRODUCT_REPORT_STATUS_LABELS,
  PRODUCT_REPORT_STATUSES,
  PRODUCT_REPORT_TYPE_LABELS,
  type ProductReportStatus,
} from "../constants";
import { useProductReportsInbox, useUpdateProductReportStatus } from "../query";

const STATUS_BADGE: Record<ProductReportStatus, string> = {
  open: "bg-amber-500/15 text-amber-800 dark:text-amber-300",
  reviewed: "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300",
  dismissed: "bg-slate-500/15 text-slate-700 dark:text-slate-300",
};

function formatWhen(value: string) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(value));
}

export function ProductReportsInboxView() {
  const authStatus = useAuthStore((state) => state.status);
  const user = useAuthStore((state) => state.user);
  const [page] = useState(1);
  const [statusFilter, setStatusFilter] = useState<ProductReportStatus | "all">(
    "all",
  );

  const statusParam = statusFilter === "all" ? undefined : statusFilter;
  const inboxQuery = useProductReportsInbox(page, statusParam);
  const updateStatus = useUpdateProductReportStatus(page, statusParam);

  const isAdmin = user?.role === "admin";
  const canViewInbox = user?.role === "admin" || user?.role === "vendor";

  if (authStatus === "loading") {
    return (
      <Container className="py-16">
        <p className="text-sm text-muted-foreground">Loading…</p>
      </Container>
    );
  }

  if (authStatus === "anonymous") {
    return (
      <Container className="py-16">
        <PageBreadcrumb
          items={[{ label: "Home", href: "/" }, { label: "Product reports" }]}
        />
        <h1 className="mt-6 text-3xl">Product reports</h1>
        <p className="mt-3 max-w-lg text-sm text-muted-foreground">
          Sign in as an admin or vendor to view product reports.
        </p>
        <Button
          className="mt-6"
          nativeButton={false}
          render={<Link href="/login?next=/reports" />}
        >
          Sign in
        </Button>
      </Container>
    );
  }

  if (!canViewInbox) {
    return (
      <Container className="py-16">
        <PageBreadcrumb
          items={[{ label: "Home", href: "/" }, { label: "Product reports" }]}
        />
        <h1 className="mt-6 text-3xl">Product reports</h1>
        <p className="mt-3 max-w-lg text-sm text-muted-foreground">
          Product reports are available to store vendors and platform admins.
        </p>
        <Button
          className="mt-6"
          variant="outline"
          nativeButton={false}
          render={<Link href="/account" />}
        >
          Back to account
        </Button>
      </Container>
    );
  }

  const reports = inboxQuery.data?.payload.reports ?? [];

  return (
    <Container className="py-8 sm:py-10">
      <PageBreadcrumb
        items={[{ label: "Home", href: "/" }, { label: "Product reports" }]}
      />

      <div className="mt-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl sm:text-4xl">Product reports</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            {isAdmin
              ? "All shopper reports across the marketplace."
              : "Reports submitted for products in your store."}
          </p>
        </div>

        <div className="w-full sm:w-52">
          <Select
            value={statusFilter}
            onValueChange={(value) =>
              setStatusFilter(value as ProductReportStatus | "all")
            }
          >
            <SelectTrigger aria-label="Filter by status">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All statuses</SelectItem>
              {PRODUCT_REPORT_STATUSES.map((status) => (
                <SelectItem key={status} value={status}>
                  {PRODUCT_REPORT_STATUS_LABELS[status]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {inboxQuery.isLoading ? (
        <p className="mt-10 text-sm text-muted-foreground">Loading reports…</p>
      ) : inboxQuery.isError ? (
        <p className="mt-10 text-sm text-destructive">
          Could not load reports. Please try again.
        </p>
      ) : reports.length === 0 ? (
        <p className="mt-10 rounded-xl border border-dashed border-border p-8 text-center text-sm text-muted-foreground">
          No reports match this filter.
        </p>
      ) : (
        <ul className="mt-8 flex flex-col gap-4">
          {reports.map((report) => (
            <li
              key={report.id}
              className="rounded-2xl border border-border bg-card p-5 shadow-sm"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <Link
                    href={`/products/${report.product.slug}`}
                    className="font-semibold hover:text-primary hover:underline"
                  >
                    {report.product.name}
                  </Link>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {report.store.name} · {report.reporter.displayName}
                  </p>
                </div>
                <span
                  className={cn(
                    "rounded-full px-2.5 py-0.5 text-xs font-medium",
                    STATUS_BADGE[report.status],
                  )}
                >
                  {PRODUCT_REPORT_STATUS_LABELS[report.status]}
                </span>
              </div>

              <p className="mt-3 text-sm font-medium">
                {PRODUCT_REPORT_TYPE_LABELS[report.type]}
              </p>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                {report.message}
              </p>
              <p className="mt-3 text-xs text-muted-foreground">
                Submitted {formatWhen(report.createdAt)}
              </p>

              {isAdmin && report.status === "open" ? (
                <div className="mt-4 flex flex-wrap gap-2">
                  <Button
                    type="button"
                    size="sm"
                    disabled={updateStatus.isPending}
                    onClick={() =>
                      updateStatus.mutate({
                        reportId: report.id,
                        status: "reviewed",
                      })
                    }
                  >
                    Mark reviewed
                  </Button>
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    disabled={updateStatus.isPending}
                    onClick={() =>
                      updateStatus.mutate({
                        reportId: report.id,
                        status: "dismissed",
                      })
                    }
                  >
                    Dismiss
                  </Button>
                </div>
              ) : null}
            </li>
          ))}
        </ul>
      )}
    </Container>
  );
}
