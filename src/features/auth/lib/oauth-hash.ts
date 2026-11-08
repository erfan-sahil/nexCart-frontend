import { useAuthStore } from "../store";

/**
 * Capture tokens from Google OAuth redirect hash
 * (`#accessToken=...&sessionId=...&expiresIn=...`) and strip them from the URL.
 */
export function hydrateAuthFromHash(): boolean {
  if (typeof window === "undefined") {
    return false;
  }

  const hash = window.location.hash.replace(/^#/, "");

  if (!hash) {
    return false;
  }

  const params = new URLSearchParams(hash);
  const accessToken = params.get("accessToken");
  const sessionId = params.get("sessionId");
  const expiresInRaw = params.get("expiresIn");
  const expiresIn = expiresInRaw ? Number(expiresInRaw) : NaN;

  if (
    !accessToken ||
    !sessionId ||
    !Number.isFinite(expiresIn) ||
    expiresIn <= 0
  ) {
    return false;
  }

  useAuthStore.setState({
    accessToken,
    sessionId,
    expiresAt: Date.now() + expiresIn * 1000,
    status: "loading",
  });

  const { pathname, search } = window.location;
  window.history.replaceState(null, "", `${pathname}${search}`);

  return true;
}
