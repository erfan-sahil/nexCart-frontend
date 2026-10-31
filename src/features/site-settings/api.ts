import { api } from "@/lib/api/client";
import { serverGet } from "@/lib/api/server";
import type { ApiSuccess } from "@/lib/api/types";

import { DEFAULT_SITE_SETTINGS, type SiteSettings } from "./types";

export async function getSiteSettings() {
  try {
    const body = await serverGet<SiteSettings>("/site-settings", undefined, {
      revalidate: 60,
    });
    return body.data ?? DEFAULT_SITE_SETTINGS;
  } catch {
    return DEFAULT_SITE_SETTINGS;
  }
}

export async function fetchSiteSettings() {
  try {
    const { data } = await api.get<ApiSuccess<SiteSettings>>("/site-settings");
    return data.data;
  } catch {
    return DEFAULT_SITE_SETTINGS;
  }
}
