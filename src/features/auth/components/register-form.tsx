"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";

import { Button } from "@/components/ui/button";

import {
  validateRegister,
  type FieldErrors,
  type RegisterValues,
} from "../lib/validation";
import { PasswordField, TextField } from "./text-field";

const emptyErrors: FieldErrors<keyof RegisterValues> = {};

export function RegisterForm() {
  const [errors, setErrors] = useState(emptyErrors);

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const nextErrors = validateRegister({
      firstName: String(formData.get("firstName") ?? ""),
      lastName: String(formData.get("lastName") ?? ""),
      email: String(formData.get("email") ?? ""),
      phone: String(formData.get("phone") ?? ""),
      password: String(formData.get("password") ?? ""),
      confirmPassword: String(formData.get("confirmPassword") ?? ""),
    });

    setErrors(nextErrors);
  }

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h1 className="text-2xl font-semibold tracking-tight">
          Create your account
        </h1>
        <p className="text-sm text-muted-foreground">
          Join NexCart to shop independent stores and follow your orders.
        </p>
      </div>

      <form className="space-y-5" onSubmit={onSubmit} noValidate>
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
          className="auth-orange-button h-10 w-full"
        >
          Create account
        </Button>
      </form>

      <p className="text-sm text-muted-foreground">
        Already have an account?{" "}
        <Link
          href="/login"
          className="font-medium text-primary hover:underline"
        >
          Sign in
        </Link>
      </p>
    </div>
  );
}
