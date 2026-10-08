import type {
  FieldError,
  FieldErrors,
  FieldValues,
  Resolver,
} from "react-hook-form";

import type { FieldErrors as ValidationErrors } from "./validation";

export function fieldErrorResolver<T extends FieldValues>(
  validate: (values: T) => ValidationErrors<Extract<keyof T, string>>,
): Resolver<T> {
  return (values) => {
    const result = validate(values);
    const errors: Record<string, FieldError> = {};

    for (const [name, message] of Object.entries(result)) {
      if (!message) continue;
      errors[name] = { type: "validation", message };
    }

    if (Object.keys(errors).length > 0) {
      return { values: {}, errors: errors as FieldErrors<T> };
    }

    return { values, errors: {} };
  };
}
