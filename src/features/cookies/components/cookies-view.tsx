import Link from "next/link";

import { Container, PageBreadcrumb } from "@/components/common";
import { Button } from "@/components/ui/button";

const sections = [
  { id: "cookie", label: "The sign-in cookie" },
  { id: "device", label: "On this device" },
  { id: "choices", label: "Your choices" },
] as const;

const cookieFacts = [
  {
    title: "Name",
    body: "refreshToken",
  },
  {
    title: "Why",
    body: "Keeps you signed in so a new access token can be issued without asking for the password again.",
  },
  {
    title: "How long",
    body: "About 7 days. Signing out clears it on this browser.",
  },
  {
    title: "Who can read it",
    body: "The cookie is httpOnly and is sent only to the auth routes. Page scripts on NexCart cannot read it.",
  },
];

const device = [
  {
    title: "Theme",
    body: "Light, dark, or system is saved in this browser under the key nexcart-theme. It is local storage, not a cookie, so the page can match your choice before it paints.",
  },
  {
    title: "Cart and wishlist",
    body: "Items you add stay in the current visit. They are not written to a cookie or to disk, so a new visit starts without them.",
  },
  {
    title: "Newsletter",
    body: "The footer form stores the email you submit on NexCart. That is an account record, not a cookie on your device.",
  },
];

export function CookiesView() {
  return (
    <Container className="py-8 sm:py-10">
      <PageBreadcrumb
        items={[{ label: "Home", href: "/" }, { label: "Cookies" }]}
      />

      <div className="mt-6 max-w-2xl">
        <p className="text-xs font-semibold tracking-[0.18em] text-primary uppercase">
          Legal
        </p>
        <h1 className="mt-1 text-3xl sm:text-4xl">Cookies</h1>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">
          NexCart sets one cookie, and only to keep a sign-in session. There are
          no advertising or analytics cookies. Last updated 8 October 2026.
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
          <section id="cookie" className="scroll-mt-36">
            <h2 className="font-display text-2xl tracking-tight">
              The sign-in cookie
            </h2>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              This cookie is set when you sign in or register, and it is
              refreshed while the session stays active.
            </p>
            <ul className="mt-4 grid gap-3 sm:grid-cols-2">
              {cookieFacts.map((item) => (
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

          <section id="device" className="scroll-mt-36">
            <h2 className="font-display text-2xl tracking-tight">
              On this device
            </h2>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              A few preferences live in the browser without using a cookie.
            </p>
            <ul className="mt-4 overflow-hidden rounded-2xl border border-border bg-card">
              {device.map((item) => (
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

          <section id="choices" className="scroll-mt-36">
            <h2 className="font-display text-2xl tracking-tight">
              Your choices
            </h2>
            <div className="mt-4 space-y-3 text-sm leading-6 text-muted-foreground">
              <p>
                Sign out to clear the sign-in cookie on this browser. You can
                also block cookies in the browser; sign-in will not stay active
                across visits if you do.
              </p>
              <p>
                Change the theme from the header toggle, or clear site data for
                NexCart to drop the saved theme. Cart and wishlist clear when
                you leave the visit or refresh into a new one.
              </p>
              <p>
                NexCart does not use optional marketing cookies, so there is no
                consent banner to accept or reject.
              </p>
            </div>
          </section>

          <section className="flex flex-col gap-4 rounded-2xl border border-border bg-card px-5 py-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-base font-medium">
                Questions about your data?
              </h2>
              <p className="mt-1 text-sm text-muted-foreground">
                The privacy page lists what an account, an order, and a seller
                application store.
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
