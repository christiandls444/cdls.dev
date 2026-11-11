/**
 * Decorative hero background: navy (left) + gold (right) glows that each slowly circle
 * their own spot in mirror image on desktop (static on phones / reduced motion), plus film grain.
 * Pure CSS (see `.hero-bg` in globals.css), aria-hidden, no JS.
 */
export function HeroBackground() {
  return (
    <div className="hero-bg" aria-hidden>
      <div className="hero-bg__bridge" />
      <div className="hero-bg__orbit-x">
        <div className="hero-bg__orbit-y">
          <div className="hero-bg__glow hero-bg__glow--gold" />
        </div>
      </div>
      <div className="hero-bg__orbit-x hero-bg__orbit--reverse">
        <div className="hero-bg__orbit-y">
          <div className="hero-bg__glow hero-bg__glow--blue" />
        </div>
      </div>
      <div className="hero-bg__grain" />
    </div>
  );
}
