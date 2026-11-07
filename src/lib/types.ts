import type { PortableTextBlock } from "next-sanity";

export type Profile = {
  name: string;
  role: string;
  tagline: string;
  /** The hero's large heading, set as plain text then a gradient accent. */
  heroTitle: string;
  heroAccent: string;
  /** Shown in the hero. Launch requires Experience that supports it. */
  yearsClaim: string;
  summary: string[];
  location: string;
  workMode: string;
  timezone: string;
  email: string;
  phone: string;
  linkedin: string;
  /** The uploaded photo, or the default in public/. Also used as the site's logo. */
  photoUrl: string;
  resumeUrl?: string;
};

export type NowCard = { label: string; title: string; subtitle: string; href?: string };
export type SkillCategory = { name: string; items: string[] };

export type Experience = {
  title: string;
  company: string;
  location: string;
  /** ISO date, YYYY-MM-DD. */
  start: string;
  /** ISO date, YYYY-MM-DD. Absent for a current role. */
  end?: string;
  highlights: string[];
};

export type Education = {
  institution: string;
  credential: string;
  location: string;
  period: string;
};

export type Language = { name: string; level: string };

export type WorkVisual = "search" | "chat" | "pipeline" | "mobile";

export type SelectedWork = {
  title: string;
  category: string;
  employer: string;
  /** Short line shown on the visual. */
  lead: string;
  description: string;
  points: string[];
  tech: string[];
  visual: WorkVisual;
};

export type Project = {
  title: string;
  slug: string;
  category: string;
  summary: string;
  tech: string[];
  liveUrl?: string;
  imageUrl?: string;
  body?: PortableTextBlock[];
};

export type BlogPost = {
  title: string;
  slug: string;
  excerpt: string;
  publishedAt: string;
  coverUrl?: string;
  categories?: string[];
  body?: PortableTextBlock[];
};

export type Testimonial = {
  name: string;
  role: string;
  company?: string;
  heading: string;
  quote: string;
  avatarUrl?: string;
};

export type Connection = { name: string; url?: string; avatarUrl?: string };

export type SiteContent = {
  profile: Profile;
  nowCards: NowCard[];
  skills: SkillCategory[];
  experience: Experience[];
  education: Education[];
  languages: Language[];
  selectedWork: SelectedWork[];
  projects: Project[];
  posts: BlogPost[];
  testimonials: Testimonial[];
  connections: Connection[];
};
