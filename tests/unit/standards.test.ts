import { execSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

/**
 * Codebase standards that ESLint can't express. Each rule maps to a section in
 * docs/CONVENTIONS.md. If a rule fails, fix the code; only change an allowlist
 * here together with a reason in CONVENTIONS.md.
 */

const ROOT = join(__dirname, "..", "..");

// Tracked + new (not git-ignored) files only, so OS files like .DS_Store never count.
const paths = execSync("git ls-files --cached --others --exclude-standard src", {
  cwd: ROOT,
  encoding: "utf8",
})
  .split("\n")
  .filter(Boolean);

const files = paths.map((path) => ({
  path,
  name: path.split("/").pop()!,
  code: readFileSync(join(ROOT, path), "utf8"),
}));
const code = files.filter((f) => /\.(ts|tsx)$/.test(f.name));

/** Source without comments, so `// see #123` or doc examples never trip a rule. */
const stripComments = (src: string) => src.replace(/\/\*[\s\S]*?\*\/|\/\/[^\n]*/g, "");

/** Client components we accept, each with a reason (keep JavaScript small). */
const CLIENT_COMPONENTS: Record<string, string> = {
  "src/components/ui/fade-in.tsx": "scroll-triggered fade (motion)",
  "src/components/layout/menu-dialog.tsx": "opens/closes the menu dialog",
  "src/components/sections/role-ticker.tsx": "cycles the hero role line",
  "src/components/theme/theme-toggle.tsx": "switches dark/light and remembers it",
};

/** Next.js file conventions that must use a default export. */
const ROUTE_FILE =
  /^(page|layout|template|loading|error|global-error|not-found|default|route|robots|sitemap|manifest|icon|apple-icon|opengraph-image|twitter-image)\.(ts|tsx)$/;

const KEBAB = /^[a-z0-9]+(-[a-z0-9]+)*$/;
/** Next segment syntax: [slug], [...slug], [[...slug]], (group), @slot, _private. */
const NEXT_SEGMENT = /^(\[{1,2}(\.\.\.)?[a-z0-9-]+\]{1,2}|\([a-z0-9-]+\)|@[a-z0-9-]+|_[a-z0-9-]+)$/;

describe("names", () => {
  it("files are kebab-case", () => {
    const bad = files.filter((f) => !KEBAB.test(f.name.split(".")[0])).map((f) => f.path);
    expect(bad).toEqual([]);
  });

  it("folders are kebab-case (or Next segments like [slug])", () => {
    const dirs = new Set(paths.flatMap((p) => p.split("/").slice(1, -1)));
    const bad = [...dirs].filter((d) => !KEBAB.test(d) && !NEXT_SEGMENT.test(d));
    expect(bad).toEqual([]);
  });
});

describe("colors come from design tokens only", () => {
  const ui = code.filter((f) => /^src\/(components|content|app)\//.test(f.path));

  it("no Tailwind palette colors (use bg-bg, text-fg, text-gold, bg-blue…)", () => {
    const palette =
      /\b(?:bg|text|border(?:-[xytrbse])?|divide|ring(?:-offset)?|outline|fill|stroke|from|via|to|decoration|shadow|placeholder|caret|accent)-(?:white|black|slate|gray|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose)(?:-\d{2,3})?\b/g;
    const hits = ui.flatMap((f) =>
      [...stripComments(f.code).matchAll(palette)]
        // `text-blue` / `bg-blue` alone are our tokens, not Tailwind's palette.
        .filter((m) => /-\d{2,3}$/.test(m[0]) || /-(?:white|black)$/.test(m[0]))
        .map((m) => `${f.path}: ${m[0]}`),
    );
    expect(hits).toEqual([]);
  });

  it("no raw hex colors or arbitrary color classes in components/content", () => {
    // layout.tsx is allowed: viewport themeColor must be a literal for the browser UI.
    // The lookbehind skips anchors like "/#work"; comments are stripped first.
    const hex =
      /(?<![\w/&])#(?:[0-9a-fA-F]{3,4}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})\b|-\[#[0-9a-fA-F]+\]/g;
    const hits = ui
      .filter((f) => f.path !== "src/app/layout.tsx")
      .flatMap((f) => [...stripComments(f.code).matchAll(hex)].map((m) => `${f.path}: ${m[0]}`));
    expect(hits).toEqual([]);
  });
});

describe("components", () => {
  it('"use client" only where listed (server components by default)', () => {
    // The directive may follow comments, so strip them before checking the top of the file.
    const client = code
      .filter((f) => /^\s*["']use client["']/.test(stripComments(f.code)))
      .map((f) => f.path)
      .sort();
    expect(client).toEqual(Object.keys(CLIENT_COMPONENTS).sort());
  });

  it("use named exports; default exports only in Next route files under src/app", () => {
    const hasDefault = (src: string) =>
      /\bexport\s+default\b|\bexport\s*\{[^}]*\bas\s+default\b/.test(stripComments(src));
    const bad = code
      .filter((f) => hasDefault(f.code))
      .filter((f) => !(f.path.startsWith("src/app/") && ROUTE_FILE.test(f.name)))
      .map((f) => f.path);
    expect(bad).toEqual([]);
  });

  it("content files hold data, not JSX", () => {
    const bad = code
      .filter((f) => f.path.startsWith("src/content/") && f.name.endsWith(".tsx"))
      .map((f) => f.path);
    expect(bad).toEqual([]);
  });
});
