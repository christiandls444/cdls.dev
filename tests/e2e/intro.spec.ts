import { expect, test } from "@playwright/test";
import { INTRO_MS } from "@/lib/intro";

const intro = "#intro";

test("new session shows the CDLS intro, then it gets out of the way", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator(intro)).toHaveAttribute("data-show", "");
  await expect(page.locator(intro)).toBeVisible();

  // After the animation the overlay is invisible and no longer blocks clicks.
  await expect(page.locator(intro)).toBeHidden({ timeout: INTRO_MS + 1500 });
  await page.getByRole("button", { name: "Open menu" }).click();
  await expect(page.getByRole("dialog", { name: "Menu" })).toBeVisible();
});

test("refresh in the same session skips the intro", async ({ page }) => {
  await page.goto("/");
  await page.reload();
  await expect(page.locator(intro)).not.toHaveAttribute("data-show");
  await expect(page.locator(intro)).toBeHidden();
});

test("navigating to another page skips the intro", async ({ page }) => {
  await page.goto("/");
  await page.goto("/blog");
  await expect(page.locator(intro)).not.toHaveAttribute("data-show");
});

test("a new session (new tab) shows it again", async ({ browser }) => {
  for (let i = 0; i < 2; i++) {
    const context = await browser.newContext();
    const page = await context.newPage();
    await page.goto("/");
    await expect(page.locator(intro)).toHaveAttribute("data-show", "");
    await context.close();
  }
});

test("blocked storage skips the intro instead of breaking the page", async ({ page }) => {
  await page.addInitScript(() => {
    Object.defineProperty(window, "sessionStorage", {
      get() {
        throw new Error("blocked");
      },
    });
  });
  await page.goto("/");
  await expect(page.locator(intro)).not.toHaveAttribute("data-show");
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
});

test("the page rises in on every full load, refresh included", async ({ page }) => {
  const rise = () =>
    page.evaluate(() => getComputedStyle(document.querySelector(".page-rise")!).animationName);
  await page.goto("/");
  expect(await rise()).toBe("page-rise");
  await page.reload();
  expect(await rise()).toBe("page-rise");
  await expect(page.locator("#intro")).not.toHaveAttribute("data-show");
});

test("refresh keeps the scroll position exact (page rise must not shift it)", async ({ page }) => {
  await page.goto("/");
  await page.reload();
  await page.waitForTimeout(1300);
  expect(await page.evaluate(() => window.scrollY)).toBe(0);
  await expect(page.getByRole("banner")).toBeInViewport();

  await page.evaluate(() => window.scrollTo(0, 600));
  await page.waitForTimeout(300);
  await page.reload();
  await page.waitForTimeout(1300);
  expect(await page.evaluate(() => window.scrollY)).toBe(600);
});

test("after the intro the whole hero is in, bottom actions included", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator("#intro")).toHaveAttribute("data-show", "");
  const main = page.getByRole("main");
  const opacity = (name: string) =>
    main.getByRole("link", { name }).evaluate((el) => {
      let n: Element | null = el;
      let o = 1;
      while (n) {
        o *= Number(getComputedStyle(n).opacity);
        n = n.parentElement;
      }
      return o;
    });
  // Intro ends at INTRO_MS; the last hero item may take ~1s more to settle.
  await expect.poll(() => opacity("Get in touch"), { timeout: INTRO_MS + 1500 }).toBe(1);
  await expect.poll(() => opacity("View work"), { timeout: 1000 }).toBe(1);
});
