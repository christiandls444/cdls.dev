<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# cdls.dev: agent guide

Personal portfolio of **Christian De Los Santos**, Full Stack LLM Engineer at Accenture.
Read this first. It is the single entry point for humans and AI agents working in this repo.

## Product rules (non-negotiable)

1. **Minimal text, icon-first.** Prefer an icon, logo or image over a sentence. Summaries are one line.
2. **Palette is white · black · gold · blue only.** Use the theme tokens; never hard-code hex in components.
3. **Static by default.** Every page should build as `○ (Static)`. Add dynamic behaviour only when a feature truly needs it.
4. **Secure by default.** Do not loosen `next.config.ts` headers without updating `docs/SECURITY.md`.

## Stack

Next.js 16 (App Router, Cache Components, Turbopack) · React 19 · TypeScript (strict) · Tailwind CSS v4 ·
`motion` for animation · `lucide-react` (line icons) · `simple-icons` (brand logos) · Vercel hosting · Cloudflare DNS/registrar.

## Map

```
src/
  app/                 routes + metadata routes (robots, sitemap, icon)
    globals.css        design tokens (the only place colors live)
    layout.tsx         fonts, metadata, header/footer shell
    page.tsx           home: composes sections only, no markup logic
  components/
    intro/             CMDLS intro loader + its inline script
    layout/            site-header, site-footer, menu-dialog
    sections/          one file per page section (hero, projects, about)
    theme/             dark (default) / light toggle + its pre-paint inline script
    ui/                small reusable primitives (icon, section, fade-in, logo, social-links, inline-script)
  content/             EDIT HERE to change what the site says (site, stack, projects)
  lib/                 helpers (cn, icon builders, custom brand icons)
  types/content.ts     shapes for everything in content/
docs/                  ARCHITECTURE, DESIGN, SECURITY, DEPLOYMENT
```

## Common tasks

| Task                         | Where                                                                                                    |
| ---------------------------- | -------------------------------------------------------------------------------------------------------- |
| Add/edit a project           | `src/content/projects.ts`                                                                                |
| Add a tech logo              | `src/content/stack.ts` (`brand(siX)` from simple-icons; `line(LucideIcon)` if the brand is missing)      |
| Change name/links            | `src/content/site.ts` (empty `href` hides a social link)                                                 |
| Edit bio / journey           | `src/content/about.ts`                                                                                   |
| Edit hero badges / role line | `src/content/site.ts` (`badges`, max 2; `roles`, cycled; `leadRole`, first in a new session)             |
| Add a menu link              | `src/content/navigation.ts` (max 3; the `#id` must exist on the page)                                    |
| Publish a blog post          | `src/content/posts/<slug>.mdx` + one entry in `src/content/posts/index.ts`                               |
| Add a page section           | new file in `components/sections/`, wrap in `<Section id label>`, add to `app/page.tsx` and header `nav` |
| Add a route                  | `src/app/<route>/page.tsx` + add it to `src/app/sitemap.ts`                                              |
| Call an external service     | server-side only (Server Action / Route Handler), key in env, origin in CSP. See `docs/SECURITY.md`      |

## Conventions

**Follow [docs/CONVENTIONS.md](docs/CONVENTIONS.md).** It covers layers, file anatomy, server vs client,
styling, content and tests, and most of it is enforced by ESLint and `tests/unit/standards.test.ts`.
Key points: server components by default, tokens only for colors, content as typed data, `@/` imports,
named exports, a test with every feature.

## Commands

```bash
npm run dev          # local dev at http://localhost:3000
npm run check        # lint + typecheck + format check + unit tests
npm run build        # production build; confirm routes are ○ Static
npm run test:e2e     # Playwright against the build: smoke, security headers, a11y (run build first)
npm run format       # prettier (sorts Tailwind classes too)
```

## Tests

| Layer            | Where                           | Guards                                                            |
| ---------------- | ------------------------------- | ----------------------------------------------------------------- |
| Unit (Vitest)    | `tests/unit/`                   | content rules: valid links, one-line summaries, unique slugs      |
| E2E (Playwright) | `tests/e2e/home.spec.ts`        | page renders, no console errors, styles load, 404                 |
| Theme            | `tests/e2e/theme.spec.ts`       | dark by default, toggle switches + remembers, no flash            |
| Menu stress      | `tests/e2e/menu-stress.spec.ts` | rapid taps, Escape/link mid-animation, theme spam, reduced motion |
| Security         | `tests/e2e/security.spec.ts`    | security headers, `noopener` links, robots outside production     |
| Accessibility    | `tests/e2e/a11y.spec.ts`        | axe WCAG 2.1 A/AA in light and dark                               |

Add a test with every feature. If you add a route, add it to the header test loop in `security.spec.ts`.

## Git workflow

| Branch                                 | Role                         | Deploys to                          |
| -------------------------------------- | ---------------------------- | ----------------------------------- |
| `main`                                 | production                   | `cdls.dev`                          |
| `develop`                              | staging / integration        | `staging.cdls.dev` (Vercel preview) |
| `feat/*`, `fix/*`, `chore/*`, `docs/*` | one change each, short-lived | unique Vercel preview URL           |

1. Branch from `develop`: `git switch develop && git pull && git switch -c feat/<short-name>`.
2. PR into **`develop`** → CI green → **squash merge**. Check it on staging.
3. Release: PR **`develop` → `main`** → **merge commit** (never squash, or the branches diverge).
4. Hotfix: `fix/*` from `main` → PR into `main`, then merge `main` back into `develop`.

Both `main` and `develop` are protected: no direct pushes, CI (`check`) must pass, no force-push or deletion.

**Naming rules live in [CONTRIBUTING.md](CONTRIBUTING.md). Follow them exactly.** CI rejects anything else.

- Branch: `<type>/<kebab-name>`, e.g. `feat/project-rag-chatbot`
- Commit / PR title: `<type>(<scope>): <imperative, lowercase, no period>`, e.g. `feat(projects): add rag chatbot`
- **Never delete branches** (local or remote) after merging, and never use `--delete-branch`.
- **Never add AI attribution** (`Co-Authored-By`, "Generated with …") to commits or PRs. The owner is the only author.

## Definition of done

`npm run check`, `npm run build` and `npm run test:e2e` pass. `/code-review` has run on the diff and its
findings are fixed. No new client components or colors outside the allowlists. No secrets in code.
Docs updated if you changed structure, tokens, headers or deployment.
