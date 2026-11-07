"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import { ArrowIcon } from "@/components/ui/section";

export type LibraryPost = {
  title: string;
  slug: string;
  excerpt: string;
  date: string;
  minutes: number;
  coverUrl?: string;
  categories: string[];
};

/** Sidebar search and category filter, beside a list of posts. */
export function BlogLibrary({ posts }: { posts: LibraryPost[] }) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<string | null>(null);
  const [filtersOpen, setFiltersOpen] = useState(true);

  const categories = useMemo(() => [...new Set(posts.flatMap((post) => post.categories))], [posts]);
  const visible = posts.filter((post) => {
    const text = `${post.title} ${post.excerpt}`.toLowerCase();
    return text.includes(query.trim().toLowerCase()) && (!category || post.categories.includes(category));
  });

  return (
    <div className="grid border-y border-border md:grid-cols-[260px_1fr] lg:grid-cols-[320px_1fr]">
      <aside className="border-b border-border p-5 md:border-b-0 md:border-r">
        <div className="md:sticky md:top-24">
          <p className="text-[10px] uppercase tracking-wider text-muted">Explore</p>
          <div className="mt-1 flex items-center justify-between">
            <h2 className="font-serif text-3xl tracking-tight">Library</h2>
            <button
              type="button"
              aria-label="Toggle filters"
              aria-expanded={filtersOpen}
              onClick={() => setFiltersOpen((value) => !value)}
              className="flex size-8 items-center justify-center rounded-lg border border-border bg-surface transition-colors hover:bg-chip"
            >
              <svg viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
                <path d="M4 7h16M7 12h10M10 17h4" />
              </svg>
            </button>
          </div>
          <p className="mt-3 border-b border-border pb-5 text-xs text-muted">
            Showing <strong className="text-foreground">{visible.length}</strong> {visible.length === 1 ? "post" : "posts"}
          </p>
          {filtersOpen && (
            <>
              <label className="mt-5 block text-[10px] font-semibold uppercase tracking-wider text-muted">
                Search
                <input
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Search"
                  className="mt-2 w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm font-normal normal-case tracking-normal text-foreground outline-none placeholder:text-muted focus-visible:border-foreground/40 focus-visible:outline-none"
                />
              </label>
              {categories.length > 0 && (
                <>
                  <p className="mt-5 text-[10px] font-semibold uppercase tracking-wider text-muted">Categories</p>
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {categories.map((item) => (
                      <button
                        key={item}
                        type="button"
                        aria-pressed={item === category}
                        onClick={() => setCategory(item === category ? null : item)}
                        className={`rounded-md border border-border px-2 py-1 text-[11px] font-medium transition-colors ${
                          item === category ? "bg-foreground text-background" : "bg-chip hover:bg-surface"
                        }`}
                      >
                        {item}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </>
          )}
        </div>
      </aside>
      <ul>
        {visible.map((post) => (
          <li key={post.slug} className="border-b border-dashed border-border last:border-b-0">
            <Link href={`/blogs/${post.slug}`} className="group grid gap-5 p-5 sm:grid-cols-[1fr_170px]">
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-wider text-muted">{post.date}</p>
                <h3 className="mt-2 font-serif text-2xl leading-tight tracking-tight">{post.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">{post.excerpt}</p>
                <p className="mt-4 flex items-center gap-4 text-xs">
                  <span className="text-muted">{post.minutes} min read</span>
                  <span className="flex items-center gap-1.5 font-semibold">
                    Read Article
                    <span className="transition-transform group-hover:translate-x-1">
                      <ArrowIcon className="size-3.5" />
                    </span>
                  </span>
                </p>
              </div>
              <div className="relative hidden aspect-[4/3] overflow-hidden rounded-xl border border-border bg-chip sm:block">
                {post.coverUrl && (
                  <Image
                    src={post.coverUrl}
                    alt=""
                    fill
                    sizes="170px"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                )}
              </div>
            </Link>
          </li>
        ))}
        {visible.length === 0 && <li className="p-8 text-center text-sm text-muted">No posts match that search.</li>}
      </ul>
    </div>
  );
}
