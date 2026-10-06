import { ApiError } from "@/lib/api/errors";

import type { FieldErrors } from "./validation";

const knownFields = new Set([
  "email",
  "password",
  "firstName",
  "lastName",
  "phone",
]);

function assignField<T extends string>(
  fields: FieldErrors<T>,
  path: string,
  message: string,
) {
  if (knownFields.has(path)) {
    fields[path as T] = message;
  }
}

export function splitApiError<T extends string>(error: ApiError) {
  const fields: FieldErrors<T> = {};

  for (const issue of error.fields ?? []) {
    assignField(fields, issue.path, issue.message);
  }

  const message = error.message.toLowerCase();

  if (error.code === "CONFLICT" && message.includes("email")) {
    assignField(fields, "email", error.message);
  }

  if (error.code === "CONFLICT" && message.includes("phone")) {
    assignField(fields, "phone", error.message);
  }

  const mappedConflict =
    error.code === "CONFLICT" && ("email" in fields || "phone" in fields);
  const form =
    error.code === "VALIDATION_ERROR" || mappedConflict
      ? undefined
      : error.message;

  return { fields, form };
}
