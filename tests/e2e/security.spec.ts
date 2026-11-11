import { expect, test } from "./fixtures";

test("sends security headers on every page", async ({ request }) => {
  for (const path of ["/", "/blog", "/does-not-exist", "/robots.txt"]) {
    const h = (await request.get(path)).headers();
    const csp = h["content-security-policy"] ?? "";

    expect(csp, path).toContain("default-src 'self'");
    expect(csp, path).toContain("frame-ancestors 'none'");
    expect(csp, path).toContain("object-src 'none'");
    expect(csp, path).not.toContain("unsafe-eval"); // dev-only
    expect(h["strict-transport-security"], path).toContain("max-age=63072000");
    expect(h["x-content-type-options"], path).toBe("nosniff");
    expect(h["x-frame-options"], path).toBe("DENY");
    expect(h["referrer-policy"], path).toBe("strict-origin-when-cross-origin");
    expect(h["permissions-policy"], path).toContain("camera=()");
    expect(h["x-powered-by"], path).toBeUndefined();
  }
});

test("external links cannot access window.opener", async ({ page }) => {
  await page.goto("/");
  const unsafe = await page.$$eval('a[target="_blank"]', (links) =>
    links
      .filter((a) => !/noopener/.test(a.getAttribute("rel") ?? ""))
      .map((a) => a.getAttribute("href")),
  );
  expect(unsafe).toEqual([]);
});

test("robots.txt blocks crawlers outside production", async ({ request }) => {
  // Local/CI builds have no VERCEL_ENV=production, so they must not be indexable.
  const body = await (await request.get("/robots.txt")).text();
  expect(body).toMatch(/Disallow: \//);
});
