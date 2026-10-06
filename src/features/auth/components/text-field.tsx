"use client";

import { useId, useState, type ComponentProps } from "react";
import { Eye, EyeOff } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type TextFieldProps = {
  label: string;
  error?: string;
  hint?: string;
} & ComponentProps<typeof Input>;

export function TextField({
  label,
  error,
  hint,
  id,
  className,
  ...props
}: TextFieldProps) {
  const generatedId = useId();
  const fieldId = id ?? generatedId;
  const descriptionId = `${fieldId}-description`;

  return (
    <div className="grid gap-2">
      <Label htmlFor={fieldId}>{label}</Label>
      <Input
        id={fieldId}
        aria-invalid={Boolean(error)}
        aria-describedby={error || hint ? descriptionId : undefined}
        className={className ?? "h-10"}
        {...props}
      />
      {error ? (
        <p id={descriptionId} className="text-sm text-destructive">
          {error}
        </p>
      ) : hint ? (
        <p id={descriptionId} className="text-sm text-muted-foreground">
          {hint}
        </p>
      ) : null}
    </div>
  );
}

type PasswordFieldProps = Omit<TextFieldProps, "type">;

export function PasswordField({
  label,
  error,
  id,
  ...props
}: PasswordFieldProps) {
  const [visible, setVisible] = useState(false);
  const generatedId = useId();
  const fieldId = id ?? generatedId;
  const descriptionId = `${fieldId}-description`;

  return (
    <div className="grid gap-2">
      <Label htmlFor={fieldId}>{label}</Label>
      <div className="relative">
        <Input
          id={fieldId}
          type={visible ? "text" : "password"}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? descriptionId : undefined}
          className="h-10 pr-10"
          {...props}
        />
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="absolute top-1/2 right-1 -translate-y-1/2 text-muted-foreground"
          onClick={() => setVisible((current) => !current)}
          aria-label={visible ? "Hide password" : "Show password"}
          aria-pressed={visible}
        >
          {visible ? <EyeOff /> : <Eye />}
        </Button>
      </div>
      {error ? (
        <p id={descriptionId} className="text-sm text-destructive">
          {error}
        </p>
      ) : null}
    </div>
  );
}
