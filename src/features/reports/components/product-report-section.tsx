"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Check, ChevronDown, Flag } from "lucide-react";
import { useEffect, useMemo, useRef, useState, type FormEvent } from "react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
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

const reportTriggerClass =
  "inline-flex h-9 items-center gap-1.5 rounded-lg border border-border bg-transparent px-3 text-sm font-medium text-muted-foreground transition-colors hover:border-destructive/40 hover:bg-destructive/5 hover:text-destructive";

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
        <span className="block h-9 w-40 animate-pulse rounded-lg bg-muted" />
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
        <Link href={loginHref} className={reportTriggerClass}>
          <Flag className="size-3.5" aria-hidden />
          Report this product
        </Link>
      </div>
    );
  }

  return (
    <div className={cn("mt-6", className)}>
      <button
        type="button"
        className={reportTriggerClass}
        onClick={() => setOpen(true)}
      >
        <Flag className="size-3.5" aria-hidden />
        Report this product
      </button>

      <Dialog open={open} onOpenChange={handleOpenChange}>
        <DialogContent>
          <form onSubmit={onSubmit}>
            <div className="relative border-b border-border px-5 py-4">
              <DialogClose disabled={createReport.isPending} />
              <DialogHeader className="pr-8">
                <div className="mb-3 flex size-10 items-center justify-center rounded-full bg-destructive/10 ring-1 ring-destructive/15">
                  <Flag className="size-4 text-destructive" aria-hidden />
                </div>
                <DialogTitle>Report this product</DialogTitle>
                <DialogDescription>
                  Choose the issue and describe what you noticed. Reports stay
                  with NexCart staff and the store.
                </DialogDescription>
              </DialogHeader>
            </div>

            <div className="space-y-4 px-5 py-5">
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

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                className="h-10 rounded-xl border-border bg-background px-4 text-foreground hover:bg-muted"
                disabled={createReport.isPending}
                onClick={() => handleOpenChange(false)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="h-10 rounded-xl bg-destructive px-4 text-white hover:bg-destructive/90 focus-visible:border-destructive/40 focus-visible:ring-destructive/25"
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
