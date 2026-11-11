import { navigation } from "@/content/navigation";
import { site } from "@/content/site";
import { cn } from "@/lib/utils";
import { HeroBackground } from "./hero-background";
import { NameRoles } from "./name-roles";

/**
 * Full-height hero, content anchored bottom-left: badge, name, two actions,
 * and one short line bottom-right. The empty top area is reserved for a
 * background visual later.
 */
export function Hero() {
  // "Christian M. De Los Santos" → ["Christian M.", "De Los Santos"]
  const words = site.name.split(" ");
  const lines: [string, string] = [words.slice(0, 2).join(" "), words.slice(2).join(" ")];
  const work = navigation.links.find((l) => l.href.endsWith("#work"));

  return (
    <section className="relative isolate">
      <HeroBackground />
      <div className="mx-auto flex min-h-[72svh] w-full max-w-5xl flex-col justify-end px-6 pt-16 pb-12 sm:min-h-[calc(100dvh-4rem)] sm:pt-24 sm:pb-16">
        <HeroIn delay={0}>
          <ul className="flex flex-col gap-2 font-mono text-xs text-muted">
            {site.badges.map((b) => (
              <li key={b.org} className="flex items-start gap-2 leading-5">
                <span className="mt-[7px] size-1.5 shrink-0 rounded-full bg-gold" aria-hidden />
                <span>
                  {b.role} <span className="whitespace-nowrap">· {b.org}</span>
                </span>
              </li>
            ))}
          </ul>
        </HeroIn>

        <HeroIn delay={80}>
          <NameRoles
            lines={lines}
            roles={site.roles}
            className="mt-5 cursor-default text-[clamp(3rem,10vw,8.5rem)] leading-[0.92] font-light tracking-[-0.045em] text-fg select-none"
          />
        </HeroIn>

        <div className="mt-10 flex flex-col gap-8 sm:flex-row sm:items-end sm:justify-between">
          <HeroIn delay={160} className="flex flex-wrap gap-3">
            <PillLink href={navigation.cta.href} variant="solid">
              {navigation.cta.label}
            </PillLink>
            {work && (
              <PillLink href={work.href} variant="outline">
                View work
              </PillLink>
            )}
          </HeroIn>

          <HeroIn delay={240}>
            <p className="max-w-xs text-sm leading-relaxed text-balance text-muted sm:text-right">
              {site.tagline}
            </p>
          </HeroIn>
        </div>
      </div>
    </section>
  );
}

function PillLink({
  href,
  variant,
  children,
}: {
  href: string;
  variant: "solid" | "outline";
  children: React.ReactNode;
}) {
  return (
    <a
      href={href}
      className={cn(
        "inline-flex h-11 items-center rounded-full px-6 text-sm transition-colors",
        variant === "solid"
          ? "bg-gold text-bg hover:bg-blue"
          : "border border-line text-fg hover:border-gold hover:text-gold",
      )}
    >
      {children}
    </a>
  );
}

/**
 * Hero reveal in pure CSS (`.hero-in` in globals.css): it starts at first paint, so
 * the name shows even before (or without) JavaScript. With the CDLS intro it waits
 * for the curtain via a CSS sibling selector.
 */
function HeroIn({
  delay,
  className,
  children,
}: {
  delay: number;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className={cn("hero-in", className)}
      style={{ "--d": `${delay}ms` } as React.CSSProperties}
    >
      {children}
    </div>
  );
}
