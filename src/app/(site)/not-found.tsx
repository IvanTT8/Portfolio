import { TextLink } from "@/components/ui/pill-link";

export default function NotFound() {
  return (
    <section className="flex min-h-[70vh] flex-col items-center justify-center px-6 py-24 text-center">
      <p className="text-sm uppercase text-muted">404</p>
      <h1 className="mt-3 font-serif text-6xl tracking-tight">
        Page <span className="gradient-text">not found</span>
      </h1>
      <div className="mt-6">
        <TextLink href="/" label="Back to home" />
      </div>
    </section>
  );
}
