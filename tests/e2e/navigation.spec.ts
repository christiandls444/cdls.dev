import { expect, test } from "@playwright/test";
import { navigation } from "@/content/navigation";
import { site } from "@/content/site";

test("every home-section menu link has a matching section", async ({ page }) => {
  await page.goto("/");
  for (const { href } of navigation.links.filter((l) => l.href.startsWith("/#"))) {
    const id = href.slice(1);
    await expect(page.locator(id), `${href} has no section`).toBeAttached();
  }
});

test("every page menu link resolves", async ({ request }) => {
  for (const { href } of navigation.links.filter((l) => !l.href.includes("#"))) {
    expect((await request.get(href)).status(), href).toBe(200);
  }
});

test("logo goes home", async ({ page }) => {
  await page.goto("/#work");
  await page.getByRole("banner").getByRole("link", { name: /home/i }).click();
  await expect(page).toHaveURL(/\/$/);
});

test("hero shows the full name, role badge and two actions", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(site.name);
  for (const b of site.badges) {
    await expect(page.getByText(`${b.role} · ${b.org}`)).toBeVisible();
  }

  const main = page.getByRole("main");
  const cta = main.getByRole("link", { name: navigation.cta.label });
  await expect(cta).toBeVisible();
  await expect(cta).toHaveAttribute("href", `mailto:${site.email}`);
  await expect(main.getByRole("link", { name: "View work" })).toHaveAttribute("href", "/#work");
});

test("menu opens, closes with Escape, and closes after picking a link", async ({ page }) => {
  await page.goto("/");
  const openBtn = page.getByRole("button", { name: "Open menu" });
  const menu = page.getByRole("dialog", { name: "Menu" });

  await expect(menu).toBeHidden();
  await openBtn.click();
  await expect(menu).toBeVisible();
  for (const { label } of [...navigation.links, navigation.cta]) {
    await expect(menu.getByRole("link", { name: label })).toBeVisible();
  }

  await page.keyboard.press("Escape");
  await expect(menu).toBeHidden();
  await expect(openBtn).toBeFocused();

  await openBtn.click();
  await menu.getByRole("button", { name: "Close menu" }).click();
  await expect(menu).toBeHidden();

  await openBtn.click();
  const first = navigation.links[0];
  await menu.getByRole("link", { name: first.label }).click();
  await expect(menu).toBeHidden();
  await expect(page).toHaveURL(new RegExp(`${first.href.replace("/", "")}$`));
});

test("page does not scroll behind the open menu", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: "Open menu" }).click();
  const overflow = await page.evaluate(() => getComputedStyle(document.documentElement).overflow);
  expect(overflow).toBe("hidden");
});

test("header scrolls away with the page (not sticky)", async ({ page }) => {
  await page.goto("/");
  await page.evaluate(() => window.scrollTo(0, 1200));
  const box = await page.getByRole("banner").boundingBox();
  expect(box && box.y + box.height).toBeLessThanOrEqual(0);
});

test.describe("hero name roles", () => {
  test.skip(({ isMobile }) => isMobile, "hover is desktop only (touch uses tap)");

  test("hovering the name shows a role pill; the name never changes", async ({ page }) => {
    await page.goto("/");
    const h1 = page.getByRole("heading", { level: 1 });
    const pill = page.locator(".role-pill");
    await expect(pill).toHaveAttribute("data-open", "false");

    await h1.hover();
    await expect(pill).toHaveAttribute("data-open", "true");
    await expect
      .poll(async () => site.roles.includes((await pill.innerText()).trim()), { timeout: 3000 })
      .toBe(true);
    await expect(h1).toHaveText(site.name);

    await page.mouse.move(5, 5);
    await expect(pill).toHaveAttribute("data-open", "false");
  });
});

test("tapping the name toggles the role pill on touch", async ({ page, isMobile }) => {
  test.skip(!isMobile, "touch only");
  await page.goto("/");
  const h1 = page.getByRole("heading", { level: 1 });
  const pill = page.locator(".role-pill");
  await h1.tap();
  await expect(pill).toHaveAttribute("data-open", "true");
  await h1.tap();
  await expect(pill).toHaveAttribute("data-open", "false");
});
