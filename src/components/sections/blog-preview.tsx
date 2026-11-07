import { PostCard } from "@/components/ui/post-card";
import { TextLink } from "@/components/ui/pill-link";
import { SectionHeading } from "@/components/ui/section";
import type { BlogPost } from "@/lib/types";

const PREVIEW_COUNT = 3;

export function BlogPreview({ posts }: { posts: BlogPost[] }) {
  if (posts.length === 0) return null;

  return (
    <section id="blog" className="px-4 pt-24 sm:px-6 lg:pt-32">
      <SectionHeading label="From my desk" title="Notes &" accent="writing" />
      <div className="mt-12 grid gap-3 md:grid-cols-3">
        {posts.slice(0, PREVIEW_COUNT).map((post) => (
          <div key={post.slug}>
            <PostCard post={post} />
          </div>
        ))}
      </div>
      <div className="mt-10 text-center">
        <TextLink href="/blogs" label="Read more posts" />
      </div>
    </section>
  );
}
