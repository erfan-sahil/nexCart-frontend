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

const WAVE_BACK =
  "M0,70 C240,-10 240,150 480,70 C720,-10 720,150 960,70 C1200,-10 1200,150 1440,70 C1680,-10 1680,150 1920,70 C2160,-10 2160,150 2400,70 C2640,-10 2640,150 2880,70 L2880,320 L0,320 Z";

const WAVE_FRONT =
  "M0,120 C240,190 240,40 480,120 C720,190 720,40 960,120 C1200,190 1200,40 1440,120 C1680,190 1680,40 1920,120 C2160,190 2160,40 2400,120 C2640,190 2640,40 2880,120 L2880,320 L0,320 Z";

export default function AuthLayout({ children }: LayoutProps<"/">) {
  return (
    <div className="grid min-h-svh flex-1 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)]">
      <aside className="auth-wave-panel relative hidden overflow-hidden text-white lg:flex lg:flex-col lg:justify-between lg:px-12 lg:py-10">
        <div aria-hidden className="auth-wave-rise pointer-events-none">
          <svg
            className="auth-wave auth-wave-back"
            viewBox="0 0 2880 320"
            preserveAspectRatio="none"
          >
            <path fill="#ffb088" d={WAVE_BACK} />
          </svg>
          <svg
            className="auth-wave auth-wave-front"
            viewBox="0 0 2880 320"
            preserveAspectRatio="none"
          >
            <path fill="var(--brand)" d={WAVE_FRONT} />
          </svg>
          <div className="auth-wave-body" />
        </div>
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
