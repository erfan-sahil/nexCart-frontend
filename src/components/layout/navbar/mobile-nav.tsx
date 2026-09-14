"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";

import { Logo } from "@/components/common";
import { CATEGORY_LINKS } from "@/constants/navigation";

import { SearchBar } from "./search-bar";

export function MobileNav() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <button
        type="button"
        className="inline-flex size-10 items-center justify-center rounded-lg text-ink lg:hidden"
        onClick={() => setOpen(true)}
        aria-label="Open menu"
      >
        <Menu className="size-5" />
      </button>

      {open ? (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            type="button"
            className="absolute inset-0 bg-ink/40"
            aria-label="Close menu"
            onClick={() => setOpen(false)}
          />
          <aside className="absolute inset-y-0 left-0 flex w-[min(100%,20rem)] flex-col bg-white shadow-xl">
            <div className="flex items-center justify-between border-b border-border px-4 py-3">
              <Logo />
              <button
                type="button"
                className="inline-flex size-9 items-center justify-center rounded-lg"
                onClick={() => setOpen(false)}
                aria-label="Close menu"
              >
                <X className="size-5" />
              </button>
            </div>
            <div className="space-y-6 overflow-y-auto px-4 py-5">
              <SearchBar />
              <div>
                <p className="mb-2 text-xs font-semibold tracking-wider text-muted-foreground uppercase">
                  Categories
                </p>
                <ul className="space-y-1">
                  {CATEGORY_LINKS.map((item) => (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        className="block rounded-lg px-2 py-2 text-sm hover:bg-brand-soft hover:text-primary"
                        onClick={() => setOpen(false)}
                      >
                        {item.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="grid grid-cols-2 gap-2 border-t border-border pt-4 text-sm">
                <Link href="/account" onClick={() => setOpen(false)}>
                  Account
                </Link>
                <Link href="/orders" onClick={() => setOpen(false)}>
                  Orders
                </Link>
                <Link href="/sell" onClick={() => setOpen(false)}>
                  Sell on NexCart
                </Link>
                <Link href="/help" onClick={() => setOpen(false)}>
                  Help
                </Link>
              </div>
            </div>
          </aside>
        </div>
      ) : null}
    </>
  );
}
