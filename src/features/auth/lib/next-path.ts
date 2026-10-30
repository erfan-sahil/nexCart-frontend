export function safeNextPath(value: string | null | undefined) {
  if (!value || value === "/") return "/";

  if (
    !value.startsWith("/") ||
    value.startsWith("//") ||
    value.includes("\\") ||
    value.includes("://") ||
    /[\u0000-\u001F\u007F]/.test(value)
  ) {
    return "/";
  }

  return value;
}

export function withNext(path: string, nextPath: string) {
  if (nextPath === "/") return path;
  return `${path}?next=${encodeURIComponent(nextPath)}`;
}
