import type { AuthUser } from "@/features/auth/types";

import type {
  Address,
  AddressInput,
  ApplicationStatus,
  BusinessType,
  DocumentType,
  SaveVendorApplicationPayload,
  VendorApplication,
} from "../types";

export type FieldErrors = Record<string, string>;

export type FormValues = {
  personal: {
    fullName: string;
    email: string;
    phone: string;
    dateOfBirth: string;
    address: Address;
  };
  identity: {
    documentType: DocumentType | "";
    documentNumber: string;
    documentImages: string[];
    selfieUrl: string;
  };
  business: {
    storeName: string;
    businessType: BusinessType | "";
    address: Address;
    tradeLicenseNumber: string;
    tradeLicenseUrl: string;
    taxId: string;
    taxDocumentUrl: string;
  };
  selling: {
    categoryIds: string[];
    description: string;
  };
};

export const STEPS = [
  { id: "personal", label: "About you" },
  { id: "identity", label: "Identity" },
  { id: "business", label: "Store" },
  { id: "selling", label: "What you sell" },
  { id: "review", label: "Review" },
] as const;

const emptyAddress = (): Address => ({
  line1: "",
  line2: "",
  city: "",
  state: "",
  postalCode: "",
  country: "",
});

export function emptyForm(user?: AuthUser | null): FormValues {
  return {
    personal: {
      fullName: user ? `${user.firstName} ${user.lastName}`.trim() : "",
      email: user?.email ?? "",
      phone: user?.phone ?? "",
      dateOfBirth: "",
      address: emptyAddress(),
    },
    identity: {
      documentType: "",
      documentNumber: "",
      documentImages: [""],
      selfieUrl: "",
    },
    business: {
      storeName: "",
      businessType: "",
      address: emptyAddress(),
      tradeLicenseNumber: "",
      tradeLicenseUrl: "",
      taxId: "",
      taxDocumentUrl: "",
    },
    selling: {
      categoryIds: [],
      description: "",
    },
  };
}

export function formFromApplication(
  application: VendorApplication | null,
  user?: AuthUser | null,
): FormValues {
  const base = emptyForm(user);

  if (!application) return base;

  return {
    personal: {
      fullName: application.personal.fullName || base.personal.fullName,
      email: application.personal.email || base.personal.email,
      phone: application.personal.phone || base.personal.phone,
      dateOfBirth: application.personal.dateOfBirth ?? "",
      address: { ...application.personal.address },
    },
    identity: {
      documentType: application.identity.documentType ?? "",
      documentNumber: application.identity.documentNumber,
      documentImages:
        application.identity.documentImages.length > 0
          ? [...application.identity.documentImages]
          : [""],
      selfieUrl: application.identity.selfieUrl,
    },
    business: {
      storeName: application.business.storeName,
      businessType: application.business.businessType ?? "",
      address: { ...application.business.address },
      tradeLicenseNumber: application.business.tradeLicense?.number ?? "",
      tradeLicenseUrl: application.business.tradeLicense?.documentUrl ?? "",
      taxId: application.business.tax?.taxId ?? "",
      taxDocumentUrl: application.business.tax?.documentUrl ?? "",
    },
    selling: {
      categoryIds: [...application.selling.categoryIds],
      description: application.selling.description,
    },
  };
}

export function isEditableStatus(status: ApplicationStatus | null) {
  return (
    status === null ||
    status === "draft" ||
    status === "more_info_required" ||
    status === "rejected"
  );
}

export function statusLabel(status: ApplicationStatus) {
  switch (status) {
    case "draft":
      return "Draft";
    case "submitted":
      return "Submitted";
    case "under_review":
      return "Under review";
    case "more_info_required":
      return "More information needed";
    case "approved":
      return "Approved";
    case "rejected":
      return "Not approved";
  }
}

function isHttpUrl(value: string) {
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

function dateError(value: string) {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);

  if (!match) return "Use a real date";

  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  const date = new Date(Date.UTC(year, month - 1, day));

  if (
    date.getUTCFullYear() !== year ||
    date.getUTCMonth() !== month - 1 ||
    date.getUTCDate() !== day ||
    year < 1900
  ) {
    return "Date of birth is not a real date";
  }

  const today = new Date();
  const todayUtc = Date.UTC(
    today.getUTCFullYear(),
    today.getUTCMonth(),
    today.getUTCDate(),
  );
  const adultOn = Date.UTC(year + 18, month - 1, day);

  if (adultOn > todayUtc) return "You must be at least 18 years old";

  return null;
}

function textError(value: string, label: string, min: number, max: number) {
  if (value.length < min) return `${label} must be at least ${min} characters`;
  if (value.length > max) return `${label} must be at most ${max} characters`;
  return null;
}

