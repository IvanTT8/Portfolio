import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { BlogLibrary } from "@/components/sections/blog-library";
import { SectionHeading } from "@/components/ui/section";
import { getContent } from "@/lib/content";
import { estimateReadMinutes, formatFullDate } from "@/lib/format";

export const metadata: Metadata = { title: "Blogs" };

export default async function BlogsPage() {
  const { posts } = await getContent();
  if (posts.length === 0) notFound();

  return (
    <div className="relative">
      <div aria-hidden="true" className="paper-bg pointer-events-none absolute inset-x-0 top-0 h-[420px]" />
      <div className="relative px-4 pb-14 pt-28 sm:px-6">
        <SectionHeading label="From my desk" title="Handpicked" accent="insights" level="h1" />
      </div>
      <div className="relative pb-20">
        <BlogLibrary
          posts={posts.map((post) => ({
            title: post.title,
            slug: post.slug,
            excerpt: post.excerpt,
            date: formatFullDate(post.publishedAt),
            minutes: estimateReadMinutes(post.body),
            coverUrl: post.coverUrl,
            categories: post.categories ?? [],
          }))}
        />
      </div>
    </div>
  );
}
