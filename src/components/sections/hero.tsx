"use client";

import { motion } from "motion/react";
import Image from "next/image";
import Link from "next/link";
import { PhotoUpload } from "@/components/ui/photo-upload";
import { PillLink } from "@/components/ui/pill-link";
import { ArrowIcon } from "@/components/ui/section";
import { HERO_PHOTOS } from "@/lib/site";
import type { NowCard, Profile } from "@/lib/types";

const SQUARE_COLORS = ["bg-emerald-500", "bg-orange-500", "bg-sky-500"];

/** Back to front. The front card shows the main photo, so uploading a new one changes it. */
const STACK = [
  { rotate: -3.2, x: 3, z: 1, photo: HERO_PHOTOS[2] },
  { rotate: 2, x: 2, z: 2, photo: HERO_PHOTOS[1] },
  { rotate: 3.6, x: 1, z: 3, photo: HERO_PHOTOS[0] },
  { rotate: -3.4, x: 0, z: 4 },
];

function PhotoStack({ profile }: { profile: Profile }) {
  return (
    <div className="relative mx-auto h-[180px] w-full max-w-[720px] [--step:16%] sm:h-[250px] sm:[--step:23%] md:[--step:17%] lg:[--step:23%]">
      {STACK.map((card) => {
        const tilt = card.rotate > 0 ? 2 : -2;
        return (
          <motion.div
            key={card.x}
            drag
            dragSnapToOrigin
            dragElastic={0.2}
            dragMomentum={false}
            whileHover={{ scale: 1.1, rotateZ: tilt, zIndex: 50 }}
            whileDrag={{ scale: 1.1, rotateZ: tilt, zIndex: 50 }}
            transition={{ type: "spring", stiffness: 300, damping: 24 }}
            className="absolute top-2 size-[150px] cursor-grab md:size-[190px] lg:size-[218px] touch-pan-y select-none overflow-hidden rounded-2xl bg-neutral-900 shadow-xl active:cursor-grabbing sm:size-[218px] md:size-[190px] lg:size-[218px]"
            style={{ left: `calc(${card.x} * var(--step))`, rotate: card.rotate, zIndex: card.z }}
          >
            <Image
              src={card.photo ?? profile.photoUrl}
              alt={card.x === 0 ? profile.name : ""}
              fill
              priority={card.x === 0}
              loading={card.x === 0 ? undefined : "eager"}
              sizes="218px"
              draggable={false}
              className="object-cover"
            />
          </motion.div>
        );
      })}
    </div>
  );
}

export function Hero({ profile, cards, currentRole }: {
  profile: Profile;
  cards: NowCard[];
  currentRole?: { company: string; title: string };
}) {
  const nameParts = profile.name.split(/\s+/);

  return (
    <section>
      <div className="relative grid min-h-[calc(100svh-150px)] gap-8 px-4 pb-10 pt-24 sm:px-5 md:grid-cols-[1fr_auto] lg:pt-28">
        <div className="min-w-0">
          <h1 className="text-center font-serif text-6xl leading-[1.08] tracking-tight sm:text-7xl md:text-left lg:text-[108px]">
            {profile.heroTitle}{" "}
            <br className="hidden md:block" />
            <span className="gradient-text-warm">{profile.heroAccent}</span>
          </h1>
          <p className="mt-7 text-center text-[10px] uppercase tracking-[0.28em] md:text-left">
            {profile.location} · {profile.yearsClaim}
          </p>
          <div className="mt-10">
            <PhotoStack profile={profile} />
            <div className="flex justify-center md:justify-start">
              <PhotoUpload />
            </div>
          </div>
        </div>

        <div className="flex flex-col items-center justify-between gap-10 text-center md:max-w-[240px] md:items-end md:text-right lg:max-w-[340px]">
          {currentRole && (
            <div className="hidden md:block md:text-left">
              <p className="flex items-center gap-3 text-[10px] uppercase tracking-[0.28em] text-muted">
                <span className="ping-dot size-1.5 rounded-full bg-blue-600" aria-hidden="true" />
                Current role
                <span className="h-px w-9 bg-blue-300" aria-hidden="true" />
              </p>
              <p className="mt-3 font-serif text-[40px] leading-none tracking-tight">{currentRole.company}</p>
              <Link
                href="/about#experience"
                className="group mt-4 flex items-center gap-2 text-[10px] uppercase tracking-[0.25em] text-muted"
              >
                {currentRole.title}
                <span className="flex size-6 items-center justify-center rounded-full border border-dashed border-muted/60">
                  <span aria-hidden="true">↗</span>
                </span>
              </Link>
            </div>
          )}
          <div>
            <p className="font-serif text-2xl leading-tight tracking-tight text-muted md:text-xl lg:text-3xl">{profile.tagline}</p>
            <p className="fade-text mt-5 font-serif text-5xl leading-[1.15] tracking-tight md:text-[64px] lg:text-[86px]">
              {nameParts.map((part) => (
                <span key={part} className="md:block">
                  {part}{" "}
                </span>
              ))}
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 border-y border-border md:grid-cols-4">
        {cards.slice(0, 3).map((card, index) => (
          <Link
            key={card.label}
            href={card.href ?? "/"}
            className="group border-b border-r border-border p-5 transition-colors last:border-b-0 hover:bg-foreground/[0.02] sm:px-5 sm:py-6 md:border-b-0"
          >
            <span className="block transition-[translate] duration-[400ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:-translate-y-0.5">
            <span className="flex items-center justify-between text-xs uppercase text-muted">
              <span className="flex items-center gap-2.5">
                <span className={`size-2.5 ${SQUARE_COLORS[index % SQUARE_COLORS.length]}`} aria-hidden="true" />
                {card.label}
              </span>
              <span className="text-foreground/40 transition-[color,translate] duration-300 group-hover:translate-x-1 group-hover:text-foreground">
                <ArrowIcon />
              </span>
            </span>
            <span className="mt-5 block font-medium">{card.title}</span>
            <span className="mt-2 block truncate text-sm text-muted">{card.subtitle}</span>
            </span>
          </Link>
        ))}
        <div className="flex flex-col justify-between gap-4 p-5 sm:py-6">
          <span className="flex items-center gap-2.5 text-xs uppercase text-muted">
            <span className="size-2.5 bg-rose-600" aria-hidden="true" />
            Contact
          </span>
          <PillLink href="/contact" label="Contact" className="w-full" />
        </div>
      </div>
    </section>
  );
}
