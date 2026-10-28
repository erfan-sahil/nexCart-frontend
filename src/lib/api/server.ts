import { ApiError } from "./errors";
import type { ApiErrorBody, ApiSuccess } from "./types";

const apiBase = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000/api";

type QueryValue = string | number | boolean | undefined;

export async function serverGet<T>(
  path: string,
  params?: Record<string, QueryValue>,
  init?: { revalidate?: number },
) {
  const url = new URL(`${apiBase}${path}`);

  for (const [key, value] of Object.entries(params ?? {})) {
    if (value === undefined || value === "") continue;
    url.searchParams.set(key, String(value));
  }

  const response = await fetch(url, {
    ...(init?.revalidate
      ? { next: { revalidate: init.revalidate } }
      : { cache: "no-store" as const }),
  });

  const body = (await response.json().catch(() => null)) as
    ApiSuccess<T> | ApiErrorBody | null;

  if (!response.ok || !body || body.success !== true) {
    const errorBody: ApiErrorBody =
      body && body.success === false
        ? body
        : {
            success: false,
            message: "Could not load the catalog.",
            code: "REQUEST_FAILED",
          };

    throw new ApiError(response.status, errorBody);
  }

  return body;
}
