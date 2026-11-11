import { site } from "./site";
import type { Navigation } from "@/types/content";

/**
 * Header navigation. Order = priority for recruiters and executives.
 * Each in-page href must match a <Section id> on the page (an e2e test enforces this).
 * Add About / Impact here once those sections exist. Keep it to 4 links max.
 */
export const navigation: Navigation = {
  links: [
    { label: "Work", href: "#work" },
    { label: "Stack", href: "#stack" },
  ],
  cta: { label: "Get in touch", href: `mailto:${site.email}` },
};
