import Image from "next/image";

/** The site's logo: the owner's photo in a circle. Size it with a `size-*` class. */
export function Logo({ photoUrl, className = "size-9" }: { photoUrl: string; className?: string }) {
  return (
    <span className={`relative block overflow-hidden rounded-full ${className}`}>
      <Image src={photoUrl} alt="" fill loading="eager" sizes="96px" className="origin-[47%_36%] scale-[1.45] object-cover" />
    </span>
  );
}

const FEATHERS = [
  "M2 46C34 44 78 34 118 4",
  "M8 40C40 36 80 26 114 2",
  "M16 34C44 30 80 20 108 2",
  "M26 28C50 24 78 16 100 3",
  "M38 24C56 20 74 13 90 5",
  "M4 52C36 50 78 42 112 22",
  "M14 56C42 54 74 48 100 34",
];

/** An original wing, drawn as curved feather strokes that fade towards the tip. */
function Wing({ side }: { side: "left" | "right" }) {
  const id = `wing-fade-${side}`;
  return (
    <svg
      viewBox="0 0 120 60"
      aria-hidden="true"
      className={`absolute top-1/2 h-14 w-28 -translate-y-1/2 text-muted ${
        side === "left" ? "right-[calc(100%-1.25rem)] -scale-x-100" : "left-[calc(100%-1.25rem)]"
      }`}
    >
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="currentColor" stopOpacity="0.9" />
          <stop offset="1" stopColor="currentColor" stopOpacity="0.1" />
        </linearGradient>
      </defs>
      {FEATHERS.map((path) => (
        <path key={path} d={path} fill="none" stroke={`url(#${id})`} strokeWidth="1.3" strokeLinecap="round" />
      ))}
    </svg>
  );
}

/** Ringed medallion holding the logo, with optional wings either side. */
export function Medallion({ photoUrl, winged = false }: { photoUrl: string; winged?: boolean }) {
  return (
    <span className="relative flex size-[92px] items-center justify-center rounded-full border border-border">
      {winged && <Wing side="left" />}
      {winged && <Wing side="right" />}
      <span className="relative flex size-[78px] items-center justify-center rounded-full border border-indigo-400/30 bg-gradient-to-b from-sky-200 to-transparent shadow-[0_0_24px_rgba(79,70,229,0.35)] dark:from-indigo-950 dark:to-[#05071a]">
        <Logo photoUrl={photoUrl} className="size-[60px]" />
      </span>
    </span>
  );
}
