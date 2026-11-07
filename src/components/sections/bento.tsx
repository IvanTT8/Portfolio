import Image from "next/image";
import Link from "next/link";
import { Medallion } from "@/components/ui/monogram";
import { ArrowIcon } from "@/components/ui/section";
import { namesWithUniqueIcons, TechIcon } from "@/components/ui/tech-icon";
import { shortSkillNames } from "@/lib/format";
import { siteUrl } from "@/lib/site";
import type { Connection, Profile, SkillCategory } from "@/lib/types";
import { FoundationsTabs } from "./foundations-tabs";

const CARD = "h-full overflow-hidden rounded-3xl border border-border bg-surface";

/** Positions on public/world-dots.svg, from its 198 by 100 viewBox. */
const PINS = {
  buenosAires: [64.5, 81.4],
  newYork: [55, 33.8],
  rotterdam: [101.5, 24.2],
};

function Arc({ from, to, lift }: { from: number[]; to: number[]; lift: number }) {
  const midX = (from[0] + to[0]) / 2;
  const midY = Math.min(from[1], to[1]) - lift;
  return (
    <path
      d={`M${from[0]} ${from[1]} Q${midX} ${midY} ${to[0]} ${to[1]}`}
      fill="none"
      stroke="#f97316"
      strokeWidth="0.3"
      strokeLinecap="round"
    />
  );
}

/** Distance from a ring's centre to the middle of its track, in pixels. */
const RING_TRACK_RADIUS = 85;

/** Which ring each item rides, where on it (degrees clockwise from 3 o'clock), and when it fades in. */
const ORBIT = [
  { ring: 0, angle: -75, delay: "0ms" },
  { ring: 1, angle: -80, delay: "60ms" },
  { ring: 3, angle: -105, delay: "120ms" },
  { ring: 1, angle: 105, delay: "180ms" },
  { ring: 2, angle: 75, delay: "240ms" },
];

/** A point on the track, measured from the ring's centre. */
function trackPosition(angle: number) {
  const radians = (angle * Math.PI) / 180;
  const offset = (trig: number) => `calc(50% + ${(RING_TRACK_RADIUS * trig).toFixed(1)}px)`;
  return { left: offset(Math.cos(radians)), top: offset(Math.sin(radians)) };
}

const ORBIT_TOOLS = ["Claude", "OpenAI", "React", "Azure", "LangChain"];

function ExperienceCard({ profile, connections }: { profile: Profile; connections: Connection[] }) {
  // Real connections take these places once they exist.
  const withAvatars = connections.filter((connection) => connection.avatarUrl).slice(0, ORBIT.length);

  return (
    <Link
      href="/about#experience"
      className={`${CARD} group relative flex flex-col items-center justify-end p-8 text-center`}
    >
      <div aria-hidden="true" className="absolute left-1/2 top-6 flex -translate-x-1/2 items-center">
        {[0, 1, 2, 3].map((ring) => (
          <span
            key={ring}
            className="relative -mx-3 size-44 rounded-full border-[6px] border-background shadow-[0_0_0_1px_var(--border)] transition-shadow duration-500 group-hover:shadow-[0_0_0_1px_rgba(129,140,248,0.45),0_0_18px_rgba(99,102,241,0.12)]"
          >
            {ORBIT.map((spot, index) => {
              if (spot.ring !== ring) return null;
              const connection = withAvatars[index];
              return (
                <span
                  key={spot.angle}
                  data-orbit-item
                  style={{ ...trackPosition(spot.angle), transitionDelay: spot.delay }}
                  className="absolute z-10 hidden size-9 -translate-x-1/2 -translate-y-1/2 scale-75 items-center justify-center overflow-hidden rounded-full border border-indigo-400/70 bg-tile opacity-0 shadow-md transition duration-300 group-hover:scale-100 group-hover:opacity-100 sm:flex"
                >
                  {connection?.avatarUrl ? (
                    <Image src={connection.avatarUrl} alt="" fill sizes="36px" className="object-cover" />
                  ) : (
                    <TechIcon name={ORBIT_TOOLS[index]} className="size-5" />
                  )}
                </span>
              );
            })}
          </span>
        ))}
      </div>
      <div className="relative mb-14 flex size-28 items-center justify-center overflow-hidden rounded-full border-2 border-neutral-700 ring-0 ring-indigo-400/70 transition-shadow duration-300 group-hover:ring-2">
        <Image src={profile.photoUrl} alt={profile.name} fill loading="eager" sizes="112px" className="object-cover" />
      </div>
      <p className="relative text-sm uppercase text-muted transition-colors duration-300 group-hover:text-indigo-500 dark:group-hover:text-indigo-300">
        Engineering experience
      </p>
      <p className="relative mt-2 font-medium lg:text-lg">
        Aligning Engineering, Data, QA, DevOps and Marketing teams
      </p>
      <span
        aria-hidden="true"
        className="absolute bottom-5 right-5 flex size-8 items-center justify-center rounded-full bg-chip text-sm opacity-0 transition-opacity duration-300 group-hover:opacity-100"
      >
        ↗
      </span>
    </Link>
  );
}

