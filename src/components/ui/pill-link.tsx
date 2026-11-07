import Link from "next/link";
import { ArrowBadge, ArrowIcon } from "./section";

/** Grey capsule with a dark circular arrow at its end. */
export function PillLink({
  href,
  label,
  className = "",
}: {
  href: string;
  label: string;
  className?: string;
}) {
  return (
    <Link
      href={href}
      className={`group relative inline-flex h-12 items-center rounded-full border border-muted/30 bg-chip pl-6 pr-14 font-medium ${className}`}
    >
      <span className="transition-opacity duration-300 group-hover:opacity-0">{label}</span>
      <span className="absolute inset-y-1 right-1 flex w-10 items-center justify-end rounded-full bg-pill pr-2.5 text-pill-foreground transition-[width] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:w-[calc(100%-0.5rem)]">
        <ArrowIcon className="size-5" />
      </span>
    </Link>
  );
}

export function TextLink({ href, label }: { href: string; label: string }) {
  return (
    <Link href={href} className="group inline-flex items-center gap-2 font-medium">
      {label}
      <ArrowBadge />
    </Link>
  );
}
