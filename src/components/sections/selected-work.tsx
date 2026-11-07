import Link from "next/link";
import { TextLink } from "@/components/ui/pill-link";
import { SectionHeading } from "@/components/ui/section";
import type { Project, SelectedWork } from "@/lib/types";
import { WorkDetails } from "./work-details";
import { WorkShowcase } from "./work-showcase";
import { WorkVisual } from "./work-visual";

export function SelectedWorkSection({ work, projects }: { work: SelectedWork[]; projects: Project[] }) {
  if (work.length === 0 && projects.length === 0) return null;

  return (
    <section id="work" className="px-4 pt-24 sm:px-6 lg:pt-32">
      <SectionHeading label="Case studies" title="Selected" accent="work" />
      <div className="mt-16">
        <WorkShowcase
          items={work.map((item) => ({
            id: item.title,
            visual: <WorkVisual visual={item.visual} lead={item.lead} title={item.title} tech={item.tech} href="/projects" />,
            details: <WorkDetails item={item} />,
          }))}
        />
      </div>
      {projects.length > 0 && (
        <ul className="mt-20 grid gap-2.5 md:grid-cols-2">
          {projects.map((project) => (
            <li key={project.slug}>
              <Link
                href={`/projects/${project.slug}`}
                className="block h-full rounded-3xl border border-border bg-surface p-6 transition-colors hover:bg-chip"
              >
                <span className="text-xs uppercase text-muted">{project.category}</span>
                <span className="mt-2 block font-serif text-3xl tracking-tight">{project.title}</span>
                <span className="mt-2 block text-sm leading-relaxed text-muted">{project.summary}</span>
              </Link>
            </li>
          ))}
        </ul>
      )}
      <div className="mt-16 text-center">
        <TextLink href="/projects" label="See all work" />
      </div>
    </section>
  );
}
