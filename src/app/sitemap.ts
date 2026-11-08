import type { MetadataRoute } from "next";

import { getSiteUrl } from "@/lib/site";

const staticRoutes = [
  "",
  "/products",
  "/stores",
  "/categories",
  "/deals",
  "/new-arrivals",
  "/sell",
  "/help",
  "/contact",
  "/returns",
  "/privacy",
  "/terms",
  "/cookies",
  "/login",
  "/register",
] as const;

export default function sitemap(): MetadataRoute.Sitemap {
  const base = getSiteUrl();
  const lastModified = new Date();

  return staticRoutes.map((path) => ({
    url: `${base}${path}`,
    lastModified,
    changeFrequency: path === "" ? "daily" : "weekly",
    priority: path === "" ? 1 : path === "/products" ? 0.9 : 0.7,
  }));
}
