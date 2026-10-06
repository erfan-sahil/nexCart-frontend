"use client";

import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { Container, PageBreadcrumb } from "@/components/common";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/features/auth/store";
import { useMe } from "@/features/auth/use-me";

import { getMyApplication, listSellingCategories } from "../api";
import { formFromApplication, isEditableStatus } from "../lib/form";
import { sellingCategoriesQueryKey, vendorApplicationQueryKey } from "../query";
import type { VendorApplication } from "../types";
import { ApplicationForm } from "./application-form";
import { ApplicationStatus } from "./application-status";

export function SellApplication() {
  const router = useRouter();
  const status = useAuthStore((state) => state.status);
  const profile = useMe();
  const role = profile.data?.user.role;
  const [submitted, setSubmitted] = useState<VendorApplication | null>(null);

  const application = useQuery({
    queryKey: vendorApplicationQueryKey,
    queryFn: getMyApplication,
    enabled: status === "authenticated" && role === "customer",
    retry: false,
  });

  const categories = useQuery({
    queryKey: sellingCategoriesQueryKey,
    queryFn: listSellingCategories,
    enabled: status === "authenticated" && role === "customer",
    staleTime: 5 * 60 * 1000,
  });

  useEffect(() => {
    if (status === "anonymous") router.replace("/login");
  }, [router, status]);

  if (
    status === "loading" ||
    status === "anonymous" ||
    (status === "authenticated" && profile.isLoading)
  ) {
    return <SellSkeleton />;
  }

  if (profile.isError || !profile.data) {
    return (
      <Message
        title="Could not load your account"
        body="Sign in again, then come back to the seller application."
        actionHref="/login"
        actionLabel="Sign in"
      />
    );
  }

  if (role === "admin") {
    return (
      <Message
        title="Admin accounts cannot apply"
        body="Seller applications are for customer accounts."
        actionHref="/"
        actionLabel="Back home"
      />
    );
  }

  if (role === "vendor") {
    return (
      <Message
        title="You already sell on NexCart"
        body="This account already has vendor access."
        actionHref="/"
        actionLabel="Back home"
      />
    );
  }

  if (application.isLoading) return <SellSkeleton />;

  if (application.isError) {
    return (
      <Message
        title="Could not load your application"
        body={
          application.error instanceof Error
            ? application.error.message
            : "Try again in a moment."
        }
        onRetry={() => application.refetch()}
      />
    );
  }

  const current = submitted ?? application.data;

  if (current && !isEditableStatus(current.status)) {
    return <ApplicationStatus application={current} />;
  }

  return (
    <Container className="py-8 sm:py-12">
      <PageBreadcrumb
        items={[{ label: "Home", href: "/" }, { label: "Sell on NexCart" }]}
      />
      <div className="mt-6 max-w-2xl">
        <p className="text-xs font-semibold tracking-[0.18em] text-primary uppercase">
          Become a seller
        </p>
        <h1 className="mt-2 text-3xl sm:text-4xl">Open your store</h1>
        <p className="mt-3 text-sm text-muted-foreground sm:text-base">
          Tell us about you and what you sell. You can save a draft and come
          back before you submit.
        </p>
      </div>
      <ApplicationForm
        initial={formFromApplication(
          application.data ?? null,
          profile.data.user,
        )}
        reviewNote={
          application.data?.status === "more_info_required" ||
          application.data?.status === "rejected"
            ? application.data.reviewNote
            : ""
        }
        categories={categories.data ?? []}
        categoriesLoading={categories.isLoading}
        categoriesError={categories.isError}
        onRetryCategories={() => categories.refetch()}
        onSubmitted={setSubmitted}
      />
    </Container>
  );
}

function SellSkeleton() {
  return (
    <Container className="py-10">
      <div className="h-4 w-40 animate-pulse rounded bg-muted" />
      <div className="mt-6 h-10 w-64 animate-pulse rounded bg-muted" />
      <div className="mt-8 h-96 animate-pulse rounded-3xl bg-muted" />
    </Container>
  );
}

function Message({
  title,
  body,
  actionHref,
  actionLabel,
  onRetry,
}: {
  title: string;
  body: string;
  actionHref?: string;
  actionLabel?: string;
  onRetry?: () => void;
}) {
  return (
    <Container className="py-16">
      <div className="mx-auto max-w-lg text-center">
        <h1 className="text-3xl">{title}</h1>
        <p className="mt-3 text-sm text-muted-foreground">{body}</p>
        {onRetry ? (
          <Button
            className="auth-orange-button mt-6 px-6 hover:bg-ink hover:text-primary"
            onClick={onRetry}
          >
            Retry
          </Button>
        ) : null}
        {actionHref && actionLabel ? (
          <Button
            className="auth-orange-button mt-6 px-6 hover:bg-ink hover:text-primary"
            render={<Link href={actionHref} />}
          >
            {actionLabel}
          </Button>
        ) : null}
      </div>
    </Container>
  );
}
