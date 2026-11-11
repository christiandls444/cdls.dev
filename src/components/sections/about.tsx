import { FadeIn } from "@/components/ui/fade-in";
import { Icon } from "@/components/ui/icon";
import { Section } from "@/components/ui/section";
import { about } from "@/content/about";
import { stack } from "@/content/stack";

/** About: short bio, journey (work + school), and the stack as icons. */
export function About() {
  return (
    <Section id="about" label="About">
      <div className="grid gap-12 md:grid-cols-5 md:gap-16">
        <FadeIn className="md:col-span-2">
          <p className="text-2xl leading-snug font-light tracking-tight text-fg sm:text-3xl">
            {about.bio}
          </p>
        </FadeIn>

        <FadeIn delay={0.08} className="md:col-span-3">
          <SubLabel>Journey</SubLabel>
          <ul className="divide-y divide-line border-y border-line">
            {about.journey.map((item) => (
              <li key={item.org} className="flex items-center gap-4 py-4">
                <span className="grid size-10 shrink-0 place-items-center rounded-full bg-gold-soft text-gold">
                  <Icon icon={item.icon} className="size-[18px]" />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-fg">{item.org}</p>
                  <p className="truncate text-sm text-muted">{item.role}</p>
                </div>
                <span className="shrink-0 font-mono text-xs text-muted">{item.period}</span>
              </li>
            ))}
          </ul>
        </FadeIn>
      </div>

      <FadeIn delay={0.12} className="mt-16">
        <SubLabel>Stack</SubLabel>
        <div className="grid gap-8 sm:grid-cols-3">
          {stack.map((group) => (
            <div key={group.title}>
              <p className="mb-3 text-sm text-fg">{group.title}</p>
              <ul className="flex flex-wrap gap-2">
                {group.items.map((item) => (
                  <li
                    key={item.name}
                    title={item.name}
                    className="grid size-11 place-items-center rounded-xl border border-line bg-surface text-muted transition-colors hover:border-gold hover:text-gold"
                  >
                    <Icon icon={item.icon} className="size-5" label={item.name} />
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </FadeIn>
    </Section>
  );
}

function SubLabel({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="mb-4 font-mono text-xs tracking-[0.2em] text-muted uppercase">{children}</h3>
  );
}
