"use client";

import { useState, type FormEvent } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { ApiError } from "@/lib/api/errors";

import { login } from "../api";
import { splitApiError } from "../lib/api-errors";
import {
  validateLogin,
  type FieldErrors,
  type LoginValues,
} from "../lib/validation";
import { sessionQueryKey } from "../query";
import { useAuthStore } from "../store";
import { PasswordField, TextField } from "./text-field";

const emptyErrors: FieldErrors<keyof LoginValues> = {};

export function LoginForm() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [errors, setErrors] = useState(emptyErrors);
  const [formError, setFormError] = useState<string>();

  const signIn = useMutation({
    mutationFn: login,
    onSuccess: (session) => {
      useAuthStore.getState().setSession(session);
      queryClient.setQueryData(sessionQueryKey, session);
      router.push("/");
      router.refresh();
    },
    onError: (error) => {
      if (error instanceof ApiError) {
        const next = splitApiError<keyof LoginValues>(error);
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
    const values: LoginValues = {
      email: String(formData.get("email") ?? ""),
      password: String(formData.get("password") ?? ""),
    };
    const nextErrors = validateLogin(values);

    setErrors(nextErrors);
    setFormError(undefined);

    if (Object.keys(nextErrors).length > 0) return;

    signIn.mutate(values);
  }

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h1 className="font-display text-4xl leading-none font-medium tracking-[-0.03em]">
          Welcome back
        </h1>
        <p className="text-sm text-muted-foreground">
          Sign in to track orders, save items, and check out faster.
        </p>
      </div>

      <form className="space-y-5" onSubmit={onSubmit} noValidate>
        {formError ? (
          <p role="alert" className="text-sm text-destructive">
            {formError}
          </p>
        ) : null}
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
            className="size-4 rounded border-[#ff7a7a] accent-[#ff7a7a]"
          />
          Remember me
        </label>
        <Button
          type="submit"
          size="lg"
          disabled={signIn.isPending}
          className="auth-orange-button h-12 w-full rounded-full duration-500 ease-out hover:bg-[#2a1218] hover:text-[#ff7a7a]"
        >
          {signIn.isPending ? "Signing in..." : "Sign in"}
        </Button>
      </form>

      <p className="text-sm text-muted-foreground">
        New to NexCart?{" "}
        <Link
          href="/register"
          className="font-medium text-[#ff7a7a] hover:underline"
        >
          Create an account
        </Link>
      </p>
    </div>
  );
}
