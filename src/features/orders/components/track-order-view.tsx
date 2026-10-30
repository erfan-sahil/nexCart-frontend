"use client";

import { ArrowRight } from "lucide-react";
import { useSearchParams } from "next/navigation";
import {
  Suspense,
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
  type FormEvent,
} from "react";

import { Container, PageBreadcrumb } from "@/components/common";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuthStore } from "@/features/auth/store";
import { ApiError } from "@/lib/api/errors";

import { trackOrder } from "../api";
import { isCheckoutEmail, toTrackedOrder } from "../lib/map-tracking";
import type { TrackedOrder } from "../types";
import { TrackingResult } from "./tracking-result";

type FormState = {
  orderId: string;
  email: string;
};

type ViewState =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "error"; message: string }
  | { status: "found" };

function lookupErrorMessage(error: unknown) {
  if (error instanceof ApiError && error.status === 404) {
    return "No order matches that number and email.";
  }

  if (error instanceof ApiError) return error.message;
  return "Could not look up that order.";
}

export function TrackOrderView() {
  return (
    <Suspense
      fallback={
        <Container className="py-10">
          <div className="h-80 animate-pulse rounded-[1.75rem] bg-muted" />
        </Container>
      }
    >
      <TrackOrderScreen />
    </Suspense>
  );
}