function assignText(
  errors: FieldErrors,
  payload: AddressInput,
  key: keyof Address,
  value: string,
  label: string,
  path: string,
  required: boolean,
) {
  const trimmed = (value ?? "").trim();

  if (!trimmed) {
    if (required) errors[path] = `${label} is required`;
    return;
  }

  const min = key === "line2" ? 0 : 2;
  const max =
    key === "postalCode" ? 20 : key === "line1" || key === "line2" ? 160 : 80;
  const message =
    min > 0
      ? textError(trimmed, label, min, max)
      : trimmed.length > max
        ? `${label} must be at most ${max} characters`
        : null;

  if (message) {
    errors[path] = message;
    return;
  }

  payload[key] = trimmed;
}

function addressPayload(
  address: Address,
  prefix: string,
  errors: FieldErrors,
  required: boolean,
) {
  const payload: AddressInput = {};
  const fields: Array<[keyof Address, string]> = [
    ["line1", "Address line"],
    ["line2", "Address line 2"],
    ["city", "City"],
    ["state", "State"],
    ["postalCode", "Postal code"],
    ["country", "Country"],
  ];

  for (const [key, label] of fields) {
    assignText(
      errors,
      payload,
      key,
      address[key],
      label,
      `${prefix}.${key}`,
      required && key !== "line2",
    );
  }

  return Object.keys(payload).length > 0 ? payload : undefined;
}

function personalPayload(
  values: FormValues,
  errors: FieldErrors,
  required: boolean,
) {
  const personal: NonNullable<SaveVendorApplicationPayload["personal"]> = {};
  const fullName = values.personal.fullName.trim();
  const email = values.personal.email.trim().toLowerCase();
  const phone = values.personal.phone.trim();
  const dateOfBirth = values.personal.dateOfBirth;

  if (!fullName) {
    if (required) errors["personal.fullName"] = "Full name is required";
  } else {
    const message = textError(fullName, "Full name", 2, 120);
    if (message) errors["personal.fullName"] = message;
    else personal.fullName = fullName;
  }

  if (!email) {
    if (required) errors["personal.email"] = "Email is required";
  } else if (email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    errors["personal.email"] = "Enter a valid email address";
  } else {
    personal.email = email;
  }

  if (!phone) {
    if (required) errors["personal.phone"] = "Phone is required";
  } else if (!/^\+[1-9]\d{7,14}$/.test(phone)) {
    errors["personal.phone"] =
      "Phone must be in international format, for example +8801712345678";
  } else {
    personal.phone = phone;
  }

  if (!dateOfBirth) {
    if (required) errors["personal.dateOfBirth"] = "Date of birth is required";
  } else {
    const message = dateError(dateOfBirth);
    if (message) errors["personal.dateOfBirth"] = message;
    else personal.dateOfBirth = dateOfBirth;
  }

  const address = addressPayload(
    values.personal.address,
    "personal.address",
    errors,
    required,
  );

  if (address) personal.address = address;

  return Object.keys(personal).length > 0 ? personal : undefined;
}

function identityPayload(
  values: FormValues,
  errors: FieldErrors,
  required: boolean,
) {
  const identity: NonNullable<SaveVendorApplicationPayload["identity"]> = {};
  const documentNumber = values.identity.documentNumber.trim();
  const images = (values.identity.documentImages ?? [])
    .map((image) => image.trim())
    .filter(Boolean);
  const selfieUrl = values.identity.selfieUrl.trim();

  if (!values.identity.documentType) {
    if (required) {
      errors["identity.documentType"] = "Identity document type is required";
    }
  } else {
    identity.documentType = values.identity.documentType;
  }

  if (!documentNumber) {
    if (required) {
      errors["identity.documentNumber"] =
        "Identity document number is required";
    }
  } else if (!/^[A-Za-z0-9-]{4,32}$/.test(documentNumber)) {
    errors["identity.documentNumber"] =
      "Use 4–32 letters, numbers, and hyphens only";
  } else {
    identity.documentNumber = documentNumber;
  }

  if (images.length > 4) {
    errors["identity.documentImages"] = "Add up to 4 document images";
  } else {
    const invalid = images.find((image) => !isHttpUrl(image));

    if (invalid) {
      errors["identity.documentImages"] = "Each image must be an http(s) URL";
    } else if (images.length === 0) {
      if (required) {
        errors["identity.documentImages"] =
          "At least one identity document image is required";
      }
    } else {
      identity.documentImages = images;
    }
  }

  if (selfieUrl) {
    if (!isHttpUrl(selfieUrl)) {
      errors["identity.selfieUrl"] = "Selfie must be an http(s) URL";
    } else {
      identity.selfieUrl = selfieUrl;
    }
  }

  return Object.keys(identity).length > 0 ? identity : undefined;
}

