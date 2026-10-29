"use client";

import Link from "next/link";
import { CreditCard, Truck } from "lucide-react";
import {
  useEffect,
  useId,
  useMemo,
  useState,
  type ComponentProps,
} from "react";
import { useForm } from "react-hook-form";
import { useMutation, useQuery } from "@tanstack/react-query";

import { Container, PageBreadcrumb } from "@/components/common";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuthStore } from "@/features/auth/store";
import { ApiError } from "@/lib/api/errors";
import {
  buildCheckoutPayload,
  createOrder,
  initiatePayment,
  quoteOrder,
} from "@/features/orders/api";
import { cn } from "@/lib/utils";

import { cartItemsForCheckout, resolveCartLines } from "../lib/catalog";
import { getCartTotals } from "../lib/totals";
import {
  checkoutResolver,
  emptyCheckout,
  newIdempotencyKey,
} from "../lib/validation";
import { useCartStore } from "../store";
import type { CheckoutValues, PaymentMethod } from "../types";
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
  icon: typeof CreditCard;
}[] = [
  {
    id: "prepaid",
    label: "Pay in full online",
    detail: "Pay items plus delivery before we confirm your order",
    icon: CreditCard,
  },
  {
    id: "cod",
    label: "Cash on delivery",
    detail: "Pay the delivery fee online now; pay for items when delivered",
    icon: Truck,
  },
];

export function CheckoutView() {
  const lines = useCartStore((state) => state.lines);
  const clear = useCartStore((state) => state.clear);
  const user = useAuthStore((state) => state.user);
  const authStatus = useAuthStore((state) => state.status);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("prepaid");
  const [submitError, setSubmitError] = useState<string | null>(null);
  const resolved = resolveCartLines(lines);
  const localTotals = getCartTotals(resolved);

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
      phone: current.phone || user.phone?.replace(/\D/g, "") || "",
    });
  }, [getValues, reset, user]);

  const checkoutItems = useMemo(
    () => cartItemsForCheckout(resolved),
    [resolved],
  );

  const quoteQuery = useQuery({
    queryKey: ["checkout-quote", checkoutItems, paymentMethod],
    enabled: resolved.length > 0 && authStatus === "authenticated",
    queryFn: async () => {
      const values = getValues();
      const payload = buildCheckoutPayload(
        { ...values, paymentMethod },
        checkoutItems,
      );
      return quoteOrder(payload);
    },
    staleTime: 15_000,
  });

  const placeOrderMutation = useMutation({
    mutationFn: async (values: CheckoutValues) => {
      const payload = buildCheckoutPayload(values, checkoutItems);
      const createKey = newIdempotencyKey();
      const order = await createOrder(payload, createKey);
      const payKey = newIdempotencyKey();
      const payment = await initiatePayment(order.id, payKey);
      return payment;
    },
    onSuccess: (payment) => {
      clear();
      window.location.assign(payment.gatewayPageUrl);
    },
    onError: (error) => {
      setSubmitError(
        error instanceof ApiError
          ? error.message
          : "Could not place your order",
      );
    },
  });

  const summaryTotals = quoteQuery.data
    ? {
        ...localTotals,
        subtotal: quoteQuery.data.totals.itemsSubtotal,
        deliveryFee: quoteQuery.data.totals.deliveryFee,
        total: quoteQuery.data.totals.grandTotal,
        dueNow: quoteQuery.data.totals.amountDueNow,
      }
    : { ...localTotals, dueNow: localTotals.total };

  if (authStatus === "loading") {
    return (
      <Container className="py-16">
        <p className="text-sm text-muted-foreground">Loading checkout…</p>
      </Container>
    );
  }

  if (authStatus !== "authenticated" || !user) {
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
          <h1 className="text-2xl">Sign in to checkout</h1>
          <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
            Orders are tied to your account. Sign in, then return here to pay
            securely.
          </p>
          <Button
            nativeButton={false}
            render={<Link href="/login?next=/checkout" />}
            className="auth-orange-button mt-6 px-6"
          >
            Sign in
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
            Your cart is empty, or items are missing variant data. Add products
            from the catalog again.
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
    setSubmitError(null);
    placeOrderMutation.mutate(values);
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
          {submitError ? (
            <p className="rounded-xl border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive">
              {submitError}
            </p>
          ) : null}

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
                placeholder="01XXXXXXXXX"
                error={errors.phone?.message}
                {...register("phone", {
                  onChange: (event) => {
                    setValue(
                      "phone",
                      event.target.value.replace(/\D/g, "").slice(0, 11),
                    );
                  },
                })}
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
                label="State / division"
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
              <CheckoutField
                label="Country"
                autoComplete="country-name"
                error={errors.country?.message}
                {...register("country")}
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
            <input type="hidden" {...register("paymentMethod")} />
            <p className="mt-4 text-xs text-muted-foreground">
              You&apos;ll complete payment on our secure gateway (mock mode in
              local development).
            </p>
          </section>
        </div>

        <OrderSummary
          totals={summaryTotals}
          lines={resolved}
          dueNow={"dueNow" in summaryTotals ? summaryTotals.dueNow : undefined}
          loadingQuote={quoteQuery.isFetching}
          action={
            <Button
              type="submit"
              className="auth-orange-button mt-5 w-full"
              disabled={isSubmitting || placeOrderMutation.isPending}
            >
              {placeOrderMutation.isPending
                ? "Processing…"
                : "Pay & place order"}
            </Button>
          }
        />
      </form>
    </Container>
  );
}
