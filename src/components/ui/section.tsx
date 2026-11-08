import { cn } from "@/lib/utils";

type Props = {
  id?: string;
  /** Small label above the content, e.g. "Stack". Rendered as the section heading. */
  label?: string;
  className?: string;
  children: React.ReactNode;
};

/** Page section with consistent width, spacing and an optional gold label. */
export function Section({ id, label, className, children }: Props) {
  const headingId = id && label ? `${id}-heading` : undefined;
  return (
    <section
      id={id}
      aria-labelledby={headingId}
      className={cn("mx-auto w-full max-w-5xl scroll-mt-24 px-6 py-20 sm:py-28", className)}
    >
      {label && (
        <h2
          id={headingId}
          className="mb-10 flex items-center gap-3 font-mono text-xs tracking-[0.2em] text-gold uppercase"
        >
          <span className="h-px w-8 bg-gold" aria-hidden />
          {label}
        </h2>
      )}
      {children}
    </section>
  );
}
