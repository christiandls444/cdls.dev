import { visibleSocials } from "@/content/site";
import { cn } from "@/lib/utils";
import { Icon } from "./icon";

/** Icon-only social links. Each link has an accessible name. */
export function SocialLinks({ className }: { className?: string }) {
  return (
    <ul className={cn("flex items-center gap-1", className)}>
      {visibleSocials.map((s) => {
        const external = s.href.startsWith("http");
        return (
          <li key={s.label}>
            <a
              href={s.href}
              {...(external && { target: "_blank", rel: "noopener noreferrer" })}
              className="grid size-10 place-items-center rounded-full text-muted transition-colors hover:bg-gold-soft hover:text-gold"
              aria-label={s.label}
              title={s.label}
            >
              <Icon icon={s.icon} className="size-[18px]" />
            </a>
          </li>
        );
      })}
    </ul>
  );
}
