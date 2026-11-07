import Image from "next/image";
import { SectionHeading } from "@/components/ui/section";
import { repeatToFill } from "@/lib/format";
import type { Testimonial } from "@/lib/types";

/** Each card's dark background, with a soft glow from the centre. */
const TONES = [
  "bg-[radial-gradient(ellipse_at_center,#123a6b_0%,#071a33_60%,#030a14_100%)]",
  "bg-[radial-gradient(ellipse_at_center,#3f5f80_0%,#1f3d5c_55%,#10263d_100%)]",
  "bg-black",
  "bg-[radial-gradient(ellipse_at_center,#2a2a63_0%,#14143a_55%,#07071a_100%)]",
  "bg-[radial-gradient(ellipse_at_center,#0f8fb0_0%,#0b7a9c_55%,#075a78_100%)]",
  "bg-[radial-gradient(ellipse_at_center,#53248c_0%,#2f1458_55%,#150729_100%)]",
];

/** Enough cards in one set that the row never shows a gap on a wide screen. */
const MIN_CARDS_PER_SET = 6;

function Avatar({ testimonial }: { testimonial: Testimonial }) {
  if (testimonial.avatarUrl) {
    return <Image src={testimonial.avatarUrl} alt="" width={44} height={44} className="size-11 rounded-full object-cover ring-1 ring-white/25" />;
  }
  return (
    <span aria-hidden="true" className="flex size-11 shrink-0 items-center justify-center rounded-full bg-white/15 font-medium ring-1 ring-white/25">
      {testimonial.name[0]}
    </span>
  );
}

function Card({ testimonial, tone, hidden }: { testimonial: Testimonial; tone: string; hidden: boolean }) {
  return (
    <figure
      aria-hidden={hidden || undefined}
      className={`flex w-[400px] max-w-[85vw] shrink-0 flex-col justify-between rounded-2xl p-7 text-white ${tone}`}
    >
      <div>
        <h3 className="font-serif text-2xl font-bold leading-tight">{testimonial.heading}</h3>
        <blockquote className="mt-3 text-[15px] leading-relaxed text-white/80">{testimonial.quote}</blockquote>
      </div>
      <figcaption className="mt-5 flex items-center gap-3">
        <Avatar testimonial={testimonial} />
        <span>
          <span className="block font-semibold">{testimonial.name}</span>
          <span className="block text-sm text-white/75">
            {testimonial.company ? `${testimonial.role} • ${testimonial.company}` : testimonial.role}
          </span>
        </span>
      </figcaption>
    </figure>
  );
}

export function Testimonials({ testimonials }: { testimonials: Testimonial[] }) {
  if (testimonials.length === 0) return null;

  const cards = repeatToFill(testimonials, MIN_CARDS_PER_SET);

  return (
    <section id="testimonials" className="pt-24 lg:pt-32">
      <div className="px-4 sm:px-6">
        <SectionHeading label="Testimonials" title="What people say" accent="about me" />
      </div>
      <div className="marquee marquee-fade mt-12 overflow-hidden">
        <div className="marquee-track flex w-max" style={{ "--marquee-duration": "42s" } as React.CSSProperties}>
          {[false, true].map((duplicate) => (
            <div key={String(duplicate)} className={`flex shrink-0 gap-4 pr-4 ${duplicate ? "marquee-duplicate" : ""}`}>
              {cards.map((testimonial, index) => (
                <Card
                  key={`${testimonial.name}-${index}`}
                  testimonial={testimonial}
                  tone={TONES[index % TONES.length]}
                  // Screen readers hear each real review once, not every repeat.
                  hidden={duplicate || index >= testimonials.length}
                />
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
