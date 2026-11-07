import type { Metadata } from "next";
import { Instrument_Serif, Outfit } from "next/font/google";
import { ThemeProvider } from "next-themes";
import type { ReactNode } from "react";
import { Footer } from "@/components/sections/footer";
import { Header } from "@/components/sections/header";
import { getContent } from "@/lib/content";
import { buildNav } from "@/lib/navigation";
import "../globals.css";

const instrumentSerif = Instrument_Serif({
  weight: "400",
  style: ["normal", "italic"],
  subsets: ["latin"],
  variable: "--font-instrument-serif",
});

const outfit = Outfit({ subsets: ["latin"], variable: "--font-outfit" });

export async function generateMetadata(): Promise<Metadata> {
  const { profile } = await getContent();
  const title = `${profile.name} | ${profile.role}`;

  return {
    title: { default: title, template: `%s | ${profile.name}` },
    description: profile.tagline,
    openGraph: { type: "website", url: "/", siteName: profile.name, title, description: profile.tagline },
    twitter: { card: "summary_large_image", title, description: profile.tagline },
  };
}

export default async function SiteLayout({ children }: { children: ReactNode }) {
  const content = await getContent();

  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
      <div className={`${instrumentSerif.variable} ${outfit.variable} font-sans antialiased`}>
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:rounded-md focus:bg-pill focus:px-4 focus:py-2 focus:text-pill-foreground"
        >
          Skip to content
        </a>
        <Header
          name={content.profile.name}
          photoUrl={content.profile.photoUrl}
          links={buildNav(content)}
          resumeUrl={content.profile.resumeUrl}
        />
        <div className="mx-auto flex w-full max-w-[1280px]">
          <div aria-hidden="true" className="hatch hidden w-8 shrink-0 border-x border-border md:block" />
          <div className="min-w-0 flex-1 overflow-x-clip">
            <main id="main">{children}</main>
          </div>
          <div aria-hidden="true" className="hatch hidden w-8 shrink-0 border-x border-border md:block" />
        </div>
        <Footer profile={content.profile} nav={buildNav(content)} />
      </div>
    </ThemeProvider>
  );
}
