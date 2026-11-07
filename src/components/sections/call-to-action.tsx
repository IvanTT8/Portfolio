import Link from "next/link";
import { Medallion } from "@/components/ui/monogram";
import { PillLink } from "@/components/ui/pill-link";
import type { Profile } from "@/lib/types";

const STICKER_TEXT = "GET IN TOUCH • GET IN TOUCH • ";

function Sticker() {
  return (
    <Link
      href="/contact"
      aria-label="Get in touch"
      className="absolute -top-5 right-0 flex size-24 items-center justify-center rounded-full bg-black ring-4 ring-blue-700 sm:-right-20 sm:top-3"
    >
      <svg viewBox="0 0 100 100" className="spin-sticker absolute inset-0 size-full" aria-hidden="true">
        <defs>
          <path id="sticker-circle" d="M50 50m-37 0a37 37 0 1 1 74 0a37 37 0 1 1-74 0" />
        </defs>
        <text fill="white" fontSize="10.5" fontWeight="600" letterSpacing="1.1">
          <textPath href="#sticker-circle">{STICKER_TEXT}</textPath>
        </text>
      </svg>
      <span className="text-3xl text-white" aria-hidden="true">
        ✦
      </span>
    </Link>
  );
}

/** Scatters a blurred shape's edge into grain, like spray paint. */
function GrainFilter() {
  return (
    <svg aria-hidden="true" className="absolute size-0">
      <filter id="cta-grain" x="-30%" y="-30%" width="160%" height="160%">
        <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed="4" result="noise" />
        <feDisplacementMap in="SourceGraphic" in2="noise" scale="110" />
      </filter>
    </svg>
  );
}

export function CallToAction({ profile }: { profile: Profile }) {
  return (
    <section id="contact" className="px-4 pb-4 pt-24 sm:px-6 lg:pt-28">
      <div className="relative overflow-hidden rounded-3xl border border-border bg-surface px-5 py-10 text-center dark:bg-black/40">
        <GrainFilter />
        <div aria-hidden="true" className="absolute inset-0">
          <div className="grain-blob absolute -bottom-24 -left-20 h-80 w-[50%] rounded-full" />
          <div className="grain-blob absolute -right-20 -top-28 h-[28rem] w-[56%] rounded-full" />
          <div className="grain-overlay absolute inset-0" />
        </div>
        <div className="relative flex flex-col items-center">
          <Medallion photoUrl={profile.photoUrl} winged />
          <div className="relative mt-8">
            <h2 className="font-display text-3xl font-extralight uppercase leading-[1.15] tracking-wide sm:text-5xl">
              Explore my <strong className="font-extrabold">projects</strong>
              <br />
              and <strong className="font-extrabold">engineering work</strong>
            </h2>
            <Sticker />
          </div>
          <PillLink href="/projects" label="View Projects" className="mt-8" />
          <p className="mt-9 text-2xl font-medium">Web, mobile and AI-powered applications.</p>
          <p className="mt-2 max-w-md font-light">
            Experience in full-stack engineering, API architecture, agentic workflows and automation.
          </p>
        </div>
      </div>
      <div aria-hidden="true" className="mt-5 flex items-center justify-between px-5 text-xs text-muted/60">
        <span>{"{ / }"}</span>
        <span className="h-1 w-5 rounded-full bg-muted/40" />
      </div>
    </section>
  );
}
