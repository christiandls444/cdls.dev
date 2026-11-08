import Link from "next/link";
import { site } from "@/content/site";

/** Wordmark: initials + gold dot. */
export function Logo() {
  return (
    <Link
      href="/"
      className="font-serif text-2xl leading-none tracking-tight text-fg"
      aria-label={`${site.name}, home`}
    >
      {site.shortName}
      <span className="text-gold">.</span>
    </Link>
  );
}
