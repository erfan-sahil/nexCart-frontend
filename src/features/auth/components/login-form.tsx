"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";

import { Button } from "@/components/ui/button";

import {
  validateLogin,
  type FieldErrors,
  type LoginValues,
} from "../lib/validation";
import { PasswordField, TextField } from "./text-field";

const emptyErrors: FieldErrors<keyof LoginValues> = {};

export function LoginForm() {
  const [errors, setErrors] = useState(emptyErrors);

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const nextErrors = validateLogin({
      email: String(formData.get("email") ?? ""),
      password: String(formData.get("password") ?? ""),
    });

    setErrors(nextErrors);
  }

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h1 className="text-2xl font-semibold tracking-tight">Welcome back</h1>
        <p className="text-sm text-muted-foreground">
          Sign in to track orders, save items, and check out faster.
        </p>
      </div>

      <form className="space-y-5" onSubmit={onSubmit} noValidate>
        <TextField
          name="email"
          type="email"
          label="Email"
          autoComplete="email"
          placeholder="you@example.com"
          error={errors.email}
        />
        <PasswordField
          name="password"
          label="Password"
          autoComplete="current-password"
          placeholder="Your password"
          error={errors.password}
        />
        <label className="flex items-center gap-2 text-sm text-muted-foreground">
          <input
            type="checkbox"
            name="remember"
            className="size-4 rounded border-input accent-primary"
          />
          Remember me
        </label>
        <Button
          type="submit"
          size="lg"
          className="auth-orange-button h-10 w-full"
        >
          Sign in
        </Button>
      </form>

      <p className="text-sm text-muted-foreground">
        New to NexCart?{" "}
        <Link
          href="/register"
          className="font-medium text-primary hover:underline"
        >
          Create an account
        </Link>
      </p>
    </div>
  );
}
