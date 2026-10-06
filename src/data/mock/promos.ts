import type { PromoSlot } from "@/types";

export const newArrivalsPromo: PromoSlot = {
  id: "promo-new-arrivals",
  eyebrow: "Sponsored",
  title: "Linen, just dropped",
  subtitle: "Washed throws from Loft & Linen. Limited first run.",
  ctaLabel: "Shop this drop",
  href: "/products/linen-throw-set",
  image:
    "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=900&q=80",
  productName: "Washed Linen Throw Set",
  price: 64,
  originalPrice: 96,
};

export const topSellingPromo: PromoSlot = {
  id: "promo-top-selling",
  eyebrow: "Sponsored",
  title: "Silence the noise",
  subtitle: "Pulse ANC headphones, still the week's top seller.",
  ctaLabel: "Grab the deal",
  href: "/products/pulse-anc-headphones",
  image:
    "https://images.unsplash.com/photo-1484704849700-f032a568e944?auto=format&fit=crop&w=900&q=80",
  productName: "Pulse ANC Wireless Headphones",
  price: 129,
  originalPrice: 199,
};
