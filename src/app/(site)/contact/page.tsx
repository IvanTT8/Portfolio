import type { Metadata } from "next";
import { HiOutlineMail, HiOutlinePhone } from "react-icons/hi";
import { AboutSocials } from "@/components/sections/about";
import { ContactForm } from "@/components/ui/contact-form";
import { SectionHeading } from "@/components/ui/section";
import { getContent } from "@/lib/content";
import { formatPhone } from "@/lib/format";

export const metadata: Metadata = { title: "Contact" };

export default async function ContactPage() {
  const { profile } = await getContent();

  return (
    <div className="relative">
      <div aria-hidden="true" className="paper-bg pointer-events-none absolute inset-x-0 top-0 h-[420px]" />
      <div className="relative mx-auto max-w-xl px-4 pb-24 pt-32 text-center sm:px-6">
        <SectionHeading label="Contact" title="Questions &" accent="feedback" level="h1" />
        <p className="mt-5 flex flex-wrap items-center justify-center gap-x-5 gap-y-1 text-sm text-muted">
          <a href={`mailto:${profile.email}`} className="inline-flex items-center gap-1.5 hover:text-foreground">
            <HiOutlineMail className="size-4" aria-hidden="true" />
            {profile.email}
          </a>
          <a href={`tel:${profile.phone}`} className="inline-flex items-center gap-1.5 hover:text-foreground">
            <HiOutlinePhone className="size-4" aria-hidden="true" />
            {formatPhone(profile.phone)}
          </a>
        </p>
        <div className="mt-4 flex justify-center">
          <AboutSocials profile={profile} />
        </div>
        <ContactForm email={profile.email} />
      </div>
    </div>
  );
}
