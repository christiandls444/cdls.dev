/**
 * CMDLS intro: shown once per browser session (sessionStorage), never on refresh.
 * The inline script in <IntroLoader> decides before first paint, so there is no flash.
 */
export const INTRO_KEY = "cdls-intro";
/** Time until the hero is fully in after the intro; keep in sync with globals.css. */
export const INTRO_MS = 9000;
