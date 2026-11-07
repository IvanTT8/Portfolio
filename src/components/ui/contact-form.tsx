"use client";

import { useState, type FormEvent } from "react";
import { buildContactMailto, MAX_MESSAGE_LENGTH } from "@/lib/contact";

const FIELD = "w-full rounded-lg border border-border bg-surface px-3 py-2.5 text-sm outline-none transition-colors placeholder:text-muted focus-visible:border-foreground/40 focus-visible:outline-none";

/** Opens the visitor's email app with the message filled in, so it needs no server. */
export function ContactForm({ email }: { email: string }) {
  const [length, setLength] = useState(0);
  const [sent, setSent] = useState(false);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    window.location.href = buildContactMailto(email, {
      name: String(data.get("name")),
      email: String(data.get("email")),
      message: String(data.get("message")),
    });
    setSent(true);
  }

  return (
    <form onSubmit={handleSubmit} className="mt-10 space-y-4 text-left">
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block text-xs font-semibold">
          Your Name
          <input name="name" required autoComplete="name" placeholder="Enter your name" className={`${FIELD} mt-2 font-normal`} />
        </label>
        <label className="block text-xs font-semibold">
          Email Address
          <input name="email" type="email" required autoComplete="email" placeholder="Enter your email address" className={`${FIELD} mt-2 font-normal`} />
        </label>
      </div>
      <label className="block text-xs font-semibold">
        <span className="flex items-center justify-between">
          Message
          <span className="font-normal text-muted">
            {length}/{MAX_MESSAGE_LENGTH}
          </span>
        </span>
        <textarea
          name="message"
          required
          rows={6}
          maxLength={MAX_MESSAGE_LENGTH}
          placeholder="What would you like to discuss?"
          onChange={(event) => setLength(event.target.value.length)}
          className={`${FIELD} mt-2 resize-y font-normal`}
        />
      </label>
      <button
        type="submit"
        className="flex w-full items-center justify-center gap-2 rounded-lg bg-foreground py-2.5 text-sm font-medium text-background transition-opacity hover:opacity-90"
      >
        <span aria-hidden="true">➤</span>
        Send Message
      </button>
      {sent && (
        <p role="status" className="text-center text-sm text-muted">
          Your email app should open with this message. If it doesn&apos;t, write to {email}.
        </p>
      )}
    </form>
  );
}
