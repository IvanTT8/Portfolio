import Link from "next/link";
import { TechChip } from "@/components/ui/tech-icon";
import type { SelectedWork } from "@/lib/types";

function Sparkle() {
  return (
    <svg viewBox="0 0 24 24" className="mt-0.5 size-4 shrink-0 text-teal-800 dark:text-teal-300" fill="currentColor" aria-hidden="true">
      <path d="M12 0c1 7 4 11 12 12-8 1-11 5-12 12-1-7-4-11-12-12 8-1 11-5 12-12Z" />
    </svg>
  );
}

type Props = { item: SelectedWork; hideTitle?: boolean };

export function WorkDetails({ item, hideTitle = false }: Props) {
  return (
    <>
      {!hideTitle && (
        <h3 className="flex items-start justify-between gap-4 font-serif text-4xl leading-tight tracking-tight">
          {item.title}
          <Link href="/projects" aria-label={`See ${item.title} in my work`} className="mt-2 text-lg text-muted transition-colors hover:text-foreground">
            ↗
          </Link>
        </h3>
      )}
      <p className="text-xs uppercase text-muted">{item.employer}</p>
      <p className="mt-4 leading-relaxed text-muted">{item.description}</p>
      <ul className="mt-5 space-y-2.5 text-sm font-medium">
        {(item.points ?? []).map((point) => (
          <li key={point} className="flex gap-3">
            <Sparkle />
            {point}
          </li>
        ))}
      </ul>
      <div className="mt-6 flex flex-wrap gap-2">
        {item.tech.map((tech) => (
          <TechChip key={tech} name={tech} />
        ))}
      </div>
    </>
  );
}
