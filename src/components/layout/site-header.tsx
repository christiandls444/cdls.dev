import { Logo } from "@/components/ui/logo";
import { SocialLinks } from "@/components/ui/social-links";
import { navigation } from "@/content/navigation";
import { MobileMenu } from "./mobile-menu";

/** Sticky header: logo · section links · socials · gold CTA. Collapses to a menu below `sm`. */
export function SiteHeader() {
  const { links, cta } = navigation;

  return (
    <header className="sticky top-0 z-40 border-b border-line/60 bg-bg/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 w-full max-w-5xl items-center justify-between gap-6 px-6">
        <Logo />

        <nav aria-label="Main" className="hidden flex-1 sm:block">
          <ul className="flex items-center gap-8">
            {links.map((item) => (
              <li key={item.href}>
                <a href={item.href} className="text-sm text-muted transition-colors hover:text-fg">
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-2">
          {/* Email is the CTA, so it isn't repeated as an icon here. */}
          <SocialLinks exclude={["Email"]} className="hidden sm:flex" />
          <a
            href={cta.href}
            className="rounded-full bg-gold px-4 py-2 text-sm font-medium text-bg transition-opacity hover:opacity-90"
          >
            {cta.label}
          </a>
          <MobileMenu>
            <nav aria-label="Mobile">
              <ul className="flex flex-col">
                {links.map((item) => (
                  <li key={item.href}>
                    <a
                      href={item.href}
                      className="block border-b border-line py-3 font-serif text-2xl text-fg"
                    >
                      {item.label}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
            <SocialLinks exclude={["Email"]} className="mt-4 -ml-2" />
          </MobileMenu>
        </div>
      </div>
    </header>
  );
}
