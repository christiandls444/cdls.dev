import { expect, test } from "@playwright/test";
import { site } from "@/content/site";
import { revealAll } from "./helpers";

test("renders identity and sections without errors", async ({ page }) => {
  const errors: string[] = [];
  page.on("pageerror", (e) => errors.push(e.message));
  page.on("console", (m) => m.type() === "error" && errors.push(m.text()));

  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1 })).toContainText(site.name.split(" ")[0]);
  await expect(page.getByText(site.role).first()).toBeVisible();
  await expect(page.locator("#about")).toBeAttached();
  await expect(page.locator("#work")).toBeAttached();

  expect(errors).toEqual([]);
});

test("styles load (regression: unstyled page / giant icons)", async ({ page }) => {
  await page.goto("/");
  await revealAll(page);
  const biggestSvg = await page.$$eval("svg", (els) =>
    Math.max(...els.map((e) => e.getBoundingClientRect().width)),
  );
  expect(biggestSvg).toBeLessThanOrEqual(64);
});

for (const scheme of ["light", "dark"] as const) {
  test(`follows ${scheme} color scheme`, async ({ page }) => {
    await page.emulateMedia({ colorScheme: scheme });
    await page.goto("/");
    const bg = await page.evaluate(() => getComputedStyle(document.body).backgroundColor);
    expect(bg).toBe(scheme === "dark" ? "rgb(10, 10, 10)" : "rgb(250, 250, 247)");
  });
}

test("unknown routes return the 404 page", async ({ page }) => {
  const res = await page.goto("/does-not-exist");
  expect(res?.status()).toBe(404);
  await expect(page.getByRole("heading", { name: "Page not found." })).toBeVisible();
});
