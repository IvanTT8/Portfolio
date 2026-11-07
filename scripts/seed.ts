import { createReadStream } from "node:fs";
import { resolve } from "node:path";
import { createClient } from "@sanity/client";
import { config } from "dotenv";
import { buildSeedDocuments } from "../content-seed/documents";
import { resume } from "../content-seed/resume";

config({ path: ".env.local", quiet: true });

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const token = process.env.SANITY_WRITE_TOKEN;

if (!projectId || !token) {
  console.error("Set NEXT_PUBLIC_SANITY_PROJECT_ID and SANITY_WRITE_TOKEN in .env.local first.");
  process.exit(1);
}

const client = createClient({
  projectId,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || "production",
  apiVersion: "2025-01-01",
  token,
  useCdn: false,
});

async function main() {
  const documents = buildSeedDocuments(resume);

  // createIfNotExists means running this again never overwrites edits made in Studio.
  const transaction = client.transaction();
  for (const document of documents) transaction.createIfNotExists(document);
  await transaction.commit();
  console.log(`Seeded ${documents.length} documents (existing ones were left unchanged).`);

  const existing = await client.fetch<{ resume?: unknown } | null>(
    `*[_id == "profile"][0]{ resume }`,
  );
  if (existing?.resume) {
    console.log("Profile already has a resume PDF, so it was left unchanged.");
    return;
  }

  const asset = await client.assets.upload(
    "file",
    createReadStream(resolve("Ivan Torrente.pdf")),
    { filename: "Ivan-Torrente-Resume.pdf", contentType: "application/pdf" },
  );
  await client
    .patch("profile")
    .set({ resume: { _type: "file", asset: { _type: "reference", _ref: asset._id } } })
    .commit();
  console.log("Uploaded the resume PDF.");
}

main().catch((error: unknown) => {
  console.error(error);
  process.exit(1);
});
