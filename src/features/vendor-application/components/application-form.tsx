"use client";

import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { Button } from "@/components/ui/button";
import { ApiError } from "@/lib/api/errors";
import { cn } from "@/lib/utils";

import { saveMyApplication, submitMyApplication } from "../api";
import {
  draftPayload,
  STEPS,
  stepForPath,
  submitPayload,
  validateStep,
  type FieldErrors,
  type FormValues,
} from "../lib/form";
import { vendorApplicationQueryKey } from "../query";
import type { SellingCategory, VendorApplication } from "../types";
import { Choice, Field, TextInput } from "./fields";

type ApplicationFormProps = {
  initial: FormValues;
  reviewNote: string;
  categories: SellingCategory[];
  categoriesLoading: boolean;
  categoriesError: boolean;
  onRetryCategories: () => void;
  onSubmitted: (application: VendorApplication) => void;
};

function errorFor(errors: FieldErrors, path: string) {
  return errors[path];
}

export function ApplicationForm({
  initial,
  reviewNote,
  categories,
  categoriesLoading,
  categoriesError,
  onRetryCategories,
  onSubmitted,
}: ApplicationFormProps) {
  const queryClient = useQueryClient();
  const [step, setStep] = useState(0);
  const [values, setValues] = useState(initial);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [formError, setFormError] = useState<string>();
  const [saved, setSaved] = useState(false);

  const save = useMutation({
    mutationFn: saveMyApplication,
    onSuccess: (application) => {
      queryClient.setQueryData(vendorApplicationQueryKey, application);
      setSaved(true);
    },
  });

  const submit = useMutation({
    mutationFn: async () => {
      const { payload, errors: nextErrors } = submitPayload(values);

      if (Object.keys(nextErrors).length > 0) {
        throw Object.assign(new Error("invalid"), { fieldErrors: nextErrors });
      }

      await saveMyApplication(payload);
      return submitMyApplication();
    },
    onSuccess: (application) => {
      queryClient.setQueryData(vendorApplicationQueryKey, application);
      onSubmitted(application);
    },
  });

  function showApiError(error: unknown) {
    if (!(error instanceof ApiError)) {
      setFormError("Something went wrong. Please try again.");
      return;
    }

    const next: FieldErrors = {};

    for (const issue of error.fields ?? []) {
      if (issue.path && issue.path !== "root") next[issue.path] = issue.message;
    }

    setErrors(next);
    setFormError(error.message);

    const first = Object.keys(next)[0];

    if (first) setStep(stepForPath(first));
  }

  async function persistDraft() {
    const { payload, errors: nextErrors } = draftPayload(values);
    setErrors(nextErrors);
    setSaved(false);

    if (Object.keys(nextErrors).length > 0) {
      setFormError("Fix the highlighted fields before saving.");
      const first = Object.keys(nextErrors)[0];
      if (first) setStep(stepForPath(first));
      return false;
    }

    if (Object.keys(payload).length === 0) {
      setFormError("Add a few details before saving a draft.");
      return false;
    }

    try {
      await save.mutateAsync(payload);
      setFormError(undefined);
      return true;
    } catch (error) {
      showApiError(error);
      return false;
    }
  }

  async function continueStep() {
    if (step < 4) {
      const nextErrors = validateStep(values, step);
      setErrors(nextErrors);

      if (Object.keys(nextErrors).length > 0) {
        setFormError("Complete this step before continuing.");
        return;
      }
    }

    const ok = await persistDraft();

    if (ok && step < 4) setStep(step + 1);
  }

  async function onSubmit() {
    const nextErrors = validateStep(values, 4);
    setErrors(nextErrors);
    setSaved(false);

    if (Object.keys(nextErrors).length > 0) {
      setFormError("Complete every section before submitting.");
      const first = Object.keys(nextErrors)[0];
      if (first) setStep(stepForPath(first));
      return;
    }

    try {
      await submit.mutateAsync();
    } catch (error) {
      if (error instanceof Error && "fieldErrors" in error) {
        const fieldErrors = error.fieldErrors as FieldErrors;
        setErrors(fieldErrors);
        setFormError("Complete every section before submitting.");
        const first = Object.keys(fieldErrors)[0];
        if (first) setStep(stepForPath(first));
        return;
      }

      showApiError(error);
    }
  }

  const pending = save.isPending || submit.isPending;
  const categoryNames = new Map(
    categories.map((category) => [category.id, category.name]),
  );

  return (
    <div className="mt-8 grid gap-8 lg:grid-cols-[15rem_minmax(0,1fr)] lg:items-start">
      <ol className="flex gap-2 overflow-x-auto lg:sticky lg:top-28 lg:flex-col lg:gap-1">
        {STEPS.map((item, index) => {
          const active = index === step;

          return (
            <li key={item.id}>
              <button
                type="button"
                onClick={() => setStep(index)}
                className={cn(
                  "flex w-full items-center gap-3 rounded-full px-3 py-2 text-left text-sm transition-colors",
                  active
                    ? "bg-brand-soft font-medium text-foreground"
                    : "text-muted-foreground hover:text-foreground",
                )}
                aria-current={active ? "step" : undefined}
              >
                <span
                  className={cn(
                    "inline-flex size-6 shrink-0 items-center justify-center rounded-full text-xs",
                    active
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground",
                  )}
                >
                  {index + 1}
                </span>
                {item.label}
              </button>
            </li>
          );
        })}
      </ol>

      <form
        className="rounded-3xl border border-border bg-card p-5 sm:p-8"
        onSubmit={(event) => {
          event.preventDefault();
          if (step === 4) void onSubmit();
          else void continueStep();
        }}
        noValidate
      >
        {reviewNote ? (
          <p className="mb-6 rounded-2xl bg-brand-soft px-4 py-3 text-sm">
            {reviewNote}
          </p>
        ) : null}
        {formError ? (
          <p role="alert" className="mb-6 text-sm text-destructive">
            {formError}
          </p>
        ) : null}
        {saved ? (
          <p className="mb-6 text-sm text-muted-foreground">Draft saved.</p>
        ) : null}

        {step === 0 ? (
          <PersonalStep
            values={values}
            errors={errors}
            onChange={(personal) =>
              setValues((current) => ({ ...current, personal }))
            }
          />
        ) : null}
        {step === 1 ? (
          <IdentityStep
            values={values}
            errors={errors}
            onChange={(identity) =>
              setValues((current) => ({ ...current, identity }))
            }
          />
        ) : null}
        {step === 2 ? (
          <BusinessStep
            values={values}
            errors={errors}
            onChange={(business) =>
              setValues((current) => ({ ...current, business }))
            }
            onUsePersonalAddress={() =>
              setValues((current) => ({
                ...current,
                business: {
                  ...current.business,
                  address: { ...current.personal.address },
                },
              }))
            }
          />
        ) : null}
        {step === 3 ? (
          <SellingStep
            values={values}
            errors={errors}
            categories={categories}
            loading={categoriesLoading}
            failed={categoriesError}
            onRetry={onRetryCategories}
            onChange={(selling) =>
              setValues((current) => ({ ...current, selling }))
            }
          />
        ) : null}
        {step === 4 ? (
          <ReviewStep values={values} categoryNames={categoryNames} />
        ) : null}

        <div className="mt-8 flex flex-wrap items-center gap-3">
          {step > 0 ? (
            <Button
              type="button"
              variant="outline"
              className="h-11 rounded-full px-5"
              disabled={pending}
              onClick={() => setStep((current) => current - 1)}
            >
              Back
            </Button>
          ) : null}
          <Button
            type="button"
            variant="outline"
            className="h-11 rounded-full px-5"
            disabled={pending}
            onClick={() => void persistDraft()}
          >
            {save.isPending ? "Saving..." : "Save draft"}
          </Button>
          <Button
            type="submit"
            className="auth-orange-button h-11 rounded-full px-6 hover:bg-ink hover:text-primary"
            disabled={pending}
          >
            {step === 4
              ? submit.isPending
                ? "Submitting..."
                : "Submit application"
              : "Continue"}
          </Button>
        </div>
      </form>
    </div>
  );
}

