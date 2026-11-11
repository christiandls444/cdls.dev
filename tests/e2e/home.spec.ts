import { expect, test } from "./fixtures";
import { site } from "@/content/site";
import { revealAll } from "./helpers";

test("renders identity and sections without errors", async ({ page }) => {
  const errors: string[] = [];
  page.on("pageerror", (e) => errors.push(e.message));
  page.on("console", (m) => m.type() === "error" && errors.push(m.text()));

  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1 })).toContainText(site.name.split(" ")[0]);
  await expect(page.getByText(site.badges[0].role, { exact: false }).first()).toBeVisible();
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

test("hero is readable without JavaScript (no blank page if JS fails to load)", async ({
  browser,
}) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  await page.goto("/");
  const opacity = (loc: ReturnType<typeof page.locator>) =>
    loc.evaluate((el) => {
      let n: Element | null = el;
      let o = 1;
      while (n) {
        o *= Number(getComputedStyle(n).opacity);
        n = n.parentElement;
      }
      return o;
    });
  const h1 = page.getByRole("heading", { level: 1 });
  await expect.poll(() => opacity(h1), { timeout: 3000 }).toBe(1);
  const cta = page.getByRole("main").getByRole("link", { name: "Get in touch" });
  await expect.poll(() => opacity(cta), { timeout: 3000 }).toBe(1);
  await context.close();
});
