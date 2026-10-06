import { useId, type ReactNode } from "react";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

type FieldProps = {
  label: string;
  htmlFor?: string;
  error?: string;
  hint?: string;
  children: ReactNode;
};

export function Field({ label, htmlFor, error, hint, children }: FieldProps) {
  return (
    <div className="grid gap-2">
      <Label htmlFor={htmlFor}>{label}</Label>
      {children}
      {error ? (
        <p className="text-sm text-destructive">{error}</p>
      ) : hint ? (
        <p className="text-sm text-muted-foreground">{hint}</p>
      ) : null}
    </div>
  );
}

type TextInputProps = {
  label: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  hint?: string;
  type?: string;
  autoComplete?: string;
  placeholder?: string;
};

export function TextInput({
  label,
  value,
  onChange,
  error,
  hint,
  type = "text",
  autoComplete,
  placeholder,
}: TextInputProps) {
  const id = useId();

  return (
    <Field label={label} htmlFor={id} error={error} hint={hint}>
      <Input
        id={id}
        value={value}
        type={type}
        autoComplete={autoComplete}
        placeholder={placeholder}
        aria-invalid={Boolean(error)}
        className="h-10"
        onChange={(event) => onChange(event.target.value)}
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
