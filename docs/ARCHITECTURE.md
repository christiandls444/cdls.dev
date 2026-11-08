# Architecture

## Layers

```
content/  ──▶  components/sections/  ──▶  app/page.tsx
(typed data)   (layout + presentation)    (composition only)
      ▲                 │
 types/content.ts       └── components/ui/ (primitives)
```

- **content** holds the data: what the site says. Plain typed objects. To change copy you edit only this layer.
- **sections** turn content into a page block. One section per file.
- **ui** holds small primitives with no knowledge of the content.
- **app** handles routing, metadata and composition.

Dependencies only flow in the direction of the arrows. `ui` never imports `content` (except `social-links` and
`logo`, which are site-identity widgets).

## Rendering

- Next.js 16 with `cacheComponents: true`. Everything is prerendered at build time (`○ Static`) and served from
  Vercel's CDN, so there is no server work per request.
- Client JS is limited to `ui/fade-in.tsx` (motion). Keep it that way unless a feature needs interactivity.

## Scaling path (when needed, not before)

| Need                       | Add                                                                            | Where                                                            |
| -------------------------- | ------------------------------------------------------------------------------ | ---------------------------------------------------------------- |
| Project detail pages       | `app/work/[slug]/page.tsx` + `generateStaticParams` from `content/projects.ts` | stays static                                                     |
| Blog / long-form           | MDX (`@next/mdx`)                                                              | `content/posts/*.mdx`                                            |
| Non-dev editing            | Headless CMS (Sanity)                                                          | replace `content/*.ts` readers with fetchers using `"use cache"` |
| Contact form               | Server Action + Resend + Cloudflare Turnstile                                  | `app/actions/contact.ts`                                         |
| "Ask my portfolio" AI chat | Route Handler + Vercel AI SDK + Anthropic API, rate limited                    | `app/api/chat/route.ts`                                          |
| Database                   | Neon or Supabase Postgres via Vercel integration                               | `lib/db.ts`                                                      |
| Analytics                  | Vercel Analytics (privacy-friendly)                                            | `app/layout.tsx` + CSP                                           |

Rule for every integration: secrets stay server-side, inputs are validated, and the origin goes into the CSP.
See [SECURITY.md](./SECURITY.md).
