"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Controller, useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { ApiError } from "@/lib/api/errors";

import { updateProfile } from "../api";
import { splitApiError } from "../lib/api-errors";
import { fieldErrorResolver } from "../lib/resolver";
import { validateProfile, type ProfileValues } from "../lib/validation";
import { meQueryKey } from "../query";
import type { AuthUser } from "../types";
import { PhoneField } from "./phone-field";
import { TextField } from "./text-field";

type AccountEditorProps = {
  user: AuthUser;
  onCancel: () => void;
  onSaved: () => void;
};

export function AccountEditor({ user, onCancel, onSaved }: AccountEditorProps) {
  const queryClient = useQueryClient();
  const {
    register,
    control,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<ProfileValues>({
    defaultValues: {
      firstName: user.firstName,
      lastName: user.lastName,
      phone: user.phone ?? "",
    },
    resolver: fieldErrorResolver(validateProfile),
  });

  const save = useMutation({
    mutationFn: updateProfile,
    onSuccess: (profile) => {
      queryClient.setQueryData(meQueryKey, profile);
      onSaved();
    },
    onError: (error) => {
      if (error instanceof ApiError) {
        const next = splitApiError<keyof ProfileValues>(error);

        for (const [field, message] of Object.entries(next.fields)) {
          if (message) setError(field as keyof ProfileValues, { message });
        }

        if (next.form) setError("root", { message: next.form });
        return;
      }

      setError("root", { message: "Something went wrong. Please try again." });
    },
  });

  return (
    <form
      className="space-y-5"
      noValidate
      onSubmit={handleSubmit((values) => save.mutate(values))}
    >
      {errors.root?.message ? (
        <p role="alert" className="text-sm text-destructive">
          {errors.root.message}
        </p>
      ) : null}

      <div className="grid gap-4 sm:grid-cols-2">
        <TextField
          label="First name"
          autoComplete="given-name"
          error={errors.firstName?.message}
          {...register("firstName")}
        />
        <TextField
          label="Last name"
          autoComplete="family-name"
          error={errors.lastName?.message}
          {...register("lastName")}
        />
      </div>

      <TextField
        label="Email"
        value={user.email}
        readOnly
        hint="Email stays linked to your sign-in."
      />

      <Controller
        name="phone"
        control={control}
        render={({ field }) => (
          <PhoneField
            value={field.value}
            onChange={field.onChange}
            onBlur={field.onBlur}
            error={errors.phone?.message}
            hint="Optional. Leave it blank to remove your number."
          />
        )}
      />

      <div className="flex flex-wrap justify-end gap-2 pt-1">
        <Button
          type="button"
          variant="ghost"
          className="h-10 rounded-full px-4"
          onClick={onCancel}
          disabled={save.isPending}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          className="h-10 rounded-full px-5 font-semibold"
          disabled={save.isPending}
        >
          {save.isPending ? "Saving..." : "Save changes"}
        </Button>
      </div>
    </form>
  );
}
