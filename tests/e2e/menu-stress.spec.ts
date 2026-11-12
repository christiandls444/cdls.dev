import type { Page } from "@playwright/test";
import { INTRO_KEY } from "@/lib/intro";
import { THEME_KEY } from "@/lib/theme";
import { expect, test } from "./fixtures";
import { bodyBg as bg, DARK, LIGHT, settle, themeColor } from "./helpers";

/**
 * Abuse cases for the menu and theme animations: rapid taps, Escape or a link mid-
 * animation, theme spam, reduced motion, resizing. Every case must end in a clean,
 * usable state with no console errors.
 */

/** Console errors / page errors collected for the whole test. */
function watch(page: Page) {
  const errors: string[] = [];
  page.on("pageerror", (e) => errors.push(e.message));
  page.on("console", (m) => m.type() === "error" && errors.push(m.text()));
  return errors;
}

test("closing at any moment of the opening ends in a clean, consistent state", async ({ page }) => {
  const errors = watch(page);
  await page.goto("/");
  await settle(page);
  const menu = page.getByRole("dialog", { name: "Menu" });
  // From the first frame to fully open. (An early close is short, so a second tap
  // could land on the ☰ after it and rightly reopen it: one tap per round.)
  for (const after of [0, 80, 300, 700, 1200, 2200]) {
    await page.getByRole("button", { name: "Open menu" }).click();
    await page.waitForTimeout(after);
    await menu.getByRole("button", { name: "Close menu" }).click();
    await expect(menu).toBeHidden({ timeout: 6000 });
  }
  // Extra taps on × while a full close is playing are ignored.
  await page.getByRole("button", { name: "Open menu" }).click();
  await settle(page, "dialog");
  const close = menu.getByRole("button", { name: "Close menu" });
  await close.click();
  await close.click({ force: true });
  await page.keyboard.press("Escape");
  await expect(menu).toBeHidden({ timeout: 6000 });
  // Opens fully again: no stuck clip-path or closing flag.
  await page.getByRole("button", { name: "Open menu" }).click();
  await settle(page);
  await expect(menu).toBeVisible();
  expect(await menu.getAttribute("data-closing")).toBeNull();
  const clip = await menu.evaluate((d) => getComputedStyle(d).clipPath);
  expect(clip).toBe("none");
  const op = await menu
    .locator(".menu-stagger")
    .first()
    .evaluate((e) => getComputedStyle(e).opacity);
  expect(op).toBe("1");
  // Page scroll unlocks after closing.
  await menu.getByRole("button", { name: "Close menu" }).click();
  await expect(menu).toBeHidden();
  expect(await page.evaluate(() => getComputedStyle(document.documentElement).overflow)).not.toBe(
    "hidden",
  );
  expect(errors).toEqual([]);
});

test("Escape while the menu is still opening closes it cleanly", async ({ page }) => {
  const errors = watch(page);
  await page.goto("/");
  await settle(page);
  const menu = page.getByRole("dialog", { name: "Menu" });
  await page.getByRole("button", { name: "Open menu" }).click();
  await page.waitForTimeout(200);
  await page.keyboard.press("Escape");
  await expect(menu).toBeHidden({ timeout: 6000 });
  await page.getByRole("button", { name: "Open menu" }).click();
  await settle(page);
  await expect(menu.getByRole("link").first()).toBeVisible();
  expect(errors).toEqual([]);
});

