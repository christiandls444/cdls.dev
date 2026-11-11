import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";
import { revealAll } from "./helpers";

for (const scheme of ["light", "dark"] as const) {
  test(`has no WCAG A/AA violations (${scheme})`, async ({ page }) => {
    await page.emulateMedia({ colorScheme: scheme });
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
