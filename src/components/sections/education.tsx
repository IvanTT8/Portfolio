import { SectionHeading } from "@/components/ui/section";
import type { Education as EducationEntry, Language } from "@/lib/types";

type Props = {
  education: EducationEntry[];
  languages: Language[];
  level?: "h1" | "h2";
};

export function Education({ education, languages, level }: Props) {
  if (education.length === 0 && languages.length === 0) return null;

  return (
    <section id="education" className="border-t border-border px-4 py-20 sm:px-6">
      <SectionHeading label="Education" title="Credentials &" accent="languages" level={level} />
      <div className="mt-12 grid gap-2.5 md:grid-cols-2">
        {education.map((entry) => (
          <div key={entry.institution} className="rounded-3xl border border-border bg-surface p-6">
            <h3 className="font-serif text-3xl leading-tight tracking-tight">{entry.institution}</h3>
            <p className="mt-3 leading-relaxed text-muted">{entry.credential}</p>
            <p className="mt-4 text-xs uppercase tracking-wider text-muted">
              {entry.location} · {entry.period}
            </p>
          </div>
        ))}
      </div>
      {languages.length > 0 && (
        <p className="mt-8 text-center text-muted">
          <span className="font-medium text-foreground">Languages: </span>
          {languages.map(({ name, level: proficiency }) => `${name} (${proficiency})`).join(", ")}
        </p>
      )}
    </section>
  );
}
