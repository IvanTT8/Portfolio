import { DEFAULT_PHOTO_URL } from "@/lib/site";
import type {
  BlogPost,
  Connection,
  Profile,
  Project,
  SiteContent,
  Testimonial,
} from "@/lib/types";

/** Builds an image URL from a Sanity image field, applying any crop set in Studio. */
export type ImageUrlFor = (source: unknown, width: number, height?: number) => string | undefined;

type WithoutNulls<T> = { [K in keyof T]: T[K] | null };

export type RawSiteContent = Omit<
  SiteContent,
  "profile" | "projects" | "posts" | "testimonials" | "connections"
> & {
  profile: WithoutNulls<Omit<Profile, "photoUrl">> & { photo?: unknown };
  projects: (WithoutNulls<Omit<Project, "imageUrl">> & { image?: unknown })[];
  posts: (WithoutNulls<Omit<BlogPost, "coverUrl">> & { cover?: unknown })[];
  testimonials: (WithoutNulls<Omit<Testimonial, "avatarUrl">> & { avatar?: unknown })[];
  connections: (WithoutNulls<Omit<Connection, "avatarUrl">> & { avatar?: unknown })[];
};

/** GROQ returns null for empty fields, while the site's types use undefined. */
function dropNulls<T extends object>(value: T): T {
  return Object.fromEntries(Object.entries(value).filter(([, v]) => v !== null)) as T;
}

export function mapSiteContent(raw: RawSiteContent, imageUrl: ImageUrlFor): SiteContent {
  if (!raw.profile?.name) {
    throw new Error('Sanity has no "profile" document. Run `npm run seed` to load the resume.');
  }

  const { photo, ...profile } = raw.profile;

  return {
    ...raw,
    profile: { ...dropNulls(profile), photoUrl: imageUrl(photo, 640, 640) ?? DEFAULT_PHOTO_URL } as Profile,
    experience: raw.experience.map(dropNulls),
    projects: raw.projects.map(({ image, ...project }) => ({
      ...(dropNulls(project) as Project),
      tech: project.tech ?? [],
      imageUrl: imageUrl(image, 1200, 675),
    })),
    posts: raw.posts.map(({ cover, ...post }) => ({
      ...(dropNulls(post) as BlogPost),
      coverUrl: imageUrl(cover, 1200, 630),
    })),
    testimonials: raw.testimonials.map(({ avatar, ...testimonial }) => ({
      ...(dropNulls(testimonial) as Testimonial),
      avatarUrl: imageUrl(avatar, 96, 96),
    })),
    connections: raw.connections.map(({ avatar, ...connection }) => ({
      ...(dropNulls(connection) as Connection),
      avatarUrl: imageUrl(avatar, 96, 96),
    })),
  };
}
