import type { MetadataRoute } from "next";

import { getSiteUrl, siteConfig } from "@/lib/site";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: siteConfig.title,
    short_name: siteConfig.name,
    description: siteConfig.description,
    start_url: "/",
    scope: "/",
    id: getSiteUrl(),
    display: "standalone",
    background_color: "#ffffff",
    theme_color: siteConfig.brandColor,
    lang: "en",
    icons: [
      {
        src: siteConfig.faviconPath,
        sizes: "any",
        type: "image/png",
        purpose: "any",
      },
    ],
  };
}
