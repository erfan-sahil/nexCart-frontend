import Link from "next/link";
import { Check, X } from "@/lib/icons";

import { Container, PageBreadcrumb } from "@/components/common";
import { Button } from "@/components/ui/button";

const sections = [
  { id: "policy", label: "When refunds apply" },
  { id: "flow", label: "How it works" },
  { id: "refund", label: "Refunds" },
  { id: "excluded", label: "Not allowed" },
] as const;

const policyRows = [
  {
    situation: "Product not yet delivered",
    allowed: false,
    note: "No refund yet — wait for delivery outcome.",
  },
  {
    situation: "Customer rejects during delivery",
    allowed: true,
    note: "Yes, after NexCart warehouse receives and accepts the return.",
  },
  {
    situation: "Courier fails delivery",
    allowed: true,
    note: "Yes, after warehouse receipt and acceptance.",
  },
  {
    situation: "Customer accepts delivery",
    allowed: false,
    note: "No. Accepting delivery ends return eligibility.",
  },
  {
    situation: "Return requested after accepting",
    allowed: false,
    note: "Not allowed.",
  },
] as const;

const steps = [
  {
    title: "Delivery fails or you refuse the package",
    body: "The courier records a failed delivery or your rejection of specific items. A refund is not started yet.",
  },
  {
    title: "Package returns to NexCart",
    body: "The courier brings rejected or undelivered items back to the NexCart warehouse.",
  },
  {
    title: "Warehouse inspects the goods",
    body: "NexCart receives and inspects the return. Only then does refund processing begin.",
  },
  {
    title: "Refund for rejected items only",
    body: "If you kept some products, only the rejected merchandise is refunded. Delivery fee is refunded only when every item is returned.",
  },
];

const excluded = [
  "Any return after you accept delivery",
  "Customer-initiated returns from order history",
  "Refunds before warehouse acceptance of the returned goods",
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
            NexCart supports returns only before successful delivery acceptance.
            Once you accept the product, you cannot request a return or refund.
          </p>
        </div>
        <Button
          nativeButton={false}
          render={<Link href="/orders" />}
          className="auth-orange-button shrink-0 px-6"
        >
          View orders
        </Button>
      </div>

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
          <section id="policy" className="scroll-mt-36">
            <h2 className="font-display text-2xl tracking-tight">
              When refunds apply
            </h2>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              Refunds start only after the physical return is accepted at the
              NexCart warehouse.
            </p>
            <div className="mt-4 overflow-hidden rounded-2xl border border-border bg-card">
              <table className="w-full text-left text-sm">
                <thead className="border-b border-border bg-muted/40 text-muted-foreground">
                  <tr>
                    <th className="px-4 py-3 font-medium">Situation</th>
                    <th className="px-4 py-3 font-medium">Refund</th>
                    <th className="hidden px-4 py-3 font-medium sm:table-cell">
                      Note
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {policyRows.map((row) => (
                    <tr
                      key={row.situation}
                      className="border-b border-border last:border-b-0"
                    >
                      <td className="px-4 py-3 align-top font-medium">
                        {row.situation}
                      </td>
                      <td className="px-4 py-3 align-top">
                        <span className="inline-flex items-center gap-1.5">
                          {row.allowed ? (
                            <Check className="size-3.5 text-primary" />
                          ) : (
                            <X className="size-3.5 text-muted-foreground" />
                          )}
                          {row.allowed ? "Yes" : "No"}
                        </span>
                      </td>
                      <td className="hidden px-4 py-3 align-top text-muted-foreground sm:table-cell">
                        {row.note}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <section id="flow" className="scroll-mt-36">
            <h2 className="font-display text-2xl tracking-tight">
              How it works
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
            <h2 className="font-display text-2xl tracking-tight">Refunds</h2>
            <div className="mt-4 space-y-3 text-sm leading-6 text-muted-foreground">
              <p>
                Partial rejection refunds only the refused products (and a fair
                share of any coupon). Items you accept stay as a completed
                purchase.
              </p>
              <p>
                Track refund progress from order history or track order. Contact
                support only if delivery failed and you need help locating the
                order.
              </p>
            </div>
          </section>

          <section id="excluded" className="scroll-mt-36">
            <h2 className="font-display text-2xl tracking-tight">
              Not allowed
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
              <h2 className="text-base font-medium">
                Need help with an order?
              </h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Check tracking for delivery and refund status, or contact
                support with your order number.
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button
                nativeButton={false}
                render={<Link href="/track-order" />}
                className="h-10 rounded-full px-5 font-semibold"
              >
                Track order
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
