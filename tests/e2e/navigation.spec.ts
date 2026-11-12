import { navigation } from "@/content/navigation";
import { site } from "@/content/site";
import { expect, test } from "./fixtures";
import { settle } from "./helpers";

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

test("a large role line fills the open top of the hero and cycles through the roles", async ({
  page,
}) => {
  await page.goto("/");
  const main = page.getByRole("main");
  const label = main.locator(".role-ticker");
  const h1 = main.getByRole("heading", { level: 1 });

  // Always visible (phones too), decorative, above the badges, right-aligned with the
  // menu icon, and about half the size of the name.
  const text = async () => (await label.innerText()).trim();
  await expect(label).toBeVisible();
  await expect(label).toHaveAttribute("aria-hidden", "true");
  await expect.poll(async () => site.roles.includes(await text())).toBe(true);
  const l = (await label.boundingBox())!;
  const badges = (await main.locator("ul").first().boundingBox())!;
  expect(l.y + l.height).toBeLessThanOrEqual(badges.y);
  const lastLetter = (await label.locator("span").last().boundingBox())!;
  const menu = (await page
    .getByRole("button", { name: "Open menu" })
    .locator("svg")
    .boundingBox())!;
  expect(Math.abs(lastLetter.x + lastLetter.width - (menu.x + menu.width))).toBeLessThanOrEqual(4);
  const size = (el: typeof label) => el.evaluate((n) => parseFloat(getComputedStyle(n).fontSize));
  expect((await size(label)) / (await size(h1))).toBeCloseTo(0.5, 1);

  // Cycles (fades out, writes in letter by letter): only roles from content.
  const first = await text();
  await expect.poll(text, { timeout: 7000 }).not.toBe(first);
  expect(site.roles).toContain(await text());
  await expect(h1).toHaveAccessibleName(site.name);
});

test("the role line opens on a random role on every load", async ({ page }) => {
  const label = page.getByRole("main").locator(".role-ticker");
  const firsts = new Set<string>();
  for (let i = 0; i < 6; i++) {
    await (i === 0 ? page.goto("/") : page.reload());
    await expect.poll(async () => site.roles.includes((await label.innerText()).trim())).toBe(true);
    firsts.add((await label.innerText()).trim());
  }
  // 6 loads over 10 roles all opening on the same one: ~1 in 100,000.
  expect(firsts.size).toBeGreaterThan(1);
});

test("menu grows from the ☰ as a circle, the ☰ turns into × in place, and shrinks back", async ({
  page,
}) => {
  await page.goto("/");
  // Let the page finish rising in after load, so the ☰ is at rest before measuring.
  await page
    .locator(".page-rise")
    .evaluate((el) => Promise.all(el.getAnimations().map((a) => a.finished)));
  const openBtn = page.getByRole("button", { name: "Open menu" });
  const ham = (await openBtn.boundingBox())!;
  await openBtn.click();
  const menu = page.getByRole("dialog", { name: "Menu" });

  // The open runs as a clip-path circle animation on the dialog.
  const circle = await menu.evaluate((d) =>
    d
      .getAnimations()
      .some((a) => JSON.stringify((a.effect as KeyframeEffect).getKeyframes()).includes("circle")),
  );
  expect(circle).toBe(true);

  // × sits exactly where ☰ was, and ends as an X (top bar turned 45°).
  const closeBtn = menu.getByRole("button", { name: "Close menu" });
  const x = (await closeBtn.boundingBox())!;
  expect(Math.abs(x.x - ham.x)).toBeLessThanOrEqual(1);
  expect(Math.abs(x.y - ham.y)).toBeLessThanOrEqual(1);
  // Wait for the circle and the icon morph to finish.
  await settle(page, "dialog");
  const top = await closeBtn
    .locator(".menu-icon__top")
    .evaluate((l) => getComputedStyle(l).transform);
  expect(top).not.toBe("none");

  // Opening focuses the menu itself, so the logo shows no focus ring.
  await expect(menu).toBeFocused();

  // Closing shrinks the circle back first (still open while it plays), then closes.
  await closeBtn.click();
  await expect(menu).toHaveAttribute("data-closing");
  expect(await menu.evaluate((d: HTMLDialogElement) => d.open)).toBe(true);
  await expect(menu).toBeHidden();
  await expect(openBtn).toBeFocused();
});

test("menu rows come in one by one from the top, and leave one by one from the bottom", async ({
  page,
}) => {
  await page.goto("/");
  await page.getByRole("button", { name: "Open menu" }).click();
  const menu = page.getByRole("dialog", { name: "Menu" });
  /** Each row's delay for its CSS rise (open) or its scripted drop (close), in DOM order. */
  const rowDelays = (css: boolean) =>
    menu.locator(".menu-stagger").evaluateAll(
      (rows, wantCss) =>
        rows.map((r) => {
          const a = r
            .getAnimations()
            .find((x) => x instanceof CSSAnimation === wantCss && x.playState !== "paused");
          return a ? Number(a.effect!.getTiming().delay) : -1;
        }),
      css,
    );

  const opening = await rowDelays(true);
  expect(opening.length).toBeGreaterThanOrEqual(5);
  for (let i = 1; i < opening.length; i++) expect(opening[i]).toBeGreaterThan(opening[i - 1]);

  await settle(page, "dialog");
  await menu.getByRole("button", { name: "Close menu" }).click();
  // Bottom row leaves first: delays fall from top to bottom.
  const closing = await rowDelays(false);
  for (let i = 1; i < closing.length; i++) expect(closing[i]).toBeLessThan(closing[i - 1]);
  // The circle waits for the rows to leave before it shrinks.
  const circleDelay = await menu.evaluate((d) =>
    Number(
      d
        .getAnimations()
        .find((a) => !(a instanceof CSSAnimation))!
        .effect!.getTiming().delay,
    ),
  );
  expect(circleDelay).toBeGreaterThanOrEqual(Math.max(...closing));
  await expect(menu).toBeHidden();
});
