import { FaLinkedinIn } from "react-icons/fa";
import { HiOutlineMail } from "react-icons/hi";
import { TextLink } from "@/components/ui/pill-link";
import { Eyebrow } from "@/components/ui/section";
import { TiltedPhoto } from "@/components/ui/tilted-photo";
import type { Profile } from "@/lib/types";

export function AboutSocials({ profile }: { profile: Profile }) {
  return (
    <div className="flex gap-3">
      <a href={profile.linkedin} target="_blank" rel="noreferrer" aria-label="LinkedIn">
        <FaLinkedinIn className="size-5" />
      </a>
      <a href={`mailto:${profile.email}`} aria-label="Email">
        <HiOutlineMail className="size-5" />
      </a>
    </div>
  );
}

export function About({ profile }: { profile: Profile }) {
  return (
    <section id="about" className="mt-24 bg-band px-4 py-16 sm:px-6 lg:mt-32 lg:py-20">
      <div className="grid items-center gap-14 lg:grid-cols-[1.2fr_1fr]">
        <div>
          <Eyebrow>Know about me</Eyebrow>
          <h2 className="mt-4 font-serif text-5xl leading-[1.08] tracking-tight sm:text-6xl">
            Senior engineer for
            <br />
            <span className="gradient-text">web, mobile &amp; AI</span>
          </h2>
          <div className="mt-8 max-w-xl space-y-5 font-light leading-relaxed tracking-wide text-muted">
            {profile.summary.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
          <div className="mt-6">
            <AboutSocials profile={profile} />
          </div>
          <div className="mt-7">
            <TextLink href="/about#experience" label="Work Experience" />
          </div>
        </div>
        <div>
          <TiltedPhoto profile={profile} />
        </div>
      </div>
    </section>
  );
}
