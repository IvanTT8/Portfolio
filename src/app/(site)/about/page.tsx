import type { Metadata } from "next";
import { AboutSocials } from "@/components/sections/about";
import { Education } from "@/components/sections/education";
import { ExperienceTimeline } from "@/components/sections/experience-timeline";
import { Eyebrow } from "@/components/ui/section";
import { TiltedPhoto } from "@/components/ui/tilted-photo";
import { getContent } from "@/lib/content";

export const metadata: Metadata = { title: "About" };

export default async function AboutPage() {
  const { profile, experience, education, languages } = await getContent();

  return (
    <div className="relative">
      <div aria-hidden="true" className="paper-bg pointer-events-none absolute inset-x-0 top-0 h-[520px]" />
      <section className="relative grid items-center gap-14 px-4 pb-14 pt-32 sm:px-6 lg:grid-cols-[1.2fr_1fr]">
        <div>
          <Eyebrow>More about me</Eyebrow>
          <h1 className="mt-4 font-serif text-5xl leading-[1.08] tracking-tight sm:text-6xl">
            I&apos;m {profile.name}, a
            <br />
            full-stack <span className="gradient-text">engineer</span>
          </h1>
          <div className="mt-8 max-w-xl space-y-5 font-light leading-relaxed tracking-wide text-muted">
            {profile.summary.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
          <div className="mt-6">
            <AboutSocials profile={profile} />
          </div>
        </div>
        <div>
          <TiltedPhoto profile={profile} />
        </div>
      </section>
      <ExperienceTimeline experience={experience} photoUrl={profile.photoUrl} />
      <Education education={education} languages={languages} />
    </div>
  );
}
