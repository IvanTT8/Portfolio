import type { Metadata } from "next";
import { Container, SectionHeading } from "@/components/ui/section";
import { TechIcon } from "@/components/ui/tech-icon";
import { getContent } from "@/lib/content";
import { shortSkillNames } from "@/lib/format";

export const metadata: Metadata = { title: "Uses" };

export default async function UsesPage() {
  const { skills } = await getContent();

  return (
    <Container className="pb-20 pt-32">
      <SectionHeading label="Uses" title="The tools" accent="I work with" level="h1" />
      <div className="mt-14 grid gap-2.5 md:grid-cols-2">
        {skills.map((category) => (
          <div key={category.name} className="rounded-3xl border border-border bg-surface p-6">
            <h2 className="font-serif text-3xl tracking-tight">{category.name}</h2>
            <ul className="mt-5 flex flex-wrap gap-2">
              {category.items.map((item) => (
                <li key={item} className="inline-flex items-center gap-2 rounded-lg border border-border bg-chip px-2.5 py-1.5 text-xs font-medium">
                  <TechIcon name={shortSkillNames([item])[0]} className="size-3.5" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </Container>
  );
}
