"use client";

import { Moon, Sun } from "lucide-react";
import { useEffect, useSyncExternalStore } from "react";
import { CIRCLE_EASE, CIRCLE_MS, circleFrom, reducedMotion } from "@/lib/motion";
import { THEME_KEY, THEME_META_ATTR, type Theme } from "@/lib/theme";

const root = () => document.documentElement;

const readTheme = (): Theme => (root().dataset.theme === "light" ? "light" : "dark");

/**
 * Browser bar color follows the page background (read from the token, no hex here).
 * Uses our own meta, first in <head> so it wins over Next's static dark one (the
 * inline theme-script.ts may have added it already; it can't share code).
 */
function syncThemeColor() {
  const bg = getComputedStyle(root()).getPropertyValue("--bg").trim();
  if (!bg) return;
  let meta = document.querySelector<HTMLMetaElement>(`meta[${THEME_META_ATTR}]`);
  if (!meta) {
    meta = document.createElement("meta");
    meta.name = "theme-color";
    meta.setAttribute(THEME_META_ATTR, "");
    document.head.prepend(meta);
  }
  meta.content = bg;
}

/** The one place data-theme changes after load (this tab or another one). */
function setTheme(theme: Theme) {
  if (theme === "light") root().dataset.theme = "light";
  else delete root().dataset.theme;
  syncThemeColor();
}

function saveTheme(theme: Theme) {
  setTheme(theme);
  try {
    localStorage.setItem(THEME_KEY, theme);
  } catch {
    // Storage blocked: the choice lasts for this page only.
  }
}

/**
 * Re-render whenever data-theme changes, and follow a choice made in another open tab
 * (the storage event fires in every other tab of the site).
 */
function subscribe(onChange: () => void) {
  const observer = new MutationObserver(onChange);
  observer.observe(root(), { attributes: true, attributeFilter: ["data-theme"] });
  const onStorage = (e: StorageEvent) => {
    if (e.key === THEME_KEY) setTheme(e.newValue === "light" ? "light" : "dark");
  };
  addEventListener("storage", onStorage);
  return () => {
    observer.disconnect();
    removeEventListener("storage", onStorage);
  };
}

/** The circle reveal in flight; a quick second click replaces (skips) it. */
let current: ViewTransition | undefined;

/**
 * Sun/moon button that switches between dark (default) and light. The new theme
 * spreads out from the button as a circle; reduced motion gets a plain crossfade,
 * and browsers without View Transitions switch instantly.
 */
export function ThemeToggle() {
  const theme = useSyncExternalStore(subscribe, readTheme, () => "dark" as const);
  const next: Theme = theme === "dark" ? "light" : "dark";

  // Saved light, but the inline script couldn't set the bar color (stylesheet not
  // applied yet, e.g. in dev): set it once the page is up.
  useEffect(() => {
    if (readTheme() === "light") syncThemeColor();
  }, []);

  const onClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    // Read the theme when the swap runs, not from this render: a quick second click
    // can fire before React has re-rendered, and must still flip it again.
    const swap = () => saveTheme(readTheme() === "dark" ? "light" : "dark");
    if (!("startViewTransition" in document)) return swap();
    if (reducedMotion()) {
      document.startViewTransition(swap);
      return;
    }

    const clipPath = circleFrom(e.currentTarget);
    root().dataset.themeSwitch = "";
    const transition = (current = document.startViewTransition(swap));
    transition.ready
      .then(() =>
        root().animate(
          { clipPath },
          {
            duration: CIRCLE_MS,
            easing: CIRCLE_EASE,
            pseudoElement: "::view-transition-new(root)",
          },
        ),
      )
      .catch(() => {});
    // Only the latest transition clears the flag: a skipped one finishes early, and
    // clearing it then would let the default crossfade run under the new circle.
    transition.finished
      .catch(() => {})
      .finally(() => {
        if (current === transition) delete root().dataset.themeSwitch;
      });
  };

  const label = `Switch to ${next} mode`;
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      title={label}
      className="theme-toggle grid size-10 place-items-center rounded-full text-muted transition-colors hover:bg-gold-soft hover:text-gold"
    >
      <Sun className="theme-toggle__sun size-[18px]" strokeWidth={1.5} aria-hidden />
      <Moon className="theme-toggle__moon size-[18px]" strokeWidth={1.5} aria-hidden />
    </button>
  );
}
