import type { ReactNode } from "react";

export function Container({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={`w-full px-4 sm:px-6 ${className}`}>{children}</div>;
}

export function Eyebrow({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <p className={`shimmer text-sm uppercase ${className}`}>{children}</p>;
}

type HeadingProps = {
  label: string;
  title: string;
  accent: string;
  /** Puts the accent on its own line. */
  stacked?: boolean;
  align?: "center" | "left";
  level?: "h1" | "h2";
};

export function SectionHeading({
  label,
  title,
  accent,
  stacked = false,
  align = "center",
  level = "h2",
}: HeadingProps) {
  const Heading = level;

  return (
    <div className={align === "center" ? "text-center" : ""}>
      <Eyebrow>{label}</Eyebrow>
      <Heading className="mt-3 font-serif text-5xl leading-[1.05] tracking-tight sm:text-6xl">
        {title} {stacked && <br />}
        <span className="gradient-text">{accent}</span>
      </Heading>
    </div>
  );
}

export function ArrowIcon({ className = "size-4" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
      <path d="M4 12h15M13 6l6 6-6 6" />
    </svg>
  );
}

/** Small dashed circle holding an arrow, used on text links. */
export function ArrowBadge() {
  return (
    <span className="block size-[25px] overflow-hidden rounded-full border border-dashed border-muted/60 transition-colors duration-500 group-hover:bg-chip">
      <span className="flex w-12 -translate-x-1/2 transition-transform duration-500 ease-in-out group-hover:translate-x-0">
        <span className="flex size-6 items-center justify-center">
          <ArrowIcon className="size-3.5" />
        </span>
        <span className="flex size-6 items-center justify-center">
          <ArrowIcon className="size-3.5" />
        </span>
      </span>
    </span>
  );
}
