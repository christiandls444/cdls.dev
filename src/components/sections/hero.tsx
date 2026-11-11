import { MapPin } from "lucide-react";
import { siAccenture } from "simple-icons";
import { FadeIn } from "@/components/ui/fade-in";
import { Icon } from "@/components/ui/icon";
import { brand } from "@/lib/icons";
import { site } from "@/content/site";

export function Hero() {
  const [first, ...rest] = site.name.split(" ");

  return (
    <section className="relative mx-auto flex w-full max-w-5xl flex-col justify-center px-6 pt-28 pb-20 sm:min-h-[78vh] sm:pt-20">
      <FadeIn>
        <p className="mb-8 inline-flex items-center gap-2 rounded-full border border-line px-3 py-1 font-mono text-xs text-muted">
          <span className="size-1.5 animate-pulse rounded-full bg-gold" aria-hidden />
          {site.role}
        </p>
      </FadeIn>

      <FadeIn delay={0.08}>
        <h1 className="text-6xl leading-[0.95] font-light tracking-[-0.045em] sm:text-8xl">
          {first}
          <br />
          <span className="text-muted italic">{rest.join(" ")}</span>
        </h1>
      </FadeIn>

      <FadeIn delay={0.16}>
        <p className="mt-8 max-w-md text-lg text-muted">{site.tagline}</p>
      </FadeIn>

      <FadeIn delay={0.24}>
        <ul className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-3 text-sm">
          <li className="flex items-center gap-2 text-fg">
            <Icon icon={brand(siAccenture)} className="size-4 text-gold" />
            {site.company}
          </li>
          <li className="flex items-center gap-2 text-muted">
            <MapPin className="size-4" strokeWidth={1.5} aria-hidden />
            {site.location}
          </li>
        </ul>
      </FadeIn>
    </section>
  );
}