test("a link click mid-animation closes and navigates", async ({ page }) => {
  const errors = watch(page);
  await page.goto("/");
  await settle(page);
  await page.getByRole("button", { name: "Open menu" }).click();
  await page.waitForTimeout(1200);
  const menu = page.getByRole("dialog", { name: "Menu" });
  await menu.getByRole("link", { name: "About" }).click({ force: true });
  await expect(menu).toBeHidden();
  await expect(page).toHaveURL(/#about/);
  expect(errors).toEqual([]);
});

test("theme spam inside the menu ends on the right theme, saved, no errors", async ({ page }) => {
  const errors = watch(page);
  await page.goto("/");
  await settle(page);
  await page.getByRole("button", { name: "Open menu" }).click();
  await settle(page);
  const menu = page.getByRole("dialog", { name: "Menu" });
  for (let n = 0; n < 5; n++) {
    await menu.getByRole("button", { name: /Switch to/ }).click();
    await page.waitForTimeout(90);
  }
  await settle(page);
  // 5 toggles from dark → light.
  await expect(page.locator("html")).toHaveAttribute("data-theme", "light");
  await expect.poll(() => bg(page)).toBe(LIGHT);
  expect(await page.evaluate((k) => localStorage.getItem(k), THEME_KEY)).toBe("light");
  await expect
    .poll(() => page.evaluate(() => "themeSwitch" in document.documentElement.dataset))
    .toBe(false);
  expect(await themeColor(page)).toBe("#fafaf7");
  await page.reload();
  expect(await bg(page)).toBe(LIGHT);
  expect(errors).toEqual([]);
});

test("reduced motion: menu and theme switch instantly, still work", async ({ browser }) => {
  const ctx = await browser.newContext({ reducedMotion: "reduce" });
  const page = await ctx.newPage();
  await page.addInitScript((key) => sessionStorage.setItem(key, "1"), INTRO_KEY);
  const errors = watch(page);
  await page.goto("/");
  await page.getByRole("button", { name: "Open menu" }).click();
  const menu = page.getByRole("dialog", { name: "Menu" });
  await expect(menu.getByRole("link").first()).toBeVisible();
  // No motion: no clip-path circle, no row or icon keyframes (a hover color fade is fine).
  const moving = await menu.evaluate((d) =>
    d
      .getAnimations({ subtree: true })
      .filter((a) => !(a instanceof CSSTransition))
      .map((a) => (a as CSSAnimation).animationName ?? "waapi"),
  );
  expect(moving).toEqual([]);
  await menu.getByRole("button", { name: "Switch to light mode" }).click();
  await expect.poll(() => bg(page)).toBe(LIGHT);
  await menu.getByRole("button", { name: "Close menu" }).click();
  await expect(menu).toBeHidden();
  expect(errors).toEqual([]);
  await ctx.close();
});

test("resize while open, then close: still closes and lines up", async ({ page }) => {
  const errors = watch(page);
  await page.goto("/");
  await settle(page);
  await page.getByRole("button", { name: "Open menu" }).click();
  await settle(page);
  await page.setViewportSize({ width: 390, height: 760 });
  const menu = page.getByRole("dialog", { name: "Menu" });
  await menu.getByRole("button", { name: "Close menu" }).click();
  await expect(menu).toBeHidden();
  expect(errors).toEqual([]);
});

test("dark default, no errors, on the blog and 404 too", async ({ page }) => {
  const errors = watch(page);
  for (const path of ["/", "/blog"]) {
    await page.goto(path);
    expect(await bg(page)).toBe(DARK);
  }
  await page.goto("/nope");
  expect(await bg(page)).toBe(DARK);
  expect(errors.filter((e) => !/404/.test(e))).toEqual([]);
});

test("closing while it's still opening plays it back: no row flashes in first", async ({
  page,
}) => {
  const errors = watch(page);
  await page.goto("/");
  await settle(page);
  await page.getByRole("button", { name: "Open menu" }).click();
  const menu = page.getByRole("dialog", { name: "Menu" });
  await page.waitForTimeout(250); // rows are still waiting their turn (hidden)
  await menu.getByRole("button", { name: "Close menu" }).click();
  // Sample the rows while it closes: none may ever become visible.
  const maxOpacity = await menu.evaluate(async (d) => {
    let max = 0;
    const rows = [...d.querySelectorAll(".menu-stagger")];
    while ((d as HTMLDialogElement).open) {
      for (const r of rows) max = Math.max(max, Number(getComputedStyle(r).opacity));
      await new Promise((r) => requestAnimationFrame(r));
    }
    return max;
  });
  expect(maxOpacity).toBeLessThan(0.05);
  await expect(menu).toBeHidden();
  expect(errors).toEqual([]);
});
