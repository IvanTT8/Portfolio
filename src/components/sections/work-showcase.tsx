"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

type Item = { id: string; visual: ReactNode; details: ReactNode };

/**
 * Visuals scroll past a single sticky details panel, which crossfades to match the
 * visual crossing the middle of the screen. Below `lg`, details sit under each visual.
 */
export function WorkShowcase({ items }: { items: Item[] }) {
  const [active, setActive] = useState(0);
  const rows = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActive(rows.current.indexOf(entry.target as HTMLDivElement));
        }
      },
      { rootMargin: "-50% 0px -50% 0px" },
    );
    for (const row of rows.current) {
      if (row) observer.observe(row);
    }
    return () => observer.disconnect();
  }, []);

  return (
    <div className="grid items-start gap-8 lg:grid-cols-[1.5fr_1fr] lg:gap-16 [&>*]:min-w-0">
      <div className="space-y-16 lg:space-y-28">
        {items.map((item, index) => (
          <div
            key={item.id}
            ref={(node) => {
              rows.current[index] = node;
            }}
          >
            {item.visual}
            <div className="mt-8 lg:hidden">{item.details}</div>
          </div>
        ))}
      </div>
      <div className="sticky top-28 hidden lg:grid">
        {items.map((item, index) => (
          <div
            key={item.id}
            aria-hidden={index !== active}
            className={`col-start-1 row-start-1 transition-opacity duration-200 ease-in-out ${
              index === active ? "opacity-100" : "pointer-events-none opacity-0"
            }`}
            // Inactive panels stay in the layout, so the column height doesn't jump.
            {...(index === active ? {} : { inert: true })}
          >
            {item.details}
          </div>
        ))}
      </div>
    </div>
  );
}
