import type { HeroSlide } from "@/types";

export const heroSlides: HeroSlide[] = [
  {
    id: "h1",
    eyebrow: "Multi-vendor marketplace",
    title: "Everything you need, shipped from stores you trust.",
    subtitle:
      "Thousands of independent sellers. One fast checkout. Deals that actually move.",
    ctaLabel: "Shop today's deals",
    href: "/deals",
    image:
      "https://images.unsplash.com/photo-1567401893414-76b7b1e5a7a5?auto=format&fit=crop&w=1600&q=80",
  },
  {
    id: "h2",
    eyebrow: "Electronics week",
    title: "Pro gear from specialist vendors, up to 40% off.",
    subtitle: "Headphones, cameras, and studio kits from verified tech stores.",
    ctaLabel: "Browse electronics",
    href: "/products?category=electronics",
    image:
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=1400&q=80",
  },
  {
    id: "h3",
    eyebrow: "New season",
    title: "Fresh drops from independent fashion houses.",
    subtitle:
      "Limited runs, real makers, and styles you will not find in a big-box feed.",
    ctaLabel: "Explore fashion",
    href: "/products?category=fashion",
    image:
      "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1400&q=80",
  },
];
