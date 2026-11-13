/**
 * Dark is the default theme; light is opt-in via the menu toggle and remembered
 * (localStorage). components/theme/theme-script.ts applies a saved choice before
 * first paint, so a light-mode visitor never sees a dark flash.
 */
export const THEME_KEY = "cdls-theme";

export type Theme = "light" | "dark";

/**
 * Marks the light-mode theme-color meta that the inline script and the toggle add
 * (first in <head>, so it wins over Next's static dark one). One name for both.
 */
export const THEME_META_ATTR = "data-theme-color";
