import { describe, expect, it } from "vitest";
import { navigation } from "@/content/navigation";
import { projects } from "@/content/projects";
import { site } from "@/content/site";
import { stack } from "@/content/stack";

const words = (s: string) => s.trim().split(/\s+/).length;
const isHttps = (s: string) => /^https:\/\/[^\s]+$/.test(s);
const isLink = (s: string) => isHttps(s) || /^mailto:[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s);
const unique = (xs: string[]) => new Set(xs).size === xs.length;

describe("site", () => {
  it("has a canonical https url without trailing slash", () => {
    expect(isHttps(site.url)).toBe(true);
    expect(site.url.endsWith("/")).toBe(false);
  });

  it("keeps the tagline short", () => {
    expect(words(site.tagline)).toBeLessThanOrEqual(12);
  });

  it("has valid social links (empty = hidden)", () => {
    for (const s of site.socials) {
      if (s.href) expect(isLink(s.href), `${s.label}: ${s.href}`).toBe(true);
    }
    expect(unique(site.socials.map((s) => s.label))).toBe(true);
  });
});

describe("projects", () => {
  it("have unique kebab-case slugs", () => {
    expect(unique(projects.map((p) => p.slug))).toBe(true);
    for (const p of projects) expect(p.slug).toMatch(/^[a-z0-9]+(-[a-z0-9]+)*$/);
  });

  it.each(projects)("$slug follows the content rules", (p) => {
    expect(p.title.trim()).not.toBe("");
    expect(words(p.summary)).toBeLessThanOrEqual(15);
    expect(p.tags.length).toBeGreaterThanOrEqual(1);
    expect(p.tags.length).toBeLessThanOrEqual(4);
    if (p.href) expect(isHttps(p.href)).toBe(true);
    if (p.repo) expect(isHttps(p.repo)).toBe(true);
  });

  it("has at least one featured project", () => {
    expect(projects.some((p) => p.featured)).toBe(true);
  });
});

describe("stack", () => {
  it("has non-empty groups with unique item names", () => {
    for (const g of stack) expect(g.items.length).toBeGreaterThan(0);
    expect(unique(stack.flatMap((g) => g.items.map((i) => i.name)))).toBe(true);
  });
});

describe("navigation", () => {
  it("keeps the header short (max 4 links)", () => {
    expect(navigation.links.length).toBeLessThanOrEqual(4);
  });

  it("uses anchors or routes for links, and a valid link for the cta", () => {
    for (const l of navigation.links) expect(l.href).toMatch(/^(#[a-z0-9-]+|\/[a-z0-9/-]*)$/);
    expect(isLink(navigation.cta.href)).toBe(true);
    expect(unique(navigation.links.map((l) => l.href))).toBe(true);
  });

  it("points the cta at the public email", () => {
    expect(navigation.cta.href).toBe(`mailto:${site.email}`);
  });
});
