/** All published site content, in the shape expected by mapSiteContent. */
export const SITE_CONTENT_QUERY = `{
  "profile": *[_id == "profile"][0]{
    name, role, tagline, heroTitle, heroAccent, yearsClaim, summary, location, workMode, timezone,
    email, phone, linkedin, photo,
    "resumeUrl": resume.asset->url
  },
  "nowCards": *[_type == "nowCard"] | order(order asc){ label, title, subtitle, href },
  "skills": *[_type == "skillCategory"] | order(order asc){ name, items },
  "experience": *[_type == "experience"] | order(start desc){
    title, company, location, start, end, highlights
  },
  "education": *[_type == "education"] | order(order asc){
    institution, credential, location, period
  },
  "languages": *[_type == "language"] | order(order asc){ name, level },
  "selectedWork": *[_type == "selectedWork"] | order(order asc){
    title, category, employer, lead, description, points, tech, visual
  },
  "projects": *[_type == "project" && defined(slug.current)] | order(order asc){
    title, "slug": slug.current, category, summary, tech, liveUrl, image, body
  },
  "posts": *[_type == "blogPost" && defined(slug.current)] | order(publishedAt desc){
    title, "slug": slug.current, excerpt, publishedAt, cover, categories, body
  },
  "testimonials": *[_type == "testimonial"] | order(order asc){
    name, role, company, heading, quote, avatar
  },
  "connections": *[_type == "connection"] | order(order asc){ name, url, avatar }
}`;
