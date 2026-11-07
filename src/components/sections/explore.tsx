import Link from "next/link";
import { SectionHeading } from "@/components/ui/section";
import { TechIcon } from "@/components/ui/tech-icon";
import type { Profile } from "@/lib/types";

const CARD =
  "group relative flex h-72 flex-col justify-end overflow-hidden rounded-3xl border border-border bg-surface p-6 text-center";

const TOOLS = ["Docker", "Claude", "Azure"];

export function Explore({ profile }: { profile: Profile }) {
  return (
    <section className="px-4 pt-24 sm:px-6 lg:pt-32">
      <SectionHeading label="My site" title="Look around" accent="& say hello" stacked />
      <div className="mt-12 grid gap-2.5 md:grid-cols-3">
        <div>
          <Link href="/uses" className={CARD}>
            <span aria-hidden="true" className="absolute inset-x-0 top-9 flex items-center justify-center gap-3">
              {TOOLS.map((tool, index) => (
                <span
                  key={tool}
                  className={`flex items-center justify-center rounded-2xl border border-border bg-chip shadow-sm transition-transform group-hover:-translate-y-1 ${index === 1 ? "size-24" : "size-20"}`}
                >
                  <TechIcon name={tool} className="size-9" />
                </span>
              ))}
            </span>
            <span className="text-xs uppercase text-muted">Uses</span>
            <span className="mt-1 text-lg">Check out the tools I use</span>
          </Link>
        </div>
        <div>
          <Link href="/certificates" className={CARD}>
            <span aria-hidden="true" className="absolute inset-x-0 top-0 h-44">
              <span className="absolute left-[18%] top-3 h-32 w-40 -rotate-[24deg] rounded-xl bg-gradient-to-br from-violet-400 via-rose-300 to-teal-300 shadow-lg transition-transform group-hover:-rotate-[18deg]" />
              <span className="absolute right-[14%] top-8 h-32 w-40 rotate-[20deg] rounded-xl border border-border bg-gradient-to-br from-fuchsia-200 to-violet-300 p-4 shadow-lg transition-transform group-hover:rotate-[14deg]">
                <span className="block h-1.5 w-3/4 rounded-full bg-white/70" />
                <span className="mt-2 block h-1.5 w-1/2 rounded-full bg-white/70" />
              </span>
            </span>
            <span className="text-xs uppercase text-muted">Certificates</span>
            <span className="mt-1 text-lg">Browse my credentials</span>
          </Link>
        </div>
        <div>
          <Link href="/links" className={`${CARD} bg-gradient-to-b from-neutral-300 to-neutral-100 dark:from-neutral-800 dark:to-neutral-900`}>
            <span className="absolute inset-x-0 top-8 px-6 text-left text-sm text-muted">
              Based in <strong className="font-semibold text-foreground">{profile.location}</strong>, working{" "}
              <strong className="font-semibold text-foreground">{profile.workMode.toLowerCase()}</strong>
            </span>
            <span className="text-xs uppercase text-muted">Links</span>
            <span className="mt-1 text-lg">Find me online</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
