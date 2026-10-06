"use client";

import {
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BookOpen,
  Car,
  ChevronDown,
  ChevronRight,
  Cpu,
  Dumbbell,
  Heart,
  HelpCircle,
  Home,
  LayoutGrid,
  MapPin,
  Package,
  Shirt,
  ShoppingBag,
  Sparkles,
  Store,
  UserRound,
  UtensilsCrossed,
  type LucideIcon,
} from "lucide-react";

import { Logo, ThemeToggle } from "@/components/common";
import { CATEGORY_LINKS } from "@/constants/navigation";
import { DrawerSessionButton } from "@/features/auth/components/account-menu";
import { cn } from "@/lib/utils";

import { SearchBar } from "./search-bar";

const CLOSE_MS = 460;

const CATEGORY_ICONS: Record<string, LucideIcon> = {
  electronics: Cpu,
  fashion: Shirt,
  home: Home,
  beauty: Sparkles,
  sports: Dumbbell,
  grocery: UtensilsCrossed,
  automotive: Car,
  books: BookOpen,
};

const SHORTCUTS = [
  { href: "/account", label: "Account", icon: UserRound },
  { href: "/orders", label: "Orders", icon: Package },
  { href: "/wishlist", label: "Wishlist", icon: Heart },
  { href: "/cart", label: "Cart", icon: ShoppingBag },
  { href: "/sell", label: "Sell on NexCart", icon: Store },
  { href: "/track-order", label: "Track order", icon: MapPin },
  { href: "/help", label: "Help center", icon: HelpCircle },
] as const;

const EASE = "cubic-bezier(0.22,1,0.36,1)";

const iconWellClass =
  "inline-flex size-9 shrink-0 items-center justify-center rounded-lg bg-brand-soft text-primary";

function HamburgerIcon({ open }: { open: boolean }) {
  return (
    <span className="relative block h-3.5 w-5" aria-hidden>
      <span
        className={cn(
          "absolute left-0 h-0.5 w-5 origin-center rounded-full bg-current transition-all duration-300 ease-out motion-reduce:transition-none",
          open ? "top-1.5 rotate-45" : "top-0",
        )}
      />
      <span
        className={cn(
          "absolute top-1.5 left-0 h-0.5 rounded-full bg-current transition-all duration-300 ease-out motion-reduce:transition-none",
          open ? "w-0 opacity-0" : "w-5 opacity-100",
        )}
      />
      <span
        className={cn(
          "absolute left-0 h-0.5 w-5 origin-center rounded-full bg-current transition-all duration-300 ease-out motion-reduce:transition-none",
          open ? "top-1.5 -rotate-45" : "top-3",
        )}
      />
    </span>
  );
}

function Reveal({
  active,
  index,
  className,
  children,
}: {
  active: boolean;
  index: number;
  className?: string;
  children: ReactNode;
}) {
  return (
    <div
      className={cn(
        "transition-[opacity,transform] duration-500 motion-reduce:translate-x-0 motion-reduce:opacity-100 motion-reduce:transition-none",
        active ? "translate-x-0 opacity-100" : "-translate-x-4 opacity-0",
        className,
      )}
      style={{
        transitionTimingFunction: EASE,
        transitionDelay: active ? `${60 + index * 32}ms` : "0ms",
      }}
    >
      {children}
    </div>
  );
}

