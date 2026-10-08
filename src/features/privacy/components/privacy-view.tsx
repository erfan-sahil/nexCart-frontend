import Link from "next/link";

import { Container, PageBreadcrumb } from "@/components/common";
import { Button } from "@/components/ui/button";

const sections = [
  { id: "collect", label: "What we collect" },
  { id: "use", label: "How we use it" },
  { id: "share", label: "Who sees it" },
  { id: "keep", label: "How long we keep it" },
  { id: "choices", label: "Your choices" },
] as const;

const collected = [
  {
    title: "Account",
    body: "Name, email, password, and an optional phone number. A profile photo is stored when you add one. The account also records whether the email is verified and when you last signed in.",
  },
  {
    title: "Orders",
    body: "At checkout we take your name, email, phone, and shipping address, plus the items and total. Payment is bKash or cash on delivery. For bKash we store the number you enter. We do not take card numbers.",
  },
  {
    title: "Support and updates",
    body: "Contact messages include your name, email, topic, and the note you write. The footer newsletter stores the email you submit.",
  },
  {
    title: "Selling",
    body: "A seller application includes your legal name, date of birth, phone, home and business addresses, and a national ID or passport number with photos of the document. A selfie, trade license, and tax ID are optional. You must be at least 18 to apply.",
  },
  {
    title: "On your device",
    body: "A sign-in session keeps you logged in. Your theme choice is saved in this browser. Cart and wishlist stay in the current session.",
  },
];

const uses = [
  "Create the account, keep it signed in, and let you update your name and phone.",
  "Place orders, share the delivery details with the seller fulfilling them, and issue refunds to the original payment method.",
  "Reply to support messages and send order updates to the email on the order.",
  "Review seller applications and run the store after approval.",
  "Send drop alerts only after you join the newsletter.",
  "Suspend accounts that break the marketplace rules.",
];

const shared = [
  {
    title: "Sellers",
    body: "The store fulfilling an order receives the name, phone, address, and items needed to ship it.",
  },
  {
    title: "Payments",
    body: "bKash payments use the number you enter at checkout. Cash on delivery is collected when the order arrives.",
  },
  {
    title: "NexCart staff",
    body: "Support and seller review use the details you sent so they can answer or decide an application.",
  },
];

export function PrivacyView() {
  return (
    <Container className="py-8 sm:py-10">
      <PageBreadcrumb
        items={[{ label: "Home", href: "/" }, { label: "Privacy" }]}
      />

      <div className="mt-6 max-w-2xl">
        <p className="text-xs font-semibold tracking-[0.18em] text-primary uppercase">
          Legal
        </p>
        <h1 className="mt-1 text-3xl sm:text-4xl">Privacy</h1>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">
          What NexCart collects when you shop, sell, or write to us, and how
          that information is used. Last updated 8 October 2026.
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
          <section id="collect" className="scroll-mt-36">
            <h2 className="font-display text-2xl tracking-tight">
              What we collect
            </h2>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              We collect the details you type into NexCart, plus a small amount
              stored so the site remembers you.
            </p>
            <ul className="mt-4 overflow-hidden rounded-2xl border border-border bg-card">
              {collected.map((item) => (
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

          <section id="use" className="scroll-mt-36">
            <h2 className="font-display text-2xl tracking-tight">
              How we use it
            </h2>
            <ul className="mt-4 space-y-3">
              {uses.map((item) => (
                <li key={item} className="flex gap-3 text-sm leading-6">
                  <span className="mt-2 size-1.5 shrink-0 rounded-full bg-primary" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </section>

          <section id="share" className="scroll-mt-36">
            <h2 className="font-display text-2xl tracking-tight">
              Who sees it
            </h2>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              NexCart does not sell personal information. It is shared only to
              run an order, a payment, or a support request.
            </p>
            <ul className="mt-4 grid gap-3 sm:grid-cols-3">
              {shared.map((item) => (
                <li
                  key={item.title}
                  className="rounded-2xl border border-border bg-card px-5 py-4"
                >
                  <h3 className="text-base font-medium">{item.title}</h3>
                  <p className="mt-1 text-sm leading-6 text-muted-foreground">
                    {item.body}
                  </p>
                </li>
              ))}
            </ul>
          </section>

          <section id="keep" className="scroll-mt-36">
            <h2 className="font-display text-2xl tracking-tight">
              How long we keep it
            </h2>
            <div className="mt-4 space-y-3 text-sm leading-6 text-muted-foreground">
              <p>
                Account details stay while the account is open. Order records
                stay so you can track a purchase, request a return within 30
                days of delivery, and keep a receipt.
              </p>
              <p>
                Seller identity documents stay for the life of the store and for
                a period after it closes, so a review decision can still be
                checked. A saved application draft stays until you submit it or
                discard it.
              </p>
              <p>
                Theme preference and the sign-in session stay on the device
                until you change the theme, sign out, or clear the browser.
              </p>
            </div>
          </section>

          <section id="choices" className="scroll-mt-36">
            <h2 className="font-display text-2xl tracking-tight">
              Your choices
            </h2>
            <div className="mt-4 space-y-3 text-sm leading-6 text-muted-foreground">
              <p>
                Update your name and phone from your account. The email is the
                address you use to sign in.
              </p>
              <p>
                Ask support to close an account or to stop newsletter mail.
                Include the email on the account so we can find it. Orders
                already placed may be kept for receipts, returns, and seller
                payouts.
              </p>
              <p>
                NexCart is a marketplace for shoppers and sellers. Seller
                applications are only accepted from people who are 18 or older.
              </p>
            </div>
          </section>

          <section className="flex flex-col gap-4 rounded-2xl border border-border bg-card px-5 py-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-base font-medium">
                Questions about your data?
              </h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Write to support and include the email on your account. We reply
                by email.
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
                render={<Link href="/account" />}
                className="h-10 rounded-full px-5"
              >
                Your account
              </Button>
            </div>
          </section>
        </div>
      </div>
    </Container>
  );
}
