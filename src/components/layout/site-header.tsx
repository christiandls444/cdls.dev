import { Logo } from "@/components/ui/logo";
import { SocialLinks } from "@/components/ui/social-links";

const nav = [
  { label: "Work", href: "#work" },
  { label: "About", href: "#about" },
];

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-line/60 bg-bg/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 w-full max-w-5xl items-center justify-between px-6">
        <Logo />
        <nav aria-label="Main" className="flex items-center gap-6">
          <ul className="hidden items-center gap-6 sm:flex">
            {nav.map((item) => (
              <li key={item.href}>
                <a href={item.href} className="text-sm text-muted transition-colors hover:text-fg">
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
          <SocialLinks />
        </nav>
      </div>
    </header>
  );
}
