import { cn } from "@/lib/utils";
import type { Icon as IconData } from "@/types/content";

type Props = {
  icon: IconData;
  className?: string;
  /** Accessible name. Omit when the icon sits next to visible text. */
  label?: string;
};

/** Renders a brand logo or a lucide icon with one API. Inherits text color. */
export function Icon({ icon, className, label }: Props) {
  const a11y = label ? { role: "img", "aria-label": label } : { "aria-hidden": true };

  if (icon.kind === "lucide") {
    const Lucide = icon.icon;
    return <Lucide className={cn("size-5", className)} strokeWidth={1.5} {...a11y} />;
  }

  // width/height are a fallback so the SVG can never blow up to full width if CSS fails.
  return (
    <svg
      viewBox="0 0 24 24"
      width={20}
      height={20}
      fill="currentColor"
      className={cn("size-5", className)}
      {...a11y}
    >
      <path d={icon.icon.path} />
    </svg>
  );
}
