import { SectionHeading } from "@/components/ui/section";
import { namesWithUniqueIcons, TechIcon } from "@/components/ui/tech-icon";
import { shortSkillNames } from "@/lib/format";
import type { SkillCategory } from "@/lib/types";
import { Bloom, SkillTiles } from "./skills-motion";

const ROW_SIZES = [14, 13, 11];

function iconRows(skills: SkillCategory[]): string[][] {
  const names = namesWithUniqueIcons(shortSkillNames(skills.flatMap((category) => category.items)));
  let start = 0;
  return ROW_SIZES.map((size) => {
    const row = names.slice(start, start + size);
    start += size;
    return row;
  }).filter((row) => row.length > 0);
}

export function Skills({ skills }: { skills: SkillCategory[] }) {
  if (skills.length === 0) return null;

  return (
    <section id="skills" className="overflow-x-clip px-4 pt-24 sm:px-6 lg:pt-32">
      <Bloom />
      <div className="relative -mt-6">
        <SectionHeading label="My skills" title="The full" accent="toolkit" />
      </div>
      <SkillTiles
        rows={iconRows(skills).map((row) =>
          row.map((name) => ({ name, icon: <TechIcon name={name} className="size-7" /> })),
        )}
      />
      <div className="mt-14 grid gap-px overflow-hidden rounded-3xl border border-border bg-border md:grid-cols-2">
        {skills.map((category) => (
          <div key={category.name} className="bg-surface p-6">
            <h3 className="font-serif text-2xl tracking-tight">{category.name}</h3>
            <ul className="mt-3 flex flex-wrap gap-x-3 gap-y-1 text-sm text-muted">
              {category.items.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}
