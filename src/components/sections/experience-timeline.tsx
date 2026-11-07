"use client";

import { motion, useScroll, useTransform } from "motion/react";
import Image from "next/image";
import { useRef } from "react";
import { SectionHeading } from "@/components/ui/section";
import { TechChip } from "@/components/ui/tech-icon";
import { formatPeriod } from "@/lib/format";
import { techMentioned } from "@/lib/tech-mentions";
import type { Experience } from "@/lib/types";

function RoleRow({ role, photoUrl }: { role: Experience; photoUrl: string }) {
  const ref = useRef<HTMLLIElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 60%", "end 60%"] });
  const height = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);
  // The marker only shows on the role being read, not waiting at the top of the next one.
  const markerOpacity = useTransform(scrollYProgress, [0, 0.005, 0.995, 1], [0, 1, 1, 0]);

  return (
    <li ref={ref} className="grid border-t border-border md:grid-cols-[320px_1fr]">
      <div className="px-4 pb-4 pt-10 sm:px-5 md:sticky md:top-24 md:self-start md:pb-10">
        <p className="font-serif text-4xl leading-tight tracking-tight">{role.company}</p>
        <p className="mt-5 font-medium text-muted">{formatPeriod(role.start, role.end)}</p>
        <p className="mt-3 text-sm text-muted">{role.location}</p>
      </div>
      <div className="relative py-10 pl-8 pr-4 sm:pr-6 md:pl-24">
        <span aria-hidden="true" className="absolute inset-y-0 left-3 w-1.5 bg-border md:left-0">
          <motion.span
            className="absolute inset-x-0 top-0 block bg-gradient-to-b from-blue-500 via-purple-600 to-pink-500"
            style={{ height }}
          />
          <motion.span
            className="absolute left-1/2 flex size-8 -translate-x-1/2 -translate-y-1/2 items-center justify-center overflow-hidden rounded-full border-2 border-background bg-neutral-900 shadow-md"
            style={{ top: height, opacity: markerOpacity }}
          >
            <Image src={photoUrl} alt="" fill loading="eager" sizes="32px" className="object-cover" />
          </motion.span>
        </span>
        <div>
          <h3 className="text-xl font-semibold">{role.title}</h3>
          <ul className="mt-5 list-disc space-y-3 pl-4 text-[15px] leading-relaxed text-muted">
            {(role.highlights ?? []).map((highlight) => (
              <li key={highlight}>{highlight}</li>
            ))}
          </ul>
          <div className="mt-7 flex flex-wrap gap-2">
            {techMentioned(role.highlights).map((tech) => (
              <TechChip key={tech} name={tech} />
            ))}
          </div>
        </div>
      </div>
    </li>
  );
}

export function ExperienceTimeline({ experience, photoUrl }: { experience: Experience[]; photoUrl: string }) {
  if (experience.length === 0) return null;

  return (
    <section id="experience" className="pt-20">
      <div className="px-4 pb-14 sm:px-6">
        <SectionHeading label="The experience" title="Experience that" accent="ships" />
      </div>
      <ol>
        {experience.map((role) => (
          <RoleRow key={`${role.company}-${role.start}`} role={role} photoUrl={photoUrl} />
        ))}
      </ol>
    </section>
  );
}
