import Link from "next/link";
import { FaWhatsapp } from "react-icons/fa";
import { HiOutlineMail } from "react-icons/hi";
import { Logo } from "@/components/ui/monogram";
import { formatPhone, whatsappUrl } from "@/lib/format";
import { CONTACT_LINK, MORE_LINKS, type NavLink } from "@/lib/navigation";
import type { Profile } from "@/lib/types";

function LinkArrow() {
  return (
    <span className="link-arrow text-xs" aria-hidden="true">
      ↗
    </span>
  );
}

const CONTACT_ICON =
  "flex size-9 items-center justify-center rounded-full border border-border transition-colors hover:bg-chip hover:text-foreground";

function Column({ title, links }: { title: string; links: (NavLink & { external?: boolean })[] }) {
  return (
    <div>
      <p className="text-xs uppercase text-muted">{title}</p>
      <ul className="mt-5 space-y-4">
        {links.map((link) => (
          <li key={link.href}>
            {link.external ? (
              <a href={link.href} target="_blank" rel="noreferrer" className="link-underline">
                {link.label}
                <LinkArrow />
              </a>
            ) : (
              <Link href={link.href} className="link-underline">
                {link.label}
                <LinkArrow />
              </Link>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

export function Footer({ profile, nav }: { profile: Profile; nav: NavLink[] }) {
  const more = [CONTACT_LINK, { label: "LinkedIn", href: profile.linkedin, external: true }];
  if (profile.resumeUrl) more.push({ label: "Resume", href: profile.resumeUrl, external: true });

  return (
    <footer className="mx-auto w-full max-w-[1280px] border-x border-t border-border">
      <div className="grid md:grid-cols-[1fr_1.4fr]">
        <div className="border-b border-border p-8 md:border-b-0 md:border-r">
          <Logo photoUrl={profile.photoUrl} className="size-12" />
          <p className="mt-5 max-w-64 text-muted">
            I&apos;m {profile.name}, a {profile.role}.
          </p>
          <div className="mt-4 flex gap-2 text-muted">
            <a href={`mailto:${profile.email}`} aria-label={`Email ${profile.email}`} title={profile.email} className={CONTACT_ICON}>
              <HiOutlineMail className="size-[18px]" aria-hidden="true" />
            </a>
            <a
              href={whatsappUrl(profile.phone)}
              target="_blank"
              rel="noreferrer"
              aria-label={`WhatsApp ${formatPhone(profile.phone)}`}
              title={formatPhone(profile.phone)}
              className={CONTACT_ICON}
            >
              <FaWhatsapp className="size-[18px]" aria-hidden="true" />
            </a>
          </div>
          <Link
            href={CONTACT_LINK.href}
            className="mt-5 inline-flex items-center gap-2 rounded-full border border-border bg-surface px-3 py-1.5 text-xs font-medium"
          >
            <span className="ping-dot size-2.5 rounded-full bg-blue-600" aria-hidden="true" />
            {CONTACT_LINK.label}
          </Link>
        </div>
        <div className="grid grid-cols-2 gap-8 p-8 sm:grid-cols-3">
          <Column title="General" links={nav} />
          <Column title="Specifics" links={MORE_LINKS} />
          <Column title="More" links={more} />
        </div>
      </div>
      <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-1 border-t border-border py-4 text-xs text-muted">
        <span>
          © {new Date().getFullYear()} <strong className="font-medium text-foreground">{profile.name}</strong>. All
          rights reserved
        </span>
        <Link href="/sitemap.xml" className="link-underline">
          Sitemap
        </Link>
      </div>
      <div aria-hidden="true" className="hatch h-7 border-t border-border" />
    </footer>
  );
}
