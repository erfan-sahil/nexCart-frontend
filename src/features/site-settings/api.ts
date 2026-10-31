import { api } from "@/lib/api/client";
import type { ApiSuccess } from "@/lib/api/types";

import { DEFAULT_SITE_SETTINGS, type SiteSettings } from "./types";

export async function fetchSiteSettings() {
  try {
    const { data } = await api.get<ApiSuccess<SiteSettings>>("/site-settings");
    return data.data;
  } catch {
    return DEFAULT_SITE_SETTINGS;
  }
}
