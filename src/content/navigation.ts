import { site } from "./site";
import type { Navigation } from "@/types/content";

/**
 * Menu links (opened from the ☰ button). Order = priority. Keep it to 3 links max.
 * Use "/#id" for home sections (works from any page; the id must exist, an e2e test
 * enforces this) and "/path" for pages.
 */
export const navigation: Navigation = {
  links: [
    { label: "Work", href: "/#work" },
    { label: "About", href: "/#about" },
    { label: "Blog", href: "/blog" },
  ],
  cta: { label: "Get in touch", href: `mailto:${site.email}` },
};
