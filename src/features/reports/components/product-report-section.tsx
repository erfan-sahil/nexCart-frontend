"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Check, ChevronDown, Flag, Shield } from "@/lib/icons";
import { useEffect, useMemo, useRef, useState, type FormEvent } from "react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
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
  productName?: string;
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

const reportTriggerClass = cn(
  "inline-flex h-9 items-center gap-2 rounded-xl border border-destructive/25 bg-destructive/5 px-3 text-sm font-medium text-destructive transition-colors",
  "hover:border-destructive/40 hover:bg-destructive/10",
  "focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-destructive/25",
);

function ReportProductTrigger({
  onClick,
  href,
}: {
  onClick?: () => void;
  href?: string;
}) {
  const inner = (
    <>
      <span className="inline-flex size-6 shrink-0 items-center justify-center rounded-md bg-destructive/15">
        <Flag className="size-3 text-destructive" aria-hidden />
      </span>
      Report this product
    </>
  );

  if (href) {
    return (
      <Link href={href} className={reportTriggerClass}>
        {inner}
      </Link>
    );
  }

  return (
    <button type="button" className={reportTriggerClass} onClick={onClick}>
      {inner}
    </button>
  );
}

function IssueTypeField({
  value,
  invalid,
  onChange,
}: {
  value: ProductReportType | "";
  invalid?: boolean;
  onChange: (value: ProductReportType) => void;
}) {
  const rootRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;

    function onPointerDown(event: MouseEvent) {
      if (!rootRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", onPointerDown);
    return () => document.removeEventListener("mousedown", onPointerDown);
  }, [open]);

  return (
    <div ref={rootRef} className="relative">
      <button
        id="report-type"
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-invalid={invalid}
        onClick={() => setOpen((current) => !current)}
        className={cn(
          "flex h-11 w-full items-center justify-between gap-3 rounded-xl border border-input bg-background px-3 text-left text-sm transition-colors outline-none hover:bg-muted/40 focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50",
          invalid && "border-destructive ring-3 ring-destructive/20",
        )}
      >
        <span
          className={cn("min-w-0 truncate", !value && "text-muted-foreground")}
        >
          {value ? PRODUCT_REPORT_TYPE_LABELS[value] : "Select an issue"}
        </span>
        <ChevronDown
          className={cn(
            "size-4 shrink-0 text-muted-foreground transition-transform",
            open && "rotate-180",
          )}
          aria-hidden
        />
      </button>
      {open ? (
        <div className="absolute top-[calc(100%+0.375rem)] left-0 z-20 w-full">
          <ScrollArea className="h-52 w-full rounded-xl border border-border bg-popover shadow-lg">
            <ul role="listbox" aria-label="Issue type" className="p-1">
              {PRODUCT_REPORT_TYPES.map((option) => {
                const selected = value === option;

                return (
                  <li key={option}>
                    <button
                      type="button"
                      role="option"
                      aria-selected={selected}
                      className={cn(
                        "flex w-full items-start gap-2 rounded-lg px-2.5 py-2 text-left text-sm text-foreground hover:bg-muted",
                        selected && "bg-muted font-medium",
                      )}
                      onClick={() => {
                        onChange(option);
                        setOpen(false);
                      }}
                    >
                      <span className="min-w-0 flex-1 leading-5">
                        {PRODUCT_REPORT_TYPE_LABELS[option]}
                      </span>
                      {selected ? (
                        <Check
                          className="mt-0.5 size-4 shrink-0 text-foreground"
                          aria-hidden
                        />
                      ) : (
                        <span className="mt-0.5 size-4 shrink-0" aria-hidden />
                      )}
                    </button>
                  </li>
                );
              })}
            </ul>
          </ScrollArea>
        </div>
      ) : null}
    </div>
  );
}

