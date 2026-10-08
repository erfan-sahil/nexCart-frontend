import Link from "next/link";
import { Check, X } from "lucide-react";

import { Container, PageBreadcrumb } from "@/components/common";
import { Button } from "@/components/ui/button";

const sections = [
  { id: "window", label: "Return window" },
  { id: "start", label: "How to start" },
  { id: "refund", label: "Refunds" },
  { id: "excluded", label: "What cannot be returned" },
] as const;

const highlights = [
  { value: "30 days", label: "From the delivery date" },
  { value: "Unused", label: "In the original packaging" },
  { value: "Same method", label: "Refund to the original payment" },
] as const;

const eligible = [
  "The request is within 30 days of delivery.",
  "The item is unused and still in its original packaging.",
  "You include the order number from your receipt or order history.",
];

const steps = [
  {
    title: "Find the order",
    body: "Open order history while signed in, or use the order number on your receipt. That number is required for a return.",
  },
  {
    title: "Send the request",
    body: "Contact support, choose A return, and include the order number plus which item you are sending back.",
  },
  {
    title: "Pack the item",
    body: "Keep it unused and in the original packaging. Support replies with how to send it once the request is accepted.",
  },
  {
    title: "Refund is issued",
    body: "After the return is accepted, the refund goes back to the original payment method. You get an email when that happens.",
  },
];

const excluded = [
  "Perishable groceries",
  "Opened beauty products",
  "Items marked final sale",
];

export function ReturnsView() {
  return (
    <Container className="py-8 sm:py-10">
      <PageBreadcrumb
        items={[{ label: "Home", href: "/" }, { label: "Returns & refunds" }]}
      />

      <div className="mt-6 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
        <div className="max-w-2xl">
          <p className="text-xs font-semibold tracking-[0.18em] text-primary uppercase">
            Support
          </p>
          <h1 className="mt-1 text-3xl sm:text-4xl">Returns & refunds</h1>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            Most items can be returned within 30 days of delivery. Start from
            your order number, and the refund goes back to the way you paid.
          </p>
        </div>
        <Button
          nativeButton={false}
          render={<Link href="/contact" />}
          className="auth-orange-button shrink-0 px-6"
        >
          Request a return
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
        <nav className="no-scrollbar flex gap-2 overflow-x-auto lg:sticky lg:top-44 lg:flex-col lg:overflow-visible">
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
          <section id="window" className="scroll-mt-36">
            <h2 className="font-display text-2xl tracking-tight">
              Return window
            </h2>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              A return is accepted when all of these are true.
            </p>
            <ul className="mt-4 space-y-3">
              {eligible.map((item) => (
                <li key={item} className="flex gap-3 text-sm leading-6">
                  <span className="mt-0.5 inline-flex size-5 shrink-0 items-center justify-center rounded-full bg-brand-soft text-primary">
                    <Check className="size-3" />
                  </span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </section>

          <section id="start" className="scroll-mt-36">
            <h2 className="font-display text-2xl tracking-tight">
              How to start a return
            </h2>
            <ol className="mt-4 overflow-hidden rounded-2xl border border-border bg-card">
              {steps.map((step, index) => (
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

          <section id="refund" className="scroll-mt-36">
            <h2 className="font-display text-2xl tracking-tight">
              When the refund arrives
            </h2>
            <div className="mt-4 space-y-3 text-sm leading-6 text-muted-foreground">
              <p>
                The refund is issued after the return is accepted. It goes back
                to the original payment method, and you receive an email when
                that happens.
              </p>
              <p>
                If something arrived damaged, contact support with the order
                number even when the item is outside the usual return rules.
              </p>
            </div>
          </section>

          <section id="excluded" className="scroll-mt-36">
            <h2 className="font-display text-2xl tracking-tight">
              What cannot be returned
            </h2>
            <ul className="mt-4 space-y-3">
              {excluded.map((item) => (
                <li key={item} className="flex gap-3 text-sm leading-6">
                  <span className="mt-0.5 inline-flex size-5 shrink-0 items-center justify-center rounded-full bg-muted text-muted-foreground">
                    <X className="size-3" />
                  </span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </section>

          <section className="flex flex-col gap-4 rounded-2xl border border-border bg-card px-5 py-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-base font-medium">Ready to send it back?</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Use the order number from your history. Support replies by
                email.
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button
                nativeButton={false}
                render={<Link href="/contact" />}
                className="h-10 rounded-full px-5 font-semibold"
              >
                Contact us
              </Button>
              <Button
                variant="outline"
                nativeButton={false}
                render={<Link href="/orders" />}
                className="h-10 rounded-full px-5"
              >
                Order history
              </Button>
            </div>
          </section>
        </div>
      </div>
    </Container>
  );
}
