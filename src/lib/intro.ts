/**
 * CDLS intro loader: shown once per browser session (sessionStorage), never on refresh.
 * The inline script in <IntroLoader> decides before first paint, so there is no flash.
 */
export const INTRO_KEY = "cdls-intro";
/** Total on-screen time, keep in sync with `.intro-loader` timings in globals.css. */
export const INTRO_MS = 4800;