function PersonalStep({
  values,
  errors,
  onChange,
}: {
  values: FormValues;
  errors: FieldErrors;
  onChange: (personal: FormValues["personal"]) => void;
}) {
  const personal = values.personal;

  return (
    <div className="space-y-5">
      <StepHeading
        title="About you"
        description="This is the person responsible for the store."
      />
      <div className="grid gap-4 sm:grid-cols-2">
        <TextInput
          label="Full name"
          autoComplete="name"
          value={personal.fullName}
          error={errorFor(errors, "personal.fullName")}
          onChange={(fullName) => onChange({ ...personal, fullName })}
        />
        <TextInput
          label="Email"
          type="email"
          autoComplete="email"
          value={personal.email}
          error={errorFor(errors, "personal.email")}
          onChange={(email) => onChange({ ...personal, email })}
        />
        <TextInput
          label="Phone"
          type="tel"
          autoComplete="tel"
          placeholder="+8801712345678"
          hint="Include the country code."
          value={personal.phone}
          error={errorFor(errors, "personal.phone")}
          onChange={(phone) => onChange({ ...personal, phone })}
        />
        <TextInput
          label="Date of birth"
          type="date"
          value={personal.dateOfBirth}
          error={errorFor(errors, "personal.dateOfBirth")}
          onChange={(dateOfBirth) => onChange({ ...personal, dateOfBirth })}
        />
      </div>
      <AddressFields
        prefix="personal.address"
        address={personal.address}
        errors={errors}
        onChange={(address) => onChange({ ...personal, address })}
      />
    </div>
  );
}

