import type { MetadataRoute } from "next";
import { getContent } from "@/lib/content";
import { siteUrl } from "@/lib/site";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const { selectedWork, projects, posts } = await getContent();

  const paths = ["/", "/about", "/uses", "/certificates", "/links", "/contact"];
  if (selectedWork.length > 0 || projects.length > 0) paths.push("/projects");
  paths.push(...projects.map(({ slug }) => `/projects/${slug}`));
  if (posts.length > 0) {
    paths.push("/blogs", ...posts.map(({ slug }) => `/blogs/${slug}`));
  }

  return paths.map((path) => ({ url: `${siteUrl}${path}` }));
}
