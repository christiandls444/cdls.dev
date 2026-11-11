import { test as base } from "@playwright/test";
import { INTRO_KEY } from "@/lib/intro";

/**
 * Default test: behaves like a returning visitor in the same session, so the
 * CDLS intro never covers the page. tests/e2e/intro.spec.ts covers the intro itself.
 */
export const test = base.extend({
  page: async ({ page }, provide) => {
    await page.addInitScript((key) => sessionStorage.setItem(key, "1"), INTRO_KEY);
    await provide(page);
  },
});

export { expect } from "@playwright/test";
