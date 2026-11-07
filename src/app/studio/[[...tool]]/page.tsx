import { isSanityConfigured } from "@/sanity/env";
import { Studio } from "./studio";

export { metadata, viewport } from "next-sanity/studio";

export const dynamic = "force-static";

export default function StudioPage() {
  if (!isSanityConfigured) {
    return (
      <p style={{ fontFamily: "sans-serif", padding: "2rem" }}>
        Studio needs a Sanity project. Set NEXT_PUBLIC_SANITY_PROJECT_ID, following the README.
      </p>
    );
  }
  return <Studio />;
}
