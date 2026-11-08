import type { ReactNode } from "react";
import { Mail, MapPin, Phone, RotateCcw, Truck } from "lucide-react";

import type { StoreProfile } from "@/features/catalog";

type StoreDetailsProps = {
  store: StoreProfile;
};

type DetailItem = {
  key: string;
  title: string;
  icon: ReactNode;
  content: ReactNode;
};

const linkClass = "font-medium text-foreground hover:text-primary";

export function StoreDetails({ store }: StoreDetailsProps) {
  const hasContact = Boolean(store.address || store.email || store.phone);

  const items: DetailItem[] = [
    hasContact
      ? {
          key: "contact",
          title: "Contact",
          icon: <MapPin className="size-4" />,
          content: (
            <ul className="space-y-2">
              {store.address ? <li>{store.address}</li> : null}
              {store.email ? (
                <li className="flex items-center gap-2">
                  <Mail className="size-3.5 shrink-0" />
                  <a href={`mailto:${store.email}`} className={linkClass}>
                    {store.email}
                  </a>
                </li>
              ) : null}
              {store.phone ? (
                <li className="flex items-center gap-2">
                  <Phone className="size-3.5 shrink-0" />
                  <a href={`tel:${store.phone}`} className={linkClass}>
                    {store.phone}
                  </a>
                </li>
              ) : null}
            </ul>
          ),
        }
      : null,
    store.shippingPolicy
      ? {
          key: "shipping",
          title: "Shipping",
          icon: <Truck className="size-4" />,
          content: (
            <p className="whitespace-pre-line">{store.shippingPolicy}</p>
          ),
        }
      : null,
    store.returnPolicy
      ? {
          key: "returns",
          title: "Returns",
          icon: <RotateCcw className="size-4" />,
          content: <p className="whitespace-pre-line">{store.returnPolicy}</p>,
        }
      : null,
  ].filter((item) => item !== null);

  if (items.length === 0) return null;

  return (
    <section
      aria-label="Store information"
      className="mt-4 grid divide-y divide-border rounded-2xl border border-border bg-card md:grid-cols-[repeat(auto-fit,minmax(14rem,1fr))] md:divide-x md:divide-y-0"
    >
      {items.map((item) => (
        <div key={item.key} className="p-5">
          <h2 className="flex items-center gap-2 font-display text-base font-semibold">
            <span className="text-primary">{item.icon}</span>
            {item.title}
          </h2>
          <div className="mt-3 text-sm leading-6 text-muted-foreground">
            {item.content}
          </div>
        </div>
      ))}
    </section>
  );
}
