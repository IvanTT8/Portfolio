const TECH_NAMES = [
  "TypeScript",
  "React Native",
  "React",
  "Next.js",
  "Node.js",
  "Express",
  "Fastify",
  "Svelte",
  "Python",
  "Django",
  "PostgreSQL",
  "MySQL",
  "Redis",
  "SQL",
  "LangChain",
  "LangGraph",
  "Pinecone",
  "Claude",
  "n8n",
  "Azure",
  "AWS",
  "Vercel",
  "Jira",
  "Datadog",
  "ServiceNow",
  "Dynamics 365",
];

/** The technologies a role's highlights name, so chips always match the written history. */
export function techMentioned(highlights: string[] = []): string[] {
  const text = highlights.join(" ");
  return TECH_NAMES.filter((name) => {
    const escaped = name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    return new RegExp(`(^|[^\\w])${escaped}(?![\\w])(?! Native)`).test(text);
  });
}
