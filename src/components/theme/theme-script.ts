/**
 * Inline <head> script (serialized with toString in app/layout.tsx), so it must stay
 * self-contained: no imports, no outside variables. Applies a saved light-mode choice
 * before first paint. The dark browser-bar color is static (viewport.themeColor); for
 * light, it puts its own theme-color meta first in <head> (the first one wins), read
 * from the --bg token. It never edits Next's meta: React would re-insert its own copy.
 * Stylesheets block inline scripts, so the token is ready here.
 */
export function themeScript(key: string, metaAttr: string) {
  try {
    if (localStorage.getItem(key) !== "light") return;
  } catch {
    return; // Storage blocked (private mode, disabled cookies): stay on the dark default.
  }
  const root = document.documentElement;
  root.dataset.theme = "light";
  const bg = getComputedStyle(root).getPropertyValue("--bg").trim();
  if (!bg) return; // stylesheet not applied yet (dev): the static dark color stays
  const meta = document.createElement("meta");
  meta.name = "theme-color";
  meta.content = bg;
  meta.setAttribute(metaAttr, "");
  document.head.prepend(meta);
}
