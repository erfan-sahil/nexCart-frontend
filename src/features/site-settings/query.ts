"use client";

import { useQuery } from "@tanstack/react-query";

import { fetchSiteSettings } from "./api";
import { DEFAULT_SITE_SETTINGS } from "./types";

export const siteSettingsQueryKey = ["site-settings"] as const;

export function useSiteSettings() {
  return useQuery({
    queryKey: siteSettingsQueryKey,
    queryFn: fetchSiteSettings,
    staleTime: 60_000,
    placeholderData: DEFAULT_SITE_SETTINGS,
  });
}
