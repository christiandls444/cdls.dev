import { GraduationCap } from "lucide-react";
import { siAccenture } from "simple-icons";
import { brand, line } from "@/lib/icons";
import type { About } from "@/types/content";

/**
 * About section content. INITIAL DRAFT: years, undergrad, certifications and photo
 * are still to come. Keep the bio to two short lines.
 */
export const about: About = {
  bio: "I build LLM systems that turn slow, manual work into fast, reliable workflows. Engineer by trade, designer at heart.",
  journey: [
    {
      org: "Accenture",
      role: "Full Stack LLM Development Analyst",
      period: "Now",
      icon: brand(siAccenture),
    },
    {
      org: "Mapúa University",
      role: "MS Computer Science",
      period: "In progress",
      icon: line(GraduationCap),
    },
  ],
};
