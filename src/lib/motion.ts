/**
 * The circle reveal shared by the theme toggle and the menu: one speed, one curve and
 * one shape everywhere a circle grows or shrinks, so they feel like the same gesture.
 */
export const CIRCLE_MS = 1000;
export const CIRCLE_EASE = "cubic-bezier(0.76, 0, 0.24, 1)";

export const reducedMotion = () => matchMedia("(prefers-reduced-motion: reduce)").matches;

/**
 * clip-path keyframes: a circle from the element's own size (so the element itself is
 * always inside it, and clickable) out to the farthest screen corner.
 */
export function circleFrom(el: Element): [string, string] {
  const r = el.getBoundingClientRect();
  const x = r.left + r.width / 2;
  const y = r.top + r.height / 2;
  const start = Math.max(r.width, r.height) / 2;
  const radius = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y));
  return [`circle(${start}px at ${x}px ${y}px)`, `circle(${radius}px at ${x}px ${y}px)`];
}

/**
 * The menu's sequence, timed around the circle: × forms while it grows, then the rows
 * rise in one by one; closing drops the visible rows (last first), then the circle
 * shrinks while × turns back into ☰. The single source: menu-dialog.tsx passes the
 * opening values to the CSS as custom properties and runs the closing itself.
 */
export const MENU = {
  iconDelayMs: 150,
  iconMs: 800,
  iconEase: "cubic-bezier(0.65, 0, 0.35, 1)",
  rowInDelayMs: 600, // the circle has nearly covered the screen by then
  rowInStaggerMs: 140,
  rowInMs: 750,
  rowOutStaggerMs: 80,
  rowOutMs: 240,
  rowOutEase: "cubic-bezier(0.55, 0, 1, 0.45)",
  rowRisePx: 48, // how far a row rises in from, and drops back to
  rowBlurPx: 6,
} as const;

/** Where a row rises from on open and drops to on close (also fed to the CSS keyframe). */
export const ROW_HIDDEN = {
  opacity: 0,
  filter: `blur(${MENU.rowBlurPx}px)`,
  transform: `translateY(${MENU.rowRisePx}px)`,
};
