"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { ApiError } from "@/lib/api/errors";

import { login } from "../api";
import { splitApiError } from "../lib/api-errors";
import { fieldErrorResolver } from "../lib/resolver";
import { validateLogin, type LoginValues } from "../lib/validation";
import { sessionQueryKey } from "../query";
import { useAuthStore } from "../store";
import { PasswordField, TextField } from "./text-field";

export function LoginForm() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<LoginValues>({
    defaultValues: { email: "", password: "" },
    resolver: fieldErrorResolver(validateLogin),
  });

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

        for (const [field, message] of Object.entries(next.fields)) {
          if (message) setError(field as keyof LoginValues, { message });
        }

        if (next.form) setError("root", { message: next.form });
        return;
      }

      setError("root", { message: "Something went wrong. Please try again." });
    },
  });

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

      <form
        className="space-y-5"
        noValidate
        onSubmit={handleSubmit((values) => signIn.mutate(values))}
      >
        {errors.root?.message ? (
          <p role="alert" className="text-sm text-destructive">
            {errors.root.message}
          </p>
        ) : null}
        <TextField
          type="email"
          label="Email"
          autoComplete="email"
          placeholder="you@example.com"
          error={errors.email?.message}
          {...register("email")}
        />
        <PasswordField
          label="Password"
          autoComplete="current-password"
          placeholder="Your password"
          error={errors.password?.message}
          {...register("password")}
        />
        <label className="flex items-center gap-2 text-sm text-muted-foreground">
          <input
            type="checkbox"
            className="size-4 rounded border-[#ff4d4d] accent-[#ff4d4d]"
          />
          Remember me
        </label>
        <Button
          type="submit"
          size="lg"
          disabled={signIn.isPending}
          className="auth-orange-button h-12 w-full rounded-full duration-500 ease-out hover:bg-[#2a1218] hover:text-[#ff4d4d]"
        >
          {signIn.isPending ? "Signing in..." : "Sign in"}
        </Button>
      </form>

      <p className="text-sm text-muted-foreground">
        New to NexCart?{" "}
        <Link
          href="/register"
          className="font-medium text-[#ff4d4d] hover:underline"
        >
          Create an account
        </Link>
      </p>
    </div>
  );
}
