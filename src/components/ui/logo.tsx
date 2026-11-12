import Link from "next/link";
import { site } from "@/content/site";

/**
 * Wordmark: initials + gold dot.
 * The accessible name starts with the visible text (WCAG 2.5.3), so no aria-label.
 */
export function Logo() {
  return (
    <Link href="/" className="text-xl leading-none font-medium tracking-tight text-fg">
      {site.shortName}
      <span className="text-gold" aria-hidden>
        .
      </span>
      <span className="sr-only">, {site.name}, home</span>
    </Link>
  );
}