function IdentityStep({
  values,
  errors,
  onChange,
}: {
  values: FormValues;
  errors: FieldErrors;
  onChange: (identity: FormValues["identity"]) => void;
}) {
  const identity = values.identity;

  return (
    <div className="space-y-5">
      <StepHeading
        title="Identity"
        description="We use this to confirm who is opening the store."
      />
      <fieldset className="space-y-2">
        <legend className="text-sm font-medium">Document type</legend>
        <div className="grid gap-3 sm:grid-cols-2">
          <Choice
            label="National ID"
            selected={identity.documentType === "nid"}
            onSelect={() => onChange({ ...identity, documentType: "nid" })}
          />
          <Choice
            label="Passport"
            selected={identity.documentType === "passport"}
            onSelect={() => onChange({ ...identity, documentType: "passport" })}
          />
        </div>
        {errorFor(errors, "identity.documentType") ? (
          <p className="text-sm text-destructive">
            {errorFor(errors, "identity.documentType")}
          </p>
        ) : null}
      </fieldset>
      <TextInput
        label="Document number"
        value={identity.documentNumber}
        error={errorFor(errors, "identity.documentNumber")}
        onChange={(documentNumber) => onChange({ ...identity, documentNumber })}
      />
      <Field
        label="Document image links"
        hint="Paste a public https link for each photo. Up to 4."
        error={errorFor(errors, "identity.documentImages")}
      >
        <div className="space-y-2">
          {identity.documentImages.map((image, index) => (
            <div key={index} className="flex gap-2">
              <input
                value={image}
                placeholder="https://"
                className="h-10 w-full rounded-lg border border-input bg-transparent px-2.5 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
                onChange={(event) => {
                  const documentImages = [...identity.documentImages];
                  documentImages[index] = event.target.value;
                  onChange({ ...identity, documentImages });
                }}
              />
              {identity.documentImages.length > 1 ? (
                <Button
                  type="button"
                  variant="outline"
                  className="h-10 rounded-lg"
                  onClick={() =>
                    onChange({
                      ...identity,
                      documentImages: identity.documentImages.filter(
                        (_, imageIndex) => imageIndex !== index,
                      ),
                    })
                  }
                >
                  Remove
                </Button>
              ) : null}
            </div>
          ))}
          {identity.documentImages.length < 4 ? (
            <Button
              type="button"
              variant="outline"
              className="h-10 rounded-full"
              onClick={() =>
                onChange({
                  ...identity,
                  documentImages: [...identity.documentImages, ""],
                })
              }
            >
              Add another image
            </Button>
          ) : null}
        </div>
      </Field>
      <TextInput
        label="Selfie link"
        hint="Optional."
        placeholder="https://"
        value={identity.selfieUrl}
        error={errorFor(errors, "identity.selfieUrl")}
        onChange={(selfieUrl) => onChange({ ...identity, selfieUrl })}
      />
    </div>
  );
}

