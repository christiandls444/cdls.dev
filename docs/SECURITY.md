# Security

## Current posture

- **Static site**: no database, no auth and no user input, which leaves a minimal attack surface.
- **HTTPS only**: `.dev` is on the HSTS preload list, and we also send `Strict-Transport-Security`.
- **Headers** (set in `next.config.ts` for every route):
  `Content-Security-Policy`, `Strict-Transport-Security`, `X-Content-Type-Options`, `X-Frame-Options: DENY`,
  `Referrer-Policy`, `Permissions-Policy`, `Cross-Origin-Opener-Policy`. `X-Powered-By` is disabled.
- **External links** use `rel="noopener noreferrer"`.
- **Dependencies**: Dependabot runs weekly. CI fails on high-severity advisories in production deps
  (`npm audit --omit=dev`), and dependency review blocks PRs that add vulnerable packages.
- **Code scanning**: CodeQL (`security-extended`) runs on every PR, on pushes and weekly.
- **Regression tests**: `tests/e2e/security.spec.ts` fails CI if a header is removed or weakened.
- **Branch protection**: `main` and `develop` need a PR with a passing `check`, and force-push and deletion are blocked.

### Domain and DNS

- **Registrar lock** and **auto-renew** are on, so the domain can't be transferred away or lapse.
- **WHOIS privacy** redacts the owner's personal details.
- **DNSSEC** is enabled, so DNS answers for `cdls.dev` are signed against forgery.
- Web records are **DNS only**. Vercel terminates TLS (Let's Encrypt, auto-renewed). TLS 1.0/1.1 are refused.
- `www.cdls.dev` and `http://` both permanently redirect to `https://cdls.dev`.

### Email (anti-spoofing)

- **SPF**, **DKIM** and **DMARC `p=reject`** (strict alignment) are published. Mail that claims to be from
  `@cdls.dev` but isn't is rejected by receiving servers, so the domain can't be used for phishing in the owner's name.
- `hello@cdls.dev` forwards to a private inbox that is never published. The catch-all is disabled.
- Any new service that sends as `@cdls.dev` must be added to SPF/DKIM first. See
  [DEPLOYMENT.md → Email](./DEPLOYMENT.md#email-cloudflare--email-routing).

Verify after deploy: `curl -sI https://cdls.dev` and check [securityheaders.com](https://securityheaders.com).
Full DNS and email checks are in [DEPLOYMENT.md → Verify](./DEPLOYMENT.md#verify).

## Rules when adding features

1. **Secrets** live in Vercel env vars or `.env.local` (git-ignored). Never prefix secrets with `NEXT_PUBLIC_`.
   Document new variable names in `.env.example`.
2. **External calls** go server-side (Server Action / Route Handler), never from the browser with a key.
3. **Validate input** on the server (e.g. `zod`) for any form or API route.
4. **Rate-limit + bot-check** public endpoints (Cloudflare Turnstile; Upstash rate limit for AI/chat routes).
5. **CSP**: add only the specific origin you need to the right directive (`connect-src`, `img-src`, `script-src`,
   `frame-src`). Never add `*`.
6. Run `npm audit` before releases. Dev-only advisories (eslint tooling) are lower priority than runtime ones.

## Account hygiene (the most common real-world breach)

- **2FA** (authenticator app or passkey, not SMS) on **GitHub, Vercel and Cloudflare**. Store the recovery codes
  offline. These three accounts control the code, the deploys and the domain.
- The **Vercel GitHub app** should only have access to this repository
  (GitHub → Settings → Applications → Vercel → Configure → Only select repositories).
- **Never** turn on the Cloudflare proxy for the Vercel records, disable Email Routing, or unlock the registrar
  unless you are deliberately moving the domain.

## Dependency overrides

Temporary pins in `package.json` → `overrides`. Remove each one once the upstream package ships the fix
(check with `npm ls <package>` after removing it).

| Package     | Forced to | Why                                                                           | Remove when                                       |
| ----------- | --------- | ----------------------------------------------------------------------------- | ------------------------------------------------- |
| `minimatch` | `^11.0.1` | GHSA-g3hv-75wg-m249 (ReDoS), pulled by `@typescript-eslint/typescript-estree` | `typescript-eslint` depends on minimatch ≥ 11.0.1 |
