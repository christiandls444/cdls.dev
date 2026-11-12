import { navigation } from "@/content/navigation";
import { site } from "@/content/site";
import { cn } from "@/lib/utils";
import { HeroBackground } from "./hero-background";
import { HeroName } from "./hero-name";
import { RoleTicker } from "./role-ticker";

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
      <div className="mx-auto flex min-h-[calc(100svh-4rem)] w-full max-w-5xl flex-col justify-end px-6 pt-16 pb-12 sm:min-h-[calc(100dvh-4rem)] sm:pt-24 sm:pb-16">
        {/* The open top area: one large role line, right-aligned with the menu icon
            (pr-1 matches the icon's inner padding, so the visible edges line up). */}
        <div className="flex flex-1 items-center pb-10">
          <HeroIn delay={320} className="w-full pr-1 text-right">
            <RoleTicker
              roles={site.roles}
              className="text-[clamp(1.5rem,5vw,4.25rem)] leading-[1.2] font-light tracking-[-0.035em] text-muted"
            />
          </HeroIn>
        </div>

        <HeroIn delay={0}>
          <ul className="flex flex-col gap-2 font-mono text-xs text-muted">
            {site.badges.map((b) => (
              <li key={b.org} className="leading-5">
                {b.role} <span className="whitespace-nowrap">· {b.org}</span>
              </li>
            ))}
          </ul>
        </HeroIn>

        <HeroIn delay={80}>
          <HeroName
            lines={lines}
            className="mt-5 text-[clamp(3rem,10vw,8.5rem)] leading-[0.92] font-light tracking-[-0.045em] text-fg"
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
