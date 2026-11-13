import { Mail } from "lucide-react";
import { siGithub } from "simple-icons";
import { brand, line, siLinkedinCustom } from "@/lib/icons";
import type { SiteConfig } from "@/types/content";

/**
 * Single source of truth for identity + links.
 * Socials with an empty href are hidden automatically.
 */
const email = "hello@cdls.dev";

export const site: SiteConfig = {
  name: "Christian M. De Los Santos",
  shortName: "CMDLS",
  role: "Full Stack LLM Engineer",
  badges: [
    { role: "LLM Engineer", org: "Accenture" },
    { role: "MS CS", org: "Mapúa" },
  ],
  roles: [
    "Researcher",
    "Software Engineer",
    "Data Engineer",
    "AI Engineer",
    "UI/UX Designer",
    "ML Engineer",
    "Prompt Engineer",
    "Minimalist",
    "Aesthetic",
    "Handsome",
    "Creative",
  ],
  leadRole: "Handsome",
  company: "Accenture",
  location: "Philippines",
  tagline: "Building production AI systems, end to end.",
  url: "https://cdls.dev",
  email,
  socials: [
    { label: "GitHub", href: "https://github.com/christiandls444", icon: brand(siGithub) },
    // TODO: add your LinkedIn profile URL
    { label: "LinkedIn", href: "", icon: brand(siLinkedinCustom) },
    { label: "Email", href: `mailto:${email}`, icon: line(Mail) },
  ],
};

export const visibleSocials = site.socials.filter((s) => s.href);
