import Link from "next/link";

import { Container, PageBreadcrumb } from "@/components/common";
import { Button } from "@/components/ui/button";

const sections = [
  { id: "using", label: "Using NexCart" },
  { id: "accounts", label: "Accounts" },
  { id: "orders", label: "Orders" },
  { id: "returns", label: "Returns" },
  { id: "selling", label: "Selling" },
  { id: "rules", label: "Marketplace rules" },
] as const;

const using = [
  {
    title: "A marketplace",
    body: "NexCart lists products from independent stores. The store named on a product is the seller. NexCart runs the site, takes the order, and passes the delivery details to that store.",
  },
  {
    title: "What you agree to",
    body: "Creating an account, placing an order, or submitting a seller application means you accept these terms and the privacy page. The fees page is part of the agreement for sellers.",
  },
  {
    title: "Changes",
    body: "These terms can be updated. The date at the top of this page is the version in effect. Continued use of the site after an update means you accept the new version.",
  },
];

const orders = [
  "Checkout asks for your name, email, phone, and shipping address, plus bKash or cash on delivery.",
  "A bKash order stores the number you enter. NexCart does not take card numbers.",
  "The store fulfilling the order receives the name, phone, address, and items needed to ship it.",
  "An order confirmation and later updates go to the email on the order.",
  "Prices and availability are set by the seller and can change until checkout is complete.",
];

const rules = [
  "Use an account that is yours. Do not share the password or sign in as someone else.",
  "List only products you are allowed to sell, with a description that matches the item.",
  "Do not use the site to send spam, scrape listings, or interfere with another store.",
  "NexCart can refuse an order, reject a seller application, or suspend an account that breaks these rules.",
];

export function TermsView() {
  return (
    <Container className="py-8 sm:py-10">
      <PageBreadcrumb
        items={[{ label: "Home", href: "/" }, { label: "Terms" }]}
      />

      <div className="mt-6 max-w-2xl">
        <p className="text-xs font-semibold tracking-[0.18em] text-primary uppercase">
          Legal
        </p>
        <h1 className="mt-1 text-3xl sm:text-4xl">Terms</h1>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">
          The rules for shopping and selling on NexCart. Last updated 8 October
          2026.
        </p>
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
          <section id="using" className="scroll-mt-36">
            <h2 className="font-display text-2xl tracking-tight">
              Using NexCart
            </h2>
            <ul className="mt-4 overflow-hidden rounded-2xl border border-border bg-card">
              {using.map((item) => (
                <li
                  key={item.title}
                  className="border-b border-border px-4 py-4 last:border-b-0 sm:px-5"
                >
                  <h3 className="text-base font-medium">{item.title}</h3>
                  <p className="mt-1 text-sm leading-6 text-muted-foreground">
                    {item.body}
                  </p>
                </li>
              ))}
            </ul>
          </section>

          <section id="accounts" className="scroll-mt-36">
            <h2 className="font-display text-2xl tracking-tight">Accounts</h2>
            <div className="mt-4 space-y-3 text-sm leading-6 text-muted-foreground">
              <p>
                Registration asks for your name, email, and a password. Phone is
                optional. The email is how you sign in and cannot be changed
                from the account page.
              </p>
              <p>
                You are responsible for the activity on a signed-in session.
                Sign out on a shared device. You can update your name and phone
                from Account.
              </p>
              <p>
                Ask support to close an account and include the email on it.
                Orders already placed may be kept for receipts, returns, and
                seller payouts.
              </p>
            </div>
          </section>

          <section id="orders" className="scroll-mt-36">
            <h2 className="font-display text-2xl tracking-tight">Orders</h2>
            <ul className="mt-4 space-y-3">
              {orders.map((item) => (
                <li key={item} className="flex gap-3 text-sm leading-6">
                  <span className="mt-2 size-1.5 shrink-0 rounded-full bg-primary" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </section>

          <section id="returns" className="scroll-mt-36">
            <h2 className="font-display text-2xl tracking-tight">Returns</h2>
            <div className="mt-4 space-y-3 text-sm leading-6 text-muted-foreground">
              <p>
                Most items can be returned within 30 days of delivery if they
                are unused and still in the original packaging. Perishable
                groceries, opened beauty products, and items marked final sale
                cannot be returned.
              </p>
              <p>
                Start from the order number in your receipt or order history.
                After the return is accepted, the refund goes back to the
                original payment method.
              </p>
            </div>
          </section>

          <section id="selling" className="scroll-mt-36">
            <h2 className="font-display text-2xl tracking-tight">Selling</h2>
            <div className="mt-4 space-y-3 text-sm leading-6 text-muted-foreground">
              <p>
                A seller application is accepted only from a customer account
                whose holder is 18 or older. Admin accounts cannot apply. The
                application asks for identity details and a store profile, and
                NexCart reviews it before a store can sell.
              </p>
              <p>
                Listing a product is free, and there is no monthly store fee.
                When an item sells, NexCart keeps an 8% referral fee on the item
                price. Shipping the buyer pays and sales tax are not part of
                that fee. A full refund returns the referral fee for that order.
              </p>
              <p>
                The rest of the sale stays pending until seven days after the
                order is marked delivered. Available balance is paid every
                Monday when it is at least Tk 25, to the bank account or mobile
                wallet on the store.
              </p>
            </div>
          </section>

          <section id="rules" className="scroll-mt-36">
            <h2 className="font-display text-2xl tracking-tight">
              Marketplace rules
            </h2>
            <ul className="mt-4 space-y-3">
              {rules.map((item) => (
                <li key={item} className="flex gap-3 text-sm leading-6">
                  <span className="mt-2 size-1.5 shrink-0 rounded-full bg-primary" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </section>

          <section className="flex flex-col gap-4 rounded-2xl border border-border bg-card px-5 py-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-base font-medium">Need the related pages?</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Privacy covers the data we collect. Cookies covers the sign-in
                cookie and what stays on this device.
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button
                nativeButton={false}
                render={<Link href="/privacy" />}
                className="h-10 rounded-full px-5 font-semibold"
              >
                Privacy
              </Button>
              <Button
                variant="outline"
                nativeButton={false}
                render={<Link href="/cookies" />}
                className="h-10 rounded-full px-5"
              >
                Cookies
              </Button>
            </div>
          </section>
        </div>
      </div>
    </Container>
  );
}
