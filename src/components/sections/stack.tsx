import { FadeIn } from "@/components/ui/fade-in";
import { Icon } from "@/components/ui/icon";
import { Section } from "@/components/ui/section";
import { stack } from "@/content/stack";

export function Stack() {
  return (
    <Section id="stack" label="Stack">
      <div className="grid gap-12 sm:grid-cols-3 sm:gap-8">
        {stack.map((group, i) => (
          <FadeIn key={group.title} delay={i * 0.08}>
            <h3 className="mb-5 font-serif text-2xl">{group.title}</h3>
            <ul className="grid grid-cols-4 gap-2 sm:grid-cols-3">
              {group.items.map((item) => (
                <li key={item.name}>
                  <div
                    className="group grid aspect-square place-items-center rounded-xl border border-line bg-surface text-muted transition-colors hover:border-gold hover:text-gold"
                    title={item.name}
                  >
                    <Icon icon={item.icon} className="size-6" label={item.name} />
                  </div>
                </li>
              ))}
            </ul>
          </FadeIn>
        ))}
      </div>
    </Section>
  );
}