export function ProductReportSection({
  productId,
  productName,
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

  function resetForm() {
    setType("");
    setMessage("");
    setFieldErrors({});
    setFormError(null);
  }

  function handleOpenChange(next: boolean) {
    if (createReport.isPending) return;
    setOpen(next);
    if (!next) {
      setFieldErrors({});
      setFormError(null);
    }
  }

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
      resetForm();
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
        <span className="block h-9 w-44 animate-pulse rounded-xl bg-muted" />
      </div>
    );
  }

  if (hasOpenReport || submitted) {
    return (
      <div className={cn("mt-6", className)}>
        <p className="inline-flex items-center gap-2 text-sm text-muted-foreground">
          <Check className="size-4 text-emerald-600" aria-hidden />
          Report received. Our team will review this listing.
        </p>
      </div>
    );
  }

  if (status === "anonymous") {
    return (
      <div className={cn("mt-6", className)}>
        <ReportProductTrigger href={loginHref} />
      </div>
    );
  }

  return (
    <div className={cn("mt-6", className)}>
      <ReportProductTrigger onClick={() => setOpen(true)} />

      <Dialog open={open} onOpenChange={handleOpenChange}>
        <DialogContent className="gap-0 overflow-hidden p-0 sm:max-w-md">
          <form onSubmit={onSubmit}>
            <div className="relative border-b border-border/80 bg-muted/80 px-5 py-4">
              <DialogClose
                disabled={createReport.isPending}
                className="top-3.5 right-3.5 z-10 hover:bg-background/80"
              />
              <div className="flex gap-4 pr-9">
                <div className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-background shadow-sm ring-1 ring-destructive/20">
                  <Flag className="size-5 text-destructive" aria-hidden />
                </div>
                <div className="min-w-0 flex-1 pt-0.5">
                  <p className="text-[11px] font-semibold tracking-[0.14em] text-destructive uppercase">
                    Listing safety
                  </p>
                  <DialogTitle className="mt-1 text-left text-xl leading-tight tracking-tight">
                    Report this product
                  </DialogTitle>
                  {productName ? (
                    <p
                      className="mt-1.5 truncate text-sm text-muted-foreground"
                      title={productName}
                    >
                      {productName}
                    </p>
                  ) : null}
                </div>
              </div>
            </div>

            <div className="space-y-5 bg-popover px-5 py-5">
              <DialogDescription className="flex max-w-none items-start gap-2.5 rounded-xl border border-border/80 bg-muted/40 px-3.5 py-3 text-left text-xs leading-5 text-muted-foreground">
                <Shield
                  className="mt-0.5 size-3.5 shrink-0 text-primary"
                  aria-hidden
                />
                <span>
                  Choose the issue and describe what you noticed. Only NexCart
                  staff and the store can read your report.
                </span>
              </DialogDescription>
              <div className="space-y-2">
                <Label htmlFor="report-type">Issue type</Label>
                <IssueTypeField
                  value={type}
                  invalid={Boolean(fieldErrors.type)}
                  onChange={(value) => {
                    setType(value);
                    setFieldErrors((current) => ({
                      ...current,
                      type: undefined,
                    }));
                  }}
                />
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
                  rows={5}
                  maxLength={REPORT_MESSAGE_MAX}
                  placeholder="Describe what is wrong with this listing."
                  className="min-h-28 rounded-xl"
                  aria-invalid={Boolean(fieldErrors.message)}
                />
                <div className="flex items-center justify-between gap-2 text-xs text-muted-foreground">
                  {fieldErrors.message ? (
                    <span className="text-destructive">
                      {fieldErrors.message}
                    </span>
                  ) : (
                    <span>At least {REPORT_MESSAGE_MIN} characters</span>
                  )}
                  <span className="tabular-nums">
                    {message.trim().length}/{REPORT_MESSAGE_MAX}
                  </span>
                </div>
              </div>

              {formError ? (
                <p className="rounded-lg border border-destructive/20 bg-destructive/5 px-3 py-2 text-sm text-destructive">
                  {formError}
                </p>
              ) : null}
            </div>

            <DialogFooter className="gap-2 sm:justify-stretch">
              <Button
                type="button"
                variant="outline"
                className="h-10 rounded-xl border-border bg-background px-4 text-foreground hover:bg-muted sm:flex-1"
                disabled={createReport.isPending}
                onClick={() => handleOpenChange(false)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="h-10 rounded-xl bg-destructive px-4 text-white hover:bg-destructive/90 focus-visible:border-destructive/40 focus-visible:ring-destructive/25 sm:flex-1"
                disabled={createReport.isPending}
              >
                {createReport.isPending ? "Submitting…" : "Submit report"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
