import { createClient } from "@sanity/client";
import { config } from "dotenv";
import { supportsYearsClaim } from "../src/lib/launch";

config({ path: ".env.local", quiet: true });

const force = process.argv.includes("--force");

function fail(message: string): never {
  console.error(`\nLaunch check failed: ${message}\n`);
  process.exit(1);
}

async function main() {
  // Only production builds are Launch, so previews and local builds skip this check.
  if (process.env.VERCEL_ENV !== "production" && !force) {
    console.log("Launch check skipped: this isn't a production build.");
    return;
  }

  const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
  if (!projectId) fail("NEXT_PUBLIC_SANITY_PROJECT_ID isn't set, so content can't be checked.");

  const client = createClient({
    projectId,
    dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || "production",
    apiVersion: "2025-01-01",
    useCdn: false,
    perspective: "published",
  });
  const experience = await client.fetch<{ start: string }[]>(
    `*[_type == "experience" && defined(start)]{ start }`,
  );

  if (!supportsYearsClaim(experience)) {
    fail(
      'the site claims "10+ years", but no published Experience started 10 or more years ago. ' +
        "Add your Earlier Experience in Studio and publish it, then deploy again.",
    );
  }
  console.log("Launch check passed.");
}

main().catch((error: unknown) => {
  fail(error instanceof Error ? error.message : String(error));
});
