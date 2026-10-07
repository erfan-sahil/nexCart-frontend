"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Controller, useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { ApiError } from "@/lib/api/errors";

import { register as registerAccount } from "../api";
import { splitApiError } from "../lib/api-errors";
import { fieldErrorResolver } from "../lib/resolver";
import { validateRegister, type RegisterValues } from "../lib/validation";
import { sessionQueryKey } from "../query";
import { useAuthStore } from "../store";
import { PhoneField } from "./phone-field";
import { PasswordField, TextField } from "./text-field";

export function RegisterForm() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const {
    register,
    control,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<RegisterValues>({
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      password: "",
      confirmPassword: "",
    },
    resolver: fieldErrorResolver(validateRegister),
  });

  const createAccount = useMutation({
    mutationFn: registerAccount,
    onSuccess: (session) => {
      useAuthStore.getState().setSession(session);
      queryClient.setQueryData(sessionQueryKey, session);
      router.push("/");
      router.refresh();
    },
    onError: (error) => {
      if (error instanceof ApiError) {
        const next = splitApiError<keyof RegisterValues>(error);

        for (const [field, message] of Object.entries(next.fields)) {
          if (message) setError(field as keyof RegisterValues, { message });
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
          Create your account
        </h1>
        <p className="text-sm text-muted-foreground">
          Join NexCart to shop independent stores and follow your orders.
        </p>
      </div>

      <form
        className="space-y-5"
        noValidate
        onSubmit={handleSubmit((values) =>
          createAccount.mutate({
            firstName: values.firstName,
            lastName: values.lastName,
            email: values.email,
            phone: values.phone,
            password: values.password,
          }),
        )}
      >
        {errors.root?.message ? (
          <p role="alert" className="text-sm text-destructive">
            {errors.root.message}
          </p>
        ) : null}
        <div className="grid gap-5 sm:grid-cols-2">
          <TextField
            label="First name"
            autoComplete="given-name"
            placeholder="Sahil"
            error={errors.firstName?.message}
            {...register("firstName")}
          />
          <TextField
            label="Last name"
            autoComplete="family-name"
            placeholder="Rahman"
            error={errors.lastName?.message}
            {...register("lastName")}
          />
        </div>
        <TextField
          type="email"
          label="Email"
          autoComplete="email"
          placeholder="you@example.com"
          error={errors.email?.message}
          {...register("email")}
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
            />
          )}
        />
        <PasswordField
          label="Password"
          autoComplete="new-password"
          placeholder="At least 8 characters"
          error={errors.password?.message}
          {...register("password")}
        />
        <PasswordField
          label="Confirm password"
          autoComplete="new-password"
          placeholder="Repeat your password"
          error={errors.confirmPassword?.message}
          {...register("confirmPassword")}
        />
        <Button
          type="submit"
          size="lg"
          disabled={createAccount.isPending}
          className="auth-orange-button auth-dark-button h-12 w-full rounded-full duration-500 ease-out hover:bg-[#ff4d4d] hover:text-[#2a1218]"
        >
          {createAccount.isPending ? "Creating account..." : "Create account"}
        </Button>
      </form>

      <p className="text-sm text-muted-foreground">
        Already have an account?{" "}
        <Link
          href="/login"
          className="font-medium text-[#ff4d4d] hover:underline"
        >
          Sign in
        </Link>
      </p>
    </div>
  );
}
