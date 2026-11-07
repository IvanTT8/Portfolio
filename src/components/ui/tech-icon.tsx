import type { IconType } from "react-icons";
import { FaAws } from "react-icons/fa";
import {
  SiAndroid,
  SiAnthropic,
  SiApple,
  SiBitbucket,
  SiCloudflare,
  SiConfluence,
  SiCss,
  SiCypress,
  SiDatadog,
  SiDjango,
  SiDocker,
  SiElasticsearch,
  SiExpress,
  SiFastapi,
  SiFastify,
  SiFlask,
  SiGit,
  SiGithub,
  SiGitlab,
  SiGraphql,
  SiHtml5,
  SiJavascript,
  SiJest,
  SiJira,
  SiKubernetes,
  SiLangchain,
  SiMocha,
  SiMongodb,
  SiMysql,
  SiN8N,
  SiNestjs,
  SiNextdotjs,
  SiNodedotjs,
  SiPostgresql,
  SiPytest,
  SiPython,
  SiReact,
  SiRedis,
  SiRedux,
  SiSass,
  SiSvelte,
  SiTailwindcss,
  SiTerraform,
  SiTestinglibrary,
  SiTypescript,
  SiVercel,
  SiZendesk,
} from "react-icons/si";
import { TbBrandOpenai } from "react-icons/tb";
import { VscAzure } from "react-icons/vsc";

type Brand = { icon: IconType; color?: string };

/** Brand colours appear on tiles and chips. Monochrome logos use the text colour. */
const BRANDS: Record<string, Brand> = {
  typescript: { icon: SiTypescript, color: "#3178c6" },
  javascript: { icon: SiJavascript, color: "#e3b900" },
  python: { icon: SiPython, color: "#3776ab" },
  react: { icon: SiReact, color: "#22b8d9" },
  "react.js": { icon: SiReact, color: "#22b8d9" },
  "react native": { icon: SiReact, color: "#22b8d9" },
  "react testing library": { icon: SiTestinglibrary, color: "#e33332" },
  "next.js": { icon: SiNextdotjs },
  redux: { icon: SiRedux, color: "#764abc" },
  html5: { icon: SiHtml5, color: "#e34f26" },
  css3: { icon: SiCss, color: "#663399" },
  sass: { icon: SiSass, color: "#cc6699" },
  "tailwind css": { icon: SiTailwindcss, color: "#06b6d4" },
  openai: { icon: TbBrandOpenai },
  langchain: { icon: SiLangchain, color: "#1c8a7d" },
  langgraph: { icon: SiLangchain, color: "#1c8a7d" },
  langsmith: { icon: SiLangchain, color: "#1c8a7d" },
  claude: { icon: SiAnthropic, color: "#d97757" },
  "microsoft azure": { icon: VscAzure, color: "#0078d4" },
  azure: { icon: VscAzure, color: "#0078d4" },
  aws: { icon: FaAws, color: "#ff9900" },
  docker: { icon: SiDocker, color: "#2496ed" },
  kubernetes: { icon: SiKubernetes, color: "#326ce5" },
  terraform: { icon: SiTerraform, color: "#7b42bc" },
  cloudflare: { icon: SiCloudflare, color: "#f38020" },
  django: { icon: SiDjango, color: "#2f8f68" },
  flask: { icon: SiFlask },
  fastapi: { icon: SiFastapi, color: "#009688" },
  fastify: { icon: SiFastify },
  express: { icon: SiExpress },
  svelte: { icon: SiSvelte, color: "#ff3e00" },
  "node.js": { icon: SiNodedotjs, color: "#5fa04e" },
  graphql: { icon: SiGraphql, color: "#e10098" },
  postgresql: { icon: SiPostgresql, color: "#4169e1" },
  mysql: { icon: SiMysql, color: "#4479a1" },
  mongodb: { icon: SiMongodb, color: "#47a248" },
  redis: { icon: SiRedis, color: "#ff4438" },
  elasticsearch: { icon: SiElasticsearch, color: "#00a0a0" },
  nestjs: { icon: SiNestjs, color: "#e0234e" },
  mocha: { icon: SiMocha, color: "#8d6748" },
  jest: { icon: SiJest, color: "#c21325" },
  pytest: { icon: SiPytest, color: "#0a9edc" },
  cypress: { icon: SiCypress, color: "#3b9e72" },
  git: { icon: SiGit, color: "#f05032" },
  github: { icon: SiGithub },
  gitlab: { icon: SiGitlab, color: "#fc6d26" },
  bitbucket: { icon: SiBitbucket, color: "#0052cc" },
  jira: { icon: SiJira, color: "#0052cc" },
  confluence: { icon: SiConfluence, color: "#1868db" },
  zendesk: { icon: SiZendesk, color: "#3a8a7f" },
  n8n: { icon: SiN8N, color: "#ea4b71" },
  datadog: { icon: SiDatadog, color: "#632ca6" },
  vercel: { icon: SiVercel },
  ios: { icon: SiApple },
  android: { icon: SiAndroid, color: "#3ddc84" },
};

/** Keeps one name per logo, so a row of tiles never repeats an icon. */
export function namesWithUniqueIcons(names: string[]): string[] {
  const seen = new Set<IconType>();
  return names.filter((name) => {
    const icon = BRANDS[name.toLowerCase()]?.icon;
    if (!icon || seen.has(icon)) return false;
    seen.add(icon);
    return true;
  });
}

export function TechIcon({ name, className = "size-4" }: { name: string; className?: string }) {
  const brand = BRANDS[name.toLowerCase()];
  if (!brand) return null;

  const Icon = brand.icon;
  return <Icon className={className} color={brand.color} aria-hidden="true" />;
}

/** The uppercase chip with a logo, used on work and experience entries. */
export function TechChip({ name }: { name: string }) {
  return (
    <span className="inline-flex items-center gap-2 rounded-lg border border-border bg-chip px-2.5 py-1.5 text-xs font-medium uppercase">
      <TechIcon name={name} className="size-3.5" />
      {name}
    </span>
  );
}
