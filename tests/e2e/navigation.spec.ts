import { expect, test } from "@playwright/test";
import { navigation } from "@/content/navigation";
import { site } from "@/content/site";

test("every in-page nav link has a matching section", async ({ page }) => {
  await page.goto("/");
  for (const { href } of navigation.links.filter((l) => l.href.startsWith("#"))) {
    await expect(page.locator(href), `${href} has no section`).toBeAttached();
  }
});

test("cta is visible and emails the public address", async ({ page }) => {
  await page.goto("/");
  const cta = page.getByRole("banner").getByRole("link", { name: navigation.cta.label });
  await expect(cta).toBeVisible();
  await expect(cta).toHaveAttribute("href", `mailto:${site.email}`);
});

test.describe("desktop", () => {
  test.skip(({ isMobile }) => isMobile, "desktop only");

  test("shows section links inline and hides the menu button", async ({ page }) => {
    await page.goto("/");
    const nav = page.getByRole("navigation", { name: "Main" });
    for (const { label } of navigation.links) {
      await expect(nav.getByRole("link", { name: label })).toBeVisible();
    }
    await expect(page.getByRole("button", { name: "Open menu" })).toBeHidden();
  });
});

test.describe("mobile", () => {
  test.skip(({ isMobile }) => !isMobile, "mobile only");

  test("menu opens, closes with Escape, and closes after picking a link", async ({ page }) => {
    await page.goto("/");
    const open = page.getByRole("button", { name: "Open menu" });
    const menu = page.getByRole("navigation", { name: "Mobile" });

    await expect(page.getByRole("navigation", { name: "Main" })).toBeHidden();
    await expect(menu).toBeHidden();

    await open.click();
    await expect(menu).toBeVisible();
    await expect(page.getByRole("button", { name: "Close menu" })).toHaveAttribute(
      "aria-expanded",
      "true",
    );
    await page.keyboard.press("Escape");
    await expect(menu).toBeHidden();
    await expect(open).toBeFocused();

    await open.click();
    const first = navigation.links[0];
    await menu.getByRole("link", { name: first.label }).click();
    await expect(menu).toBeHidden();
    await expect(page).toHaveURL(new RegExp(`${first.href}$`));
  });
});
