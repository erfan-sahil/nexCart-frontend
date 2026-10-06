"use client";

import { useState } from "react";

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
      <input
        id="newsletter-email"
        type="email"
        required
        placeholder="Email address"
        className="h-11 min-w-0 flex-1 rounded-full border border-white/15 bg-white/5 px-4 text-sm text-white outline-none placeholder:text-white/40 focus:border-primary"
      />
      <button
        type="submit"
        className="h-11 shrink-0 rounded-full bg-primary px-4 text-sm font-medium text-primary-foreground hover:bg-brand-hover"
      >
        Join
      </button>
    </form>
  );
}
