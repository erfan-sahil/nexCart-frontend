import { ShieldCheck, Store, Truck } from "lucide-react";

import { Logo, ThemeToggle } from "@/components/common";

const highlights = [
  {
    icon: Store,
    title: "Thousands of independent stores",
    description: "One account for every seller on the marketplace.",
  },
  {
    icon: Truck,
    title: "Orders in one place",
    description: "Track deliveries, returns, and wishlists together.",
  },
  {
    icon: ShieldCheck,
    title: "Secure sign-in",
    description: "Your session stays on this device until you sign out.",
  },
] as const;

export default function AuthLayout({ children }: LayoutProps<"/">) {
  return (
    <div className="grid min-h-svh flex-1 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)]">
      <aside className="relative hidden overflow-hidden bg-surface-dark text-white lg:flex lg:flex-col lg:justify-between lg:px-12 lg:py-10">
        <div
          aria-hidden
          className="pointer-events-none absolute -top-24 -left-16 size-72 rounded-full bg-primary/30 blur-3xl motion-safe:animate-auth-orb"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute right-0 bottom-0 size-80 rounded-full bg-primary/20 blur-3xl motion-safe:animate-auth-orb-alt"
        />
        <Logo variant="on-dark" priority className="relative" />
        <div className="relative max-w-md space-y-8">
          <div className="space-y-3">
            <p className="text-sm font-medium tracking-wide text-white/70 uppercase">
              NexCart
            </p>
            <p className="text-4xl leading-tight font-semibold tracking-tight">
              Shop from stores you can actually find.
            </p>
          </div>
          <ul className="space-y-5">
            {highlights.map(({ icon: Icon, title, description }) => (
              <li key={title} className="flex gap-3">
                <span className="mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-lg bg-white/10">
                  <Icon className="size-4" />
                </span>
                <span>
                  <span className="block text-sm font-medium">{title}</span>
                  <span className="mt-1 block text-sm text-white/65">
                    {description}
                  </span>
                </span>
              </li>
            ))}
          </ul>
        </div>
        <p className="relative text-sm text-white/50">
          Independent sellers. Everyday essentials. One checkout.
        </p>
      </aside>

      <div className="flex min-h-svh flex-col bg-background">
        <header className="flex items-center justify-between px-4 py-4 sm:px-8">
          <Logo priority className="lg:invisible" />
          <ThemeToggle showLabel={false} />
        </header>
        <div className="flex flex-1 items-center justify-center px-4 py-8 sm:px-8">
          <div className="w-full max-w-md">{children}</div>
        </div>
      </div>
    </div>
  );
}
