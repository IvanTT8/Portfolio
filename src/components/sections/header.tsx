"use client";

import { motion } from "motion/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useRef, useState } from "react";
import { CommandMenu } from "@/components/ui/command-menu";
import { Logo } from "@/components/ui/monogram";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { CONTACT_LINK, MORE_LINKS, type NavLink } from "@/lib/navigation";

const FEATURE_STYLES = [
  "from-sky-500 via-blue-700 to-indigo-950",
  "from-amber-500 via-rose-700 to-stone-950",
];

function isActive(pathname: string, href: string): boolean {
  return href === "/" ? pathname === "/" : pathname.startsWith(href);
}

type Props = { name: string; photoUrl: string; links: NavLink[]; resumeUrl?: string };

function MoreMenu({ pathname }: { pathname: string }) {
  const [open, setOpen] = useState(false);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [features, rest] = [MORE_LINKS.slice(0, 2), MORE_LINKS.slice(2)];
  const active = MORE_LINKS.some((link) => isActive(pathname, link.href));

  function show() {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setOpen(true);
  }

  function hide() {
    closeTimer.current = setTimeout(() => setOpen(false), 120);
  }

  return (
    <div
      className="relative"
      onMouseEnter={show}
      onMouseLeave={hide}
      onKeyDown={(event) => {
        if (event.key === "Escape") setOpen(false);
      }}
    >
      <button
        type="button"
        aria-expanded={open}
        aria-haspopup="true"
        onClick={() => setOpen((value) => !value)}
        className={`flex items-center gap-1 rounded-full px-4 py-1.5 text-sm font-medium ${active ? "bg-pill text-pill-foreground" : ""}`}
      >
        More
        <svg viewBox="0 0 24 24" className={`size-3 transition-transform ${open ? "rotate-180" : ""}`} fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
          <path d="m6 9 6 6 6-6" />
        </svg>
      </button>
      {open && (
        <motion.div
          initial={{ opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.18 }}
          className="absolute left-1/2 top-full w-[700px] -translate-x-[58%] pt-3"
        >
          <div className="grid grid-cols-3 gap-2.5 rounded-2xl border border-border bg-surface p-2.5 shadow-xl">
            {features.map((link, index) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className={`flex h-48 flex-col justify-end rounded-xl bg-gradient-to-br p-4 text-white ${FEATURE_STYLES[index]}`}
              >
                <span className="font-semibold">{link.label}</span>
                <span className="text-xs text-white/85">{link.description}</span>
              </Link>
            ))}
            <div className="flex flex-col gap-2.5">
              {[...rest, { ...CONTACT_LINK, description: "Email, phone and LinkedIn" }].map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="flex flex-1 flex-col justify-center rounded-xl border border-border px-4 transition-colors hover:bg-chip"
                >
                  <span className="text-sm font-semibold">{link.label}</span>
                  <span className="text-xs text-muted">{link.description}</span>
                </Link>
              ))}
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}

export function Header({ name, photoUrl, links, resumeUrl }: Props) {
  const pathname = usePathname();
  const commandLinks = [...links, ...MORE_LINKS, CONTACT_LINK];

  return (
    <>
      <div aria-hidden="true" className="top-fade pointer-events-none fixed inset-x-0 top-0 z-30 h-20" />
      <header className="fixed inset-x-0 top-0 z-40">
        <div className="mx-auto flex h-[78px] max-w-[1280px] items-center justify-between px-4">
          <Link href="/" aria-label={`${name}, home`} className="w-20">
            <Logo photoUrl={photoUrl} />
          </Link>
          <nav
            aria-label="Main"
            className="hidden items-center rounded-full border border-border bg-background/70 p-0.5 backdrop-blur md:flex"
          >
            {links.map((link) => {
              const active = isActive(pathname, link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  aria-current={active ? "page" : undefined}
                  className={`relative rounded-full px-4 py-1.5 text-sm font-medium transition-colors duration-150 ${active ? "font-semibold text-pill-foreground" : "text-foreground/80 hover:text-foreground"}`}
                >
                  {active && (
                    <motion.span
                      layoutId="nav-active"
                      className="absolute inset-0 -z-10 rounded-full bg-pill"
                      transition={{ type: "spring", stiffness: 380, damping: 32 }}
                    >
                      <span className="absolute -top-2 left-1/2 h-1 w-8 -translate-x-1/2 rounded-full bg-foreground/70">
                        <span className="absolute -inset-x-1 top-0 h-6 rounded-full bg-foreground/25 blur-md" />
                      </span>
                    </motion.span>
                  )}
                  {link.label}
                </Link>
              );
            })}
            <MoreMenu pathname={pathname} />
            <Link
              href={CONTACT_LINK.href}
              className="ml-1 rounded-full bg-pill px-4 py-1.5 text-sm text-pill-foreground"
            >
              {CONTACT_LINK.label}
            </Link>
          </nav>
          <div className="flex w-20 items-center justify-end gap-1">
            <ThemeToggle className="md:hidden" />
            <CommandMenu links={commandLinks} resumeUrl={resumeUrl} />
          </div>
        </div>
      </header>
    </>
  );
}
