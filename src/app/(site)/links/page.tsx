import type { Metadata } from "next";
import { Container, SectionHeading } from "@/components/ui/section";
import { getContent } from "@/lib/content";
import { formatPhone } from "@/lib/format";

export const metadata: Metadata = { title: "Links" };

export default async function LinksPage() {
  const { profile } = await getContent();
  const links = [
    { label: "LinkedIn", detail: "ivan-torrente-243878184", href: profile.linkedin, external: true },
    { label: "Email", detail: profile.email, href: `mailto:${profile.email}` },
    { label: "Phone", detail: formatPhone(profile.phone), href: `tel:${profile.phone}` },
  ];
  if (profile.resumeUrl) {
    links.push({ label: "Resume", detail: "Download PDF", href: profile.resumeUrl, external: true });
  }

  return (
    <Container className="mx-auto max-w-xl pb-20 pt-32">
      <SectionHeading label="Links" title="Find me" accent="online" level="h1" />
      <ul className="mt-12 space-y-2.5">
        {links.map((link) => (
          <li key={link.label}>
            <a
              href={link.href}
              target={link.external ? "_blank" : undefined}
              rel={link.external ? "noreferrer" : undefined}
              className="flex items-center justify-between gap-4 rounded-2xl border border-border bg-surface px-5 py-4 transition-colors hover:bg-chip"
            >
              <span className="font-medium">{link.label}</span>
              <span className="truncate text-sm text-muted">{link.detail}</span>
            </a>
          </li>
        ))}
      </ul>
    </Container>
  );
}