/** Decorative, and each chip renders twice to loop, so rows stay short to keep the page light. */
const MARQUEE_ROW_SIZE = 7;

function marqueeRows(skills: SkillCategory[]): string[][] {
  const names = namesWithUniqueIcons(shortSkillNames(skills.flatMap((category) => category.items)));
  const step = Math.floor(names.length / 3);
  return [0, 1, 2].map((row) => names.slice(row * step, row * step + MARQUEE_ROW_SIZE));
}

function MarqueeChips({ items, duplicate = false }: { items: string[]; duplicate?: boolean }) {
  return (
    <div className={`flex shrink-0 gap-3 pr-3 ${duplicate ? "marquee-duplicate" : ""}`}>
      {items.map((item) => (
        <span key={item} className="flex items-center gap-2 rounded-lg border border-border bg-chip px-2.5 py-1.5 text-xs font-medium uppercase">
          <TechIcon name={item} />
          {item}
        </span>
      ))}
    </div>
  );
}

function TechCard({ skills }: { skills: SkillCategory[] }) {
  const host = new URL(siteUrl).host;

  return (
    <div className={`${CARD} grid-lines relative flex flex-col`}>
      <p className="px-6 pt-10 text-center font-serif text-3xl leading-tight bg-gradient-to-r from-pink-500 to-fuchsia-400 bg-clip-text text-transparent dark:from-indigo-200 dark:to-indigo-400">
        Shipping with modern technologies
      </p>
      <div aria-hidden="true" className="marquee-fade mt-10 space-y-10">
        {marqueeRows(skills).map((items, index) => (
          <div key={items[0]} className="marquee overflow-hidden">
            <div
              className="marquee-track flex w-max"
              style={{
                "--marquee-duration": "60s",
                animationDirection: index % 2 === 1 ? "reverse" : "normal",
              } as React.CSSProperties}
            >
              <MarqueeChips items={items} />
              <MarqueeChips items={items} duplicate />
            </div>
          </div>
        ))}
      </div>
      <div className="relative mt-auto px-[10%] pt-12">
        <div aria-hidden="true" className="absolute inset-x-4 bottom-0 top-16 rounded-t-[50%] bg-gradient-to-t from-violet-200/70 to-transparent dark:from-violet-900/40" />
        <div className="relative rounded-t-xl border border-b-0 border-border bg-surface">
          <div className="flex items-center gap-3 border-b border-border px-3 py-2">
            <span className="flex gap-1" aria-hidden="true">
              <span className="size-1.5 rounded-full bg-neutral-300" />
              <span className="size-1.5 rounded-full bg-neutral-300" />
              <span className="size-1.5 rounded-full bg-neutral-300" />
            </span>
            <span className="mx-auto truncate rounded-md bg-chip px-3 py-0.5 text-[9px] text-muted">{host}</span>
          </div>
          <div className="grid-lines px-4 py-6 text-center">
            <span aria-hidden="true" className="mx-auto mb-2 flex size-7 items-center justify-center rounded-full bg-indigo-500/20 text-xs text-indigo-500 dark:text-indigo-300">
              ⌕
            </span>
            <p className="font-serif text-2xl leading-none tracking-tight">Built for production.</p>
            <p className="mt-2 text-[10px] text-muted">Web, mobile and AI-powered applications.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function MapCard({ profile }: { profile: Profile }) {
  const country = profile.location.split(",").at(-1)?.trim() ?? profile.location;

  return (
    <div className={`${CARD} relative flex flex-col justify-between dark:bg-black`}>
      <p className="relative z-10 px-6 pt-8 text-center font-serif text-3xl leading-tight bg-gradient-to-r from-indigo-400 to-violet-600 bg-clip-text text-transparent dark:from-indigo-200 dark:to-indigo-400">
        Remote engineering from {country}
      </p>
      <div className="relative -mt-3 min-h-64 flex-1" aria-hidden="true">
        {/* The crop centres on the Atlantic, as the arcs link Buenos Aires to past employers and study. */}
        <svg viewBox="30 0 80 100" preserveAspectRatio="xMidYMid slice" className="absolute inset-0 size-full">
          <image href="/world-dots.svg" x="0" y="0" width="198" height="100" className="opacity-100 dark:opacity-45" />
          <Arc from={PINS.buenosAires} to={PINS.newYork} lift={12} />
          <Arc from={PINS.newYork} to={PINS.rotterdam} lift={10} />
          <Arc from={PINS.buenosAires} to={PINS.rotterdam} lift={4} />
          {[PINS.buenosAires, PINS.newYork, PINS.rotterdam].map(([x, y]) => (
            <circle key={x} cx={x} cy={y} r="0.7" fill="#f97316" />
          ))}
        </svg>
      </div>
      <div className="relative z-10 pb-7 pt-2 text-center">
        <p className="text-sm uppercase text-muted">{profile.workMode}</p>
        <p className="mt-1 text-lg font-medium">
          {country} - {profile.timezone}
        </p>
      </div>
    </div>
  );
}

function ExploreCard({ profile }: { profile: Profile }) {
  return (
    <div className={`${CARD} flex flex-col items-center justify-center gap-5 p-7 text-center`}>
      <Medallion photoUrl={profile.photoUrl} winged />
      <p className="shimmer font-serif text-3xl leading-tight tracking-tight">Explore my work and engineering history</p>
      <Link
        href="/projects"
        className="group flex items-center gap-3 rounded-xl border border-border bg-surface px-4 py-3 text-sm shadow-md"
      >
        <span className="shimmer whitespace-nowrap">View selected work</span>
        <span className="transition-transform group-hover:translate-x-1">
          <ArrowIcon className="size-5" />
        </span>
      </Link>
    </div>
  );
}

function FoundationsCard() {
  return (
    <div className={`${CARD} grid gap-8 p-7 md:grid-cols-[1fr_auto]`}>
      <div>
        <p className="flex items-center gap-3 text-[11px] uppercase tracking-[0.25em] text-muted">
          <span className="flex size-9 items-center justify-center rounded-full border border-border" aria-hidden="true">
            ✦
          </span>
          AI engineering
        </p>
        <h2 className="mt-5 font-display text-[45px] font-semibold leading-[1.05] tracking-[-0.06em]">
          Agentic
          <br />
          <span className="font-serif font-normal tracking-tight text-muted">foundations.</span>
        </h2>
        <p className="mt-5 max-w-72 text-sm leading-relaxed text-muted">
          LangChain, LangGraph, RAG architectures, vector databases and LLM integrations.
        </p>
      </div>
      <FoundationsTabs />
    </div>
  );
}

export function Bento({
  profile,
  skills,
  connections,
}: {
  profile: Profile;
  skills: SkillCategory[];
  connections: Connection[];
}) {
  return (
    <section className="px-4 pt-14 sm:px-6 lg:pt-28">
      <div className="grid gap-2.5 md:grid-cols-3 md:auto-rows-[minmax(320px,auto)] [&>*]:min-w-0">
        <div className="md:col-span-2">
          <ExperienceCard profile={profile} connections={connections} />
        </div>
        <div className="md:row-span-2">
          <TechCard skills={skills} />
        </div>
        <div className="md:row-span-2">
          <MapCard profile={profile} />
        </div>
        <div>
          <ExploreCard profile={profile} />
        </div>
        <div className="md:col-span-2">
          <FoundationsCard />
        </div>
      </div>
    </section>
  );
}
