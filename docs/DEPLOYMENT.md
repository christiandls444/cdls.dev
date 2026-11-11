# Deployment

| Piece   | Provider                           | Notes                                                |
| ------- | ---------------------------------- | ---------------------------------------------------- |
| Source  | GitHub `christiandls444/cdls.dev`  | `main` = production, `develop` = staging             |
| Hosting | Vercel (Hobby), project `cdls-dev` | auto-deploys from GitHub, region `sin1` (Singapore)  |
| Domain  | Cloudflare Registrar               | `cdls.dev`, registered 2026-11-11, auto-renew on     |
| DNS     | Cloudflare (DNS only)              | records point to Vercel; Cloudflare proxy is **off** |
| Email   | Cloudflare Email Routing           | receive-only forwarding, no mailbox                  |

## Environments

| Env        | Branch    | URL                              | Indexed | Who can see                          |
| ---------- | --------- | -------------------------------- | ------- | ------------------------------------ |
| Production | `main`    | `https://cdls.dev`               | yes     | everyone                             |
| Staging    | `develop` | Vercel preview URL for `develop` | no      | owner (Vercel Deployment Protection) |
| Preview    | any PR    | `cdls-dev-git-<branch>…`         | no      | owner                                |

- `robots.txt` blocks crawlers unless `VERCEL_ENV=production` (`src/app/robots.ts`).
- Keep **Deployment Protection → Vercel Authentication** on (the default) so previews need the owner's login.
- Not set up yet: a fixed `staging.cdls.dev`. To add it: Vercel → Domains → add `staging.cdls.dev` →
  **Git Branch: `develop`**, then add the CNAME Vercel shows in Cloudflare (DNS only).

## Release flow

`feat/*` → PR → `develop` → PR `chore(release): vX.Y.Z` → `main` (merge commit). Every merge to `main` deploys to
production automatically. Full rules: [CONTRIBUTING.md](../CONTRIBUTING.md).

## DNS records (Cloudflare → cdls.dev → DNS → Records)

| Type  | Name                  | Content                                       | Proxy    | Purpose                                            |
| ----- | --------------------- | --------------------------------------------- | -------- | -------------------------------------------------- |
| CNAME | `@`                   | `d7034108f95bb2c1.vercel-dns-017.com`         | DNS only | site → Vercel (Cloudflare flattens it at the apex) |
| CNAME | `www`                 | `d7034108f95bb2c1.vercel-dns-017.com`         | DNS only | `www` → Vercel, which 308-redirects to `cdls.dev`  |
| MX    | `@`                   | `route1/2/3.mx.cloudflare.net` (57 / 73 / 97) | n/a      | Email Routing (managed, locked)                    |
| TXT   | `@`                   | `v=spf1 include:_spf.mx.cloudflare.net ~all`  | n/a      | SPF (managed by Email Routing)                     |
| TXT   | `cf2024-1._domainkey` | `v=DKIM1; …`                                  | n/a      | DKIM (managed, locked)                             |
| TXT   | `_dmarc`              | `v=DMARC1; p=reject; adkim=s; aspf=s`         | n/a      | DMARC: reject spoofed `@cdls.dev` mail             |

**Keep the Vercel records on "DNS only" (grey cloud).** Vercel issues the TLS certificate and runs the CDN.
Proxying through Cloudflare (orange cloud) breaks certificate renewal and causes redirect loops, so ignore
Cloudflare's "proxying is recommended" banner for these two records.

If Vercel ever shows a different target (Project → Settings → Domains → View DNS configuration), update both
CNAMEs to match.

## Vercel domains (Project → Settings → Domains)

| Domain                | Setting                            |
| --------------------- | ---------------------------------- |
| `cdls.dev`            | Connect to environment: Production |
| `www.cdls.dev`        | Redirect: 308 → `cdls.dev`         |
| `cdls-dev.vercel.app` | Production (default, keep)         |

`cdls.dev` is the canonical URL (`site.url` in `src/content/site.ts`, used for metadata and the sitemap).

## Email (Cloudflare → Email Routing)

| Address          | Action                                                 |
| ---------------- | ------------------------------------------------------ |
| `hello@cdls.dev` | Forward to the owner's private inbox                   |
| Catch-all        | **Disabled** (random addresses are dropped, less spam) |

- The destination inbox is never published. Only `hello@cdls.dev` appears on the site.
- **Receive-only.** Nothing is configured to _send_ as `@cdls.dev`. Because DMARC is `p=reject`, any service added
  later to send as `@cdls.dev` (e.g. Resend for a contact form, or Gmail "Send mail as") must be added to SPF and
  set up with DKIM **before** it sends, or its mail will be rejected.
- Do not click **Disable** in Email Routing → Settings. It deletes the MX, SPF and DKIM records.

## Domain settings (Cloudflare → Domain Registration → cdls.dev)

| Setting        | State                                                      |
| -------------- | ---------------------------------------------------------- |
| Auto-renew     | on (the domain expires 2027-11-11 if renewal fails)        |
| Registrar lock | on (transfers are also blocked for 60 days after purchase) |
| WHOIS privacy  | on (redacted)                                              |
| DNSSEC         | enabled                                                    |

## Verify

```bash
curl -sI https://cdls.dev                    # 200 + security headers
curl -sI https://www.cdls.dev | head -3      # 308 → https://cdls.dev/
curl -s  https://cdls.dev/robots.txt         # Allow + sitemap in production
dig +short MX cdls.dev                       # three route*.mx.cloudflare.net
dig +short TXT _dmarc.cdls.dev               # v=DMARC1; p=reject; …
dig +short DS cdls.dev                       # non-empty once DNSSEC is active
```

Also check [securityheaders.com](https://securityheaders.com/?q=cdls.dev) and send a test mail to
`hello@cdls.dev` from an outside account.

## Local

```bash
nvm use            # Node from .nvmrc
npm ci
npm run dev
```
