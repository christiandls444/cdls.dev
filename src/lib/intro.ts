import { reducedMotion } from "./motion";

/**
 * CMDLS intro: shown once per browser session (sessionStorage), never on refresh.
 * The inline script in <IntroLoader> decides before first paint, so there is no flash.
 */
export const INTRO_KEY = "cdls-intro";
/** Time until the hero is fully in after the intro; keep in sync with globals.css. */
export const INTRO_MS = 9000;
/**
 * Reduced motion: when the page starts fading in under the intro, from page load.
 * Keep in sync with the 1200ms delays under prefers-reduced-motion in globals.css.
 */
const REDUCED_FADE_MS = 1200;

/**
 * Calls `done` once the intro is out of the way: at once when there is none (refresh,
 * blocked storage) or it ended earlier, or once the reduced-motion fade has begun.
 * `justExited` is true when its letters have just landed or its curtain has just
 * started: the hero is still about to rise in (`.hero-in` in globals.css).
 * Returns a cleanup. `#intro` and its attributes are set by components/intro.
 */
export function afterIntro(done: (justExited: boolean) => void): () => void {
  const intro = document.getElementById("intro");
  const exited = () => intro!.hasAttribute("data-landed") || intro!.hasAttribute("data-curtain");
  if (!intro?.hasAttribute("data-show") || exited()) {
    done(false);
    return () => {};
  }
  if (reducedMotion()) {
    // Counted from page load, so a later visit to the hero (client-side) doesn't wait.
    const timer = setTimeout(() => done(false), REDUCED_FADE_MS - performance.now());
    return () => clearTimeout(timer);
  }
  const observer = new MutationObserver(() => {
    if (!exited()) return;
    observer.disconnect();
    done(true);
  });
  observer.observe(intro, { attributes: true, attributeFilter: ["data-landed", "data-curtain"] });
  return () => observer.disconnect();
}
