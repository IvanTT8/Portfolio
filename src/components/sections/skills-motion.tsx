"use client";

import { motion, useScroll, useSpring, useTransform } from "motion/react";
import { useRef, type CSSProperties, type ReactNode } from "react";

const PETALS = [0, 40, 80, 120, 160, 200, 240, 280, 320];

/** Degrees turned across the section's trip through the viewport. */
const BLOOM_TURN = 120;

/** Follows scrolling closely, with a little lag so it never feels rigid. */
const SCROLL_SPRING = { stiffness: 80, damping: 24, mass: 0.6 };

/** An original metallic bloom, which turns as the page scrolls. */
export function Bloom() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const target = useTransform(scrollYProgress, [0, 1], [0, BLOOM_TURN]);
  const rotate = useSpring(target, SCROLL_SPRING);

  return (
    <div ref={ref} className="relative mx-auto w-fit overflow-hidden">
      <motion.svg
        data-settled-motion
        viewBox="0 0 320 240"
        className="h-56 w-auto"
        aria-hidden="true"
        style={{ rotate, transformOrigin: "50% 51.6%" }}
      >
        <defs>
          <linearGradient id="petal" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" style={{ stopColor: "var(--petal-1)" }} />
            <stop offset="0.4" style={{ stopColor: "var(--petal-2)" }} />
            <stop offset="0.7" style={{ stopColor: "var(--petal-3)" }} />
            <stop offset="1" style={{ stopColor: "var(--petal-4)" }} />
          </linearGradient>
        </defs>
        {PETALS.map((angle) => (
          <ellipse
            key={angle}
            cx="160"
            cy="62"
            rx="46"
            ry="62"
            fill="url(#petal)"
            opacity="0.82"
            transform={`rotate(${angle} 160 124)`}
          />
        ))}
        <circle cx="160" cy="124" r="20" fill="url(#petal)" />
      </motion.svg>
      {/* Stays still while the bloom turns, so the fade into the heading holds. */}
      <div aria-hidden="true" className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-b from-transparent to-background" />
    </div>
  );
}

type Tile = { name: string; icon: ReactNode };

/**
 * Tiles scatter outward and spin while the section is low on screen, and settle into
 * straight rows as it scrolls up. Scrolling back reverses it. One CSS variable drives
 * every tile, so scrolling doesn't re-render them.
 */
export function SkillTiles({ rows }: { rows: Tile[][] }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 95%", "start 45%"] });
  const progress = useSpring(scrollYProgress, SCROLL_SPRING);

  return (
    <motion.div
      ref={ref}
      className="relative mt-10 space-y-2.5"
      style={{ "--p": progress } as unknown as CSSProperties}
    >
      {rows.map((row, rowIndex) => (
        <div key={row[0].name} className="flex flex-wrap justify-center gap-2.5">
          {row.map((tile, index) => {
            const offset = index - (row.length - 1) / 2;
            return (
              <span
                key={tile.name}
                data-settled-motion
                className="skill-tile group/tile relative block"
                style={
                  {
                    "--o": offset,
                    "--r": rowIndex - (rows.length - 1) / 2,
                    "--a": Math.abs(offset),
                  } as CSSProperties
                }
                title={tile.name}
              >
                <span className="flex size-14 items-center justify-center rounded-2xl border border-border bg-tile shadow-sm transition-transform group-hover/tile:scale-110">
                  {tile.icon}
                </span>
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute -top-8 left-1/2 z-10 -translate-x-1/2 whitespace-nowrap rounded-md bg-foreground px-2 py-1 text-[11px] font-medium text-background opacity-0 transition-opacity group-hover/tile:opacity-100"
                >
                  {tile.name}
                </span>
              </span>
            );
          })}
        </div>
      ))}
    </motion.div>
  );
}
