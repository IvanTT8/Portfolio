import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { PortableText } from "next-sanity";
import { Container, Eyebrow } from "@/components/ui/section";
import { TechChip } from "@/components/ui/tech-icon";
import { getContent } from "@/lib/content";

type Props = { params: Promise<{ slug: string }> };

async function findProject(params: Props["params"]) {
  const { slug } = await params;
  const { projects } = await getContent();
  return projects.find((project) => project.slug === slug);
}

export async function generateStaticParams() {
  const { projects } = await getContent();
  return projects.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const project = await findProject(params);
  return project ? { title: project.title, description: project.summary } : {};
}

export default async function ProjectPage({ params }: Props) {
  const project = await findProject(params);
  if (!project) notFound();

  return (
    <Container className="mx-auto max-w-3xl pb-20 pt-32">
      <Eyebrow>{project.category}</Eyebrow>
      <h1 className="mt-3 font-serif text-6xl leading-tight tracking-tight">{project.title}</h1>
      <p className="mt-4 text-lg leading-relaxed text-muted">{project.summary}</p>
      <div className="mt-6 flex flex-wrap gap-2">
        {project.tech.map((item) => (
          <TechChip key={item} name={item} />
        ))}
      </div>
      {project.liveUrl && (
        <a
          href={project.liveUrl}
          target="_blank"
          rel="noreferrer"
          className="mt-6 inline-block font-medium underline underline-offset-4"
        >
          Live Preview
        </a>
      )}
      {project.imageUrl && (
        <Image
          src={project.imageUrl}
          alt=""
          width={1200}
          height={675}
          priority
          className="mt-10 rounded-3xl border border-border"
        />
      )}
      {project.body && (
        <div className="rich-text mt-10 leading-relaxed">
          <PortableText value={project.body} />
        </div>
      )}
    </Container>
  );
}