function businessPayload(
  values: FormValues,
  errors: FieldErrors,
  required: boolean,
) {
  const business: NonNullable<SaveVendorApplicationPayload["business"]> = {};
  const storeName = values.business.storeName.trim();
  const licenseNumber = values.business.tradeLicenseNumber.trim();
  const licenseUrl = values.business.tradeLicenseUrl.trim();
  const taxId = values.business.taxId.trim();
  const taxUrl = values.business.taxDocumentUrl.trim();

  if (!storeName) {
    if (required) errors["business.storeName"] = "Store name is required";
  } else {
    const message = textError(storeName, "Store name", 2, 120);
    if (message) errors["business.storeName"] = message;
    else business.storeName = storeName;
  }

  if (!values.business.businessType) {
    if (required) errors["business.businessType"] = "Business type is required";
  } else {
    business.businessType = values.business.businessType;
  }

  const address = addressPayload(
    values.business.address,
    "business.address",
    errors,
    required,
  );

  if (address) business.address = address;

  if (licenseNumber.length > 64) {
    errors["business.tradeLicense.number"] =
      "License number must be at most 64 characters";
  } else if (licenseUrl && !isHttpUrl(licenseUrl)) {
    errors["business.tradeLicense.documentUrl"] =
      "License document must be an http(s) URL";
  } else if (licenseNumber || licenseUrl) {
    business.tradeLicense = {
      ...(licenseNumber ? { number: licenseNumber } : {}),
      ...(licenseUrl ? { documentUrl: licenseUrl } : {}),
    };
  }

  if (taxId.length > 64) {
    errors["business.tax.taxId"] = "Tax ID must be at most 64 characters";
  } else if (taxUrl && !isHttpUrl(taxUrl)) {
    errors["business.tax.documentUrl"] = "Tax document must be an http(s) URL";
  } else if (taxId || taxUrl) {
    business.tax = {
      ...(taxId ? { taxId } : {}),
      ...(taxUrl ? { documentUrl: taxUrl } : {}),
    };
  }

  return Object.keys(business).length > 0 ? business : undefined;
}

function sellingPayload(
  values: FormValues,
  errors: FieldErrors,
  required: boolean,
) {
  const selling: NonNullable<SaveVendorApplicationPayload["selling"]> = {};
  const description = (values.selling.description ?? "").trim();
  const categoryIds = values.selling.categoryIds ?? [];

  if (categoryIds.length > 20) {
    errors["selling.categoryIds"] = "Select up to 20 categories";
  } else if (categoryIds.length === 0) {
    if (required) {
      errors["selling.categoryIds"] =
        "Select at least one category you want to sell";
    }
  } else {
    selling.categoryIds = categoryIds;
  }

  if (!description) {
    if (required) {
      errors["selling.description"] =
        "Business description must be at least 20 characters";
    }
  } else if (description.length > 2000) {
    errors["selling.description"] =
      "Description must be at most 2000 characters";
  } else if (required && description.length < 20) {
    errors["selling.description"] =
      "Business description must be at least 20 characters";
  } else {
    selling.description = description;
  }

  return Object.keys(selling).length > 0 ? selling : undefined;
}

export function validateStep(values: FormValues, step: number) {
  const errors: FieldErrors = {};

  if (step === 0) personalPayload(values, errors, true);
  if (step === 1) identityPayload(values, errors, true);
  if (step === 2) businessPayload(values, errors, true);
  if (step === 3) sellingPayload(values, errors, true);
  if (step === 4) {
    personalPayload(values, errors, true);
    identityPayload(values, errors, true);
    businessPayload(values, errors, true);
    sellingPayload(values, errors, true);
  }

  return errors;
}

export function draftPayload(values: FormValues) {
  const errors: FieldErrors = {};
  const payload: SaveVendorApplicationPayload = {};
  const personal = personalPayload(values, errors, false);
  const identity = identityPayload(values, errors, false);
  const business = businessPayload(values, errors, false);
  const selling = sellingPayload(values, errors, false);

  if (personal) payload.personal = personal;
  if (identity) payload.identity = identity;
  if (business) payload.business = business;
  if (selling) payload.selling = selling;

  return { payload, errors };
}

export function submitPayload(values: FormValues) {
  const errors = validateStep(values, 4);
  const { payload } = draftPayload(values);

  return { payload, errors };
}

export function stepForPath(path: string) {
  if (path.startsWith("personal")) return 0;
  if (path.startsWith("identity")) return 1;
  if (path.startsWith("business")) return 2;
  if (path.startsWith("selling")) return 3;
  return 4;
}
