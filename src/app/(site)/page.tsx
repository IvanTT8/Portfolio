import { About } from "@/components/sections/about";
import { Bento } from "@/components/sections/bento";
import { BlogPreview } from "@/components/sections/blog-preview";
import { CallToAction } from "@/components/sections/call-to-action";
import { Explore } from "@/components/sections/explore";
import { Hero } from "@/components/sections/hero";
import { SelectedWorkSection } from "@/components/sections/selected-work";
import { Skills } from "@/components/sections/skills";
import { Testimonials } from "@/components/sections/testimonials";
import { getContent } from "@/lib/content";

export default async function HomePage() {
  const content = await getContent();
  const { profile, experience } = content;
  const current = experience.find((role) => !role.end);
  // "Interpublic Group (IPG)" reads better large as its short form.
  const shortCompany = current?.company.match(/\(([^)]+)\)/)?.[1] ?? current?.company;

  return (
    <>
      <Hero
        profile={profile}
        cards={content.nowCards}
        currentRole={current && shortCompany ? { company: shortCompany, title: current.title } : undefined}
      />
      <Bento profile={profile} skills={content.skills} connections={content.connections} />
      <SelectedWorkSection work={content.selectedWork} projects={content.projects} />
      <Skills skills={content.skills} />
      <About profile={profile} />
      <BlogPreview posts={content.posts} />
      <Testimonials testimonials={content.testimonials} />
      <Explore profile={profile} />
      <CallToAction profile={profile} />
    </>
  );
}
