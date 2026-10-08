"use client";

import Link from "next/link";
import { Check, Smartphone, Truck } from "lucide-react";
import { useEffect, useId, useState, type ComponentProps } from "react";
import { useForm } from "react-hook-form";

import { Container, PageBreadcrumb } from "@/components/common";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuthStore } from "@/features/auth/store";
import { formatPrice } from "@/lib/format";
import { cn } from "@/lib/utils";

import { resolveCartLines } from "../lib/catalog";
import { getCartTotals } from "../lib/totals";
import {
  checkoutResolver,
  createOrderId,
  emptyCheckout,
} from "../lib/validation";
import { useCartStore } from "../store";
import type { CheckoutValues, PaymentMethod, PlacedOrder } from "../types";
import { OrderSummary } from "./order-summary";

function CheckoutField({
  label,
  error,
  id,
  className,
  ...props
}: { label: string; error?: string } & ComponentProps<typeof Input>) {
  const generatedId = useId();
  const fieldId = id ?? generatedId;
  const descriptionId = `${fieldId}-error`;

  return (
    <div className="grid gap-2">
      <Label htmlFor={fieldId}>{label}</Label>
      <Input
        id={fieldId}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? descriptionId : undefined}
        className={className ?? "h-10"}
        {...props}
      />
      {error ? (
        <p id={descriptionId} className="text-sm text-destructive">
          {error}
        </p>
      ) : null}
    </div>
  );
}

const paymentOptions: {
  id: PaymentMethod;
  label: string;
  detail: string;
  icon: typeof Smartphone;
}[] = [
  {
    id: "bkash",
    label: "bKash",
    detail: "Pay from your bKash wallet",
    icon: Smartphone,
  },
  {
    id: "cod",
    label: "Cash on delivery",
    detail: "Pay when the order arrives",
    icon: Truck,
  },
];

