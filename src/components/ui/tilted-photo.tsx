import Image from "next/image";
import type { Profile } from "@/lib/types";

/** Large tilted portrait. Loads straight away, so it's never blank when scrolled to. */
export function TiltedPhoto({ profile }: { profile: Profile }) {
  return (
    <div className="relative mx-auto aspect-square w-full max-w-[400px]">
      <div aria-hidden="true" className="absolute -inset-3 rotate-3 rounded-[3rem] border border-border" />
      <div className="absolute inset-0 rotate-6 overflow-hidden rounded-[3rem] bg-neutral-900 shadow-xl">
        <Image src={profile.photoUrl} alt={profile.name} fill loading="eager" sizes="400px" className="object-cover" />
      </div>
    </div>
  );
}
