"use client";

import {
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
  useSyncExternalStore,
  type ReactNode,
} from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BookOpen,
  Car,
  CloseCircle,
  Cpu,
  Dumbbell,
  Heart,
  HelpCircle,
  Home,
  HamburgerMenu,
  LayoutGrid,
  MapPin,
  Package,
  RoundAltArrowDown,
  RoundAltArrowRight,
  Shirt,
  ShoppingBag,
  Sparkles,
  Store,
  UserRound,
  UtensilsCrossed,
  type AppIcon,
} from "@/lib/icons";

import { Logo, ThemeToggle } from "@/components/common";
import type { CategoryNavLink } from "./category-nav";
import { DrawerSessionButton } from "@/features/auth/components/account-menu";
import { useCartItemCount } from "@/features/cart";
import { useWishlistCount } from "@/features/wishlist";
import {
  isSearchInteractionActive,
  subscribeSearchInteraction,
} from "@/components/search/search-interaction";
import { cn } from "@/lib/utils";

import { SearchBar } from "./search-bar";

const CLOSE_MS = 460;

const CATEGORY_ICONS: Record<string, AppIcon> = {
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

function MenuToggleIcon({ open }: { open: boolean }) {
  const layer =
    "absolute inset-0 size-6 transition-all duration-300 ease-out motion-reduce:transition-none";

  return (
    <span className="relative block size-6" aria-hidden>
      <HamburgerMenu
        weight="line-duotone"
        className={cn(
          layer,
          open
            ? "scale-50 -rotate-90 opacity-0"
            : "scale-100 rotate-0 opacity-100",
        )}
      />
      <CloseCircle
        weight="line-duotone"
        className={cn(
          layer,
          open
            ? "scale-100 rotate-0 opacity-100"
            : "scale-50 rotate-90 opacity-0",
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

export function MobileNav({ categories }: { categories: CategoryNavLink[] }) {
  const pathname = usePathname();
  const cartCount = useCartItemCount();
  const wishlistCount = useWishlistCount();
  const panelId = useId();
  const triggerRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLElement>(null);
  const wasOpen = useRef(false);
  const drawerOpenRef = useRef(false);
  const closeTimer = useRef<number | null>(null);
  const openFrame = useRef<number | null>(null);
  const categoriesId = useId();
  const [open, setOpen] = useState(false);
  const [present, setPresent] = useState(false);
  const [categoriesOpen, setCategoriesOpen] = useState(false);
  const [trackedPath, setTrackedPath] = useState(pathname);
  const searchActive = useSyncExternalStore(
    subscribeSearchInteraction,
    isSearchInteractionActive,
    () => false,
  );

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
      if (event.key !== "Escape") return;
      if (searchActive) return;
      closeMenu();
    }

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open, closeMenu, searchActive]);

  useEffect(() => {
    if (open && !drawerOpenRef.current) {
      drawerOpenRef.current = true;
      wasOpen.current = true;
      if (!searchActive) {
        panelRef.current
          ?.querySelector<HTMLElement>("[data-drawer-close]")
          ?.focus();
      }
      return;
    }

    if (!open) {
      drawerOpenRef.current = false;
    }

    if (wasOpen.current && !present) {
      wasOpen.current = false;
      if (!searchActive) {
        triggerRef.current?.focus();
      }
    }
  }, [open, present, searchActive]);

  useEffect(() => {
    if (!open || searchActive) return;
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
  }, [open, searchActive]);

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
                  <MenuToggleIcon open />
                </button>
              </div>

              <div className="relative z-50 shrink-0 border-b border-border bg-background px-4 py-4">
                <Reveal active={open} index={0}>
                  <SearchBar inDrawer />
                </Reveal>
              </div>

              <div className="min-h-0 flex-1 space-y-6 overflow-y-auto px-4 py-4">
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
                      <RoundAltArrowDown
                        weight="line-duotone"
                        className={cn(
                          "size-5 shrink-0 text-muted-foreground transition-transform duration-300 motion-reduce:transition-none",
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
                              <RoundAltArrowRight
                                weight="line-duotone"
                                className="size-5 shrink-0 text-muted-foreground"
                              />
                            </Link>
                          </li>
                          {categories.map((item) => {
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
                                  <RoundAltArrowRight
                                    weight="line-duotone"
                                    className="size-5 shrink-0 text-muted-foreground"
                                  />
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
                          {href === "/cart" && cartCount > 0 ? (
                            <span className="inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1.5 text-[11px] font-semibold text-[#fff4f2]">
                              {cartCount > 9 ? "9+" : cartCount}
                            </span>
                          ) : null}
                          {href === "/wishlist" && wishlistCount > 0 ? (
                            <span className="inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1.5 text-[11px] font-semibold text-[#fff4f2]">
                              {wishlistCount > 9 ? "9+" : wishlistCount}
                            </span>
                          ) : null}
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
        <MenuToggleIcon open={open} />
      </button>
      {drawer}
    </>
  );
}
