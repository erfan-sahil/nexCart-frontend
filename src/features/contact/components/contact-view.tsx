"use client";

import Link from "next/link";
import { ArrowRight, Check, Mail, Clock3 } from "lucide-react";
import {
  useEffect,
  useId,
  useRef,
  useState,
  type FormEvent,
  type ReactNode,
} from "react";

import { Container, PageBreadcrumb } from "@/components/common";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useMe } from "@/features/auth/use-me";
import { cn } from "@/lib/utils";

const TOPICS = [
  { value: "order", label: "An order" },
  { value: "return", label: "A return" },
  { value: "account", label: "My account" },
  { value: "selling", label: "Selling on NexCart" },
  { value: "other", label: "Something else" },
] as const;

type Topic = (typeof TOPICS)[number]["value"];

type ContactValues = {
  name: string;
  email: string;
  topic: Topic | "";
  orderId: string;
  message: string;
};

type FieldErrors = Partial<Record<keyof ContactValues, string>>;

const EMPTY: ContactValues = {
  name: "",
  email: "",
  topic: "",
  orderId: "",
  message: "",
};

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const fieldClass =
  "h-11 w-full min-w-0 rounded-xl border border-input bg-background px-3 text-sm text-foreground shadow-none transition-colors outline-none placeholder:text-muted-foreground hover:bg-background focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 data-[size=default]:h-11 dark:bg-background dark:hover:bg-background dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40";

function needsOrder(topic: ContactValues["topic"]) {
  return topic === "order" || topic === "return";
}

function validate(values: ContactValues): FieldErrors {
  const errors: FieldErrors = {};
  const name = values.name.trim();
  const email = values.email.trim();
  const message = values.message.trim();

  if (!name) errors.name = "Enter your name";
  else if (name.length > 80)
    errors.name = "Name must be 80 characters or fewer";

  if (!email) errors.email = "Enter your email";
  else if (!EMAIL_PATTERN.test(email)) errors.email = "Enter a valid email";

  if (!values.topic) errors.topic = "Choose what this is about";

  if (needsOrder(values.topic) && !values.orderId.trim()) {
    errors.orderId = "Add the order number";
  }

  if (message.length < 12) errors.message = "Write at least a short message";
  else if (message.length > 1000) {
    errors.message = "Message must be 1000 characters or fewer";
  }

  return errors;
}