function BusinessStep({
  values,
  errors,
  onChange,
  onUsePersonalAddress,
}: {
  values: FormValues;
  errors: FieldErrors;
  onChange: (business: FormValues["business"]) => void;
  onUsePersonalAddress: () => void;
}) {
  const business = values.business;

  return (
    <div className="space-y-5">
      <StepHeading
        title="Your store"
        description="Shoppers will see the store name on NexCart."
      />
      <TextInput
        label="Store name"
        value={business.storeName}
        error={errorFor(errors, "business.storeName")}
        onChange={(storeName) => onChange({ ...business, storeName })}
      />
      <fieldset className="space-y-2">
        <legend className="text-sm font-medium">Business type</legend>
        <div className="grid gap-3 sm:grid-cols-2">
          <Choice
            label="Individual"
            selected={business.businessType === "individual"}
            onSelect={() =>
              onChange({ ...business, businessType: "individual" })
            }
          />
          <Choice
            label="Company"
            selected={business.businessType === "company"}
            onSelect={() => onChange({ ...business, businessType: "company" })}
          />
        </div>
        {errorFor(errors, "business.businessType") ? (
          <p className="text-sm text-destructive">
            {errorFor(errors, "business.businessType")}
          </p>
        ) : null}
      </fieldset>
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm font-medium">Business address</p>
        <button
          type="button"
          className="text-sm font-medium text-primary hover:underline"
          onClick={onUsePersonalAddress}
        >
          Use personal address
        </button>
      </div>
      <AddressFields
        prefix="business.address"
        address={business.address}
        errors={errors}
        onChange={(address) => onChange({ ...business, address })}
      />
      <div className="grid gap-4 sm:grid-cols-2">
        <TextInput
          label="Trade license number"
          hint="Optional."
          value={business.tradeLicenseNumber}
          error={errorFor(errors, "business.tradeLicense.number")}
          onChange={(tradeLicenseNumber) =>
            onChange({ ...business, tradeLicenseNumber })
          }
        />
        <TextInput
          label="Trade license document"
          hint="Optional https link."
          placeholder="https://"
          value={business.tradeLicenseUrl}
          error={errorFor(errors, "business.tradeLicense.documentUrl")}
          onChange={(tradeLicenseUrl) =>
            onChange({ ...business, tradeLicenseUrl })
          }
        />
        <TextInput
          label="Tax ID"
          hint="Optional."
          value={business.taxId}
          error={errorFor(errors, "business.tax.taxId")}
          onChange={(taxId) => onChange({ ...business, taxId })}
        />
        <TextInput
          label="Tax document"
          hint="Optional https link."
          placeholder="https://"
          value={business.taxDocumentUrl}
          error={errorFor(errors, "business.tax.documentUrl")}
          onChange={(taxDocumentUrl) =>
            onChange({ ...business, taxDocumentUrl })
          }
        />
      </div>
    </div>
  );
}

function SellingStep({
  values,
  errors,
  categories,
  loading,
  failed,
  onRetry,
  onChange,
}: {
  values: FormValues;
  errors: FieldErrors;
  categories: SellingCategory[];
  loading: boolean;
  failed: boolean;
  onRetry: () => void;
  onChange: (selling: FormValues["selling"]) => void;
}) {
  const selling = values.selling;

  return (
    <div className="space-y-5">
      <StepHeading
        title="What you sell"
        description="Pick the categories shoppers should find you in."
      />
      <Field label="Categories" error={errorFor(errors, "selling.categoryIds")}>
        {loading ? (
          <p className="text-sm text-muted-foreground">Loading categories...</p>
        ) : failed ? (
          <button
            type="button"
            className="text-sm font-medium text-primary hover:underline"
            onClick={onRetry}
          >
            Could not load categories. Try again.
          </button>
        ) : categories.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            No selling categories are available yet.
          </p>
        ) : (
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => {
              const selected = selling.categoryIds.includes(category.id);

              return (
                <button
                  key={category.id}
                  type="button"
                  aria-pressed={selected}
                  onClick={() => {
                    const categoryIds = selected
                      ? selling.categoryIds.filter((id) => id !== category.id)
                      : [...selling.categoryIds, category.id];

                    if (categoryIds.length > 20) return;

                    onChange({ ...selling, categoryIds });
                  }}
                  className={cn(
                    "rounded-full border px-3 py-1.5 text-sm transition-colors",
                    selected
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-border hover:border-primary/50",
                  )}
                >
                  {category.name}
                </button>
              );
            })}
          </div>
        )}
      </Field>
      <Field
        label="Business description"
        hint="At least 20 characters."
        error={errorFor(errors, "selling.description")}
      >
        <textarea
          value={selling.description}
          rows={5}
          className="w-full rounded-lg border border-input bg-transparent px-3 py-2 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
          onChange={(event) =>
            onChange({ ...selling, description: event.target.value })
          }
        />
      </Field>
    </div>
  );
}

