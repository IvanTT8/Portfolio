"use client";

import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState, type KeyboardEvent } from "react";
import type { NavLink } from "@/lib/navigation";
import { ThemeToggle } from "./theme-toggle";

type Item = NavLink & { external?: boolean };

export function CommandMenu({ links, resumeUrl }: { links: NavLink[]; resumeUrl?: string }) {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);

  const items = useMemo<Item[]>(() => {
    const all: Item[] = [...links];
    if (resumeUrl) all.push({ label: "Resume", href: resumeUrl, external: true });
    return all.filter((item) => item.label.toLowerCase().includes(query.trim().toLowerCase()));
  }, [links, resumeUrl, query]);

  function close() {
    setOpen(false);
    setQuery("");
    setActive(0);
  }

  useEffect(() => {
    function onKeyDown(event: globalThis.KeyboardEvent) {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setOpen((value) => !value);
      }
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  function go(item: Item) {
    close();
    if (item.external) window.open(item.href, "_blank", "noreferrer");
    else router.push(item.href);
  }

  function onInputKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === "Escape") close();
    if (event.key === "ArrowDown") {
      event.preventDefault();
      setActive((value) => Math.min(value + 1, items.length - 1));
    }
    if (event.key === "ArrowUp") {
      event.preventDefault();
      setActive((value) => Math.max(value - 1, 0));
    }
    if (event.key === "Enter" && items[active]) go(items[active]);
  }

  return (
    <>
      <button
        type="button"
        aria-label="Open command menu"
        aria-haspopup="dialog"
        onClick={() => setOpen(true)}
        className="flex size-9 items-center justify-center rounded-full text-lg transition-colors hover:bg-chip"
      >
        ⌘
      </button>
      {open && (
        <div
          className="fixed inset-0 z-[70] flex items-start justify-center bg-black/40 px-4 pt-20 backdrop-blur-sm"
          onClick={(event) => {
            if (event.target === event.currentTarget) close();
          }}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-label="Command menu"
            className="w-full max-w-[520px] overflow-hidden rounded-2xl border border-border bg-surface shadow-2xl"
          >
            <div className="flex items-center gap-3 border-b border-border px-3 py-2">
              <svg viewBox="0 0 24 24" className="size-5 shrink-0 text-muted" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
                <circle cx="11" cy="11" r="7" />
                <path d="M16.5 16.5 21 21" />
              </svg>
              <input
                ref={inputRef}
                value={query}
                onChange={(event) => {
                  setQuery(event.target.value);
                  setActive(0);
                }}
                onKeyDown={onInputKeyDown}
                placeholder="Search here..."
                aria-label="Search pages"
                className="min-w-0 flex-1 bg-transparent py-1.5 text-sm outline-none focus-visible:outline-none placeholder:text-muted"
              />
              <ThemeToggle />
              <button
                type="button"
                onClick={close}
                className="rounded-md border border-border bg-chip px-2 py-1 text-xs"
              >
                esc
              </button>
            </div>
            <p className="px-4 pb-1 pt-3 text-xs font-medium text-muted">Navigation</p>
            <ul className="px-2 pb-2">
              {items.map((item, index) => (
                <li key={item.href}>
                  <button
                    type="button"
                    onMouseEnter={() => setActive(index)}
                    onClick={() => go(item)}
                    className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-sm ${index === active ? "bg-chip" : ""}`}
                  >
                    {item.label}
                    {item.external && <span aria-hidden="true">↗</span>}
                  </button>
                </li>
              ))}
              {items.length === 0 && <li className="px-3 py-2 text-sm text-muted">No results.</li>}
            </ul>
          </div>
        </div>
      )}
    </>
  );
}
