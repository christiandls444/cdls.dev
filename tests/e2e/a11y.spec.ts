import AxeBuilder from "@axe-core/playwright";
import { THEME_KEY } from "@/lib/theme";
import { expect, test } from "./fixtures";
import { revealAll } from "./helpers";

for (const theme of ["light", "dark"] as const) {
  test(`has no WCAG A/AA violations (${theme})`, async ({ page }) => {
    await page.addInitScript(
      ([key, value]) => localStorage.setItem(key, value),
      [THEME_KEY, theme],
    );
    await page.goto("/");
    await revealAll(page);

    const { violations } = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
      .analyze();

    expect(violations.map((v) => `${v.id}: ${v.nodes.map((n) => n.target).join(", ")}`)).toEqual(
      [],
    );
  });
}
