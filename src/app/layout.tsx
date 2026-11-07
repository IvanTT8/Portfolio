import type { Metadata } from "next";
import type { ReactNode } from "react";
import { siteUrl } from "@/lib/site";

export const metadata: Metadata = { metadataBase: new URL(siteUrl) };

/** Fetches no content, so Studio still opens if the site's content has a problem. */
export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" data-scroll-behavior="smooth" suppressHydrationWarning>
      <body>{children}</body>
    </html>
  );
}
