import type { Page } from "@playwright/test";

/** Scroll through the page so every FadeIn section animates in, then return to top. */
export async function revealAll(page: Page) {
  await page.evaluate(async () => {
    for (let y = 0; y < document.body.scrollHeight; y += 300) {
      window.scrollTo(0, y);
      await new Promise((r) => setTimeout(r, 60));
    }
    window.scrollTo(0, 0);
  });
  await page.waitForTimeout(800);
}

/** Page background in each theme (the --bg token). */
export const DARK = "rgb(10, 10, 10)";
export const LIGHT = "rgb(250, 250, 247)";

export const bodyBg = (page: Page) =>
  page.evaluate(() => getComputedStyle(document.body).backgroundColor);

/** The browser-bar color the browser uses: the first theme-color meta. */
export const themeColor = (page: Page) =>
  page.evaluate(() => document.querySelector('meta[name="theme-color"]')?.getAttribute("content"));

/** Wait until every finite animation in `selector` (or the whole page) has finished. */
export const settle = (page: Page, selector = "html") =>
  page.locator(selector).evaluate((el) =>
    Promise.all(
      el
        .getAnimations({ subtree: true })
        .filter((a) => a.effect?.getTiming().iterations !== Infinity)
        .map((a) => a.finished.catch(() => {})),
    ),
  );
