# Deployment

**Domain:** Cloudflare Registrar · **Hosting:** Vercel · **Source:** GitHub `christiandls444/cdls.dev`

## 1. Domain (Cloudflare)

1. Buy `cdls.dev` in Cloudflare Dashboard → Domain Registration (at-cost price, no renewal markup).
2. Turn on **DNSSEC** and **Registrar lock**.

## 2. Hosting (Vercel)

1. vercel.com → Add New Project → import the GitHub repo. The framework is auto-detected as Next.js and no
   settings are needed.
2. Settings → Git → **Production Branch = `main`**.
3. Env vars (when needed): Project → Settings → Environment Variables. Scope each var to Production and/or Preview.

## Environments

| Env        | Branch    | URL                      | Indexed | Who can see                        |
| ---------- | --------- | ------------------------ | ------- | ---------------------------------- |
| Production | `main`    | `cdls.dev`               | yes     | everyone                           |
| Staging    | `develop` | `staging.cdls.dev`       | no      | you (Vercel Deployment Protection) |
| Preview    | any PR    | `cdls-dev-git-<branch>…` | no      | you                                |

- `robots.txt` blocks crawlers unless `VERCEL_ENV=production` (`src/app/robots.ts`).
- Staging domain: Vercel → Settings → Domains → add `staging.cdls.dev` → **Git Branch: `develop`**, then add the
  CNAME Vercel shows in Cloudflare (DNS only).
- Keep **Deployment Protection → Vercel Authentication** on (the default) so previews and staging need your login.

## Release flow

`feat/*` → PR → `develop` (staging) → PR → `main` (production). See the Git workflow section in `AGENTS.md`.

## 3. Connect domain

1. Vercel → Project → Settings → Domains → add `cdls.dev` and `www.cdls.dev` (redirect `www` → apex).
2. In Cloudflare DNS, add the records Vercel shows (usually `A @ 76.76.21.21` and `CNAME www cname.vercel-dns.com`).
3. Set both records to **DNS only (grey cloud)**. Vercel handles SSL and CDN, and proxying through Cloudflare
   causes certificate/redirect issues.

## 4. Verify

- `https://cdls.dev` loads and `http://` redirects to `https://`
- `curl -sI https://cdls.dev` shows the security headers
- `https://cdls.dev/sitemap.xml` and `/robots.txt` resolve

## Local

```bash
nvm use            # Node from .nvmrc
npm ci
npm run dev
```