function TrackOrderScreen() {
  const params = useSearchParams();
  const prefillOrder = params.get("order")?.trim().toUpperCase() ?? "";
  const prefillEmail = params.get("email")?.trim() ?? "";
  const userEmail = useAuthStore((state) => state.user?.email ?? "");
  const orderFieldId = useId();
  const emailFieldId = useId();
  const [orderId, setOrderId] = useState(prefillOrder);
  const [emailDraft, setEmailDraft] = useState<string | null>(
    prefillEmail || null,
  );
  const email = emailDraft ?? userEmail;
  const [fieldError, setFieldError] = useState<string | null>(null);
  const [view, setView] = useState<ViewState>(
    prefillOrder && prefillEmail ? { status: "loading" } : { status: "idle" },
  );
  const [shipment, setShipment] = useState<TrackedOrder | null>(null);
  const requestSeq = useRef(0);

  const applyLookup = useCallback(
    (seq: number, lookupEmail: string, orderNumber: string) => {
      return trackOrder({ orderNumber, email: lookupEmail }).then(
        (order) => {
          if (seq !== requestSeq.current) return;
          setShipment(toTrackedOrder(order, lookupEmail));
          setView({ status: "found" });
        },
        (error: unknown) => {
          if (seq !== requestSeq.current) return;
          setShipment(null);
          setView({ status: "error", message: lookupErrorMessage(error) });
        },
      );
    },
    [],
  );

  useEffect(() => {
    if (!prefillOrder || !prefillEmail) return;

    const seq = ++requestSeq.current;
    void applyLookup(seq, prefillEmail, prefillOrder);
  }, [applyLookup, prefillEmail, prefillOrder]);

  function track(next: FormState) {
    const nextOrderId = next.orderId.trim().toUpperCase();
    const nextEmail = next.email.trim();

    if (!nextOrderId || !nextEmail) {
      setFieldError("Add the order number and the checkout email.");
      if (!shipment) setView({ status: "idle" });
      return;
    }

    if (!isCheckoutEmail(nextEmail)) {
      setFieldError("Enter the email used at checkout.");
      if (!shipment) setView({ status: "idle" });
      return;
    }

    setFieldError(null);
    setOrderId(nextOrderId);
    setEmailDraft(nextEmail);
    setView({ status: "loading" });
    const seq = ++requestSeq.current;
    void applyLookup(seq, nextEmail, nextOrderId);
  }

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    track({ orderId, email });
  }

  const notice = fieldError ?? (view.status === "error" ? view.message : null);

  return (
    <Container className="py-8 sm:py-10">
      <PageBreadcrumb
        items={[{ label: "Home", href: "/" }, { label: "Track order" }]}
      />

      {shipment ? (
        <header className="mt-6 flex flex-col gap-5 border-b border-border pb-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-xs font-semibold tracking-[0.18em] text-primary uppercase">
              Shipment
            </p>
            <h1 className="mt-1 text-3xl sm:text-4xl">{shipment.id}</h1>
          </div>
          <form
            className="grid w-full gap-2 sm:grid-cols-[1fr_1fr_auto] lg:max-w-xl"
            noValidate
            onSubmit={onSubmit}
          >
            <Input
              aria-label="Order number"
              value={orderId}
              autoComplete="off"
              placeholder="Order number"
              className="h-10 bg-card uppercase"
              onChange={(event) => setOrderId(event.target.value.toUpperCase())}
            />
            <Input
              aria-label="Email"
              type="email"
              value={email}
              autoComplete="email"
              placeholder="Email"
              className="h-10 bg-card"
              onChange={(event) => setEmailDraft(event.target.value)}
            />
            <Button
              type="submit"
              className="auth-orange-button h-10 px-5"
              disabled={view.status === "loading"}
            >
              Track
            </Button>
          </form>
        </header>
      ) : (
        <section className="mt-6 overflow-hidden rounded-[1.75rem] border border-border bg-card lg:grid lg:min-h-[32rem] lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)]">
          <div className="flex flex-col justify-between bg-surface-dark px-6 py-10 text-[#fff4f2] sm:px-10 sm:py-12">
            <div>
              <p className="text-xs font-semibold tracking-[0.18em] text-primary uppercase">
                Track order
              </p>
              <h1 className="mt-4 max-w-md text-4xl text-balance text-white sm:text-5xl">
                See where your order is.
              </h1>
              <p className="mt-4 max-w-sm text-sm leading-6 text-white/65">
                Use the number on your receipt and the email from checkout. The
                route updates as the parcel moves.
              </p>
            </div>
            <RouteSketch />
          </div>

          <div className="flex flex-col justify-center px-6 py-8 sm:px-10">
            <form className="grid gap-4" noValidate onSubmit={onSubmit}>
              <div className="grid gap-2">
                <Label htmlFor={orderFieldId}>Order number</Label>
                <Input
                  id={orderFieldId}
                  value={orderId}
                  autoComplete="off"
                  placeholder="NC20261030A1B2C3"
                  className="h-12 text-base uppercase"
                  aria-invalid={Boolean(fieldError)}
                  onChange={(event) =>
                    setOrderId(event.target.value.toUpperCase())
                  }
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor={emailFieldId}>Checkout email</Label>
                <Input
                  id={emailFieldId}
                  type="email"
                  value={email}
                  autoComplete="email"
                  placeholder="you@email.com"
                  className="h-12"
                  aria-invalid={Boolean(fieldError)}
                  onChange={(event) => setEmailDraft(event.target.value)}
                />
              </div>
              {fieldError ? (
                <p className="text-sm text-destructive">{fieldError}</p>
              ) : null}
              {view.status === "error" ? (
                <p className="text-sm text-destructive">{view.message}</p>
              ) : null}
              <Button
                type="submit"
                className="auth-orange-button mt-1 w-full"
                disabled={view.status === "loading"}
              >
                {view.status === "loading" ? "Looking up…" : "Track order"}
                <ArrowRight data-icon="inline-end" />
              </Button>
            </form>
          </div>
        </section>
      )}

      {view.status === "loading" && !shipment ? (
        <div className="mt-6 h-40 animate-pulse rounded-[1.75rem] bg-muted" />
      ) : null}

      {shipment ? (
        <>
          {notice ? (
            <p className="mt-4 text-sm text-destructive">{notice}</p>
          ) : null}
          {view.status === "loading" ? (
            <div className="mt-6 h-80 animate-pulse rounded-[1.75rem] bg-muted" />
          ) : (
            <TrackingResult order={shipment} />
          )}
        </>
      ) : null}
    </Container>
  );
}

function RouteSketch() {
  const stops = ["Packed", "On the road", "Your door"];

  return (
    <div className="mt-12">
      <div className="relative h-2.5">
        <span
          aria-hidden
          className="absolute top-1/2 right-1/6 left-1/6 h-px -translate-y-1/2 bg-white/20"
        />
        <span
          aria-hidden
          className="absolute top-1/2 left-1/6 h-px w-1/3 -translate-y-1/2 bg-[repeating-linear-gradient(90deg,var(--primary)_0_6px,transparent_6px_11px)]"
        />
        <span className="absolute top-1/2 left-1/6 size-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#fff4f2]" />
        <span className="absolute top-1/2 left-1/2 size-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary ring-4 ring-primary/30" />
        <span className="absolute top-1/2 left-5/6 size-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#fff4f2]" />
      </div>
      <div className="mt-4 grid grid-cols-3 text-center text-[11px] tracking-wide text-white/55 uppercase">
        {stops.map((stop) => (
          <span key={stop}>{stop}</span>
        ))}
      </div>
    </div>
  );
}
