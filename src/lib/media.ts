const apiBase = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000/api";

function apiOrigin() {
  return apiBase.replace(/\/api\/?$/, "");
}

export function mediaUrl(url: string | null | undefined) {
  if (!url) return "";
  if (/^https?:\/\//i.test(url)) return url;
  return `${apiOrigin()}${url.startsWith("/") ? url : `/${url}`}`;
}
