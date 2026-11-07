"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef, useState, type ChangeEvent } from "react";

/** Renders nothing for visitors. The server checks the session again on upload. */
export function PhotoUpload() {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [signedIn, setSignedIn] = useState(false);
  const [status, setStatus] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    let active = true;
    fetch("/api/session")
      .then((response) => response.json() as Promise<{ authenticated: boolean }>)
      .then(({ authenticated }) => {
        if (active) setSignedIn(authenticated);
      })
      .catch(() => {});
    return () => {
      active = false;
    };
  }, []);

  if (!signedIn) return null;

  async function handleFile(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;

    setUploading(true);
    setStatus(null);
    const body = new FormData();
    body.append("photo", file);

    try {
      const response = await fetch("/api/photo", { method: "POST", body });
      if (response.ok) {
        setStatus("Photo updated.");
        router.refresh();
      } else {
        const data = (await response.json()) as { error?: string };
        setStatus(data.error ?? "The upload failed. Try again.");
      }
    } catch {
      setStatus("The upload failed. Check your connection and try again.");
    }
    setUploading(false);
  }

  async function signOut() {
    await fetch("/api/logout", { method: "POST" });
    setSignedIn(false);
    setStatus(null);
  }

  return (
    <div className="mt-5 flex flex-wrap items-center gap-3">
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        className="hidden"
        aria-label="Profile photo"
        onChange={handleFile}
      />
      <button
        type="button"
        disabled={uploading}
        onClick={() => inputRef.current?.click()}
        className="rounded-full bg-pill px-4 py-2 text-sm font-medium text-pill-foreground disabled:opacity-60"
      >
        {uploading ? "Uploading…" : "Upload photo"}
      </button>
      <button type="button" onClick={signOut} className="text-sm text-muted underline underline-offset-4">
        Sign out
      </button>
      {status && (
        <p role="status" className="w-full text-sm text-muted">
          {status}
        </p>
      )}
    </div>
  );
}
