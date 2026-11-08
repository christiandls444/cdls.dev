import { Cloud, Database } from "lucide-react";
import {
  siAnthropic,
  siDocker,
  siFastapi,
  siGooglecloud,
  siHuggingface,
  siKubernetes,
  siLangchain,
  siNextdotjs,
  siNodedotjs,
  siPostgresql,
  siPython,
  siReact,
  siTailwindcss,
  siTypescript,
} from "simple-icons";
import { brand, line } from "@/lib/icons";
import type { TechGroup } from "@/types/content";

/**
 * Tech stack, grouped. Icons come from simple-icons (brands) or lucide (fallback
 * for brands simple-icons does not ship, e.g. AWS, Azure, OpenAI).
 */
export const stack: TechGroup[] = [
  {
    title: "AI",
    items: [
      { name: "Anthropic", icon: brand(siAnthropic) },
      { name: "LangChain", icon: brand(siLangchain) },
      { name: "Hugging Face", icon: brand(siHuggingface) },
      { name: "Vector DBs", icon: line(Database) },
    ],
  },
  {
    title: "Build",
    items: [
      { name: "TypeScript", icon: brand(siTypescript) },
      { name: "Python", icon: brand(siPython) },
      { name: "React", icon: brand(siReact) },
      { name: "Next.js", icon: brand(siNextdotjs) },
      { name: "Node.js", icon: brand(siNodedotjs) },
      { name: "FastAPI", icon: brand(siFastapi) },
      { name: "Tailwind", icon: brand(siTailwindcss) },
      { name: "PostgreSQL", icon: brand(siPostgresql) },
    ],
  },
  {
    title: "Ship",
    items: [
      { name: "Docker", icon: brand(siDocker) },
      { name: "Kubernetes", icon: brand(siKubernetes) },
      { name: "Google Cloud", icon: brand(siGooglecloud) },
      { name: "Azure", icon: line(Cloud) },
    ],
  },
];
