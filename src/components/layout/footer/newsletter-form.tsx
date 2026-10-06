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
        className="h-11 min-w-0 flex-1 rounded-full border border-primary/40 bg-white/5 px-4 text-sm text-white outline-none placeholder:text-white/45 focus:border-primary"
      />
      <button
        type="submit"
        className="auth-orange-button h-11 shrink-0 px-5 text-sm"
      >
        Join
      </button>
    </form>
  );
}
