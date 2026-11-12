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
