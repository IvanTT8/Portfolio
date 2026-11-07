"use client";

import { motion, useMotionValue, useSpring } from "motion/react";
import Link from "next/link";
import { useState, type MouseEvent, type ReactNode } from "react";

const BADGE_RADIUS = 48;
const BADGE_TEXT = "VIEW DETAILS   •   VIEW DETAILS   •   ";

function CursorBadge({ x, y, visible }: { x: ReturnType<typeof useSpring>; y: ReturnType<typeof useSpring>; visible: boolean }) {
  return (
    <motion.div
      aria-hidden="true"
      className="pointer-events-none absolute left-0 top-0 z-20 max-md:hidden"
      style={{ x, y }}
      initial={false}
      animate={{ scale: visible ? 1 : 0, opacity: visible ? 1 : 0 }}
      transition={{ duration: 0.25 }}
    >
      <div className="rounded-full border border-white/25 bg-white/5 backdrop-blur-md">
        <div className="relative size-24">
          <svg viewBox="0 0 100 100" className="spin-badge absolute inset-0 size-full p-1">
            <defs>
              <path id="badge-circle" d="M50 50m-38 0a38 38 0 1 1 76 0a38 38 0 1 1-76 0" />
            </defs>
            <text fill="white" fontSize="10.5" letterSpacing="1.2" xmlSpace="preserve">
              <textPath href="#badge-circle">{BADGE_TEXT}</textPath>
            </text>
          </svg>
          <span className="absolute inset-0 flex items-center justify-center text-white">↗</span>
        </div>
      </div>
    </motion.div>
  );
}

type Props = { href?: string; className?: string; children: ReactNode };

/** Lifts on hover, with a spinning badge that trails the cursor when the card is a link. */
export function WorkCardFrame({ href, className = "", children }: Props) {
  const [hovering, setHovering] = useState(false);
  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const spring = { stiffness: 300, damping: 30, mass: 0.4 };
  const x = useSpring(rawX, spring);
  const y = useSpring(rawY, spring);

  function track(event: MouseEvent<HTMLElement>) {
    const box = event.currentTarget.getBoundingClientRect();
    rawX.set(event.clientX - box.left - BADGE_RADIUS);
    rawY.set(event.clientY - box.top - BADGE_RADIUS);
  }

  const handlers = {
    onMouseEnter: (event: MouseEvent<HTMLElement>) => {
      const box = event.currentTarget.getBoundingClientRect();
      // Starts at the cursor, instead of sliding in from the last position.
      x.jump(event.clientX - box.left - BADGE_RADIUS);
      y.jump(event.clientY - box.top - BADGE_RADIUS);
      setHovering(true);
    },
    onMouseMove: track,
    onMouseLeave: () => setHovering(false),
  };

  const frame = `work-card group/card relative block transition-[translate] duration-300 ease-in-out hover:-translate-y-2 ${className}`;

  if (!href) {
    return (
      <div className={frame}>
        {children}
      </div>
    );
  }

  return (
    <Link href={href} className={frame} {...handlers}>
      <CursorBadge x={x} y={y} visible={hovering} />
      {children}
    </Link>
  );
}
