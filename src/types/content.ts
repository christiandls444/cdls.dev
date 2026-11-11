import type { SimpleIcon } from "simple-icons";
import type { LucideIcon } from "lucide-react";

/** An icon is either a brand logo (simple-icons) or a generic line icon (lucide). */
export type Icon = { kind: "brand"; icon: SimpleIcon } | { kind: "lucide"; icon: LucideIcon };

export type SocialLink = {
  label: string;
  href: string;
  icon: Icon;
};

export type SiteConfig = {
  name: string;
  shortName: string;
  /** Full role, used in metadata (page title, search results). */
  role: string;
  /** Hero badge lines (role · place). Use exact titles so they match LinkedIn. Max 2. */
  badges: { role: string; org: string }[];
  /** Shown one at a time (shuffled) when the hero name is hovered or tapped. 1–3 words each. */
  roles: string[];
  company: string;
  location: string;
  /** One short line. Keep it under ~12 words. */
  tagline: string;
  url: string;
  /** Public contact address (forwards privately via Cloudflare Email Routing). */
  email: string;
  socials: SocialLink[];
};

export type NavLink = {
  label: string;
  /** In-page anchor ("#work") or route ("/blog"). */
  href: string;
};

export type Navigation = {
  links: NavLink[];
  cta: NavLink;
};

export type TechItem = {
  name: string;
  icon: Icon;
};

export type TechGroup = {
  title: string;
  items: TechItem[];
};

export type JourneyItem = {
  org: string;
  role: string;
  /** Short and human, e.g. "2024 — Now" or "In progress". */
  period: string;
  icon: Icon;
};

export type About = {
  /** Two short lines max. */
  bio: string;
  journey: JourneyItem[];
};

export type Post = {
  /** URL segment: /blog/<slug>. Lowercase kebab-case. */
  slug: string;
  title: string;
  /** ISO date, e.g. "2026-11-20". */
  date: string;
  /** One line, under ~20 words. Shown in the list and as the meta description. */
  summary: string;
  /** Loads the MDX body, e.g. () => import("./my-post.mdx"). */
  load: () => Promise<{ default: React.ComponentType }>;
};

export type Project = {
  slug: string;
  title: string;
  /** One line, under ~15 words. */
  summary: string;
  icon: Icon;
  tags: string[];
  href?: string;
  repo?: string;
  featured?: boolean;
};
