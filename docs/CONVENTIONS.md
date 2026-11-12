# Code conventions

The patterns every file in this repo follows, for humans and AI agents alike. Most of them
are **enforced**: CI fails if they are broken. The table says where each one is checked.

| Rule                                                                     | Enforced by                                                                    |
| ------------------------------------------------------------------------ | ------------------------------------------------------------------------------ |
| Layer boundaries (who may import whom)                                   | ESLint `no-restricted-imports`                                                 |
| `@/` alias, never `../`                                                  | ESLint `no-restricted-imports`                                                 |
| Import order (builtin → external → `@/` → relative, A→Z, no blank lines) | ESLint `import/order` (auto-fix)                                               |
| One import per module                                                    | ESLint `import/no-duplicates`                                                  |
| Small functions and files (complexity ≤ 12, nesting ≤ 3, ≤ 250 lines)    | ESLint `complexity`, `max-depth`, `max-lines`                                  |
| kebab-case file and folder names                                         | `tests/unit/standards.test.ts`                                                 |
| Colors from design tokens only                                           | `tests/unit/standards.test.ts`                                                 |
| `"use client"` only in allowlisted files                                 | `tests/unit/standards.test.ts`                                                 |
| Named exports (default only in `src/app` route files)                    | `tests/unit/standards.test.ts`                                                 |
| Content is data (no `.tsx` in `src/content`)                             | `tests/unit/standards.test.ts`                                                 |
| Formatting, Tailwind class order                                         | Prettier                                                                       |
| Branch and PR title format                                               | `.github/workflows/pr-conventions.yml` ([CONTRIBUTING.md](../CONTRIBUTING.md)) |

## Layers

```
app/ ──▶ components/{layout,intro,theme} ──▶ components/sections ──▶ components/ui
  │                                               │                        │
  └──────────────────────▶ content/ ◀─────────────┴────────────────────────┘
                              │
                       lib/ · types/   (used by everything, import nothing above)
```

- `content/` is typed data. It never imports components or routes.
- `lib/` and `types/` are foundations: no UI, no content.
- `ui/` primitives sit at the bottom. They may read `@/content/site` only (logo, social links).
- `sections/` compose `ui/` and read `content/`. They never import `layout/`.
- `layout/`, `intro/` and `theme/` wrap pages. They never import `sections/`.
- Routes in `app/` compose sections and layout.

## File anatomy

Same order in every component file:

```tsx
"use client"; // only if allowlisted (see below)

import { … } from "react";              // 1. external, A→Z
import { Section } from "@/components/ui/section"; // 2. @/ internal, A→Z
import { thing } from "./sibling";      // 3. relative (same folder only)

/** One line: what this component is for. */
export function ThingSection({ … }: Props) {   // 4. the exported component
  …
}

function Helper() { … }                  // 5. private helpers last
```

- **Types** for content live in `src/types/content.ts`. Props types stay next to their component.
- **Constants** that tune behavior (durations, limits) are `UPPER_CASE` at the top of the file or in `src/lib`.
- **Comments** explain _why_, not _what_. Every exported component gets a one-line JSDoc.

## Server vs client

Server components by default. A client component is allowed only for real interactivity, kept
small, and listed with its reason in `CLIENT_COMPONENTS` in `tests/unit/standards.test.ts`:

| File                                  | Why it is a client component   |
| ------------------------------------- | ------------------------------ |
| `components/ui/fade-in.tsx`           | scroll-triggered fade (motion) |
| `components/layout/menu-dialog.tsx`   | opens/closes the menu dialog   |
| `components/sections/role-ticker.tsx` | cycles the hero role line      |
| `components/theme/theme-toggle.tsx`   | switches dark/light, remembers |

Cache Components (Next 16): don't call `new Date()`, `Math.random()` or request APIs in a server
component without `"use cache"` or `<Suspense>`, or the build fails. Format fixed dates with
`formatDate()` from `@/lib/format`. Read `node_modules/next/dist/docs/01-app/01-getting-started/08-caching.md`.

Pattern: the client component owns state only. Pass server-rendered markup in as `children`
(icons and functions can't cross the server/client boundary as props).

## Styling

- Tailwind utilities with **tokens only**: `bg-bg`, `bg-surface`, `text-fg`, `text-muted`,
  `border-line`, `text-gold`, `bg-gold-soft`, `text-blue`. Never `text-blue-500`, `bg-white` or `#hex`.
  Tokens and their light/dark values live in `src/app/globals.css` ([DESIGN.md](./DESIGN.md)).
- Conditional classes go through `cn()` from `@/lib/utils`.
- Animations: CSS when it must work before React loads (hero, intro; the intro's letter flight is a
  self-contained inline script, `components/intro/intro-script.ts`); `FadeIn` for scroll reveals.
  Always respect `prefers-reduced-motion`.
- Custom CSS goes in `globals.css` under a comment naming the component it belongs to.

## Icons and accessibility

- Icons always go through `<Icon>` (`@/components/ui/icon`), built with `brand()` (simple-icons) or
  `line()` (lucide) from `@/lib/icons`. No raw `<svg>` or direct lucide usage for content icons.
- Decorative icons are `aria-hidden`. Icon-only links and buttons need an `aria-label`.
- Every interactive element is reachable by keyboard and shows the gold focus ring.
- New UI must pass the axe test (`tests/e2e/a11y.spec.ts`) in light and dark mode.

## Content

- Everything the site says lives in `src/content/*.ts` as typed data.
- Text budget: hero = name + 1 line; card = title + 1 line + tags; about bio = 2 lines.
- Client or employer work is anonymized (no client names, code or links).

## Tests

Every feature ships with tests in the same PR:

| Change                           | Add                                                                                   |
| -------------------------------- | ------------------------------------------------------------------------------------- |
| New content field or rule        | Unit test in `tests/unit/content.test.ts`                                             |
| New section, page or interaction | E2E test in `tests/e2e/` (desktop and mobile run automatically)                       |
| New route                        | Add it to the header loop in `tests/e2e/security.spec.ts` and to `src/app/sitemap.ts` |

## Templates

**New section**

1. Content: `src/content/<name>.ts` (+ its type in `src/types/content.ts`).
2. Component: `src/components/sections/<name>.tsx`, wrapped in `<Section id="<name>" label="…">`.
3. Add it to `src/app/page.tsx` and, if it needs a menu link, to `src/content/navigation.ts` (`/#<name>`).
4. Tests: content rules (unit) + renders and the menu link resolves (e2e).

**New page**

1. `src/app/<route>/page.tsx` with `metadata` (title, description, canonical).
2. Add to `src/app/sitemap.ts` and the security header test.
3. E2E: renders, 200, menu link if any.

## Review before merge

1. `npm run check`, `npm run build`, `npm run test:e2e` pass locally.
2. The AI reviewer (`/code-review`) runs on the diff; findings are fixed or answered in the PR.
3. CI is green (`check`, `conventions`, `dependency-review`).
4. The owner gives the go to commit and to merge.
