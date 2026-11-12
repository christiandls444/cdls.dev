import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

/**
 * Project rules on top of Next's defaults. They enforce docs/CONVENTIONS.md so the
 * codebase stays aligned no matter who (or which agent) writes the code.
 */

/**
 * Layer boundaries: which modules each layer must NOT import (see docs/CONVENTIONS.md).
 * Each folder is listed bare and with "/*" so a future barrel (`@/content`) is covered too.
 */
const deny = (...dirs) => dirs.flatMap((d) => [`@/${d}`, `@/${d}/*`]);

const layers = [
  {
    // Root files like src/mdx-components.tsx (more specific rules below still apply).
    files: ["src/*.{ts,tsx}"],
    forbid: deny("app", "components/sections", "components/layout", "components/intro"),
    why: "Files at the root of src/ are shared config: no routes or page-level components.",
  },
  {
    files: ["src/content/**"],
    forbid: deny("components", "app"),
    why: "content/ is plain data: it must not import UI or routes.",
  },
  {
    files: ["src/lib/**", "src/types/**"],
    forbid: deny("components", "content", "app"),
    why: "lib/ and types/ are shared foundations: no UI, content or routes.",
  },
  {
    files: ["src/components/ui/**", "src/mdx-components.tsx"],
    forbid: deny("components/sections", "components/layout", "components/intro", "app"),
    why: "ui/ primitives are the bottom of the component tree.",
    // ui/ may read site identity only (logo, social links): a separate pattern so the
    // "!" exception works (gitignore can't re-include a file under an excluded folder).
    extraPatterns: [
      {
        group: ["@/content/*", "!@/content/site"],
        message: "ui/ may read @/content/site only; pass other content in as props.",
      },
    ],
    extraPaths: [{ name: "@/content", message: "ui/ may read @/content/site only." }],
  },
  {
    files: ["src/components/sections/**"],
    forbid: deny("components/layout", "components/intro", "app"),
    why: "sections/ may use ui/ only, never layout/, intro/ or routes.",
  },
  {
    files: ["src/components/layout/**", "src/components/intro/**"],
    forbid: deny("components/sections", "app"),
    why: "layout/ and intro/ wrap pages; they must not depend on page sections.",
  },
];

const noParentImports = {
  group: ["../*"],
  message: 'Use the "@/" alias instead of "../" imports.',
};

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,

  {
    files: ["src/**/*.{ts,tsx}", "tests/**/*.ts"],
    rules: {
      "import/order": [
        "error",
        {
          groups: ["builtin", "external", "internal", "parent", "sibling", "index"],
          pathGroups: [{ pattern: "@/**", group: "internal" }],
          pathGroupsExcludedImportTypes: ["builtin"],
          "newlines-between": "never",
          alphabetize: { order: "asc", caseInsensitive: true },
        },
      ],
      "import/no-duplicates": "error",
      "no-restricted-imports": ["error", { patterns: [noParentImports] }],
    },
  },

  {
    files: ["src/**/*.{ts,tsx}"],
    rules: {
      complexity: ["error", 12],
      "max-lines": ["error", { max: 250, skipBlankLines: true, skipComments: true }],
      "max-depth": ["error", 3],
    },
  },

  ...layers.map(({ files, forbid, why, extraPatterns = [], extraPaths = [] }) => ({
    files,
    rules: {
      "no-restricted-imports": [
        "error",
        {
          paths: extraPaths,
          patterns: [noParentImports, { group: forbid, message: why }, ...extraPatterns],
        },
      ],
    },
  })),

  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
]);

export default eslintConfig;
