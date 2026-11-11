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

Verify after deploy: `curl -sI https://cdls.dev` and check [securityheaders.com](https://securityheaders.com).

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

- 2FA (authenticator app or passkey) on **GitHub, Vercel and Cloudflare**
- GitHub branch protection on `main`: require PR + passing CI
- Cloudflare: registrar lock on, and DNSSEC enabled

## Dependency overrides

Temporary pins in `package.json` → `overrides`. Remove each one once the upstream package ships the fix
(check with `npm ls <package>` after removing it).

| Package     | Forced to | Why                                                                           | Remove when                                       |
| ----------- | --------- | ----------------------------------------------------------------------------- | ------------------------------------------------- |
| `minimatch` | `^11.0.1` | GHSA-g3hv-75wg-m249 (ReDoS), pulled by `@typescript-eslint/typescript-estree` | `typescript-eslint` depends on minimatch ≥ 11.0.1 |
