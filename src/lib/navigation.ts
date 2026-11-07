import type { SiteContent } from "./types";

export type NavLink = { label: string; href: string };
export type MoreLink = NavLink & { description: string };

/** Links to Hidden Sections are left out, so visitors never reach an empty page. */
export function buildNav(content: SiteContent): NavLink[] {
  const links: NavLink[] = [
    { label: "Home", href: "/" },
    { label: "About", href: "/about" },
  ];
  if (content.selectedWork.length > 0 || content.projects.length > 0) {
    links.push({ label: "Work", href: "/projects" });
  }
  if (content.posts.length > 0) links.push({ label: "Blogs", href: "/blogs" });
  return links;
}

/** The pages under the nav's More menu. */
export const MORE_LINKS: MoreLink[] = [
  { label: "Uses", href: "/uses", description: "The tools I work with" },
  { label: "Certificates", href: "/certificates", description: "Credentials and education" },
  { label: "Links", href: "/links", description: "All my links in one place" },
];

export const CONTACT_LINK: NavLink = { label: "Contact", href: "/contact" };
