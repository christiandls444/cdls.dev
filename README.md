# cdls.dev

Personal portfolio of **Christian De Los Santos**, Full Stack LLM Engineer.

Next.js 16 · TypeScript · Tailwind CSS v4 · Vercel

## Quick start

```bash
npm ci
npm run dev        # http://localhost:3000
```

## Edit content

Everything the site says lives in [`src/content/`](src/content):

- `site.ts`: name, role, tagline, social links
- `stack.ts`: tech logos
- `projects.ts`: work cards

## Scripts

| Command            | What                                   |
| ------------------ | -------------------------------------- |
| `npm run dev`      | dev server                             |
| `npm run check`    | lint + typecheck + format + unit tests |
| `npm run build`    | production build                       |
| `npm run test:e2e` | browser tests (after build)            |
| `npm run format`   | format code                            |

## Docs

- [AGENTS.md](AGENTS.md): start here (humans and AI agents)
- [Architecture](docs/ARCHITECTURE.md) · [Design](docs/DESIGN.md) · [Security](docs/SECURITY.md) · [Deployment](docs/DEPLOYMENT.md)
