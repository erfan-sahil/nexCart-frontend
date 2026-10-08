"use client";

import { useState } from "react";

import { Input } from "@/components/ui/input";

export function NewsletterForm() {
  const [submitted, setSubmitted] = useState(false);

  if (submitted) {
    return (
      <p className="text-sm text-primary">
        You are on the list. Welcome aboard.
      </p>
    );
  }

  return (
    <form
      className="flex gap-2"
      onSubmit={(event) => {
        event.preventDefault();
        setSubmitted(true);
      }}
    >
      <label htmlFor="newsletter-email" className="sr-only">
        Email address
      </label>
      <Input
        id="newsletter-email"
        type="email"
        required
        placeholder="Email address"
        className="h-12 min-w-0 flex-1 rounded-full border-white/20 bg-white/5 px-4 text-sm text-white placeholder:text-white/45 focus-visible:border-primary"
      />
      <button
        type="submit"
        className="inline-flex h-12 shrink-0 items-center rounded-full border border-border bg-card px-6 text-sm font-semibold text-foreground transition-colors duration-300 hover:border-primary hover:bg-brand-soft"
      >
        Join
      </button>
    </form>
  );
}
