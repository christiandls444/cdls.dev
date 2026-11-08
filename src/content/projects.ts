import { Bot, FileSearch, Workflow } from "lucide-react";
import { line } from "@/lib/icons";
import type { Project } from "@/types/content";

/**
 * TODO: these are SAMPLE projects so the layout can be tested.
 * Replace with real work. Keep `summary` to one line.
 */
export const projects: Project[] = [
  {
    slug: "rag-assistant",
    title: "RAG Assistant",
    summary: "Grounded Q&A over enterprise documents.",
    icon: line(FileSearch),
    tags: ["RAG", "Python", "Vector DB"],
    featured: true,
  },
  {
    slug: "agent-workflows",
    title: "Agent Workflows",
    summary: "Multi-step LLM agents with tool use.",
    icon: line(Workflow),
    tags: ["Agents", "TypeScript"],
    featured: true,
  },
  {
    slug: "chat-platform",
    title: "Chat Platform",
    summary: "Streaming chat UI with evals and tracing.",
    icon: line(Bot),
    tags: ["Next.js", "LLM Ops"],
    featured: true,
  },
];
