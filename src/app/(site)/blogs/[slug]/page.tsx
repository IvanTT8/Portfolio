import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { PortableText } from "next-sanity";
import { Container, Eyebrow } from "@/components/ui/section";
import { getContent } from "@/lib/content";
import { formatMonthYear } from "@/lib/format";

type Props = { params: Promise<{ slug: string }> };

async function findPost(params: Props["params"]) {
  const { slug } = await params;
  const { posts } = await getContent();
  return posts.find((post) => post.slug === slug);
}

export async function generateStaticParams() {
  const { posts } = await getContent();
  return posts.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const post = await findPost(params);
  return post ? { title: post.title, description: post.excerpt } : {};
}

export default async function PostPage({ params }: Props) {
  const post = await findPost(params);
  if (!post) notFound();

  return (
    <Container className="mx-auto max-w-3xl pb-20 pt-32">
      <Eyebrow>{formatMonthYear(post.publishedAt)}</Eyebrow>
      <h1 className="mt-3 font-serif text-6xl leading-tight tracking-tight">{post.title}</h1>
      <p className="mt-4 text-lg leading-relaxed text-muted">{post.excerpt}</p>
      {post.coverUrl && (
        <Image
          src={post.coverUrl}
          alt=""
          width={1200}
          height={630}
          priority
          className="mt-10 rounded-3xl border border-border"
        />
      )}
      {post.body && (
        <div className="rich-text mt-10 leading-relaxed">
          <PortableText value={post.body} />
        </div>
      )}
    </Container>
  );
}
