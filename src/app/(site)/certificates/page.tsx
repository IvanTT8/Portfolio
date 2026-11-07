import type { Metadata } from "next";
import { Education } from "@/components/sections/education";
import { getContent } from "@/lib/content";

export const metadata: Metadata = { title: "Certificates" };

export default async function CertificatesPage() {
  const { education, languages } = await getContent();

  return (
    <div className="pt-12">
      <Education education={education} languages={languages} level="h1" />
    </div>
  );
}
