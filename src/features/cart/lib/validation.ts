import type { FieldError, FieldErrors, Resolver } from "react-hook-form";

import type { CheckoutValues } from "../types";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const emptyCheckout: CheckoutValues = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  line1: "",
  city: "",
  region: "",
  postalCode: "",
  country: "Bangladesh",
  paymentMethod: "prepaid",
  note: "",
};

type CheckoutErrors = Partial<Record<keyof CheckoutValues, string>>;

function required(value: string, message: string) {
  return value.trim() ? undefined : message;
}

const BD_PHONE_PATTERN = /^01[3-9]\d{8}$/;

export function validateCheckout(values: CheckoutValues): CheckoutErrors {
  const errors: CheckoutErrors = {};

  errors.firstName = required(values.firstName, "Enter your first name");
  errors.lastName = required(values.lastName, "Enter your last name");

  const email = values.email.trim();
  if (!email) errors.email = "Enter your email address";
  else if (!EMAIL_PATTERN.test(email)) errors.email = "Enter a valid email";

  const phone = values.phone.replace(/\D/g, "");
  if (!BD_PHONE_PATTERN.test(phone)) {
    errors.phone = "Enter an 11-digit Bangladesh mobile number";
  }

  errors.line1 = required(values.line1, "Enter a street address");
  errors.city = required(values.city, "Enter a city");
  errors.region = required(values.region, "Enter a state or division");

  const postal = values.postalCode.trim();
  if (postal.length < 3) errors.postalCode = "Enter a postal code";

  errors.country = required(values.country, "Enter a country");

  return Object.fromEntries(
    Object.entries(errors).filter((entry) => entry[1]),
  ) as CheckoutErrors;
}

export function checkoutResolver(): Resolver<CheckoutValues> {
  return (values) => {
    const result = validateCheckout(values);
    const errors: Record<string, FieldError> = {};

    for (const [name, message] of Object.entries(result)) {
      if (!message) continue;
      errors[name] = { type: "validation", message };
    }

    if (Object.keys(errors).length > 0) {
      return { values: {}, errors: errors as FieldErrors<CheckoutValues> };
    }

    return { values, errors: {} };
  };
}

export function newIdempotencyKey() {
  return crypto.randomUUID();
}
