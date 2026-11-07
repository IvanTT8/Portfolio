import { formatPhone } from "@/lib/format";
import type { Profile } from "@/lib/types";

const LINK_CLASS =
  "rounded-full border border-border bg-surface px-5 py-2.5 text-sm font-medium transition-colors hover:bg-chip";

export function ContactLinks({ profile, className = "" }: { profile: Profile; className?: string }) {
  return (
    <div className={`flex flex-wrap gap-3 ${className}`}>
      <a className={LINK_CLASS} href={`mailto:${profile.email}`}>
        {profile.email}
      </a>
      <a className={LINK_CLASS} href={`tel:${profile.phone}`}>
        {formatPhone(profile.phone)}
      </a>
      <a className={LINK_CLASS} href={profile.linkedin} target="_blank" rel="noreferrer">
        LinkedIn
      </a>
      {profile.resumeUrl && (
        <a className={LINK_CLASS} href={profile.resumeUrl} target="_blank" rel="noreferrer">
          Download resume
        </a>
      )}
    </div>
  );
}
