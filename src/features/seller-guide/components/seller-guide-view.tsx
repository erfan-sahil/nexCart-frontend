import Link from "next/link";
import { Check } from "lucide-react";

import { Container, PageBreadcrumb } from "@/components/common";
import { Button } from "@/components/ui/button";

const sections = [
  { id: "who", label: "Who can apply" },
  { id: "prepare", label: "What to prepare" },
  { id: "steps", label: "The application" },
  { id: "after", label: "After you submit" },
  { id: "listings", label: "Listing standards" },
] as const;

const prepare = [
  "Your legal name, email, phone in international format, date of birth, and home address.",
  "A national ID or passport. The number uses 4–32 letters, numbers, or hyphens, plus at least one photo of the document. You can add up to four images. A selfie is optional.",
  "A store name, whether you sell as an individual or a company, and the business address.",
  "A trade license or tax ID if you have one. Both are optional.",
  "At least one category you plan to sell, and a short description of the business (20 characters or more).",
];

const steps = [
  {
    title: "About you",
    body: "Name, contact details, date of birth, and your home address. You must be at least 18.",
  },
  {
    title: "Identity",
    body: "Choose a national ID or passport, enter the document number, and upload a clear photo of it.",
  },
  {
    title: "Store",
    body: "Name the store, choose individual or company, and add the business address. Add a license or tax document only if you have one.",
  },
  {
    title: "What you sell",
    body: "Pick the categories you will list and describe the business in plain language.",
  },
  {
    title: "Review",
    body: "Check every section. You can save a draft and come back. Submit only when the application is complete.",
  },
];

const after = [
  {
    title: "Submitted",
    body: "The application is in the queue. Return to Sell on NexCart to see the status.",
  },
  {
    title: "More information",
    body: "Review may ask for a missing detail. The note on the application says what to update.",
  },
  {
    title: "Approved",
    body: "The account becomes a vendor. You do not submit a second application.",
  },
  {
    title: "Rejected",
    body: "The decision includes a note. Read it before you apply again.",
  },
];

const listings = [
  "Use the real product name, price, and photos. Do not reuse another seller’s images.",
  "Ship the item you listed, in the condition you described.",
  "Keep stock accurate. Remove a product when you cannot fulfill it.",
  "Answer buyer questions through the store you registered. Do not ask buyers to pay outside NexCart.",
];

export function SellerGuideView() {
  return (
    <Container className="py-8 sm:py-10">
      <PageBreadcrumb
        items={[
          { label: "Home", href: "/" },
          { label: "Sell on NexCart", href: "/sell" },
          { label: "Seller guide" },
        ]}
      />

      <div className="mt-6 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
        <div className="max-w-2xl">
          <p className="text-xs font-semibold tracking-[0.18em] text-primary uppercase">
            Vendors
          </p>
          <h1 className="mt-1 text-3xl sm:text-4xl">Seller guide</h1>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            How to apply for a store, what the review checks, and how to list
            once you are approved.
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

      <div className="mt-8 grid items-start gap-8 lg:grid-cols-[13.5rem_minmax(0,1fr)] lg:gap-10">
        <nav className="flex gap-2 overflow-x-auto pb-1 lg:sticky lg:top-36 lg:flex-col lg:overflow-visible lg:pb-0">
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
          <section id="who" className="scroll-mt-36">
            <h2 className="font-display text-2xl tracking-tight">
              Who can apply
            </h2>
            <div className="mt-4 space-y-3 text-sm leading-6 text-muted-foreground">
              <p>
                Sign in with a customer account. You must be at least 18. Admin
                accounts cannot apply, and an account that is already a vendor
                does not need another application.
              </p>
              <p>
                One application belongs to one account. Save a draft if you need
                to gather documents, then submit when every required field is
                filled.
              </p>
            </div>
          </section>

          <section id="prepare" className="scroll-mt-36">
            <h2 className="font-display text-2xl tracking-tight">
              What to prepare
            </h2>
            <ul className="mt-4 space-y-3">
              {prepare.map((item) => (
                <li key={item} className="flex gap-3 text-sm leading-6">
                  <span className="mt-0.5 inline-flex size-5 shrink-0 items-center justify-center rounded-full bg-brand-soft text-primary">
                    <Check className="size-3" />
                  </span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </section>

          <section id="steps" className="scroll-mt-36">
            <h2 className="font-display text-2xl tracking-tight">
              The application
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

          <section id="after" className="scroll-mt-36">
            <h2 className="font-display text-2xl tracking-tight">
              After you submit
            </h2>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {after.map((item) => (
                <article
                  key={item.title}
                  className="rounded-2xl border border-border bg-card px-4 py-4"
                >
                  <h3 className="text-base font-medium">{item.title}</h3>
                  <p className="mt-1.5 text-sm leading-6 text-muted-foreground">
                    {item.body}
                  </p>
                </article>
              ))}
            </div>
          </section>

          <section id="listings" className="scroll-mt-36">
            <h2 className="font-display text-2xl tracking-tight">
              Listing standards
            </h2>
            <ul className="mt-4 space-y-3">
              {listings.map((item) => (
                <li key={item} className="flex gap-3 text-sm leading-6">
                  <span className="mt-0.5 inline-flex size-5 shrink-0 items-center justify-center rounded-full bg-brand-soft text-primary">
                    <Check className="size-3" />
                  </span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </section>

          <section className="flex flex-col gap-4 rounded-2xl border border-border bg-card px-5 py-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-base font-medium">Ready to apply?</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                The form follows these same five steps. Questions go to support.
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button
                nativeButton={false}
                render={<Link href="/sell" />}
                className="h-10 rounded-full px-5 font-semibold"
              >
                Open the application
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
