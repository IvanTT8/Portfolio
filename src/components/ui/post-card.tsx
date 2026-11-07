import Image from "next/image";
import Link from "next/link";
import { estimateReadMinutes, formatMonthYear } from "@/lib/format";
import type { BlogPost } from "@/lib/types";
import { ArrowBadge } from "./section";

export function PostCard({ post }: { post: BlogPost }) {
  return (
    <Link
      href={`/blogs/${post.slug}`}
      className="group flex h-full flex-col rounded-3xl border border-border bg-surface/60 p-2.5 transition-colors duration-300 hover:bg-tile"
    >
      <div className="relative flex aspect-[3/2] items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-br from-indigo-950 via-slate-900 to-rose-950">
        {post.coverUrl && (
          <Image
            src={post.coverUrl}
            alt=""
            fill
            sizes="(min-width: 768px) 360px, 100vw"
            className="object-cover brightness-75 transition-transform duration-500 group-hover:scale-105"
          />
        )}
        <p className="relative px-6 text-center text-lg font-medium text-white">{post.title}</p>
      </div>
      <div className="flex flex-1 flex-col px-2 pb-2 pt-4">
        <h3 className="text-lg font-medium leading-snug transition-colors duration-300 group-hover:text-muted">{post.title}</h3>
        <p className="mt-2 flex-1 text-sm leading-relaxed text-muted">{post.excerpt}</p>
        <div className="mt-4 flex items-center justify-between text-xs text-muted">
          <span className="uppercase">{estimateReadMinutes(post.body)} min read · {formatMonthYear(post.publishedAt)}</span>
          <span className="flex items-center gap-2">
            Read post <ArrowBadge />
          </span>
        </div>
      </div>
    </Link>
  );
}
