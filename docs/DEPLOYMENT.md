# Deployment

**Domain:** Cloudflare Registrar · **Hosting:** Vercel · **Source:** GitHub `christiandls444/cdls.dev`

## 1. Domain (Cloudflare)

1. Buy `cdls.dev` in Cloudflare Dashboard → Domain Registration (at-cost price, no renewal markup).
2. Turn on **DNSSEC** and **Registrar lock**.

## 2. Hosting (Vercel)

1. vercel.com → Add New Project → import the GitHub repo. The framework is auto-detected as Next.js and no
   settings are needed.
2. Every push to `main` deploys to production, and every PR gets a preview URL.
3. Env vars (when needed): Project → Settings → Environment Variables.

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
