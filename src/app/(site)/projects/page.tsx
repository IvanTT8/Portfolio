import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { TextLink } from "@/components/ui/pill-link";
import { WorkDetails } from "@/components/sections/work-details";
import { WorkVisual } from "@/components/sections/work-visual";
import { Eyebrow } from "@/components/ui/section";
import { TechChip } from "@/components/ui/tech-icon";
import { getContent } from "@/lib/content";

export const metadata: Metadata = { title: "Work" };

function EntryHeader({ number, kicker, title, tag }: { number: number; kicker: string; title: string; tag: string }) {
  return (
    <>
      <p className="flex items-center gap-3 text-[10px] uppercase tracking-wider text-muted">
        {String(number).padStart(2, "0")}
        <span className="h-px w-8 bg-border" aria-hidden="true" />
        {kicker}
      </p>
      <div className="mt-2 flex flex-wrap items-end justify-between gap-3 border-b border-dashed border-muted/40 pb-3">
        <h2 className="font-serif text-3xl tracking-tight">{title}</h2>
        <span className="rounded-md bg-chip px-3 py-1.5 text-xs uppercase">{tag}</span>
      </div>
    </>
  );
}

export default async function WorkPage() {
  const { selectedWork, projects } = await getContent();
  if (selectedWork.length === 0 && projects.length === 0) notFound();

  return (
    <div className="relative overflow-hidden pb-20 pt-32">
      <p aria-hidden="true" className="sketch-word pointer-events-none absolute inset-x-0 top-10 select-none text-center font-display text-[22vw] font-bold leading-none lg:text-[300px]">
        work
      </p>
      <div className="relative text-center">
        <Eyebrow>Case studies</Eyebrow>
        <h1 className="mt-3 font-serif text-6xl tracking-tight">
          Selected <span className="gradient-text">Work</span>
        </h1>
      </div>
      <div className="relative mt-32 grid gap-x-8 gap-y-20 px-4 sm:px-6 lg:grid-cols-2">
        {selectedWork.map((item, index) => (
          <div key={item.title} className={index % 2 === 1 ? "lg:mt-48" : ""}>
            <EntryHeader number={index + 1} kicker={item.employer} title={item.title} tag={item.category} />
            <div className="mt-4">
              <WorkVisual visual={item.visual} lead={item.lead} title={item.title} tech={item.tech} />
            </div>
            <div className="mt-6">
              <WorkDetails item={item} hideTitle />
            </div>
          </div>
        ))}
        {projects.map((project, index) => (
          <div key={project.slug} className={(selectedWork.length + index) % 2 === 1 ? "lg:mt-48" : ""}>
            <EntryHeader
              number={selectedWork.length + index + 1}
              kicker="Case study"
              title={project.title}
              tag={project.category}
            />
            {project.imageUrl && (
              <Link href={`/projects/${project.slug}`} className="mt-4 block rounded-3xl border border-border bg-surface p-2">
                <Image src={project.imageUrl} alt="" width={1200} height={675} className="rounded-[1.25rem]" />
              </Link>
            )}
            <p className="mt-5 leading-relaxed text-muted">{project.summary}</p>
            <div className="mt-4 flex flex-wrap gap-2">
              {project.tech.map((tech) => (
                <TechChip key={tech} name={tech} />
              ))}
            </div>
            <div className="mt-5 flex flex-wrap gap-6">
              <TextLink href={`/projects/${project.slug}`} label="View details" />
              {project.liveUrl && (
                <a href={project.liveUrl} target="_blank" rel="noreferrer" className="shimmer font-medium">
                  Live Preview
                </a>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
