"use client";

import { ArrowRight } from "lucide-react";
import { useEffect, useId, useState, type FormEvent } from "react";

import { Container, PageBreadcrumb } from "@/components/common";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { lookupOrder, type LookupResult } from "../lib/mock-orders";
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
  | { status: "found"; result: Extract<LookupResult, { kind: "found" }> };

const EMPTY_FORM: FormState = { orderId: "", email: "" };

export function TrackOrderView() {
  const orderFieldId = useId();
  const emailFieldId = useId();
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [fieldError, setFieldError] = useState<string | null>(null);
  const [query, setQuery] = useState<FormState | null>(null);
  const [view, setView] = useState<ViewState>({ status: "idle" });
  const [shipment, setShipment] = useState<TrackedOrder | null>(null);

  useEffect(() => {
    if (!query) return;

    const timer = window.setTimeout(() => {
      const result = lookupOrder(query.orderId, query.email);

      if (result.kind === "found") {
        setShipment(result.order);
        setView({ status: "found", result });
        return;
      }

      setView({
        status: "error",
        message:
          result.kind === "mismatch"
            ? "That email does not match this order."
            : "No shipment uses that order number.",
      });
    }, 450);

    return () => window.clearTimeout(timer);
  }, [query]);

  function track(next: FormState) {
    const orderId = next.orderId.trim();
    const email = next.email.trim();

    if (!orderId || !email) {
      setFieldError("Add the order number and the checkout email.");
      if (!shipment) setView({ status: "idle" });
      return;
    }

    setFieldError(null);
    setForm({ orderId, email });
    setView({ status: "loading" });
    setQuery({ orderId, email });
  }

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    track(form);
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
              value={form.orderId}
              autoComplete="off"
              placeholder="Order number"
              className="h-10 bg-card uppercase"
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  orderId: event.target.value.toUpperCase(),
                }))
              }
            />
            <Input
              aria-label="Email"
              type="email"
              value={form.email}
              autoComplete="email"
              placeholder="Email"
              className="h-10 bg-card"
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  email: event.target.value,
                }))
              }
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
                  value={form.orderId}
                  autoComplete="off"
                  placeholder="NX-48291"
                  className="h-12 text-base uppercase"
                  aria-invalid={Boolean(fieldError)}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      orderId: event.target.value.toUpperCase(),
                    }))
                  }
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor={emailFieldId}>Checkout email</Label>
                <Input
                  id={emailFieldId}
                  type="email"
                  value={form.email}
                  autoComplete="email"
                  placeholder="you@email.com"
                  className="h-12"
                  aria-invalid={Boolean(fieldError)}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      email: event.target.value,
                    }))
                  }
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
