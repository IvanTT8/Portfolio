import { defineArrayMember, defineField, defineType } from "sanity";

const requiredString = (name: string, title: string) =>
  defineField({ name, title, type: "string", validation: (rule) => rule.required() });

const stringList = (name: string, title: string) =>
  defineField({ name, title, type: "array", of: [defineArrayMember({ type: "string" })] });

const orderField = defineField({
  name: "order",
  title: "Display order",
  type: "number",
  description: "Lower numbers appear first.",
  initialValue: 100,
  validation: (rule) => rule.required(),
});

const slugField = defineField({
  name: "slug",
  title: "URL slug",
  type: "slug",
  options: { source: "title" },
  validation: (rule) => rule.required(),
});

const richText = defineField({
  name: "body",
  title: "Body",
  type: "array",
  of: [defineArrayMember({ type: "block" })],
  validation: (rule) => rule.required(),
});

const croppableImage = (name: string, title: string, description?: string) =>
  defineField({ name, title, description, type: "image", options: { hotspot: true } });

const profile = defineType({
  name: "profile",
  title: "Profile",
  type: "document",
  fields: [
    requiredString("name", "Name"),
    requiredString("role", "Role"),
    requiredString("tagline", "Tagline"),
    requiredString("heroTitle", "Hero heading"),
    requiredString("heroAccent", "Hero heading accent"),
    defineField({
      name: "yearsClaim",
      title: "Years of experience claim",
      type: "string",
      description: "Shown in the hero. Your Experience entries should support it.",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "summary",
      title: "Summary paragraphs",
      type: "array",
      of: [defineArrayMember({ type: "text", rows: 4 })],
      validation: (rule) => rule.required().min(1),
    }),
    requiredString("location", "Location"),
    requiredString("workMode", "Work mode"),
    requiredString("timezone", "Time zone"),
    defineField({
      name: "email",
      title: "Email",
      type: "string",
      validation: (rule) => rule.required().email(),
    }),
    requiredString("phone", "Phone"),
    defineField({
      name: "linkedin",
      title: "LinkedIn URL",
      type: "url",
      validation: (rule) => rule.required(),
    }),
    croppableImage("photo", "Photo", "Optional. The hero is text-only without one."),
    defineField({ name: "resume", title: "Resume PDF", type: "file" }),
  ],
});

const nowCard = defineType({
  name: "nowCard",
  title: "Now card",
  type: "document",
  fields: [
    requiredString("label", "Label"),
    requiredString("title", "Title"),
    requiredString("subtitle", "Subtitle"),
    defineField({ name: "href", title: "Link", type: "string" }),
    orderField,
  ],
});

const skillCategory = defineType({
  name: "skillCategory",
  title: "Skill category",
  type: "document",
  fields: [requiredString("name", "Name"), stringList("items", "Skills"), orderField],
  preview: { select: { title: "name" } },
});

const experience = defineType({
  name: "experience",
  title: "Experience",
  type: "document",
  description: "A dated role. Add Earlier Experience here to support the years claim before Launch.",
  fields: [
    requiredString("title", "Title"),
    requiredString("company", "Company"),
    requiredString("location", "Location"),
    defineField({
      name: "start",
      title: "Start date",
      type: "date",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "end",
      title: "End date",
      type: "date",
      description: "Leave empty for a current role.",
    }),
    defineField({
      name: "highlights",
      title: "Highlights",
      description: "The first three appear on the home page.",
      type: "array",
      of: [defineArrayMember({ type: "text", rows: 2 })],
    }),
  ],
  orderings: [
    { title: "Newest first", name: "startDesc", by: [{ field: "start", direction: "desc" }] },
  ],
  preview: { select: { title: "title", subtitle: "company" } },
});

const education = defineType({
  name: "education",
  title: "Education",
  type: "document",
  fields: [
    requiredString("institution", "Institution"),
    requiredString("credential", "Credential"),
    requiredString("location", "Location"),
    requiredString("period", "Period"),
    orderField,
  ],
  preview: { select: { title: "institution", subtitle: "credential" } },
});

const language = defineType({
  name: "language",
  title: "Language",
  type: "document",
  fields: [requiredString("name", "Name"), requiredString("level", "Level"), orderField],
  preview: { select: { title: "name", subtitle: "level" } },
});

const selectedWork = defineType({
  name: "selectedWork",
  title: "Selected Work",
  type: "document",
  fields: [
    requiredString("title", "Title"),
    requiredString("category", "Category"),
    requiredString("employer", "Employer"),
    requiredString("lead", "Short line on the visual"),
    defineField({
      name: "description",
      title: "Description",
      type: "text",
      rows: 3,
      validation: (rule) => rule.required(),
    }),
    stringList("points", "Key points"),
    stringList("tech", "Tech used"),
    defineField({
      name: "visual",
      title: "Visual",
      type: "string",
      options: { list: ["search", "chat", "pipeline", "mobile"] },
      initialValue: "search",
      validation: (rule) => rule.required(),
    }),
    orderField,
  ],
  preview: { select: { title: "title", subtitle: "employer" } },
});

const project = defineType({
  name: "project",
  title: "Project",
  type: "document",
  description: "A real case study. Each one gets its own page.",
  fields: [
    requiredString("title", "Title"),
    slugField,
    requiredString("category", "Category"),
    defineField({
      name: "summary",
      title: "Summary",
      type: "text",
      rows: 3,
      validation: (rule) => rule.required(),
    }),
    stringList("tech", "Tech used"),
    defineField({ name: "liveUrl", title: "Live URL", type: "url" }),
    croppableImage("image", "Image"),
    richText,
    orderField,
  ],
});

const blogPost = defineType({
  name: "blogPost",
  title: "Blog post",
  type: "document",
  fields: [
    requiredString("title", "Title"),
    slugField,
    defineField({
      name: "excerpt",
      title: "Excerpt",
      type: "text",
      rows: 2,
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "publishedAt",
      title: "Published on",
      type: "date",
      validation: (rule) => rule.required(),
    }),
    croppableImage("cover", "Cover image"),
    stringList("categories", "Categories"),
    richText,
  ],
});

const testimonial = defineType({
  name: "testimonial",
  title: "Testimonial",
  type: "document",
  fields: [
    requiredString("name", "Name"),
    requiredString("role", "Role"),
    defineField({ name: "company", title: "Company", type: "string" }),
    requiredString("heading", "Heading"),
    defineField({
      name: "quote",
      title: "Quote",
      type: "text",
      rows: 4,
      validation: (rule) => rule.required(),
    }),
    croppableImage("avatar", "Avatar"),
    orderField,
  ],
  preview: { select: { title: "name", subtitle: "company", media: "avatar" } },
});

const connection = defineType({
  name: "connection",
  title: "Connection",
  type: "document",
  fields: [
    requiredString("name", "Name"),
    defineField({ name: "url", title: "Profile URL", type: "url" }),
    croppableImage("avatar", "Avatar"),
    orderField,
  ],
  preview: { select: { title: "name", media: "avatar" } },
});

export const schemaTypes = [
  profile,
  nowCard,
  skillCategory,
  experience,
  education,
  language,
  selectedWork,
  project,
  blogPost,
  testimonial,
  connection,
];
