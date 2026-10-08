import Link from "next/link";
import { Building2, Check, Smartphone } from "lucide-react";

import { Container, PageBreadcrumb } from "@/components/common";
import { Button } from "@/components/ui/button";

import {
  formatTaka,
  MINIMUM_PAYOUT,
  PAYOUT_HOLD_DAYS,
  REFERRAL_FEE_RATE,
} from "../lib/schedule";
import { PayoutEstimate } from "./payout-estimate";

const sections = [
  { id: "fee", label: "The referral fee" },
  { id: "estimate", label: "Estimate" },
  { id: "excluded", label: "What stays out" },
  { id: "schedule", label: "When you are paid" },
  { id: "account", label: "Payout account" },
] as const;

const rate = Math.round(REFERRAL_FEE_RATE * 100);

const highlights = [
  { value: `${rate}%`, label: "Referral fee on the item price" },
  { value: "Tk 0", label: "To list a product" },
  { value: "Tk 0", label: "Monthly store fee" },
] as const;

const excluded = [
  "Shipping the buyer pays at checkout is not part of the referral fee.",
  "Sales tax collected on the order is not part of the referral fee.",
  "A full refund returns the referral fee for that order.",
  "There is no charge to open a store or to keep a listing live.",
];

const schedule = [
  {
    title: "Order is paid",
    body: "The sale is recorded at the item price. The referral fee is calculated then, and the rest is your balance.",
  },
  {
    title: `Hold for ${PAYOUT_HOLD_DAYS} days`,
    body: "The amount stays pending until seven days after the order is marked delivered, so a return can still be settled.",
  },
  {
    title: "Weekly payout",
    body: `Available balance is sent every Monday when it is at least ${formatTaka(MINIMUM_PAYOUT)}. A smaller balance waits for the next week.`,
  },
];

const accounts = [
  {
    title: "Bank account",
    icon: Building2,
    points: [
      "Account holder name",
      "Bank name and branch",
      "Account number",
      "Routing number, if your bank uses one",
    ],
  },
  {
    title: "Mobile wallet",
    icon: Smartphone,
    points: [
      "Account holder name",
      "Wallet provider",
      "Account number or the phone number on the wallet",
    ],
  },
];

