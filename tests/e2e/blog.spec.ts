import { sortedPosts } from "@/content/posts";
import { expect, test } from "./fixtures";

test("blog index renders, with posts or the empty state", async ({ page }) => {
  const res = await page.goto("/blog");
  expect(res?.status()).toBe(200);
  await expect(page.getByRole("heading", { level: 1, name: "Blog" })).toBeVisible();

  if (sortedPosts.length === 0) {
    await expect(page.getByText(/First posts coming soon/)).toBeVisible();
  } else {
    for (const post of sortedPosts) {
      await expect(page.getByRole("link", { name: new RegExp(post.title) })).toBeVisible();
    }
  }
});

test("menu Blog link opens the blog", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: "Open menu" }).click();
  await page.getByRole("dialog", { name: "Menu" }).getByRole("link", { name: "Blog" }).click();
  await expect(page).toHaveURL(/\/blog$/);
});

test("home section links work from the blog page", async ({ page }) => {
  await page.goto("/blog");
  await page.getByRole("button", { name: "Open menu" }).click();
  await page.getByRole("dialog", { name: "Menu" }).getByRole("link", { name: "About" }).click();
  await expect(page).toHaveURL(/\/#about$/);
  await expect(page.locator("#about")).toBeInViewport();
});

test("the prerendered placeholder post is a hard 404", async ({ page }) => {
  expect((await page.goto("/blog/__placeholder__"))?.status()).toBe(404);
});

test("unknown posts show not found and are never indexable", async ({ page }) => {
  // Unknown slugs render on request. Next streams the shell before notFound() runs,
  // so the very first hit can be a 200 (later hits are 404). The page is still the
  // not-found UI with <meta name="robots" content="noindex">, so search engines skip it.
  const res = await page.goto("/blog/does-not-exist");
  expect([200, 404]).toContain(res?.status());
  await expect(page.getByRole("heading", { name: "Page not found." })).toBeVisible();
  await expect(page.locator('meta[name="robots"][content="noindex"]').first()).toBeAttached();
});

for (const post of sortedPosts) {
  test(`post ${post.slug} renders`, async ({ page }) => {
    expect((await page.goto(`/blog/${post.slug}`))?.status()).toBe(200);
    await expect(page.getByRole("heading", { level: 1, name: post.title })).toBeVisible();
  });
}
