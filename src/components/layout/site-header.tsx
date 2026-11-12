import { ThemeToggle } from "@/components/theme/theme-toggle";
import { Logo } from "@/components/ui/logo";
import { SocialLinks } from "@/components/ui/social-links";
import { navigation } from "@/content/navigation";
import { MenuDialog } from "./menu-dialog";

/**
 * Minimal header: logo (home) on the left, ☰ menu on the right. Same on every screen size.
 * Not sticky: it scrolls away with the page so nothing overlaps the content.
 */
export function SiteHeader() {
  const { links, cta } = navigation;
  // Menu rows (each link, then the icon row) rise in one by one, in --i order.
  const row = (i: number) => ({ "--i": i }) as React.CSSProperties;

  return (
    <header className="relative z-40">
      <div className="mx-auto flex h-16 w-full max-w-5xl items-center justify-between px-6">
        <Logo />
        <MenuDialog>
          <nav aria-label="Main">
            <ul className="flex flex-col gap-2">
              {[...links, cta].map((item, i) => (
                <li key={item.href} className="menu-stagger" style={row(i)}>
                  <a
                    href={item.href}
                    className="group inline-flex items-baseline gap-3 text-5xl leading-tight font-light tracking-[-0.04em] text-fg transition-colors hover:text-gold sm:text-7xl"
                  >
                    {item.label}
                    <span
                      className="size-2 rounded-full bg-gold opacity-0 transition-opacity group-hover:opacity-100"
                      aria-hidden
                    />
                  </a>
                </li>
              ))}
            </ul>
          </nav>
          <div
            className="menu-stagger mt-12 -ml-2 flex items-center gap-1"
            style={row(links.length + 1)}
          >
            <SocialLinks />
            <ThemeToggle />
          </div>
        </MenuDialog>
      </div>
    </header>
  );
}