export function MobileNav() {
  const pathname = usePathname();
  const panelId = useId();
  const triggerRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLElement>(null);
  const wasOpen = useRef(false);
  const closeTimer = useRef<number | null>(null);
  const openFrame = useRef<number | null>(null);
  const categoriesId = useId();
  const [open, setOpen] = useState(false);
  const [present, setPresent] = useState(false);
  const [categoriesOpen, setCategoriesOpen] = useState(false);
  const [trackedPath, setTrackedPath] = useState(pathname);

  if (trackedPath !== pathname) {
    setTrackedPath(pathname);
    setOpen(false);
    setPresent(false);
    setCategoriesOpen(false);
  }

  const cancelMotion = useCallback(() => {
    if (closeTimer.current !== null) {
      window.clearTimeout(closeTimer.current);
      closeTimer.current = null;
    }
    if (openFrame.current !== null) {
      window.cancelAnimationFrame(openFrame.current);
      openFrame.current = null;
    }
  }, []);

  const openMenu = useCallback(() => {
    cancelMotion();
    setPresent(true);
    openFrame.current = requestAnimationFrame(() => {
      openFrame.current = requestAnimationFrame(() => {
        setOpen(true);
      });
    });
  }, [cancelMotion]);

  const closeMenu = useCallback(() => {
    cancelMotion();
    setOpen(false);
    setCategoriesOpen(false);
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setPresent(false);
      return;
    }
    closeTimer.current = window.setTimeout(() => {
      setPresent(false);
    }, CLOSE_MS);
  }, [cancelMotion]);

  useEffect(() => {
    cancelMotion();
  }, [pathname, cancelMotion]);

  useEffect(() => {
    return () => cancelMotion();
  }, [cancelMotion]);

  useEffect(() => {
    const media = window.matchMedia("(min-width: 1024px)");

    function onChange() {
      if (media.matches) closeMenu();
    }

    media.addEventListener("change", onChange);
    return () => media.removeEventListener("change", onChange);
  }, [closeMenu]);

  useEffect(() => {
    if (!present) return;

    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [present]);

  useEffect(() => {
    if (!open) return;

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") closeMenu();
    }

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open, closeMenu]);

  useEffect(() => {
    if (open) {
      wasOpen.current = true;
      panelRef.current
        ?.querySelector<HTMLElement>("[data-drawer-close]")
        ?.focus();
      return;
    }

    if (wasOpen.current && !present) {
      wasOpen.current = false;
      triggerRef.current?.focus();
    }
  }, [open, present]);

  useEffect(() => {
    if (!open) return;
    const panel = panelRef.current;
    if (!panel) return;

    function onKeyDown(event: KeyboardEvent) {
      if (event.key !== "Tab" || !panel) return;

      const focusable = panel.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), input:not([disabled]), [tabindex]:not([tabindex="-1"])',
      );
      if (focusable.length === 0) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }

    panel.addEventListener("keydown", onKeyDown);
    return () => panel.removeEventListener("keydown", onKeyDown);
  }, [open]);

  const drawer =
    present && typeof document !== "undefined"
      ? createPortal(
          <div className="fixed inset-0 z-50 lg:hidden">
            <button
              type="button"
              className={cn(
                "absolute inset-0 bg-ink/55 backdrop-blur-[3px] transition-opacity duration-500 motion-reduce:transition-none",
                open ? "opacity-100" : "opacity-0",
              )}
              style={{ transitionTimingFunction: EASE }}
              aria-label="Close menu"
              onClick={closeMenu}
            />
            <aside
              ref={panelRef}
              id={panelId}
              role="dialog"
              aria-modal="true"
              aria-label="Site menu"
              className={cn(
                "absolute inset-y-0 left-0 flex w-[min(88vw,22rem)] flex-col overflow-hidden border-r border-border bg-background",
                "transition-transform duration-500 motion-reduce:transition-none",
                open ? "translate-x-0" : "-translate-x-full",
              )}
              style={{ transitionTimingFunction: EASE }}
            >
              <div className="flex items-center justify-between gap-3 border-b border-border px-4 py-3.5">
                <div className="contents" onClick={closeMenu}>
                  <Logo />
                </div>
                <button
                  type="button"
                  data-drawer-close
                  className="inline-flex size-10 items-center justify-center rounded-xl text-foreground transition-colors hover:bg-brand-soft hover:text-primary"
                  onClick={closeMenu}
                  aria-label="Close menu"
                >
                  <HamburgerIcon open />
                </button>
              </div>

              <div className="min-h-0 flex-1 space-y-6 overflow-y-auto px-4 py-4">
                <Reveal active={open} index={0}>
                  <div
                    onKeyDown={(event) => {
                      if (event.key === "Enter") closeMenu();
                    }}
                  >
                    <SearchBar />
                  </div>
                </Reveal>

                <Reveal active={open} index={1}>
                  <div className="overflow-hidden rounded-2xl border border-border">
                    <button
                      type="button"
                      className="flex w-full items-center gap-3 px-3 py-3 text-left text-sm font-semibold transition-colors hover:bg-muted"
                      aria-expanded={categoriesOpen}
                      aria-controls={categoriesId}
                      onClick={() => setCategoriesOpen((current) => !current)}
                    >
                      <span className={iconWellClass}>
                        <LayoutGrid className="size-4" />
                      </span>
                      <span className="min-w-0 flex-1">Categories</span>
                      <ChevronDown
                        className={cn(
                          "size-4 shrink-0 text-muted-foreground transition-transform duration-300 motion-reduce:transition-none",
                          categoriesOpen && "rotate-180",
                        )}
                        style={{ transitionTimingFunction: EASE }}
                      />
                    </button>
                    <div
                      id={categoriesId}
                      className={cn(
                        "grid transition-[grid-template-rows] duration-300 motion-reduce:transition-none",
                        categoriesOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
                      )}
                      style={{ transitionTimingFunction: EASE }}
                    >
                      <div
                        className="overflow-hidden"
                        inert={categoriesOpen ? undefined : true}
                      >
                        <ul
                          className={cn(
                            "border-t border-border transition-transform duration-300 motion-reduce:translate-y-0 motion-reduce:transition-none",
                            categoriesOpen ? "translate-y-0" : "-translate-y-3",
                          )}
                          style={{ transitionTimingFunction: EASE }}
                        >
                          <li>
                            <Link
                              href="/categories"
                              className="flex items-center gap-3 px-3 py-2.5 text-sm font-medium transition-colors hover:bg-muted hover:text-primary"
                              onClick={closeMenu}
                            >
                              <span className={iconWellClass}>
                                <LayoutGrid className="size-4" />
                              </span>
                              <span className="min-w-0 flex-1">
                                All categories
                              </span>
                              <ChevronRight className="size-4 shrink-0 text-muted-foreground" />
                            </Link>
                          </li>
                          {CATEGORY_LINKS.map((item) => {
                            const Icon =
                              CATEGORY_ICONS[item.slug] ?? LayoutGrid;

                            return (
                              <li
                                key={item.href}
                                className="border-t border-border"
                              >
                                <Link
                                  href={item.href}
                                  className="flex items-center gap-3 px-3 py-2.5 text-sm transition-colors hover:bg-muted hover:text-primary"
                                  onClick={closeMenu}
                                >
                                  <span className={iconWellClass}>
                                    <Icon className="size-4" />
                                  </span>
                                  <span className="min-w-0 flex-1">
                                    {item.label}
                                  </span>
                                  <ChevronRight className="size-4 shrink-0 text-muted-foreground" />
                                </Link>
                              </li>
                            );
                          })}
                        </ul>
                      </div>
                    </div>
                  </div>
                </Reveal>

                <Reveal active={open} index={2}>
                  <ul className="overflow-hidden rounded-2xl border border-border">
                    {SHORTCUTS.map(({ href, label, icon: Icon }) => (
                      <li
                        key={href}
                        className="border-t border-border first:border-t-0"
                      >
                        <Link
                          href={href}
                          className="flex items-center gap-3 px-3 py-3 text-sm font-medium transition-colors hover:bg-muted hover:text-primary"
                          onClick={closeMenu}
                        >
                          <span className={iconWellClass}>
                            <Icon className="size-4" />
                          </span>
                          <span className="min-w-0 flex-1">{label}</span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </Reveal>
              </div>

              <div className="flex shrink-0 items-center justify-between border-t border-border px-4 py-3">
                <p className="text-sm font-medium">Appearance</p>
                <ThemeToggle showLabel={false} />
              </div>

              <div className="shrink-0 border-t border-border bg-background px-4 py-3">
                <DrawerSessionButton onNavigate={closeMenu} />
              </div>
            </aside>
          </div>,
          document.body,
        )
      : null;

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        className="inline-flex size-10 shrink-0 items-center justify-center rounded-xl text-foreground transition-colors hover:bg-brand-soft hover:text-primary lg:hidden"
        onClick={() => (open ? closeMenu() : openMenu())}
        aria-expanded={open}
        aria-controls={panelId}
        aria-label={open ? "Close menu" : "Open menu"}
      >
        <HamburgerIcon open={open} />
      </button>
      {drawer}
    </>
  );
}
