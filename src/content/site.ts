import { Mail } from "lucide-react";
import { siGithub } from "simple-icons";
import { brand, line, siLinkedinCustom } from "@/lib/icons";
import type { SiteConfig } from "@/types/content";

/**
 * Single source of truth for identity + links.
 * Socials with an empty href are hidden automatically.
 */
export const site: SiteConfig = {
  name: "Christian De Los Santos",
  shortName: "CDLS",
  role: "Full Stack LLM Engineer",
  company: "Accenture",
  location: "Philippines",
  tagline: "Building production AI systems, end to end.",
  url: "https://cdls.dev",
  socials: [
    { label: "GitHub", href: "https://github.com/christiandls444", icon: brand(siGithub) },
    // TODO: add your LinkedIn profile URL
    { label: "LinkedIn", href: "", icon: brand(siLinkedinCustom) },
    // TODO: add a public contact email, e.g. "mailto:hello@cdls.dev"
    { label: "Email", href: "", icon: line(Mail) },
  ],
};

export const visibleSocials = site.socials.filter((s) => s.href);
