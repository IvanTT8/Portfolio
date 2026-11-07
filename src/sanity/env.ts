export const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ?? "";
export const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";
export const apiVersion = "2025-01-01";

/** Without a project, the site previews using the resume content in content-seed. */
export const isSanityConfigured = projectId.length > 0;