export function ContactView() {
  const profile = useMe();
  const filled = useRef(false);
  const nameId = useId();
  const emailId = useId();
  const topicId = useId();
  const orderId = useId();
  const messageId = useId();
  const [values, setValues] = useState<ContactValues>(EMPTY);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [sending, setSending] = useState(false);
  const [sentTo, setSentTo] = useState<string | null>(null);

  useEffect(() => {
    const user = profile.data?.user;
    if (!user || filled.current) return;
    filled.current = true;
    setValues((current) => ({
      ...current,
      name: current.name || `${user.firstName} ${user.lastName}`.trim(),
      email: current.email || user.email,
    }));
  }, [profile.data]);

  function update<K extends keyof ContactValues>(
    key: K,
    value: ContactValues[K],
  ) {
    setValues((current) => ({ ...current, [key]: value }));
    setErrors((current) => ({ ...current, [key]: undefined }));
  }

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const next = validate(values);
    setErrors(next);
    if (Object.keys(next).length > 0) return;

    setSending(true);
    window.setTimeout(() => {
      setSending(false);
      setSentTo(values.email.trim());
    }, 500);
  }

  return (
    <Container className="py-8 sm:py-10">
      <PageBreadcrumb
        items={[{ label: "Home", href: "/" }, { label: "Contact us" }]}
      />

      <section className="mt-6 overflow-hidden rounded-3xl border border-border bg-card lg:grid lg:min-h-[34rem] lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
        <div className="flex flex-col justify-between bg-surface-dark px-6 py-8 text-[#fff4f2] sm:px-8 sm:py-10">
          <div>
            <p className="text-xs font-semibold tracking-[0.18em] text-primary uppercase">
              Support
            </p>
            <h1 className="mt-3 max-w-sm text-3xl text-balance text-white sm:text-4xl">
              Contact us
            </h1>
            <p className="mt-3 max-w-sm text-sm leading-6 text-white/65">
              Questions about an order, a return, or selling on NexCart. Send a
              note and we reply by email.
            </p>
          </div>

          <dl className="mt-10 space-y-4 text-sm">
            <div className="flex items-start gap-3">
              <Mail className="mt-0.5 size-4 text-primary" />
              <div>
                <dt className="text-white/50">Email</dt>
                <dd className="mt-0.5 font-medium">support@nexcart.com</dd>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Clock3 className="mt-0.5 size-4 text-primary" />
              <div>
                <dt className="text-white/50">Hours</dt>
                <dd className="mt-0.5 font-medium">Every day, 9:00–21:00</dd>
              </div>
            </div>
          </dl>

          <p className="mt-8 text-sm text-white/65">
            Already have a number?{" "}
            <Link
              href="/track-order"
              className="font-medium text-white hover:text-primary"
            >
              Track an order
            </Link>
          </p>
        </div>

        <div className="px-6 py-8 sm:px-8 sm:py-10">
          {sentTo ? (
            <div className="flex h-full flex-col justify-center">
              <span className="inline-flex size-11 items-center justify-center rounded-full bg-brand-soft text-primary">
                <Check className="size-5" />
              </span>
              <h2 className="mt-4 font-display text-2xl tracking-tight">
                Message sent
              </h2>
              <p className="mt-2 max-w-md text-sm leading-6 text-muted-foreground">
                We received your note and will reply to {sentTo}.
              </p>
              <Button
                variant="outline"
                className="mt-6 h-11 w-fit rounded-full px-5"
                onClick={() => {
                  setSentTo(null);
                  setValues((current) => ({
                    ...EMPTY,
                    name: current.name,
                    email: current.email,
                  }));
                }}
              >
                Send another
              </Button>
            </div>
          ) : (
            <form className="grid gap-4" noValidate onSubmit={onSubmit}>
              <div>
                <h2 className="font-display text-2xl tracking-tight">
                  Send a message
                </h2>
                <p className="mt-1.5 text-sm leading-6 text-muted-foreground">
                  Share a few details and we will reply to the email you enter.
                </p>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Name" id={nameId} error={errors.name}>
                  <Input
                    id={nameId}
                    value={values.name}
                    autoComplete="name"
                    placeholder="Your name"
                    className={fieldClass}
                    aria-invalid={Boolean(errors.name)}
                    onChange={(event) => update("name", event.target.value)}
                  />
                </Field>
                <Field label="Email" id={emailId} error={errors.email}>
                  <Input
                    id={emailId}
                    type="email"
                    value={values.email}
                    autoComplete="email"
                    placeholder="you@email.com"
                    className={fieldClass}
                    aria-invalid={Boolean(errors.email)}
                    onChange={(event) => update("email", event.target.value)}
                  />
                </Field>
              </div>

              <Field label="Topic" id={topicId} error={errors.topic}>
                <Select
                  items={TOPICS}
                  value={values.topic || null}
                  onValueChange={(value) => update("topic", value ?? "")}
                >
                  <SelectTrigger
                    id={topicId}
                    aria-invalid={Boolean(errors.topic)}
                    className={cn(fieldClass, "justify-between font-normal")}
                  >
                    <SelectValue placeholder="Choose a topic" />
                  </SelectTrigger>
                  <SelectContent align="start" className="p-1">
                    {TOPICS.map((topic) => (
                      <SelectItem key={topic.value} value={topic.value}>
                        {topic.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Field>

              {needsOrder(values.topic) ? (
                <Field label="Order number" id={orderId} error={errors.orderId}>
                  <Input
                    id={orderId}
                    value={values.orderId}
                    autoComplete="off"
                    placeholder="NX-48291"
                    className={cn(fieldClass, "uppercase")}
                    aria-invalid={Boolean(errors.orderId)}
                    onChange={(event) =>
                      update("orderId", event.target.value.toUpperCase())
                    }
                  />
                </Field>
              ) : null}

              <Field label="Message" id={messageId} error={errors.message}>
                <textarea
                  id={messageId}
                  value={values.message}
                  rows={6}
                  placeholder="Tell us what happened"
                  aria-invalid={Boolean(errors.message)}
                  className={cn(
                    fieldClass,
                    "h-auto min-h-36 resize-y py-3 leading-6",
                  )}
                  onChange={(event) => update("message", event.target.value)}
                />
              </Field>

              <Button
                type="submit"
                className="auth-orange-button mt-1 w-full sm:w-fit sm:px-8"
                disabled={sending}
              >
                {sending ? "Sending…" : "Send message"}
                <ArrowRight className="size-4" />
              </Button>
            </form>
          )}
        </div>
      </section>
    </Container>
  );
}

function Field({
  label,
  id,
  error,
  children,
}: {
  label: string;
  id: string;
  error?: string;
  children: ReactNode;
}) {
  return (
    <div className="grid gap-2">
      <Label htmlFor={id}>{label}</Label>
      {children}
      {error ? <p className="text-sm text-destructive">{error}</p> : null}
    </div>
  );
}
