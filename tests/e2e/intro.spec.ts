import { expect, test } from "@playwright/test";
import { INTRO_MS } from "@/lib/intro";

const intro = "#intro";

test("new session shows the CMDLS intro, then it gets out of the way", async ({ page }) => {
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

test("the page rises in on every refresh; under the intro it fades so the name holds still", async ({
  page,
}) => {
  const rise = () =>
    page.evaluate(() => getComputedStyle(document.querySelector(".page-rise")!).animationName);
  await page.goto("/");
  await expect(page.locator(intro)).toHaveAttribute("data-show", "");
  expect(await rise()).toBe("page-fade");
  await page.reload();
  expect(await rise()).toBe("page-rise");
  await expect(page.locator(intro)).not.toHaveAttribute("data-show");
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

test("each intro letter lands exactly on its word in the hero name", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator(intro)).toHaveAttribute("data-landed", "", { timeout: INTRO_MS });
  await expect(page.locator(intro)).not.toHaveAttribute("data-curtain");

  // The flown letters keep their final transform (hidden), so compare their content
  // box to the hero letter they landed on: the swap must be invisible. Measured a
  // second after landing, so a letter that snaps back (Safari, when the float
  // animation outlives the flight) is caught too.
  await page.waitForTimeout(1000);
  const offsets = await page.evaluate(() => {
    const kinds = ["letter", "dot"];
    return kinds.flatMap((kind) => {
      const from = [...document.querySelectorAll(`[data-morph-source="${kind}"]`)];
      const to = [...document.querySelectorAll(`[data-morph-target="${kind}"]`)];
      return from.map((el, i) => {
        const a = el.getBoundingClientRect();
        const b = to[i].getBoundingClientRect();
        return {
          char: `${el.textContent}→${to[i].textContent}`,
          x: Math.round(Math.abs(a.left - b.left)),
          y: Math.round(Math.abs(a.top + (a.height - b.height) / 2 - b.top)),
        };
      });
    });
  });
  expect(offsets.map((o) => o.char)).toEqual(["C→C", "M→M", "D→D", "L→L", "S→S", ".→."]);
  for (const o of offsets) expect(o, o.char).toMatchObject({ x: 0, y: 0 });

  // One by one, in reading order: each letter takes off after the previous one.
  const starts = await page.evaluate(() =>
    [...document.querySelectorAll("[data-morph-source]")].map((el) =>
      Number(el.getAnimations().at(-1)?.startTime),
    ),
  );
  for (let i = 1; i < starts.length; i++) expect(starts[i]).toBeGreaterThan(starts[i - 1] + 100);

  // The period in "M." is gold, like the logo's dot.
  const gold = await page.evaluate(() => {
    const dot = document.querySelector('[data-morph-target="dot"]')!;
    const logoDot = document.querySelector('header a[href="/"] .text-gold')!;
    return [getComputedStyle(dot).color, getComputedStyle(logoDot).color];
  });
  expect(gold[0]).toBe(gold[1]);

  // The real heading is intact and fully visible afterwards.
  const h1 = page.getByRole("heading", { level: 1 });
  await expect(h1).toHaveText("Christian M. De Los Santos");
  await expect(h1).toHaveAccessibleName("Christian M. De Los Santos");
  await expect
    .poll(() =>
      h1.evaluate((el) =>
        [...el.querySelectorAll("span")].every((s) => getComputedStyle(s).opacity === "1"),
      ),
    )
    .toBe(true);
});

test("a first visit on a page without the hero name exits with the curtain", async ({ page }) => {
  await page.goto("/blog");
  await expect(page.locator(intro)).toHaveAttribute("data-curtain", "", { timeout: INTRO_MS });
  await expect(page.locator(intro)).not.toHaveAttribute("data-morph");
  await expect(page.locator(intro)).toBeHidden({ timeout: 1500 });
});

test("reduced motion: no flight, the intro just fades", async ({ browser }) => {
  const context = await browser.newContext({ reducedMotion: "reduce" });
  const page = await context.newPage();
  await page.goto("/");
  await expect(page.locator(intro)).toHaveAttribute("data-show", "");
  await expect(page.locator(intro)).toBeHidden({ timeout: 2500 });
  await expect(page.locator(intro)).not.toHaveAttribute("data-morph");
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  await context.close();
});

test("the page can't scroll under the flying letters, and scrolls again after", async ({
  page,
}) => {
  await page.goto("/");
  await expect(page.locator(intro)).toHaveAttribute("data-show", "");
  await page.mouse.move(200, 400);
  await page.mouse.wheel(0, 800);
  await page.waitForTimeout(300);
  expect(await page.evaluate(() => window.scrollY)).toBe(0);

  await expect(page.locator(intro)).toHaveAttribute("data-landed", "", { timeout: INTRO_MS });
  await page.mouse.wheel(0, 800);
  await expect.poll(() => page.evaluate(() => window.scrollY)).toBeGreaterThan(0);
});

test("failsafe: if the loader never reports back, the curtain still reveals the page", async ({
  page,
}) => {
  test.slow();
  // Swallow the loader's animationend before it reaches the intro script.
  await page.addInitScript(() => {
    window.addEventListener("animationend", (e) => e.stopPropagation(), { capture: true });
  });
  await page.goto("/");
  await expect(page.locator(intro)).toHaveAttribute("data-curtain", "", { timeout: 14_000 });
  await expect(page.locator(intro)).toBeHidden({ timeout: 2000 });
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
});
