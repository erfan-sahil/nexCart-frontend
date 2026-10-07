"use client";

import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Controller,
  FormProvider,
  useForm,
  useFormContext,
  useWatch,
  type FieldPath,
} from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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

const FORM_FIELD_PATHS: Record<string, FieldPath<FormValues>> = {
  "business.tradeLicense.number": "business.tradeLicenseNumber",
  "business.tradeLicense.documentUrl": "business.tradeLicenseUrl",
  "business.tax.taxId": "business.taxId",
  "business.tax.documentUrl": "business.taxDocumentUrl",
};

function toFieldPath(path: string) {
  return FORM_FIELD_PATHS[path] ?? (path as FieldPath<FormValues>);
}

function errorMessage(error: unknown) {
  if (
    error &&
    typeof error === "object" &&
    "message" in error &&
    typeof error.message === "string"
  ) {
    return error.message;
  }

  return undefined;
}

type ApplicationFormProps = {
  initial: FormValues;
  reviewNote: string;
  categories: SellingCategory[];
  categoriesLoading: boolean;
  categoriesError: boolean;
  onRetryCategories: () => void;
  onSubmitted: (application: VendorApplication) => void;
};

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
  const [saved, setSaved] = useState(false);
  const form = useForm<FormValues>({ defaultValues: initial });
  const {
    clearErrors,
    getValues,
    handleSubmit,
    setError,
    formState: { errors },
  } = form;

  const save = useMutation({
    mutationFn: saveMyApplication,
    onSuccess: (application) => {
      queryClient.setQueryData(vendorApplicationQueryKey, application);
      setSaved(true);
    },
  });

  const submit = useMutation({
    mutationFn: async () => {
      const { payload, errors: nextErrors } = submitPayload(getValues());

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

  function applyErrors(next: FieldErrors, formMessage?: string) {
    clearErrors();

    for (const [path, message] of Object.entries(next)) {
      setError(toFieldPath(path), { type: "validate", message });
    }

    if (formMessage) setError("root", { type: "server", message: formMessage });

    const first = Object.keys(next)[0];
    if (first) setStep(stepForPath(first));
  }

  function showApiError(error: unknown) {
    if (!(error instanceof ApiError)) {
      clearErrors();
      setError("root", {
        type: "server",
        message: "Something went wrong. Please try again.",
      });
      return;
    }

    const next: FieldErrors = {};

    for (const issue of error.fields ?? []) {
      if (issue.path && issue.path !== "root") next[issue.path] = issue.message;
    }

    applyErrors(next, error.message);
  }

  async function persistDraft() {
    const { payload, errors: nextErrors } = draftPayload(getValues());
    setSaved(false);

    if (Object.keys(nextErrors).length > 0) {
      applyErrors(nextErrors, "Fix the highlighted fields before saving.");
      return false;
    }

    if (Object.keys(payload).length === 0) {
      clearErrors();
      setError("root", {
        type: "server",
        message: "Add a few details before saving a draft.",
      });
      return false;
    }

    try {
      await save.mutateAsync(payload);
      clearErrors();
      return true;
    } catch (error) {
      showApiError(error);
      return false;
    }
  }

  async function continueStep() {
    if (step < 4) {
      const nextErrors = validateStep(getValues(), step);

      if (Object.keys(nextErrors).length > 0) {
        applyErrors(nextErrors, "Complete this step before continuing.");
        return;
      }
    }

    const ok = await persistDraft();

    if (ok && step < 4) setStep(step + 1);
  }

  async function submitApplication() {
    const nextErrors = validateStep(getValues(), 4);
    setSaved(false);

    if (Object.keys(nextErrors).length > 0) {
      applyErrors(nextErrors, "Complete every section before submitting.");
      return;
    }

    try {
      await submit.mutateAsync();
    } catch (error) {
      if (error instanceof Error && "fieldErrors" in error) {
        applyErrors(
          error.fieldErrors as FieldErrors,
          "Complete every section before submitting.",
        );
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
    <FormProvider {...form}>
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
                        ? "bg-primary text-[#fff4f2]"
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
          onSubmit={handleSubmit(() => {
            if (step === 4) void submitApplication();
            else void continueStep();
          })}
          noValidate
        >
          {reviewNote ? (
            <p className="mb-6 rounded-2xl bg-brand-soft px-4 py-3 text-sm">
              {reviewNote}
            </p>
          ) : null}
          {errors.root?.message ? (
            <p role="alert" className="mb-6 text-sm text-destructive">
              {errors.root.message}
            </p>
          ) : null}
          {saved ? (
            <p className="mb-6 text-sm text-muted-foreground">Draft saved.</p>
          ) : null}

          {step === 0 ? <PersonalStep /> : null}
          {step === 1 ? <IdentityStep /> : null}
          {step === 2 ? <BusinessStep /> : null}
          {step === 3 ? (
            <SellingStep
              categories={categories}
              loading={categoriesLoading}
              failed={categoriesError}
              onRetry={onRetryCategories}
            />
          ) : null}
          {step === 4 ? <ReviewStep categoryNames={categoryNames} /> : null}

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
              className="auth-orange-button h-11 rounded-full px-6 hover:bg-ink hover:text-[#fff4f2]"
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
    </FormProvider>
  );
}

function PersonalStep() {
  const {
    register,
    formState: { errors },
  } = useFormContext<FormValues>();

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
          error={errors.personal?.fullName?.message}
          {...register("personal.fullName")}
        />
        <TextInput
          label="Email"
          type="email"
          autoComplete="email"
          error={errors.personal?.email?.message}
          {...register("personal.email")}
        />
        <TextInput
          label="Phone"
          type="tel"
          autoComplete="tel"
          placeholder="+8801712345678"
          hint="Include the country code."
          error={errors.personal?.phone?.message}
          {...register("personal.phone")}
        />
        <TextInput
          label="Date of birth"
          type="date"
          error={errors.personal?.dateOfBirth?.message}
          {...register("personal.dateOfBirth")}
        />
      </div>
      <AddressFields prefix="personal.address" />
    </div>
  );
}

function IdentityStep() {
  const {
    control,
    register,
    getValues,
    setValue,
    formState: { errors },
  } = useFormContext<FormValues>();
  const documentType = useWatch({ control, name: "identity.documentType" });
  const documentImages =
    useWatch({ control, name: "identity.documentImages" }) ?? [];
  const imageError = errorMessage(errors.identity?.documentImages);

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
            selected={documentType === "nid"}
            onSelect={() =>
              setValue("identity.documentType", "nid", { shouldDirty: true })
            }
          />
          <Choice
            label="Passport"
            selected={documentType === "passport"}
            onSelect={() =>
              setValue("identity.documentType", "passport", {
                shouldDirty: true,
              })
            }
          />
        </div>
        {errors.identity?.documentType?.message ? (
          <p className="text-sm text-destructive">
            {errors.identity.documentType.message}
          </p>
        ) : null}
      </fieldset>
      <TextInput
        label="Document number"
        error={errors.identity?.documentNumber?.message}
        {...register("identity.documentNumber")}
      />
      <Field
        label="Document image links"
        hint="Paste a public https link for each photo. Up to 4."
        error={imageError}
      >
        <div className="space-y-2">
          {documentImages.map((_, index) => (
            <div key={index} className="flex gap-2">
              <Controller
                name={`identity.documentImages.${index}`}
                control={control}
                render={({ field }) => (
                  <Input
                    placeholder="https://"
                    aria-invalid={Boolean(imageError)}
                    className="h-10"
                    name={field.name}
                    ref={field.ref}
                    value={field.value}
                    onBlur={field.onBlur}
                    onChange={field.onChange}
                  />
                )}
              />
              {documentImages.length > 1 ? (
                <Button
                  type="button"
                  variant="outline"
                  className="h-10 rounded-lg"
                  onClick={() =>
                    setValue(
                      "identity.documentImages",
                      getValues("identity.documentImages").filter(
                        (_, imageIndex) => imageIndex !== index,
                      ),
                      { shouldDirty: true },
                    )
                  }
                >
                  Remove
                </Button>
              ) : null}
            </div>
          ))}
          {documentImages.length < 4 ? (
            <Button
              type="button"
              variant="outline"
              className="h-10 rounded-full"
              onClick={() =>
                setValue(
                  "identity.documentImages",
                  [...getValues("identity.documentImages"), ""],
                  { shouldDirty: true },
                )
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
        error={errors.identity?.selfieUrl?.message}
        {...register("identity.selfieUrl")}
      />
    </div>
  );
}

function BusinessStep() {
  const {
    control,
    register,
    getValues,
    setValue,
    formState: { errors },
  } = useFormContext<FormValues>();
  const businessType = useWatch({ control, name: "business.businessType" });

  return (
    <div className="space-y-5">
      <StepHeading
        title="Your store"
        description="Shoppers will see the store name on NexCart."
      />
      <TextInput
        label="Store name"
        error={errors.business?.storeName?.message}
        {...register("business.storeName")}
      />
      <fieldset className="space-y-2">
        <legend className="text-sm font-medium">Business type</legend>
        <div className="grid gap-3 sm:grid-cols-2">
          <Choice
            label="Individual"
            selected={businessType === "individual"}
            onSelect={() =>
              setValue("business.businessType", "individual", {
                shouldDirty: true,
              })
            }
          />
          <Choice
            label="Company"
            selected={businessType === "company"}
            onSelect={() =>
              setValue("business.businessType", "company", {
                shouldDirty: true,
              })
            }
          />
        </div>
        {errors.business?.businessType?.message ? (
          <p className="text-sm text-destructive">
            {errors.business.businessType.message}
          </p>
        ) : null}
      </fieldset>
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm font-medium">Business address</p>
        <button
          type="button"
          className="text-sm font-medium text-primary hover:underline"
          onClick={() =>
            setValue(
              "business.address",
              { ...getValues("personal.address") },
              {
                shouldDirty: true,
              },
            )
          }
        >
          Use personal address
        </button>
      </div>
      <AddressFields prefix="business.address" />
      <div className="grid gap-4 sm:grid-cols-2">
        <TextInput
          label="Trade license number"
          hint="Optional."
          error={errorMessage(errors.business?.tradeLicenseNumber)}
          {...register("business.tradeLicenseNumber")}
        />
        <TextInput
          label="Trade license document"
          hint="Optional https link."
          placeholder="https://"
          error={errorMessage(errors.business?.tradeLicenseUrl)}
          {...register("business.tradeLicenseUrl")}
        />
        <TextInput
          label="Tax ID"
          hint="Optional."
          error={errorMessage(errors.business?.taxId)}
          {...register("business.taxId")}
        />
        <TextInput
          label="Tax document"
          hint="Optional https link."
          placeholder="https://"
          error={errorMessage(errors.business?.taxDocumentUrl)}
          {...register("business.taxDocumentUrl")}
        />
      </div>
    </div>
  );
}

function SellingStep({
  categories,
  loading,
  failed,
  onRetry,
}: {
  categories: SellingCategory[];
  loading: boolean;
  failed: boolean;
  onRetry: () => void;
}) {
  const {
    control,
    register,
    setValue,
    formState: { errors },
  } = useFormContext<FormValues>();
  const categoryIds = useWatch({ control, name: "selling.categoryIds" }) ?? [];
  const categoryError = errorMessage(errors.selling?.categoryIds);

  return (
    <div className="space-y-5">
      <StepHeading
        title="What you sell"
        description="Pick the categories shoppers should find you in."
      />
      <Field label="Categories" error={categoryError}>
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
              const selected = categoryIds.includes(category.id);

              return (
                <button
                  key={category.id}
                  type="button"
                  aria-pressed={selected}
                  onClick={() => {
                    const next = selected
                      ? categoryIds.filter((id) => id !== category.id)
                      : [...categoryIds, category.id];

                    if (next.length > 20) return;

                    setValue("selling.categoryIds", next, {
                      shouldDirty: true,
                    });
                  }}
                  className={cn(
                    "rounded-full border px-3 py-1.5 text-sm transition-colors",
                    selected
                      ? "border-primary bg-primary text-[#fff4f2]"
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
        error={errors.selling?.description?.message}
      >
        <textarea
          rows={5}
          aria-invalid={Boolean(errors.selling?.description)}
          className="w-full rounded-lg border border-input bg-transparent px-3 py-2 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
          {...register("selling.description")}
        />
      </Field>
    </div>
  );
}

function ReviewStep({ categoryNames }: { categoryNames: Map<string, string> }) {
  const { control } = useFormContext<FormValues>();
  const values = useWatch({ control });
  const personal = values.personal;
  const identity = values.identity;
  const business = values.business;
  const selling = values.selling;
  const rows = [
    ["Name", personal?.fullName],
    ["Email", personal?.email],
    ["Phone", personal?.phone],
    ["Date of birth", personal?.dateOfBirth],
    [
      "Document",
      identity?.documentType === "nid"
        ? "National ID"
        : identity?.documentType === "passport"
          ? "Passport"
          : "",
    ],
    ["Document number", identity?.documentNumber],
    ["Store", business?.storeName],
    ["Business type", business?.businessType],
    [
      "Categories",
      selling?.categoryIds?.map((id) => categoryNames.get(id) ?? id).join(", "),
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
      <p className="text-sm text-muted-foreground">{selling?.description}</p>
    </div>
  );
}

function AddressFields({
  prefix,
}: {
  prefix: "personal.address" | "business.address";
}) {
  const {
    register,
    formState: { errors },
  } = useFormContext<FormValues>();
  const addressErrors =
    prefix === "personal.address"
      ? errors.personal?.address
      : errors.business?.address;

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <div className="sm:col-span-2">
        <TextInput
          label="Address line"
          autoComplete="address-line1"
          error={addressErrors?.line1?.message}
          {...register(`${prefix}.line1`)}
        />
      </div>
      <div className="sm:col-span-2">
        <TextInput
          label="Address line 2"
          hint="Optional."
          autoComplete="address-line2"
          error={addressErrors?.line2?.message}
          {...register(`${prefix}.line2`)}
        />
      </div>
      <TextInput
        label="City"
        autoComplete="address-level2"
        error={addressErrors?.city?.message}
        {...register(`${prefix}.city`)}
      />
      <TextInput
        label="State"
        autoComplete="address-level1"
        error={addressErrors?.state?.message}
        {...register(`${prefix}.state`)}
      />
      <TextInput
        label="Postal code"
        autoComplete="postal-code"
        error={addressErrors?.postalCode?.message}
        {...register(`${prefix}.postalCode`)}
      />
      <TextInput
        label="Country"
        autoComplete="country-name"
        error={addressErrors?.country?.message}
        {...register(`${prefix}.country`)}
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
