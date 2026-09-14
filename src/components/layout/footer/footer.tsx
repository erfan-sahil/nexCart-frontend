import Link from "next/link";

import { Container, Logo } from "@/components/common";

import { FooterLinks } from "./footer-links";
import { NewsletterForm } from "./newsletter-form";

const social = [
  {
    href: "https://instagram.com",
    label: "Instagram",
    icon: (
      <svg viewBox="0 0 24 24" className="size-4" fill="none" aria-hidden>
        <rect
          x="3"
          y="3"
          width="18"
          height="18"
          rx="5"
          stroke="currentColor"
          strokeWidth="1.8"
        />
        <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="1.8" />
        <circle cx="17.5" cy="6.5" r="1" fill="currentColor" />
      </svg>
    ),
  },
  {
    href: "https://x.com",
    label: "X",
    icon: (
      <svg
        viewBox="0 0 24 24"
        className="size-4"
        fill="currentColor"
        aria-hidden
      >
        <path d="M14.7 10.3 22 2h-2.2l-6.3 7.2L8.4 2H2l7.8 11.1L2 22h2.2l6.8-7.8L15.6 22H22l-7.3-11.7Zm-2.4 2.8-.8-1.1L5.1 3.5h2.7l5.1 7.3.8 1.1 7.2 10.2h-2.7l-5.9-8z" />
      </svg>
    ),
  },
  {
    href: "https://facebook.com",
    label: "Facebook",
    icon: (
      <svg
        viewBox="0 0 24 24"
        className="size-4"
        fill="currentColor"
        aria-hidden
      >
        <path d="M14 9h3V6h-3c-2.2 0-4 1.8-4 4v2H8v3h2v7h3v-7h2.6l.4-3H13v-2c0-.6.4-1 1-1Z" />
      </svg>
    ),
  },
  {
    href: "https://youtube.com",
    label: "YouTube",
    icon: (
      <svg
        viewBox="0 0 24 24"
        className="size-4"
        fill="currentColor"
        aria-hidden
      >
        <path d="M22 12.2s0-3.2-.4-4.6c-.2-.9-.9-1.6-1.8-1.8C18.4 5.4 12 5.4 12 5.4s-6.4 0-7.8.4c-.9.2-1.6.9-1.8 1.8C2 9 2 12.2 2 12.2s0 3.2.4 4.6c.2.9.9 1.6 1.8 1.8 1.4.4 7.8.4 7.8.4s6.4 0 7.8-.4c.9-.2 1.6-.9 1.8-1.8.4-1.4.4-4.6.4-4.6ZM10 15.5v-6.6l5.5 3.3-5.5 3.3Z" />
      </svg>
    ),
  },
];

export function Footer() {
  return (
    <footer className="mt-auto bg-surface-dark text-white">
      <Container className="grid gap-12 py-14 lg:grid-cols-[1.1fr_1.6fr] lg:gap-16">
        <div>
          <Logo variant="light" />
          <p className="mt-4 max-w-sm text-sm leading-6 text-white/60">
            A multi-vendor marketplace for independent stores. Fast delivery,
            verified sellers, and deals that keep moving.
          </p>
          <p className="mt-8 text-sm font-medium text-white">
            Get drop alerts and flash deals
          </p>
          <div className="mt-3 max-w-md">
            <NewsletterForm />
          </div>
        </div>
        <FooterLinks />
      </Container>
      <div className="border-t border-white/10">
        <Container className="flex flex-col gap-4 py-5 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-white/45">
            © {new Date().getFullYear()} NexCart. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            {social.map(({ href, icon, label }) => (
              <Link
                key={label}
                href={href}
                aria-label={label}
                className="text-white/50 transition-colors hover:text-primary"
              >
                {icon}
              </Link>
            ))}
          </div>
          <div className="flex gap-4 text-xs text-white/45">
            <Link href="/privacy" className="hover:text-primary">
              Privacy
            </Link>
            <Link href="/terms" className="hover:text-primary">
              Terms
            </Link>
            <Link href="/cookies" className="hover:text-primary">
              Cookies
            </Link>
          </div>
        </Container>
      </div>
    </footer>
  );
}