export function CheckoutView() {
  const lines = useCartStore((state) => state.lines);
  const clear = useCartStore((state) => state.clear);
  const user = useAuthStore((state) => state.user);
  const [order, setOrder] = useState<PlacedOrder | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("bkash");
  const resolved = resolveCartLines(lines);
  const totals = getCartTotals(resolved);

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    getValues,
    formState: { errors, isSubmitting },
  } = useForm<CheckoutValues>({
    defaultValues: emptyCheckout,
    resolver: checkoutResolver(),
  });

  useEffect(() => {
    if (!user) return;

    const current = getValues();
    reset({
      ...current,
      firstName: current.firstName || user.firstName,
      lastName: current.lastName || user.lastName,
      email: current.email || user.email,
      phone: current.phone || user.phone || "",
    });
  }, [getValues, reset, user]);

  if (order) {
    return (
      <Container className="py-8 sm:py-10">
        <PageBreadcrumb
          items={[
            { label: "Home", href: "/" },
            { label: "Cart", href: "/cart" },
            { label: "Checkout" },
          ]}
        />
        <div className="mx-auto mt-10 max-w-lg rounded-2xl border border-border bg-card px-6 py-12 text-center">
          <span className="mx-auto inline-flex size-12 items-center justify-center rounded-full bg-brand-soft text-primary">
            <Check className="size-6" />
          </span>
          <p className="mt-5 text-xs font-semibold tracking-[0.18em] text-primary uppercase">
            Order placed
          </p>
          <h1 className="mt-2 text-3xl">Thanks, {order.recipient}</h1>
          <p className="mt-3 text-sm text-muted-foreground">
            Order{" "}
            <span className="font-medium text-foreground">{order.id}</span> is
            confirmed. A receipt preview would go to {order.email}.
          </p>
          <dl className="mt-6 space-y-2 rounded-xl bg-muted/60 px-4 py-4 text-left text-sm">
            <div className="flex justify-between gap-4">
              <dt className="text-muted-foreground">Ship to</dt>
              <dd className="text-right font-medium">{order.address}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-muted-foreground">Payment</dt>
              <dd className="font-medium">{order.paymentLabel}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-muted-foreground">
                {order.itemCount} {order.itemCount === 1 ? "item" : "items"}
              </dt>
              <dd className="font-semibold tabular-nums">
                {formatPrice(order.total)}
              </dd>
            </div>
          </dl>
          <p className="mt-4 text-xs text-muted-foreground">
            This is a preview checkout. No payment was captured.
          </p>
          <Button
            nativeButton={false}
            render={<Link href="/products" />}
            className="auth-orange-button mt-6 px-6"
          >
            Continue shopping
          </Button>
        </div>
      </Container>
    );
  }

  if (resolved.length === 0) {
    return (
      <Container className="py-8 sm:py-10">
        <PageBreadcrumb
          items={[
            { label: "Home", href: "/" },
            { label: "Cart", href: "/cart" },
            { label: "Checkout" },
          ]}
        />
        <div className="mt-10 rounded-2xl border border-border bg-card px-6 py-16 text-center">
          <h1 className="text-2xl">Nothing to check out</h1>
          <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
            Your cart is empty. Add a product, then come back to place the
            order.
          </p>
          <Button
            nativeButton={false}
            render={<Link href="/cart" />}
            className="auth-orange-button mt-6 px-6"
          >
            Back to cart
          </Button>
        </div>
      </Container>
    );
  }

  function placeOrder(values: CheckoutValues) {
    const address = [
      values.line1.trim(),
      values.city.trim(),
      values.region.trim(),
      values.postalCode.trim(),
    ].join(", ");
    const paymentLabel =
      values.paymentMethod === "cod"
        ? "Cash on delivery"
        : `bKash ${values.bkashNumber.replace(/\D/g, "")}`;

    setOrder({
      id: createOrderId(),
      email: values.email.trim(),
      recipient: values.firstName.trim(),
      address,
      paymentLabel,
      itemCount: totals.itemCount,
      total: totals.total,
    });
    clear();
  }

  return (
    <Container className="py-8 sm:py-10">
      <PageBreadcrumb
        items={[
          { label: "Home", href: "/" },
          { label: "Cart", href: "/cart" },
          { label: "Checkout" },
        ]}
      />

      <div className="mt-6">
        <p className="text-xs font-semibold tracking-[0.18em] text-primary uppercase">
          Checkout
        </p>
        <h1 className="mt-1 text-3xl sm:text-4xl">Delivery details</h1>
      </div>

      <form
        id="checkout-form"
        className="mt-8 grid items-start gap-8 lg:grid-cols-[minmax(0,1fr)_22rem]"
        noValidate
        onSubmit={handleSubmit(placeOrder)}
      >
        <div className="space-y-4">
          <section className="rounded-2xl border border-border bg-card p-5">
            <h2 className="font-display text-lg font-semibold">Contact</h2>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <CheckoutField
                label="First name"
                autoComplete="given-name"
                error={errors.firstName?.message}
                {...register("firstName")}
              />
              <CheckoutField
                label="Last name"
                autoComplete="family-name"
                error={errors.lastName?.message}
                {...register("lastName")}
              />
              <CheckoutField
                label="Email"
                type="email"
                autoComplete="email"
                error={errors.email?.message}
                {...register("email")}
              />
              <CheckoutField
                label="Phone"
                type="tel"
                autoComplete="tel"
                error={errors.phone?.message}
                {...register("phone")}
              />
            </div>
          </section>

          <section className="rounded-2xl border border-border bg-card p-5">
            <h2 className="font-display text-lg font-semibold">
              Shipping address
            </h2>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <CheckoutField
                  label="Street address"
                  autoComplete="address-line1"
                  error={errors.line1?.message}
                  {...register("line1")}
                />
              </div>
              <CheckoutField
                label="City"
                autoComplete="address-level2"
                error={errors.city?.message}
                {...register("city")}
              />
              <CheckoutField
                label="State"
                autoComplete="address-level1"
                error={errors.region?.message}
                {...register("region")}
              />
              <CheckoutField
                label="Postal code"
                autoComplete="postal-code"
                error={errors.postalCode?.message}
                {...register("postalCode")}
              />
            </div>
          </section>

          <section className="rounded-2xl border border-border bg-card p-5">
            <h2 className="font-display text-lg font-semibold">Payment</h2>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {paymentOptions.map((option) => {
                const selected = paymentMethod === option.id;
                const Icon = option.icon;

                return (
                  <button
                    key={option.id}
                    type="button"
                    aria-pressed={selected}
                    className={cn(
                      "flex items-start gap-3 rounded-xl border px-4 py-3 text-left transition-colors",
                      selected
                        ? "border-primary bg-brand-soft"
                        : "border-border hover:border-primary/40",
                    )}
                    onClick={() => {
                      setPaymentMethod(option.id);
                      setValue("paymentMethod", option.id, {
                        shouldValidate: true,
                      });
                    }}
                  >
                    <Icon className="mt-0.5 size-4 text-primary" />
                    <span>
                      <span className="block text-sm font-medium">
                        {option.label}
                      </span>
                      <span className="mt-0.5 block text-xs text-muted-foreground">
                        {option.detail}
                      </span>
                    </span>
                  </button>
                );
              })}
            </div>

            {paymentMethod === "bkash" ? (
              <div className="mt-4">
                <CheckoutField
                  label="bKash number"
                  type="tel"
                  inputMode="numeric"
                  autoComplete="tel"
                  placeholder="01XXXXXXXXX"
                  error={errors.bkashNumber?.message}
                  {...register("bkashNumber", {
                    onChange: (event) => {
                      setValue(
                        "bkashNumber",
                        event.target.value.replace(/\D/g, "").slice(0, 11),
                      );
                    },
                  })}
                />
                <p className="mt-2 text-xs text-muted-foreground">
                  A payment request is sent to this bKash number. Confirm it in
                  the bKash app.
                </p>
              </div>
            ) : null}
          </section>
        </div>

        <OrderSummary
          totals={totals}
          lines={resolved}
          action={
            <Button
              type="submit"
              className="auth-orange-button mt-5 w-full"
              disabled={isSubmitting}
            >
              Place order
            </Button>
          }
        />
      </form>
    </Container>
  );
}
