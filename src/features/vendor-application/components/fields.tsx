import { useId, type ComponentProps, type ReactNode } from "react";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

type FieldProps = {
  label: string;
  htmlFor?: string;
  error?: string;
  hint?: string;
  descriptionId?: string;
  children: ReactNode;
};

export function Field({
  label,
  htmlFor,
  error,
  hint,
  descriptionId,
  children,
}: FieldProps) {
  return (
    <div className="grid gap-2">
      <Label htmlFor={htmlFor}>{label}</Label>
      {children}
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

type TextInputProps = {
  label: string;
  error?: string;
  hint?: string;
} & ComponentProps<typeof Input>;

export function TextInput({
  label,
  error,
  hint,
  id,
  className,
  ...props
}: TextInputProps) {
  const generatedId = useId();
  const fieldId = id ?? generatedId;
  const descriptionId = `${fieldId}-description`;

  return (
    <Field
      label={label}
      htmlFor={fieldId}
      error={error}
      hint={hint}
      descriptionId={descriptionId}
    >
      <Input
        id={fieldId}
        aria-invalid={Boolean(error)}
        aria-describedby={error || hint ? descriptionId : undefined}
        className={className ?? "h-10"}
        {...props}
      />
    </Field>
  );
}

type ChoiceProps = {
  label: string;
  selected: boolean;
  onSelect: () => void;
};

export function Choice({ label, selected, onSelect }: ChoiceProps) {
  return (
    <button
      type="button"
      aria-pressed={selected}
      onClick={onSelect}
      className={cn(
        "rounded-2xl border px-4 py-3 text-left text-sm font-medium transition-colors",
        selected
          ? "border-primary bg-brand-soft text-foreground"
          : "border-border bg-background text-foreground hover:border-primary/50",
      )}
    >
      {label}
    </button>
  );
}