function ReviewStep({
  values,
  categoryNames,
}: {
  values: FormValues;
  categoryNames: Map<string, string>;
}) {
  const rows = [
    ["Name", values.personal.fullName],
    ["Email", values.personal.email],
    ["Phone", values.personal.phone],
    ["Date of birth", values.personal.dateOfBirth],
    [
      "Document",
      values.identity.documentType === "nid"
        ? "National ID"
        : values.identity.documentType === "passport"
          ? "Passport"
          : "",
    ],
    ["Document number", values.identity.documentNumber],
    ["Store", values.business.storeName],
    ["Business type", values.business.businessType],
    [
      "Categories",
      values.selling.categoryIds
        .map((id) => categoryNames.get(id) ?? id)
        .join(", "),
    ],
  ];

  return (
    <div className="space-y-5">
      <StepHeading
        title="Review and submit"
        description="Check the details, then send the application for review."
      />
      <dl className="grid gap-3 sm:grid-cols-2">
        {rows.map(([label, value]) => (
          <div key={label} className="rounded-2xl bg-background px-4 py-3">
            <dt className="text-[11px] font-medium tracking-wide text-muted-foreground uppercase">
              {label}
            </dt>
            <dd className="mt-1 text-sm font-medium">{value || "Not added"}</dd>
          </div>
        ))}
      </dl>
      <p className="text-sm text-muted-foreground">
        {values.selling.description}
      </p>
    </div>
  );
}

function AddressFields({
  prefix,
  address,
  errors,
  onChange,
}: {
  prefix: string;
  address: FormValues["personal"]["address"];
  errors: FieldErrors;
  onChange: (address: FormValues["personal"]["address"]) => void;
}) {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <div className="sm:col-span-2">
        <TextInput
          label="Address line"
          autoComplete="address-line1"
          value={address.line1}
          error={errorFor(errors, `${prefix}.line1`)}
          onChange={(line1) => onChange({ ...address, line1 })}
        />
      </div>
      <div className="sm:col-span-2">
        <TextInput
          label="Address line 2"
          hint="Optional."
          autoComplete="address-line2"
          value={address.line2}
          error={errorFor(errors, `${prefix}.line2`)}
          onChange={(line2) => onChange({ ...address, line2 })}
        />
      </div>
      <TextInput
        label="City"
        autoComplete="address-level2"
        value={address.city}
        error={errorFor(errors, `${prefix}.city`)}
        onChange={(city) => onChange({ ...address, city })}
      />
      <TextInput
        label="State"
        autoComplete="address-level1"
        value={address.state}
        error={errorFor(errors, `${prefix}.state`)}
        onChange={(state) => onChange({ ...address, state })}
      />
      <TextInput
        label="Postal code"
        autoComplete="postal-code"
        value={address.postalCode}
        error={errorFor(errors, `${prefix}.postalCode`)}
        onChange={(postalCode) => onChange({ ...address, postalCode })}
      />
      <TextInput
        label="Country"
        autoComplete="country-name"
        value={address.country}
        error={errorFor(errors, `${prefix}.country`)}
        onChange={(country) => onChange({ ...address, country })}
      />
    </div>
  );
}

function StepHeading({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div>
      <h2 className="text-2xl">{title}</h2>
      <p className="mt-1 text-sm text-muted-foreground">{description}</p>
    </div>
  );
}
