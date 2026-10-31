"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Flag } from "lucide-react";
import { useMemo, useState, type FormEvent } from "react";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { withNext } from "@/features/auth/lib/next-path";
import { useAuthStore } from "@/features/auth/store";
import { ApiError } from "@/lib/api/errors";
import { cn } from "@/lib/utils";

import {
  PRODUCT_REPORT_TYPE_LABELS,
  PRODUCT_REPORT_TYPES,
  REPORT_MESSAGE_MAX,
  REPORT_MESSAGE_MIN,
  type ProductReportType,
} from "../constants";
import { useCreateProductReport, useMyProductReport } from "../query";

type ProductReportSectionProps = {
  productId: string;
  className?: string;
};

function validate(type: ProductReportType | "", message: string) {
  const errors: { type?: string; message?: string } = {};

  if (!type) {
    errors.type = "Choose an issue type";
  }

  const trimmed = message.trim();

  if (!trimmed) {
    errors.message = "Describe the issue";
  } else if (trimmed.length < REPORT_MESSAGE_MIN) {
    errors.message = `Use at least ${REPORT_MESSAGE_MIN} characters`;
  } else if (trimmed.length > REPORT_MESSAGE_MAX) {
    errors.message = `Use at most ${REPORT_MESSAGE_MAX} characters`;
  }

  return errors;
}

export function ProductReportSection({
  productId,
  className,
}: ProductReportSectionProps) {
  const pathname = usePathname();
  const status = useAuthStore((state) => state.status);
  const [open, setOpen] = useState(false);
  const [type, setType] = useState<ProductReportType | "">("");
  const [message, setMessage] = useState("");
  const [fieldErrors, setFieldErrors] = useState<{
    type?: string;
    message?: string;
  }>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const mineQuery = useMyProductReport(productId, status === "authenticated");
  const createReport = useCreateProductReport(productId);

  const hasOpenReport = Boolean(mineQuery.data?.report);
  const loginHref = useMemo(() => withNext("/login", pathname), [pathname]);

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    setFormError(null);

    const errors = validate(type, message);
    setFieldErrors(errors);

    if (errors.type || errors.message || !type) {
      return;
    }

    try {
      await createReport.mutateAsync({
        productId,
        type,
        message: message.trim(),
      });
      setSubmitted(true);
      setOpen(false);
      setMessage("");
      setType("");
    } catch (error) {
      if (error instanceof ApiError) {
        setFormError(error.message);
        return;
      }

      setFormError("Could not submit your report. Please try again.");
    }
  }

  if (
    status === "loading" ||
    (status === "authenticated" && mineQuery.isLoading)
  ) {
    return (
      <div className={cn("mt-6", className)}>
        <span className="block h-10 w-40 animate-pulse rounded-lg bg-muted" />
      </div>
    );
  }

  if (status === "anonymous") {
    return (
      <div
        className={cn(
          "mt-6 rounded-xl border border-border bg-muted/20 p-4",
          className,
        )}
      >
        <div className="flex items-start gap-3">
          <Flag
            className="mt-0.5 size-4 shrink-0 text-muted-foreground"
            aria-hidden
          />
          <div>
            <p className="text-sm font-medium">Report this product</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Sign in to tell us about a listing issue.
            </p>
            <Link
              href={loginHref}
              className="mt-2 inline-block text-sm font-medium text-primary hover:underline"
            >
              Sign in to report
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (hasOpenReport || submitted) {
    return (
      <div
        className={cn(
          "mt-6 rounded-xl border border-border bg-muted/20 p-4",
          className,
        )}
      >
        <p className="text-sm text-muted-foreground">
          Thanks — we received your report for this product. Our team will
          review it.
        </p>
      </div>
    );
  }

  return (
    <div className={cn("mt-6", className)}>
      {!open ? (
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="gap-2"
          onClick={() => setOpen(true)}
        >
          <Flag className="size-4" aria-hidden />
          Report this product
        </Button>
      ) : (
        <form
          onSubmit={onSubmit}
          className="rounded-xl border border-border bg-card p-4 sm:p-5"
        >
          <h3 className="text-sm font-semibold">Report this product</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            Tell us what is wrong with this listing. Reports are reviewed by
            NexCart staff.
          </p>

          <div className="mt-4 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="report-type">Issue type</Label>
              <Select
                value={type || null}
                onValueChange={(value) => {
                  setType(value as ProductReportType);
                  setFieldErrors((current) => ({
                    ...current,
                    type: undefined,
                  }));
                }}
              >
                <SelectTrigger
                  id="report-type"
                  className="w-full"
                  aria-invalid={Boolean(fieldErrors.type)}
                >
                  <SelectValue placeholder="Select an issue" />
                </SelectTrigger>
                <SelectContent>
                  {PRODUCT_REPORT_TYPES.map((option) => (
                    <SelectItem key={option} value={option}>
                      {PRODUCT_REPORT_TYPE_LABELS[option]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {fieldErrors.type ? (
                <p className="text-xs text-destructive">{fieldErrors.type}</p>
              ) : null}
            </div>

            <div className="space-y-2">
              <Label htmlFor="report-message">Message</Label>
              <Textarea
                id="report-message"
                value={message}
                onChange={(event) => {
                  setMessage(event.target.value);
                  setFieldErrors((current) => ({
                    ...current,
                    message: undefined,
                  }));
                }}
                rows={4}
                maxLength={REPORT_MESSAGE_MAX}
                placeholder="Describe what you noticed about this product listing."
                aria-invalid={Boolean(fieldErrors.message)}
              />
              <div className="flex items-center justify-between gap-2 text-xs text-muted-foreground">
                {fieldErrors.message ? (
                  <span className="text-destructive">
                    {fieldErrors.message}
                  </span>
                ) : (
                  <span>Minimum {REPORT_MESSAGE_MIN} characters</span>
                )}
                <span>
                  {message.trim().length}/{REPORT_MESSAGE_MAX}
                </span>
              </div>
            </div>
          </div>

          {formError ? (
            <p className="mt-3 text-sm text-destructive">{formError}</p>
          ) : null}

          <div className="mt-4 flex flex-wrap gap-2">
            <Button type="submit" disabled={createReport.isPending}>
              {createReport.isPending ? "Submitting…" : "Submit report"}
            </Button>
            <Button
              type="button"
              variant="ghost"
              disabled={createReport.isPending}
              onClick={() => {
                setOpen(false);
                setFormError(null);
                setFieldErrors({});
              }}
            >
              Cancel
            </Button>
          </div>
        </form>
      )}
    </div>
  );
}
