"use client";

import { useState, type FormEvent } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { ApiError } from "@/lib/api/errors";

import { register } from "../api";
import { splitApiError } from "../lib/api-errors";
import {
  validateRegister,
  type FieldErrors,
  type RegisterValues,
} from "../lib/validation";
import { sessionQueryKey } from "../query";
import { useAuthStore } from "../store";
import { PasswordField, TextField } from "./text-field";

const emptyErrors: FieldErrors<keyof RegisterValues> = {};

export function RegisterForm() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [errors, setErrors] = useState(emptyErrors);
  const [formError, setFormError] = useState<string>();

  const createAccount = useMutation({
    mutationFn: register,
    onSuccess: (session) => {
      useAuthStore.getState().setSession(session);
      queryClient.setQueryData(sessionQueryKey, session);
      router.push("/");
      router.refresh();
    },
    onError: (error) => {
      if (error instanceof ApiError) {
        const next = splitApiError<keyof RegisterValues>(error);
        setErrors(next.fields);
        setFormError(next.form);
        return;
      }

      setFormError("Something went wrong. Please try again.");
    },
  });

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const values: RegisterValues = {
      firstName: String(formData.get("firstName") ?? ""),
      lastName: String(formData.get("lastName") ?? ""),
      email: String(formData.get("email") ?? ""),
      phone: String(formData.get("phone") ?? ""),
      password: String(formData.get("password") ?? ""),
      confirmPassword: String(formData.get("confirmPassword") ?? ""),
    };
    const nextErrors = validateRegister(values);

    setErrors(nextErrors);
    setFormError(undefined);

    if (Object.keys(nextErrors).length > 0) return;

    createAccount.mutate({
      firstName: values.firstName,
      lastName: values.lastName,
      email: values.email,
      phone: values.phone,
      password: values.password,
    });
  }

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h1 className="font-display text-4xl leading-none font-medium tracking-[-0.03em]">
          Create your account
        </h1>
        <p className="text-sm text-muted-foreground">
          Join NexCart to shop independent stores and follow your orders.
        </p>
      </div>

      <form className="space-y-5" onSubmit={onSubmit} noValidate>
        {formError ? (
          <p role="alert" className="text-sm text-destructive">
            {formError}
          </p>
        ) : null}
        <div className="grid gap-5 sm:grid-cols-2">
          <TextField
            name="firstName"
            label="First name"
            autoComplete="given-name"
            placeholder="Sahil"
            error={errors.firstName}
          />
          <TextField
            name="lastName"
            label="Last name"
            autoComplete="family-name"
            placeholder="Rahman"
            error={errors.lastName}
          />
        </div>
        <TextField
          name="email"
          type="email"
          label="Email"
          autoComplete="email"
          placeholder="you@example.com"
          error={errors.email}
        />
        <TextField
          name="phone"
          type="tel"
          label="Phone"
          autoComplete="tel"
          placeholder="+8801712345678"
          hint="Optional. Use international format."
          error={errors.phone}
        />
        <PasswordField
          name="password"
          label="Password"
          autoComplete="new-password"
          placeholder="At least 8 characters"
          error={errors.password}
        />
        <PasswordField
          name="confirmPassword"
          label="Confirm password"
          autoComplete="new-password"
          placeholder="Repeat your password"
          error={errors.confirmPassword}
        />
        <Button
          type="submit"
          size="lg"
          disabled={createAccount.isPending}
          className="auth-orange-button auth-dark-button h-12 w-full rounded-full duration-500 ease-out hover:bg-[#ff7a7a] hover:text-[#2a1218]"
        >
          {createAccount.isPending ? "Creating account..." : "Create account"}
        </Button>
      </form>

      <p className="text-sm text-muted-foreground">
        Already have an account?{" "}
        <Link
          href="/login"
          className="font-medium text-[#ff7a7a] hover:underline"
        >
          Sign in
        </Link>
      </p>
    </div>
  );
}
