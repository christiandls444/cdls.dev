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
  role: string;
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
