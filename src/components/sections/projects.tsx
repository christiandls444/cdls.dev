import { ArrowUpRight } from "lucide-react";
import { FadeIn } from "@/components/ui/fade-in";
import { Icon } from "@/components/ui/icon";
import { Section } from "@/components/ui/section";
import { projects } from "@/content/projects";
import type { Project } from "@/types/content";

export function Projects() {
  const featured = projects.filter((p) => p.featured);

  return (
    <Section id="work" label="Work">
      <ul className="grid gap-4 sm:grid-cols-3">
        {featured.map((project, i) => (
          <li key={project.slug}>
            <FadeIn delay={i * 0.08} className="h-full">
              <ProjectCard project={project} />
            </FadeIn>
          </li>
        ))}
      </ul>
    </Section>
  );
}

function ProjectCard({ project }: { project: Project }) {
  const link = project.href ?? project.repo;

  const body = (
    <>
      <div className="mb-10 flex items-start justify-between">
        <span className="grid size-11 place-items-center rounded-lg bg-gold-soft text-gold">
          <Icon icon={project.icon} />
        </span>
        {link && (
          <ArrowUpRight
            className="size-5 text-muted transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-blue"
            strokeWidth={1.5}
            aria-hidden
          />
        )}
      </div>
      <h3 className="font-serif text-2xl">{project.title}</h3>
      <p className="mt-2 text-sm text-muted">{project.summary}</p>
      <ul className="mt-6 flex flex-wrap gap-1.5" aria-label="Tags">
        {project.tags.map((tag) => (
          <li
            key={tag}
            className="rounded-full border border-line px-2.5 py-0.5 font-mono text-[11px] text-muted"
          >
            {tag}
          </li>
        ))}
      </ul>
    </>
  );

  const cardClass =
    "group flex h-full flex-col rounded-2xl border border-line bg-surface p-6 transition-colors hover:border-gold";

  return link ? (
    <a href={link} target="_blank" rel="noopener noreferrer" className={cardClass}>
      {body}
    </a>
  ) : (
    <div className={cardClass}>{body}</div>
  );
}