export function FeesView() {
  return (
    <Container className="py-8 sm:py-10">
      <PageBreadcrumb
        items={[
          { label: "Home", href: "/" },
          { label: "Sell on NexCart", href: "/sell" },
          { label: "Fees & payouts" },
        ]}
      />

      <div className="mt-6 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
        <div className="max-w-2xl">
          <p className="text-xs font-semibold tracking-[0.18em] text-primary uppercase">
            Vendors
          </p>
          <h1 className="mt-1 text-3xl sm:text-4xl">Fees & payouts</h1>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            NexCart charges one referral fee when an item sells. Listing is
            free, and payouts go to the bank account or mobile wallet on your
            store.
          </p>
        </div>
        <Button
          nativeButton={false}
          render={<Link href="/sell" />}
          className="auth-orange-button shrink-0 px-6"
        >
          Start application
        </Button>
      </div>

      <ul className="mt-8 grid gap-3 sm:grid-cols-3">
        {highlights.map((item) => (
          <li
            key={item.label}
            className="rounded-2xl border border-border bg-card px-5 py-4"
          >
            <p className="font-display text-3xl tracking-tight text-primary">
              {item.value}
            </p>
            <p className="mt-1 text-sm text-muted-foreground">{item.label}</p>
          </li>
        ))}
      </ul>

      <div className="mt-8 grid items-start gap-8 lg:grid-cols-[13.5rem_minmax(0,1fr)] lg:gap-10">
        <nav className="flex gap-2 overflow-x-auto pb-1 lg:sticky lg:top-44 lg:flex-col lg:overflow-visible lg:pb-0">
          {sections.map((section) => (
            <a
              key={section.id}
              href={`#${section.id}`}
              className="inline-flex shrink-0 rounded-full border border-border bg-card px-3.5 py-2 text-sm font-medium transition-colors hover:border-primary/40 hover:bg-brand-soft hover:text-primary lg:rounded-xl"
            >
              {section.label}
            </a>
          ))}
        </nav>

        <div className="space-y-10">
          <section id="fee" className="scroll-mt-36">
            <h2 className="font-display text-2xl tracking-tight">
              The referral fee
            </h2>
            <div className="mt-4 space-y-3 text-sm leading-6 text-muted-foreground">
              <p>
                The fee is {rate}% of the item price on a paid order. It is the
                only selling fee. You keep the rest of the item price.
              </p>
              <p>
                On a Tk 100 item, the referral fee is Tk 8 and the payout is Tk
                92. The fee is calculated per item, then added up for the order.
              </p>
            </div>
          </section>

          <section id="estimate" className="scroll-mt-36">
            <h2 className="font-display text-2xl tracking-tight">
              Estimate your payout
            </h2>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              Move the price to see the fee and what lands in your balance.
            </p>
            <div className="mt-4">
              <PayoutEstimate />
            </div>
          </section>

          <section id="excluded" className="scroll-mt-36">
            <h2 className="font-display text-2xl tracking-tight">
              What stays out of the fee
            </h2>
            <ul className="mt-4 space-y-3">
              {excluded.map((item) => (
                <li key={item} className="flex gap-3 text-sm leading-6">
                  <span className="mt-0.5 inline-flex size-5 shrink-0 items-center justify-center rounded-full bg-brand-soft text-primary">
                    <Check className="size-3" />
                  </span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </section>

          <section id="schedule" className="scroll-mt-36">
            <h2 className="font-display text-2xl tracking-tight">
              When you are paid
            </h2>
            <ol className="mt-4 overflow-hidden rounded-2xl border border-border bg-card">
              {schedule.map((step, index) => (
                <li
                  key={step.title}
                  className="grid grid-cols-[auto_minmax(0,1fr)] gap-4 border-b border-border px-4 py-4 last:border-b-0 sm:px-5"
                >
                  <span className="inline-flex size-8 items-center justify-center rounded-full bg-brand-soft text-sm font-semibold text-primary">
                    {index + 1}
                  </span>
                  <div>
                    <h3 className="text-base font-medium">{step.title}</h3>
                    <p className="mt-1 text-sm leading-6 text-muted-foreground">
                      {step.body}
                    </p>
                  </div>
                </li>
              ))}
            </ol>
          </section>

          <section id="account" className="scroll-mt-36">
            <h2 className="font-display text-2xl tracking-tight">
              Payout account
            </h2>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              After the store is approved, add one payout account. A store keeps
              a single account. Saving a new one replaces the previous account.
            </p>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {accounts.map((account) => {
                const Icon = account.icon;

                return (
                  <article
                    key={account.title}
                    className="rounded-2xl border border-border bg-card px-4 py-4"
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="inline-flex size-9 items-center justify-center rounded-xl bg-brand-soft text-primary">
                        <Icon className="size-4" />
                      </span>
                      <h3 className="text-base font-medium">{account.title}</h3>
                    </div>
                    <ul className="mt-3 space-y-2">
                      {account.points.map((point) => (
                        <li
                          key={point}
                          className="text-sm leading-6 text-muted-foreground"
                        >
                          {point}
                        </li>
                      ))}
                    </ul>
                  </article>
                );
              })}
            </div>
          </section>

          <section className="flex flex-col gap-4 rounded-2xl border border-border bg-card px-5 py-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-base font-medium">Ready to open a store?</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                The seller guide covers the application. Questions about a
                payout go to support.
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button
                nativeButton={false}
                render={<Link href="/sell/guide" />}
                className="h-10 rounded-full px-5 font-semibold"
              >
                Seller guide
              </Button>
              <Button
                variant="outline"
                nativeButton={false}
                render={<Link href="/contact" />}
                className="h-10 rounded-full px-5"
              >
                Contact us
              </Button>
            </div>
          </section>
        </div>
      </div>
    </Container>
  );
}
