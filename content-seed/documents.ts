import type { SiteContent } from "../src/lib/types";

export type SeedDocument = { _id: string; _type: string; [field: string]: unknown };

function withOrder<T extends object>(type: string, items: T[]): SeedDocument[] {
  return items.map((item, index) => ({
    _id: `${type}-${index + 1}`,
    _type: type,
    order: index + 1,
    ...item,
  }));
}

/** Turns resume content into Sanity documents, using stable IDs so seeding is repeatable. */
export function buildSeedDocuments(content: SiteContent): SeedDocument[] {
  // These URLs are local to the preview. The seed script uploads the PDF to Sanity instead.
  const profile: Partial<SiteContent["profile"]> = { ...content.profile };
  delete profile.resumeUrl;
  delete profile.photoUrl;

  return [
    { _id: "profile", _type: "profile", ...profile },
    ...withOrder("nowCard", content.nowCards),
    ...withOrder("skillCategory", content.skills),
    ...content.experience.map((entry, index) => ({
      _id: `experience-${index + 1}`,
      _type: "experience",
      ...entry,
    })),
    ...withOrder("education", content.education),
    ...withOrder("language", content.languages),
    ...withOrder("selectedWork", content.selectedWork),
    // Avatar paths are local to the preview. Upload avatars in Studio.
    ...withOrder("testimonial", content.testimonials).map((review) => {
      delete review.avatarUrl;
      return review;
    }),
  ];
}
