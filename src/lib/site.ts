/** Shared site identity and SEO defaults for NexCart. */
export const siteConfig = {
  name: "NexCart",
  title: "NexCart — Shop Independent Stores, Flash Deals & More",
  description:
    "NexCart is a multi-vendor marketplace for independent stores. Discover trending products, limited-time flash deals, fast delivery, and verified sellers—or open your own store.",
  keywords: [
    "NexCart",
    "online marketplace",
    "multi-vendor ecommerce",
    "independent stores",
    "flash deals",
    "online shopping",
    "fast delivery",
    "sell online",
  ],
  brandColor: "#ff4d4d",
  /** Full logo for Open Graph / social previews. */
  logoPath: "/brand/nexcart-logo.png",
  /** Square, letterboxed mark for favicons and app icons. */
  faviconPath: "/brand/nexcart-favicon.png",
} as const;

export function getSiteUrl(): string {
  const fromEnv = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "");
  if (fromEnv) return fromEnv;

  const vercel = process.env.VERCEL_URL;
  if (vercel) return `https://${vercel}`;

  return "http://localhost:3000";
}
