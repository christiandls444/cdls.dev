import { INTRO_KEY } from "@/lib/intro";
import { THEME_KEY } from "@/lib/theme";
import { expect, test } from "./fixtures";
import { bodyBg, DARK, LIGHT, settle, themeColor } from "./helpers";

for (const scheme of ["light", "dark"] as const) {
  test(`dark by default, even when the OS is ${scheme}`, async ({ page }) => {
    await page.emulateMedia({ colorScheme: scheme });
    await page.goto("/");
    expect(await bodyBg(page)).toBe(DARK);
    expect(await themeColor(page)).toBe("#0a0a0a");
  });
}

test("menu toggle switches to light, remembers it, and switches back", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: "Open menu" }).click();
  const menu = page.getByRole("dialog", { name: "Menu" });

  await menu.getByRole("button", { name: "Switch to light mode" }).click();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "light");
  await expect.poll(() => bodyBg(page)).toBe(LIGHT);
  await expect.poll(() => themeColor(page)).toBe("#fafaf7");
  expect(await page.evaluate((k) => localStorage.getItem(k), THEME_KEY)).toBe("light");

  await page.reload();
  expect(await bodyBg(page)).toBe(LIGHT);

  await page.getByRole("button", { name: "Open menu" }).click();
  await menu.getByRole("button", { name: "Switch to dark mode" }).click();
  await expect(page.locator("html")).not.toHaveAttribute("data-theme");
  await expect.poll(() => bodyBg(page)).toBe(DARK);
  await expect.poll(() => themeColor(page)).toBe("#0a0a0a");
});

test("the toggle sits next to the social icons in the menu", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: "Open menu" }).click();
  const menu = page.getByRole("dialog", { name: "Menu" });
  // Rows rise in one by one; measure once they're all in place.
  await settle(page, "dialog");
  const toggle = await menu.getByRole("button", { name: /Switch to/ }).boundingBox();
  const lastSocial = await menu.locator("ul").last().locator("a").last().boundingBox();
  expect(toggle && lastSocial).toBeTruthy();
  expect(Math.abs(toggle!.y - lastSocial!.y)).toBeLessThanOrEqual(1);
  expect(toggle!.x).toBeGreaterThan(lastSocial!.x);
});

test("a saved light choice applies before React loads (no dark flash)", async ({ page }) => {
  await page.addInitScript((key) => localStorage.setItem(key, "light"), THEME_KEY);
  // Block every JS bundle: only the inline <head> script can set the theme.
  await page.route("**/_next/static/chunks/*.js", (route) => route.abort());
  await page.goto("/");
  await expect(page.locator("html")).toHaveAttribute("data-theme", "light");
  expect(await bodyBg(page)).toBe(LIGHT);
  expect(await themeColor(page)).toBe("#fafaf7");
});

test("follows a theme change made in another tab", async ({ context }) => {
  const [a, b] = [await context.newPage(), await context.newPage()];
  for (const p of [a, b]) {
    await p.addInitScript((key) => sessionStorage.setItem(key, "1"), INTRO_KEY);
    await p.goto("/");
  }
  await a.getByRole("button", { name: "Open menu" }).click();
  await a.getByRole("button", { name: "Switch to light mode" }).click();
  await expect(b.locator("html")).toHaveAttribute("data-theme", "light");
  await expect.poll(() => bodyBg(b)).toBe(LIGHT);
});
